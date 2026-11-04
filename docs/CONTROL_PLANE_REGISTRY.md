# HeavenzFire Control Plane Registry — Durable Local Foundation

This phase hardens the Phase-1 registry. It does not yet start a desktop window, scan the machine, clone repositories, execute tasks, or connect remote nodes automatically.

## Local data directory

- `HEAVENZFIRE_DATA_DIR` when set.
- Otherwise `%LOCALAPPDATA%/HeavenzFire` on Windows, or `~/.heavenzfire` on other platforms.
- The future Electron main process must set this to its OS-managed application-data directory (on Windows, the app's LocalAppData location) before starting the gateway.
- Registry files are outside the Git checkout. Registering a project records an explicitly supplied path; it does not scan, read, or modify repository source files.

Files:

| File | Role |
| --- | --- |
| `control-plane-registry.json` | Materialized project/node snapshot for fast reads |
| `registry-ledger.jsonl` | Append-only, hash-chained registry commits; each commit contains the committed snapshot |
| `node-runtime.json` | Atomic operational overlay for heartbeat status and resource telemetry; not an audit ledger |
| `task-evidence.jsonl` | Separate append-only task authorization/evidence records |
| `registry.lock/` and `task-evidence.lock/` | Atomic directory locks with owner metadata |

## Locking and crash recovery

Writers acquire an atomic directory lock, reload current disk state while holding it, append and fsync the JSONL commit, then write a unique temporary snapshot, fsync it, and atomically rename it into place. Independent registry instances therefore serialize through the same filesystem lock, not merely a per-process promise queue.

A lock is reclaimed automatically only when its owner is on the same host and the recorded PID is provably absent. Unknown, malformed, remote-host, or permission-denied lock owners are not stolen; callers fail closed on lock timeout. A PID can theoretically be reused, so this conservative strategy may require manual lock inspection after unusual crashes.

If the process exits after the ledger commit but before snapshot replacement, the next read verifies the ledger and rebuilds the snapshot. A non-newline-terminated final JSONL fragment is treated as an incomplete append and truncated to the last complete record. A malformed or hash-invalid complete record is rejected rather than silently discarded. Node heartbeats update `node-runtime.json` atomically under the same registry lock instead of appending a full registry snapshot every 30 seconds. Runtime telemetry is intentionally ephemeral and does not increment the durable registry revision or masquerade as audit evidence.

The first write creates an authenticated genesis record. Existing Phase-1 schema-version-1 snapshots are migrated on first access; their old bounded event history is retained as historical metadata but cannot be retroactively authenticated.

## Registry snapshot and project/node records

The materialized snapshot is schema version 2 and contains a monotonically increasing revision, projects, nodes, and recent event projections. The JSONL registry ledger is the authoritative source and is not bounded/truncated.

Projects may link a GitHub repository, an explicitly selected absolute local path, a default branch, and an owning node. At least one of repository or local path is required. Duplicate repository and local path links are rejected.

Nodes declare a kind and allowlisted capabilities: `health-report`, `project-files`, `git-read`, `git-write`, `local-inference`, and `task-execution`. These are declarations, not grants of operating-system permissions. Node enrollment credentials, rotation, revocation, and network discovery remain separate work. Optional health telemetry includes CPU count, total/free physical memory, process RSS, and server-stamped report time. Values are range-checked; a heartbeat without telemetry preserves the previous health sample.

## Task evidence ledger

`TaskEvidenceLedger` stores each record separately from mutable registry state. Records include:

- Authorizing identity kind and subject identifier.
- Task ID and action.
- SHA-256 hash of the task payload (payload contents are not copied into the audit log).
- Optional assigned node ID.
- Verification/result hash and outcome.
- Sequence number, timestamp, previous-record hash, and record hash.

Appending validates required fields, acquires its own cross-process lock, verifies the existing chain, appends one JSONL record, and fsyncs it. The ledger exposes a verification method and rejects modified committed records.

**Security boundary:** an unkeyed SHA-256 chain detects accidental corruption and unsophisticated edits, but it is not a digital signature and cannot prevent an administrator with filesystem access from rewriting the entire log and recomputing the chain. Stronger provenance requires protected signing keys and/or an independently anchored checkpoint. Authorization identity fields are assertions supplied by the trusted caller; this phase does not yet authenticate individual users or node credentials.

## HTTP API

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/control-plane/registry` | Read registry snapshot |
| GET | `/api/control-plane/registry/verify` | Verify registry commit chain |
| GET | `/api/control-plane/evidence?limit=100` | Read latest verified evidence records (limit 1–1,000) |
| GET | `/api/control-plane/evidence/verify` | Verify task evidence chain |
| POST | `/api/control-plane/evidence` | Append task authorization/evidence record |
| POST | `/api/control-plane/projects` | Register project link |
| POST | `/api/control-plane/nodes` | Register or refresh node |
| POST | `/api/control-plane/nodes/:nodeId/heartbeat` | Mark registered node online and optionally update validated health telemetry |
| PATCH | `/api/control-plane/nodes/:nodeId/status` | Set node online/offline |

Every route requires a bearer token in `HEAVENZFIRE_CONTROL_TOKEN` and a loopback TCP peer address. Missing credentials disable the API with HTTP 503. The desktop main process must keep the token private and mediate renderer requests through a restricted preload/IPC bridge; it must never expose the token to page JavaScript.

## Verification commands

```powershell
npm run test:control-plane
npm run lint
npm run build
```

The tests cover persistence, validation, independent-instance concurrent writes, snapshot reconstruction, incomplete trailing-write recovery, registry tamper detection, evidence append serialization, and evidence tamper detection.

## Explicitly not complete

- Electron main/preload/renderer shell and Windows installer.
- GitHub OAuth/device authorization and branch synchronization.
- Windows workspace picker/discovery.
- Authenticated Windows/Termux node transport and health telemetry.
- Node enrollment, credential rotation, and revocation.
- Task dispatch/execution, policy enforcement, and approval workflow.
- Hardware-backed signing or external audit anchoring.

These are intentionally separate phases; this foundation does not claim they are implemented.
