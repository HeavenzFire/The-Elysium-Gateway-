import { createHash, randomUUID } from "node:crypto";
import { hostname, homedir } from "node:os";
import path from "node:path";
import { mkdir, open, readFile, rename, rm, writeFile } from "node:fs/promises";

export type NodeKind = "windows" | "android" | "linux" | "macos";
export type NodeStatus = "online" | "offline" | "unknown";
export type NodeCapability = "local-inference" | "project-files" | "git-read" | "git-write" | "task-execution" | "health-report";

export interface RegisteredProject {
  id: string; name: string; repositoryFullName?: string; defaultBranch?: string;
  localPath?: string; ownerNodeId?: string; createdAt: string; updatedAt: string;
}
export interface RegisteredNode {
  id: string; label: string; kind: NodeKind; status: NodeStatus; capabilities: NodeCapability[];
  platform?: string; appVersion?: string; lastSeenAt: string; createdAt: string; updatedAt: string;
}
export interface RegistryEvent {
  id: string; type: "project.registered" | "node.registered" | "node.heartbeat" | "node.status";
  subjectId: string; occurredAt: string; actor: "local-user" | "node"; detail?: Record<string, string>;
}
export interface RegistrySnapshot {
  schemaVersion: 2; revision: number; updatedAt: string;
  projects: RegisteredProject[]; nodes: RegisteredNode[]; events: RegistryEvent[];
}
export interface RegisterProjectInput {
  name: string; repositoryFullName?: string; defaultBranch?: string; localPath?: string; ownerNodeId?: string;
}
export interface RegisterNodeInput {
  id?: string; label: string; kind: NodeKind; capabilities?: NodeCapability[]; platform?: string; appVersion?: string;
}
interface LedgerRecord {
  schemaVersion: 1; sequence: number; previousHash: string; committedAt: string;
  state: RegistrySnapshot; hash: string;
}
const GENESIS = "0".repeat(64);
const ALLOWED_CAPABILITIES = new Set<NodeCapability>(["local-inference", "project-files", "git-read", "git-write", "task-execution", "health-report"]);
const NODE_KINDS = new Set<NodeKind>(["windows", "android", "linux", "macos"]);
const LOCK_TIMEOUT_MS = 15_000;
const LOCK_RETRY_MS = 40;

function requiredText(value: unknown, field: string, max = 120): string {
  if (typeof value !== "string") throw new Error(`INVALID_${field.toUpperCase()}`);
  const normalized = value.trim();
  if (!normalized || normalized.length > max) throw new Error(`INVALID_${field.toUpperCase()}`);
  return normalized;
}
function optionalText(value: unknown, field: string, max = 240): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return requiredText(value, field, max);
}
function normalizeLocalPath(value: unknown): string | undefined {
  const raw = optionalText(value, "local_path", 1024);
  if (!raw) return undefined;
  if (!path.isAbsolute(raw)) throw new Error("LOCAL_PATH_MUST_BE_ABSOLUTE");
  return path.normalize(raw);
}
function normalizeRepository(value: unknown): string | undefined {
  const raw = optionalText(value, "repository_full_name", 200);
  if (!raw) return undefined;
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(raw)) throw new Error("INVALID_REPOSITORY_FULL_NAME");
  return raw;
}
function normalizeCapabilities(value: unknown): NodeCapability[] {
  if (value === undefined) return ["health-report"];
  if (!Array.isArray(value) || value.length > ALLOWED_CAPABILITIES.size) throw new Error("INVALID_NODE_CAPABILITIES");
  const unique = [...new Set(value)];
  if (unique.some((item) => typeof item !== "string" || !ALLOWED_CAPABILITIES.has(item as NodeCapability))) {
    throw new Error("UNSUPPORTED_NODE_CAPABILITY");
  }
  return unique as NodeCapability[];
}
function emptySnapshot(): RegistrySnapshot {
  return { schemaVersion: 2, revision: 0, updatedAt: new Date(0).toISOString(), projects: [], nodes: [], events: [] };
}
function clone<T>(value: T): T { return structuredClone(value); }
function recordHash(sequence: number, previousHash: string, committedAt: string, state: RegistrySnapshot): string {
  return createHash("sha256").update(JSON.stringify({ schemaVersion: 1, sequence, previousHash, committedAt, state })).digest("hex");
}
function isMissing(error: unknown): boolean { return (error as NodeJS.ErrnoException)?.code === "ENOENT"; }
async function delay(ms: number): Promise<void> { await new Promise((resolve) => setTimeout(resolve, ms)); }

/**
 * Zero-dependency local registry. Each mutation acquires an atomic directory lock,
 * reloads disk state, appends and fsyncs a hash-chained JSONL commit, then atomically
 * replaces the materialized snapshot. Project paths are references only: no scanning
 * or repository mutation is performed here.
 */
