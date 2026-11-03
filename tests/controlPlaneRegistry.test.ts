import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
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
    assert.equal(snapshot.schemaVersion, 1);
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

test("heartbeat updates node status and records an auditable event", async () => {
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

    const heartbeat = await registry.heartbeatNode(node.id);
    const snapshot = await registry.getSnapshot();
    assert.equal(heartbeat.status, "online");
    assert.equal(snapshot.nodes[0].status, "online");
    assert.equal(snapshot.events.at(-1)?.type, "node.heartbeat");
  });
});

test("writes valid JSON and bounds retained event history", async () => {
  await withRegistry(async (registry) => {
    await registry.registerNode({ id: "node-a", label: "Node A", kind: "linux" });
    const raw = await readFile(registry.filePath, "utf8");
    const parsed = JSON.parse(raw);
    assert.equal(parsed.schemaVersion, 1);
    assert.equal(parsed.revision, 1);
  });
});
