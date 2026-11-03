import { createHash, randomUUID } from "node:crypto";
import { hostname } from "node:os";
import path from "node:path";
import { mkdir, open, readFile, rm } from "node:fs/promises";

const GENESIS = "0".repeat(64);
const SHA256 = /^[a-f0-9]{64}$/;
export interface TaskEvidenceInput {
  authorization: { kind: "local-user" | "service"; subjectId: string };
  taskId: string;
  action: string;
  payloadHash: string;
  assignedNodeId?: string;
  verificationHash: string;
  outcome: "accepted" | "rejected" | "completed" | "failed" | "approval-required";
  detail?: Record<string, string>;
}
export interface TaskEvidenceRecord extends TaskEvidenceInput {
  id: string;
  sequence: number;
  occurredAt: string;
  previousHash: string;
  recordHash: string;
}
interface LockOwner { pid: number; host: string; createdAt: string; nonce: string; }

function digest(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
function validateText(value: unknown, field: string, max = 160): string {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) throw new Error(`INVALID_${field.toUpperCase()}`);
  return value.trim();
}
function validateHash(value: unknown, field: string): string {
  if (typeof value !== "string" || !SHA256.test(value)) throw new Error(`INVALID_${field.toUpperCase()}`);
  return value;
}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Independent append-only task/evidence log. Payloads are represented by hashes,
 * not copied into the audit log. This provides local tamper evidence, not a
 * signature or protection against an administrator who can rewrite the whole log.
 */
export class TaskEvidenceLedger {
  readonly filePath: string;
  readonly lockPath: string;
  constructor(dataDirectory: string) {
    this.filePath = path.join(dataDirectory, "task-evidence.jsonl");
    this.lockPath = path.join(dataDirectory, "task-evidence.lock");
  }

  private async withLock<T>(work: () => Promise<T>): Promise<T> {
    await mkdir(path.dirname(this.filePath), { recursive: true, mode: 0o700 });
    const started = Date.now();
    const owner: LockOwner = { pid: process.pid, host: hostname(), createdAt: new Date().toISOString(), nonce: randomUUID() };
    while (Date.now() - started < 15_000) {
      try {
        await mkdir(this.lockPath, { mode: 0o700 });
        await (await open(path.join(this.lockPath, "owner.json"), "wx", 0o600)).close();
        // Replace the empty owner marker atomically enough for readers: the lock
        // directory itself is already exclusively held by this process.
        const ownerHandle = await open(path.join(this.lockPath, "owner.json"), "w", 0o600);
        try { await ownerHandle.writeFile(JSON.stringify(owner), "utf8"); await ownerHandle.sync(); }
        finally { await ownerHandle.close(); }
        try { return await work(); }
        finally { await rm(this.lockPath, { recursive: true, force: true }); }
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
        try {
          const existing = JSON.parse(await readFile(path.join(this.lockPath, "owner.json"), "utf8")) as LockOwner;
          if (existing.host === hostname() && Number.isInteger(existing.pid) && existing.pid > 0) {
            try { process.kill(existing.pid, 0); }
            catch (probe) {
              if ((probe as NodeJS.ErrnoException).code === "ESRCH") {
                await rm(this.lockPath, { recursive: true, force: true });
                continue;
              }
            }
          }
        } catch { /* owner may still be initializing; fail closed */ }
        await sleep(50);
      }
    }
    throw new Error("TASK_EVIDENCE_LOCK_TIMEOUT");
  }

  private async readVerified(): Promise<TaskEvidenceRecord[]> {
    let raw: string;
    try { raw = await readFile(this.filePath, "utf8"); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
    if (raw && !raw.endsWith("\n")) {
      const last = raw.lastIndexOf("\n");
      const safeLength = last < 0 ? 0 : last + 1;
      const handle = await open(this.filePath, "r+");
      try { await handle.truncate(Buffer.byteLength(raw.slice(0, safeLength), "utf8")); await handle.sync(); }
      finally { await handle.close(); }
      raw = raw.slice(0, safeLength);
    }
    const records: TaskEvidenceRecord[] = [];
    let previousHash = GENESIS;
    for (const [index, line] of raw.split("\n").entries()) {
      if (!line) continue;
      let record: TaskEvidenceRecord;
      try { record = JSON.parse(line) as TaskEvidenceRecord; }
      catch { throw new Error(`TASK_EVIDENCE_CORRUPT_LINE_${index + 1}`); }
      const { recordHash, ...body } = record;
      if (record.sequence !== records.length + 1 || record.previousHash !== previousHash ||
          digest(body) !== recordHash) throw new Error(`TASK_EVIDENCE_CHAIN_INVALID_LINE_${index + 1}`);
      records.push(record);
      previousHash = recordHash;
    }
    return records;
  }

  async append(input: TaskEvidenceInput): Promise<TaskEvidenceRecord> {
    const authorization = input?.authorization;
    if (!authorization || !["local-user", "service"].includes(authorization.kind)) throw new Error("INVALID_AUTHORIZATION_KIND");
    const normalized: TaskEvidenceInput = {
      authorization: { kind: authorization.kind, subjectId: validateText(authorization.subjectId, "authorization_subject", 120) },
      taskId: validateText(input.taskId, "task_id", 120),
      action: validateText(input.action, "action", 120),
      payloadHash: validateHash(input.payloadHash, "payload_hash"),
      ...(input.assignedNodeId ? { assignedNodeId: validateText(input.assignedNodeId, "assigned_node_id", 120) } : {}),
      verificationHash: validateHash(input.verificationHash, "verification_hash"),
      outcome: input.outcome,
      ...(input.detail ? { detail: input.detail } : {}),
    };
    if (!["accepted", "rejected", "completed", "failed", "approval-required"].includes(normalized.outcome)) {
      throw new Error("INVALID_EVIDENCE_OUTCOME");
    }
    return this.withLock(async () => {
      const existing = await this.readVerified();
      const previousHash = existing.at(-1)?.recordHash || GENESIS;
      const body = { ...normalized, id: randomUUID(), sequence: existing.length + 1, occurredAt: new Date().toISOString(), previousHash };
      const record: TaskEvidenceRecord = { ...body, recordHash: digest(body) };
      const handle = await open(this.filePath, "a", 0o600);
      try { await handle.writeFile(JSON.stringify(record) + "\n", "utf8"); await handle.sync(); }
      finally { await handle.close(); }
      return record;
    });
  }

  async verify(): Promise<{ valid: true; count: number; headHash: string }> {
    return this.withLock(async () => {
      const records = await this.readVerified();
      return { valid: true, count: records.length, headHash: records.at(-1)?.recordHash || GENESIS };
    });
  }
}