export class ControlPlaneRegistry {
  private writeQueue: Promise<void> = Promise.resolve();
  readonly filePath: string;
  readonly ledgerPath: string;
  readonly lockPath: string;

  constructor(dataDirectory = process.env.HEAVENZFIRE_DATA_DIR || path.join(homedir(), ".heavenzfire")) {
    this.filePath = path.join(dataDirectory, "control-plane-registry.json");
    this.ledgerPath = path.join(dataDirectory, "registry-ledger.jsonl");
    this.lockPath = path.join(dataDirectory, "registry.lock");
  }

  private async acquireLock(): Promise<() => Promise<void>> {
    await mkdir(path.dirname(this.filePath), { recursive: true, mode: 0o700 });
    const started = Date.now();
    const owner = { pid: process.pid, host: hostname(), createdAt: new Date().toISOString(), nonce: randomUUID() };
    while (Date.now() - started < LOCK_TIMEOUT_MS) {
      try {
        await mkdir(this.lockPath, { mode: 0o700 });
        await writeFile(path.join(this.lockPath, "owner.json"), JSON.stringify(owner), { flag: "wx", mode: 0o600 });
        return async () => { await rm(this.lockPath, { recursive: true, force: true }); };
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
          // If this process created the directory but failed writing owner metadata, clean it up.
          try { await rm(this.lockPath, { recursive: true, force: true }); } catch { /* best effort */ }
          throw error;
        }
        // Only reclaim a lock when its same-host owner is provably gone. Unknown or
        // malformed owners are never stolen automatically.
        try {
          const lockOwner = JSON.parse(await readFile(path.join(this.lockPath, "owner.json"), "utf8")) as { pid?: number; host?: string };
          if (lockOwner.host === hostname() && Number.isInteger(lockOwner.pid) && (lockOwner.pid as number) > 0) {
            try { process.kill(lockOwner.pid as number, 0); }
            catch (probeError) {
              if ((probeError as NodeJS.ErrnoException).code === "ESRCH") {
                await rm(this.lockPath, { recursive: true, force: true });
                continue;
              }
            }
          }
        } catch { /* owner may be in creation; wait rather than risk stealing it */ }
        await delay(LOCK_RETRY_MS + Math.floor(Math.random() * LOCK_RETRY_MS));
      }
    }
    throw new Error("REGISTRY_LOCK_TIMEOUT");
  }

  private async atomicWriteSnapshot(record: LedgerRecord): Promise<void> {
    const temporary = `${this.filePath}.${randomUUID()}.tmp`;
    const payload = JSON.stringify({ schemaVersion: 2, sequence: record.sequence, headHash: record.hash, state: record.state }, null, 2) + "\n";
    const handle = await open(temporary, "wx", 0o600);
    try { await handle.writeFile(payload, "utf8"); await handle.sync(); }
    finally { await handle.close(); }
    await rename(temporary, this.filePath);
    // Directory fsync is supported on POSIX; Windows may reject opening a directory.
    try { const directory = await open(path.dirname(this.filePath), "r"); try { await directory.sync(); } finally { await directory.close(); } }
    catch { /* atomic rename remains the platform-level commit boundary on Windows */ }
  }

  private async readLedger(): Promise<{ state: RegistrySnapshot; sequence: number; headHash: string }> {
    let raw: string;
    try { raw = await readFile(this.ledgerPath, "utf8"); }
    catch (error) {
      if (!isMissing(error)) throw error;
      // One-time migration from the Phase-1 snapshot. The old bounded event list is
      // retained as historical metadata, but cannot be retroactively authenticated.
      try {
        const legacy = JSON.parse(await readFile(this.filePath, "utf8")) as RegistrySnapshot;
        if (legacy.schemaVersion !== 1 || !Array.isArray(legacy.projects) || !Array.isArray(legacy.nodes)) throw new Error("REGISTRY_SCHEMA_INVALID");
        const migrated: RegistrySnapshot = { ...legacy, schemaVersion: 2, events: Array.isArray(legacy.events) ? legacy.events : [] };
        return { state: migrated, sequence: 0, headHash: GENESIS };
      } catch (legacyError) {
        if (isMissing(legacyError)) return { state: emptySnapshot(), sequence: 0, headHash: GENESIS };
        throw legacyError;
      }
    }
    // A process can be terminated during an append. A non-newline-terminated tail
    // is not a committed JSONL record; discard only that incomplete final fragment.
    if (raw.length > 0 && !raw.endsWith("\n")) {
      const lastNewline = raw.lastIndexOf("\n");
      const safeLength = lastNewline < 0 ? 0 : lastNewline + 1;
      const handle = await open(this.ledgerPath, "r+");
      try { await handle.truncate(Buffer.byteLength(raw.slice(0, safeLength), "utf8")); await handle.sync(); }
      finally { await handle.close(); }
      raw = raw.slice(0, safeLength);
    }
    let state = emptySnapshot();
    let sequence = 0;
    let headHash = GENESIS;
    const lines = raw.split("\n");
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (!line) continue;
      let record: LedgerRecord;
      try { record = JSON.parse(line) as LedgerRecord; }
      catch { throw new Error(`REGISTRY_LEDGER_CORRUPT_LINE_${index + 1}`); }
      if (record.schemaVersion !== 1 || record.sequence !== sequence + 1 || record.previousHash !== headHash ||
          !record.state || record.state.schemaVersion !== 2 || !Array.isArray(record.state.projects) ||
          !Array.isArray(record.state.nodes) || !Array.isArray(record.state.events)) {
        throw new Error(`REGISTRY_LEDGER_CHAIN_INVALID_LINE_${index + 1}`);
      }
      const expected = recordHash(record.sequence, record.previousHash, record.committedAt, record.state);
      if (expected !== record.hash) throw new Error(`REGISTRY_LEDGER_HASH_MISMATCH_LINE_${index + 1}`);
      state = record.state;
      sequence = record.sequence;
      headHash = record.hash;
    }
    return { state, sequence, headHash };
  }

  private async appendCommit(state: RegistrySnapshot, sequence: number, previousHash: string): Promise<LedgerRecord> {
    const committedAt = new Date().toISOString();
    const record: LedgerRecord = {
      schemaVersion: 1, sequence: sequence + 1, previousHash, committedAt, state: clone(state),
      hash: recordHash(sequence + 1, previousHash, committedAt, state),
    };
    const handle = await open(this.ledgerPath, "a", 0o600);
    try { await handle.writeFile(JSON.stringify(record) + "\n", "utf8"); await handle.sync(); }
    finally { await handle.close(); }
    return record;
  }

  private async loadAndRepair(): Promise<{ state: RegistrySnapshot; sequence: number; headHash: string }> {
    const ledger = await this.readLedger();
    let snapshotMatches = false;
    try {
      const snapshot = JSON.parse(await readFile(this.filePath, "utf8")) as { sequence?: number; headHash?: string };
      snapshotMatches = snapshot.sequence === ledger.sequence && snapshot.headHash === ledger.headHash;
    } catch { /* regenerate from the verified ledger */ }
    if (!snapshotMatches && ledger.sequence > 0) {
      const repairRecord: LedgerRecord = {
        schemaVersion: 1, sequence: ledger.sequence, previousHash: "", committedAt: new Date().toISOString(),
        state: ledger.state, hash: ledger.headHash,
      };
      await this.atomicWriteSnapshot(repairRecord);
    } else if (ledger.sequence === 0) {
      // Persist the migration/empty state as the first authenticated ledger commit.
      const record = await this.appendCommit(ledger.state, 0, GENESIS);
      await this.atomicWriteSnapshot(record);
      return { state: record.state, sequence: record.sequence, headHash: record.hash };
    }
    return ledger;
  }

  private async mutate<T>(operation: (snapshot: RegistrySnapshot) => { value: T; event?: RegistryEvent }): Promise<T> {
    let resolveResult!: (value: T) => void;
    let rejectResult!: (reason: unknown) => void;
    const result = new Promise<T>((resolve, reject) => { resolveResult = resolve; rejectResult = reject; });
    this.writeQueue = this.writeQueue.then(async () => {
      let release: (() => Promise<void>) | undefined;
      try {
        release = await this.acquireLock();
        const current = await this.loadAndRepair();
        const snapshot = clone(current.state);
        const mutation = operation(snapshot);
        const now = new Date().toISOString();
        snapshot.revision += 1;
        snapshot.updatedAt = now;
        if (mutation.event) {
          snapshot.events.push(mutation.event);
          // This array is a read-optimized projection only. The authoritative,
          // append-only history remains in registry-ledger.jsonl.
          if (snapshot.events.length > 10_000) snapshot.events.splice(0, snapshot.events.length - 10_000);
        }
        const record = await this.appendCommit(snapshot, current.sequence, current.headHash);
        await this.atomicWriteSnapshot(record);
        resolveResult(mutation.value);
      } catch (error) { rejectResult(error); }
      finally { if (release) await release(); }
    });
    return result;
  }

  async getSnapshot(): Promise<RegistrySnapshot> {
    await this.writeQueue;
    const release = await this.acquireLock();
    try { return clone((await this.loadAndRepair()).state); }
    finally { await release(); }
  }

  async verifyLedger(): Promise<{ valid: boolean; sequence: number; headHash: string }> {
    const release = await this.acquireLock();
    try {
      const result = await this.readLedger();
      return { valid: true, sequence: result.sequence, headHash: result.headHash };
    } finally { await release(); }
  }

  async registerProject(input: RegisterProjectInput): Promise<RegisteredProject> {
    const name = requiredText(input?.name, "name");
    const repositoryFullName = normalizeRepository(input.repositoryFullName);
    const defaultBranch = optionalText(input.defaultBranch, "default_branch", 120);
    const localPath = normalizeLocalPath(input.localPath);
    const ownerNodeId = optionalText(input.ownerNodeId, "owner_node_id", 80);
    if (!repositoryFullName && !localPath) throw new Error("PROJECT_REQUIRES_REPOSITORY_OR_LOCAL_PATH");
    return this.mutate((snapshot) => {
      const duplicate = snapshot.projects.find((project) =>
        (repositoryFullName && project.repositoryFullName?.toLowerCase() === repositoryFullName.toLowerCase()) ||
        (localPath && project.localPath?.toLowerCase() === localPath.toLowerCase()));
      if (duplicate) throw new Error("DUPLICATE_PROJECT_LINK");
      if (ownerNodeId && !snapshot.nodes.some((node) => node.id === ownerNodeId)) throw new Error("UNKNOWN_OWNER_NODE");
      const now = new Date().toISOString();
      const project: RegisteredProject = { id: randomUUID(), name,
        ...(repositoryFullName ? { repositoryFullName } : {}), ...(defaultBranch ? { defaultBranch } : {}),
        ...(localPath ? { localPath } : {}), ...(ownerNodeId ? { ownerNodeId } : {}), createdAt: now, updatedAt: now };
      snapshot.projects.push(project);
      return { value: project, event: { id: randomUUID(), type: "project.registered", subjectId: project.id,
        occurredAt: now, actor: "local-user", detail: { name, ...(repositoryFullName ? { repositoryFullName } : {}) } } };
    });
  }

  async registerNode(input: RegisterNodeInput): Promise<RegisteredNode> {
    const id = optionalText(input?.id, "node_id", 80) || randomUUID();
    const label = requiredText(input?.label, "label");
    if (!NODE_KINDS.has(input?.kind)) throw new Error("INVALID_NODE_KIND");
    const capabilities = normalizeCapabilities(input.capabilities);
    const platform = optionalText(input.platform, "platform", 120);
    const appVersion = optionalText(input.appVersion, "app_version", 80);
    return this.mutate((snapshot) => {
      const now = new Date().toISOString();
      const existing = snapshot.nodes.find((node) => node.id === id);
      const node: RegisteredNode = { id, label, kind: input.kind, status: "online", capabilities,
        ...(platform ? { platform } : {}), ...(appVersion ? { appVersion } : {}),
        lastSeenAt: now, createdAt: existing?.createdAt || now, updatedAt: now };
      if (existing) snapshot.nodes[snapshot.nodes.indexOf(existing)] = node; else snapshot.nodes.push(node);
      return { value: node, event: { id: randomUUID(), type: "node.registered", subjectId: id,
        occurredAt: now, actor: "node", detail: { label, kind: input.kind, capabilities: capabilities.join(",") } } };
    });
  }

  async heartbeatNode(nodeId: string): Promise<RegisteredNode> {
    const id = requiredText(nodeId, "node_id", 80);
    return this.mutate((snapshot) => {
      const node = snapshot.nodes.find((item) => item.id === id);
      if (!node) throw new Error("UNKNOWN_NODE");
      const now = new Date().toISOString(); node.status = "online"; node.lastSeenAt = now; node.updatedAt = now;
      return { value: node, event: { id: randomUUID(), type: "node.heartbeat", subjectId: id, occurredAt: now, actor: "node" } };
    });
  }

  async setNodeStatus(nodeId: string, status: Exclude<NodeStatus, "unknown">): Promise<RegisteredNode> {
    const id = requiredText(nodeId, "node_id", 80);
    return this.mutate((snapshot) => {
      const node = snapshot.nodes.find((item) => item.id === id);
      if (!node) throw new Error("UNKNOWN_NODE");
      const now = new Date().toISOString(); node.status = status; node.updatedAt = now;
      return { value: node, event: { id: randomUUID(), type: "node.status", subjectId: id, occurredAt: now, actor: "local-user", detail: { status } } };
    });
  }
}
let singleton: ControlPlaneRegistry | undefined;
export function getControlPlaneRegistry(): ControlPlaneRegistry { singleton ||= new ControlPlaneRegistry(); return singleton; }
