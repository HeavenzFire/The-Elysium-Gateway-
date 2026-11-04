import test from "node:test";
import assert from "node:assert/strict";
import { appendFile, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { ControlPlaneRegistry } from "../src/server/controlPlane/registry.ts";

async function withRegistry(run: (registry: ControlPlaneRegistry, directory: string) => Promise<void>) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "hf-control-plane-"));
  try {
    await run(new ControlPlaneRegistry(directory), directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("persists projects and nodes across registry instances", async () => {
  await withRegistry(async (registry, directory) => {
    const node = await registry.registerNode({
      id: "zdh-windows",
      label: "ZDH Windows",
      kind: "windows",
      capabilities: ["health-report", "project-files", "git-read"],
      platform: "Windows 11",
    });
    const project = await registry.registerProject({
      name: "Elysium Gateway",
      repositoryFullName: "HeavenzFire/The-Elysium-Gateway-",
      defaultBranch: "main",
      localPath: path.join(directory, "workspace"),
      ownerNodeId: node.id,
    });

    const reopened = new ControlPlaneRegistry(directory);
    const snapshot = await reopened.getSnapshot();
    assert.equal(snapshot.schemaVersion, 2);
    assert.equal(snapshot.revision, 2);
    assert.equal(snapshot.nodes[0].id, "zdh-windows");
    assert.equal(snapshot.projects[0].id, project.id);
    assert.equal(snapshot.projects[0].repositoryFullName, "HeavenzFire/The-Elysium-Gateway-");
    assert.equal(snapshot.events.length, 2);
  });
});

test("rejects projects without a source and rejects relative local paths", async () => {
  await withRegistry(async (registry) => {
    await assert.rejects(
      registry.registerProject({ name: "Unlinked project" }),
      /PROJECT_REQUIRES_REPOSITORY_OR_LOCAL_PATH/,
    );
    await assert.rejects(
      registry.registerProject({ name: "Bad path", localPath: "relative/workspace" }),
      /LOCAL_PATH_MUST_BE_ABSOLUTE/,
    );
  });
});

test("prevents duplicate repository and local workspace links", async () => {
  await withRegistry(async (registry, directory) => {
    await registry.registerProject({
      name: "Primary",
      repositoryFullName: "HeavenzFire/UnifiedCodebase",
      localPath: path.join(directory, "one"),
    });
    await assert.rejects(
      registry.registerProject({
        name: "Duplicate repository",
        repositoryFullName: "heavenzfire/unifiedcodebase",
      }),
      /DUPLICATE_PROJECT_LINK/,
    );
    await assert.rejects(
      registry.registerProject({
        name: "Duplicate path",
        localPath: path.join(directory, "one"),
      }),
      /DUPLICATE_PROJECT_LINK/,
    );
  });
});

test("rejects unapproved capabilities and unknown node ownership", async () => {
  await withRegistry(async (registry, directory) => {
    await assert.rejects(
      registry.registerNode({
        label: "Untrusted",
        kind: "windows",
        capabilities: ["arbitrary-shell"] as never,
      }),
      /UNSUPPORTED_NODE_CAPABILITY/,
    );
    await assert.rejects(
      registry.registerProject({
        name: "Unowned",
        localPath: path.join(directory, "workspace"),
        ownerNodeId: "missing-node",
      }),
      /UNKNOWN_OWNER_NODE/,
    );
  });
});

test("heartbeat updates ephemeral health without extending the durable registry ledger", async () => {
  await withRegistry(async (registry) => {
    const node = await registry.registerNode({
      id: "android-a67l",
      label: "Android Termux",
      kind: "android",
      capabilities: ["health-report", "local-inference"],
    });
    await registry.setNodeStatus(node.id, "offline");
    const offline = await registry.getSnapshot();
    assert.equal(offline.nodes[0].status, "offline");

    const beforeHeartbeat = await registry.verifyLedger();
    const heartbeat = await registry.heartbeatNode(node.id, {
      cpuCount: 8, totalMemoryBytes: 8_000_000_000, freeMemoryBytes: 2_000_000_000, processMemoryBytes: 120_000_000,
    });
    const snapshot = await registry.getSnapshot();
    const afterHeartbeat = await registry.verifyLedger();
    assert.equal(heartbeat.status, "online");
    assert.equal(snapshot.nodes[0].status, "online");
    assert.equal(snapshot.nodes[0].health?.cpuCount, 8);
    assert.equal(snapshot.nodes[0].health?.freeMemoryBytes, 2_000_000_000);
    assert.equal(afterHeartbeat.sequence, beforeHeartbeat.sequence);
    assert.equal(JSON.parse(await readFile(registry.runtimePath, "utf8")).nodes[node.id].health.cpuCount, 8);
    await registry.setNodeStatus(node.id, "offline");
    assert.equal((await registry.getSnapshot()).nodes[0].status, "offline");
    assert.equal(JSON.parse(await readFile(registry.runtimePath, "utf8")).nodes[node.id], undefined);
  });
});

test("rejects malformed node health telemetry", async () => {
  await withRegistry(async (registry) => {
    const node = await registry.registerNode({ id: "health-node", label: "Health Node", kind: "windows" });
    await assert.rejects(registry.heartbeatNode(node.id, { cpuCount: 0, totalMemoryBytes: 10, freeMemoryBytes: 11, processMemoryBytes: -1 }), /INVALID_NODE_HEALTH/);
  });
});
test("writes a valid versioned materialized snapshot", async () => {
  await withRegistry(async (registry) => {
    await registry.registerNode({ id: "node-a", label: "Node A", kind: "linux" });
    const raw = await readFile(registry.filePath, "utf8");
    const parsed = JSON.parse(raw);
    assert.equal(parsed.schemaVersion, 2);
    assert.equal(parsed.state.revision, 1);
  });
});


test("migrates a Phase-1 snapshot into the authenticated schema-v2 ledger", async () => {
  await withRegistry(async (_registry, directory) => {
    const legacy = {
      schemaVersion: 1, revision: 4, updatedAt: new Date(0).toISOString(),
      projects: [], nodes: [], events: [],
    };
    await writeFile(path.join(directory, "control-plane-registry.json"), JSON.stringify(legacy));
    const migrated = await new ControlPlaneRegistry(directory).getSnapshot();
    assert.equal(migrated.schemaVersion, 2);
    assert.equal(migrated.revision, 4);
    assert.equal((await new ControlPlaneRegistry(directory).verifyLedger()).sequence, 1);
  });
});
test("serializes writes across independent registry instances", async () => {
  await withRegistry(async (_registry, directory) => {
    const registries = Array.from({ length: 8 }, () => new ControlPlaneRegistry(directory));
    await Promise.all(registries.map((registry, index) => registry.registerNode({
      id: `parallel-${index}`, label: `Parallel ${index}`, kind: "linux",
    })));
    const snapshot = await new ControlPlaneRegistry(directory).getSnapshot();
    assert.equal(snapshot.nodes.length, 8);
    assert.equal(snapshot.revision, 8);
    const verified = await new ControlPlaneRegistry(directory).verifyLedger();
    assert.equal(verified.valid, true);
    assert.equal(verified.sequence, 9); // one genesis commit plus eight mutations
  });
});

test("recovers the materialized snapshot from the verified append-only ledger", async () => {
  await withRegistry(async (registry, directory) => {
    await registry.registerNode({ id: "recover-me", label: "Recovery", kind: "windows" });
    await rm(registry.filePath);
    const recovered = await new ControlPlaneRegistry(directory).getSnapshot();
    assert.equal(recovered.nodes[0]?.id, "recover-me");
    assert.equal(recovered.revision, 1);
    assert.equal(JSON.parse(await readFile(registry.filePath, "utf8")).sequence, 2);
  });
});

test("rebuilds a tampered materialized snapshot from the verified ledger", async () => {
  await withRegistry(async (registry, directory) => {
    await registry.registerNode({ id: "snapshot-integrity", label: "Trusted Label", kind: "windows" });
    const snapshot = JSON.parse(await readFile(registry.filePath, "utf8"));
    snapshot.state.nodes[0].label = "Tampered Label";
    await writeFile(registry.filePath, JSON.stringify(snapshot));
    const restored = await new ControlPlaneRegistry(directory).getSnapshot();
    const repairedDisk = JSON.parse(await readFile(registry.filePath, "utf8"));
    assert.equal(restored.nodes[0].label, "Trusted Label");
    assert.equal(repairedDisk.state.nodes[0].label, "Trusted Label");
  });
});
test("discards an incomplete final JSONL fragment after a crash", async () => {
  await withRegistry(async (registry, directory) => {
    await registry.registerNode({ id: "safe-tail", label: "Safe Tail", kind: "android" });
    await appendFile(registry.ledgerPath, '{"schemaVersion":1,"sequence":999');
    const recovered = await new ControlPlaneRegistry(directory).getSnapshot();
    assert.equal(recovered.nodes[0]?.id, "safe-tail");
    const raw = await readFile(registry.ledgerPath, "utf8");
    assert.equal(raw.includes('"sequence":999'), false);
    assert.equal((await new ControlPlaneRegistry(directory).verifyLedger()).valid, true);
  });
});

test("rejects a modified committed ledger record", async () => {
  await withRegistry(async (registry, directory) => {
    await registry.registerNode({ id: "tamper-check", label: "Original", kind: "linux" });
    const raw = await readFile(registry.ledgerPath, "utf8");
    await writeFile(registry.ledgerPath, raw.replace('"label":"Original"', '"label":"Modified"'));
    await assert.rejects(new ControlPlaneRegistry(directory).getSnapshot(), /REGISTRY_LEDGER_HASH_MISMATCH/);
  });
});
