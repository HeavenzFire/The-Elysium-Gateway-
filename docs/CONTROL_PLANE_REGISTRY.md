# HeavenzFire Control Plane Registry — Phase 1

This phase adds the durable registry foundation used by HeavenzFire Desktop. It does not yet start a desktop window, scan the machine, clone repositories, execute tasks, or connect remote nodes automatically.

## Source of truth

The registry is stored as JSON at:

- `HEAVENZFIRE_DATA_DIR/control-plane-registry.json` when the environment variable is set.
- Otherwise, `~/.heavenzfire/control-plane-registry.json`.

The desktop main process should set `HEAVENZFIRE_DATA_DIR` to its OS-managed application-data directory before starting the gateway service. The registry is not stored inside the Git checkout.

Writes are serialized within the process and committed using a temporary file plus atomic rename. The document includes a monotonically increasing revision and a bounded event history. The event history is operational audit metadata, not a cryptographic tamper-proof ledger.

## Project registration

A project record may link:

- A GitHub repository in `owner/repository` form.
- An explicitly selected absolute local workspace path.
- A default branch.
- An owning registered node.

At least one of the GitHub repository or local workspace path is required. Duplicate repository links and duplicate local paths are rejected. Registration does not inspect or modify the referenced workspace.

## Node registration

Nodes have an explicit kind (`windows`, `android`, `linux`, or `macos`) and an allowlisted capability set:

- `health-report`
- `project-files`
- `git-read`
- `git-write`
- `local-inference`
- `task-execution`

Capabilities are declarations only. This registry does not grant operating-system permissions or execute work. A later node agent must independently enforce each capability.

## HTTP API

The gateway exposes these routes:

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/control-plane/registry` | Read the complete registry snapshot |
| POST | `/api/control-plane/projects` | Register a project link |
| POST | `/api/control-plane/nodes` | Register or refresh a node |
| POST | `/api/control-plane/nodes/:nodeId/heartbeat` | Mark a registered node online |
| PATCH | `/api/control-plane/nodes/:nodeId/status` | Set a node online/offline |

Every route requires a bearer token in `HEAVENZFIRE_CONTROL_TOKEN` and a loopback TCP peer address. Missing credentials disable the API with HTTP 503. Invalid credentials return 401; non-loopback clients return 403. The desktop main process must keep the token private and mediate renderer requests through a restricted preload/IPC bridge; it must never expose the token to page JavaScript.

Example request:

```powershell
$headers = @{ Authorization = "Bearer $env:HEAVENZFIRE_CONTROL_TOKEN" }
Invoke-RestMethod -Method Get -Uri "http://127.0.0.1:3000/api/control-plane/registry" -Headers $headers
```

## Verification

Run:

```powershell
npm run test:control-plane
npm run lint
npm run build
```

The focused tests cover persistence across process instances, project-link uniqueness, absolute-path validation, owner-node validation, capability allowlisting, heartbeat transitions, and event recording.

## Explicitly deferred

- Electron main/preload/renderer shell and Windows installer.
- GitHub OAuth/device authorization and repository synchronization.
- Windows directory picker and local workspace discovery.
- Android/Termux authenticated node transport.
- Node enrollment/rotation/revocation credentials.
- Task ledger, task execution, and approval workflows.
- Cryptographically chained or externally anchored audit evidence.

These are separate implementation slices; none is represented as complete by this registry foundation.
