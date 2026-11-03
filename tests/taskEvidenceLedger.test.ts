import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { TaskEvidenceLedger } from "../src/server/controlPlane/evidenceLedger.ts";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

async function withLedger(run: (ledger: TaskEvidenceLedger, directory: string) => Promise<void>) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "hf-evidence-"));
  try { await run(new TaskEvidenceLedger(directory), directory); }
  finally { await rm(directory, { recursive: true, force: true }); }
}

test("appends authorized task evidence with payload and verification hashes", async () => {
  await withLedger(async (ledger) => {
    const record = await ledger.append({
      authorization: { kind: "local-user", subjectId: "desktop-user" },
      taskId: "task-001",
      action: "run-verified-test-suite",
      payloadHash: hash("task payload"),
      assignedNodeId: "zdh-windows",
      verificationHash: hash("test result"),
      outcome: "completed",
    });
    assert.equal(record.sequence, 1);
    assert.equal(record.assignedNodeId, "zdh-windows");
    assert.deepEqual(await ledger.verify(), { valid: true, count: 1, headHash: record.recordHash });
  });
});

test("serializes concurrent evidence appends", async () => {
  await withLedger(async (ledger) => {
    await Promise.all(Array.from({ length: 6 }, (_, index) => ledger.append({
      authorization: { kind: "service", subjectId: "orchestrator" },
      taskId: `task-${index}`,
      action: "dispatch",
      payloadHash: hash(`payload-${index}`),
      verificationHash: hash(`verification-${index}`),
      outcome: "accepted",
    })));
    assert.equal((await ledger.verify()).count, 6);
  });
});

test("detects modifications to committed evidence", async () => {
  await withLedger(async (ledger, directory) => {
    await ledger.append({
      authorization: { kind: "local-user", subjectId: "desktop-user" },
      taskId: "tamper-task",
      action: "approve",
      payloadHash: hash("payload"),
      verificationHash: hash("proof"),
      outcome: "accepted",
    });
    const raw = await readFile(ledger.filePath, "utf8");
    await writeFile(ledger.filePath, raw.replace('"outcome":"accepted"', '"outcome":"rejected"'));
    await assert.rejects(ledger.verify(), /TASK_EVIDENCE_CHAIN_INVALID/);
  });
});
