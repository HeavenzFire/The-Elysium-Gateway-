import { randomUUID } from "node:crypto";
import { homedir } from "node:os";
import path from "node:path";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";

export type NodeKind = "windows" | "android" | "linux" | "macos";
export type NodeStatus = "online" | "offline" | "unknown";
export type NodeCapability =
  | "local-inference"
  | "project-files"
  | "git-read"
  | "git-write"
  | "task-execution"
  | "health-report";

export interface RegisteredProject {
  id: string;
  name: string;
  repositoryFullName?: string;
  defaultBranch?: string;
  localPath?: string;
  ownerNodeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisteredNode {
  id: string;
  label: string;
  kind: NodeKind;
  status: NodeStatus;
  capabilities: NodeCapability[];
  platform?: string;
  appVersion?: string;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistryEvent {
  id: string;
  type: "project.registered" | "node.registered" | "node.heartbeat" | "node.status";
  subjectId: string;
  occurredAt: string;
  actor: "local-user" | "node";
  detail?: Record<string, string>;
}

export interface RegistrySnapshot {
  schemaVersion: 1;
  revision: number;
  updatedAt: string;
  projects: RegisteredProject[];
  nodes: RegisteredNode[];
  events: RegistryEvent[];
}

export interface RegisterProjectInput {
  name: string;
  repositoryFullName?: string;
  defaultBranch?: string;
  localPath?: string;
  ownerNodeId?: string;
}

export interface RegisterNodeInput {
  id?: string;
  label: string;
  kind: NodeKind;
  capabilities?: NodeCapability[];
  platform?: string;
  appVersion?: string;
}

const ALLOWED_CAPABILITIES = new Set<NodeCapability>([
  "local-inference",
  "project-files",
  "git-read",
  "git-write",
  "task-execution",
  "health-report",
]);
const NODE_KINDS = new Set<NodeKind>(["windows", "android", "linux", "macos"]);

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
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(raw)) {
    throw new Error("INVALID_REPOSITORY_FULL_NAME");
  }
  return raw;
}

function normalizeCapabilities(value: unknown): NodeCapability[] {
  if (value === undefined) return ["health-report"];
  if (!Array.isArray(value) || value.length > ALLOWED_CAPABILITIES.size) {
    throw new Error("INVALID_NODE_CAPABILITIES");
  }
  const unique = [...new Set(value)];
  if (unique.some((item) => typeof item !== "string" || !ALLOWED_CAPABILITIES.has(item as NodeCapability))) {
    throw new Error("UNSUPPORTED_NODE_CAPABILITY");
  }
  return unique as NodeCapability[];
}

function emptySnapshot(): RegistrySnapshot {
  return {
    schemaVersion: 1,
    revision: 0,
    updatedAt: new Date(0).toISOString(),
    projects: [],
    nodes: [],
    events: [],
  };
}

/**
 * Durable, local-first registry. It records only explicitly supplied project
 * locations and node capabilities; it never scans the filesystem or executes work.
 */
export class ControlPlaneRegistry {
  private writeQueue: Promise<void> = Promise.resolve();
  private snapshotCache: RegistrySnapshot | null = null;
  readonly filePath: string;

  constructor(dataDirectory = process.env.HEAVENZFIRE_DATA_DIR || path.join(homedir(), ".heavenzfire")) {
    this.filePath = path.join(dataDirectory, "control-plane-registry.json");
  }

  private async load(): Promise<RegistrySnapshot> {
    if (this.snapshotCache) return structuredClone(this.snapshotCache);
    try {
      const raw = await readFile(this.filePath, "utf8");
      const parsed = JSON.parse(raw) as RegistrySnapshot;
      if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.projects) ||
          !Array.isArray(parsed.nodes) || !Array.isArray(parsed.events)) {
        throw new Error("REGISTRY_SCHEMA_INVALID");
      }
      this.snapshotCache = parsed;
      return structuredClone(parsed);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      const initial = emptySnapshot();
      this.snapshotCache = initial;
      return structuredClone(initial);
    }
  }

  private async persist(snapshot: RegistrySnapshot): Promise<void> {
    const directory = path.dirname(this.filePath);
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const temporaryPath = `${this.filePath}.${randomUUID()}.tmp`;
    await writeFile(temporaryPath, JSON.stringify(snapshot, null, 2) + "\n", { encoding: "utf8", mode: 0o600 });
    await rename(temporaryPath, this.filePath);
    this.snapshotCache = structuredClone(snapshot);
  }

  private async mutate<T>(
    operation: (snapshot: RegistrySnapshot) => { value: T; event?: RegistryEvent },
  ): Promise<T> {
    let resolveResult!: (value: T) => void;
    let rejectResult!: (reason: unknown) => void;
    const result = new Promise<T>((resolve, reject) => {
      resolveResult = resolve;
      rejectResult = reject;
    });

    this.writeQueue = this.writeQueue.then(async () => {
      try {
        const snapshot = await this.load();
        const mutation = operation(snapshot);
        const now = new Date().toISOString();
        snapshot.revision += 1;
        snapshot.updatedAt = now;
        if (mutation.event) {
          snapshot.events.push(mutation.event);
          if (snapshot.events.length > 10000) snapshot.events.splice(0, snapshot.events.length - 10000);
        }
        await this.persist(snapshot);
        resolveResult(mutation.value);
      } catch (error) {
        rejectResult(error);
      }
    });
    return result;
  }

  async getSnapshot(): Promise<RegistrySnapshot> {
    await this.writeQueue;
    return this.load();
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
        (localPath && project.localPath?.toLowerCase() === localPath.toLowerCase()),
      );
      if (duplicate) throw new Error("DUPLICATE_PROJECT_LINK");

      if (ownerNodeId && !snapshot.nodes.some((node) => node.id === ownerNodeId)) {
        throw new Error("UNKNOWN_OWNER_NODE");
      }

      const now = new Date().toISOString();
      const project: RegisteredProject = {
        id: randomUUID(),
        name,
        ...(repositoryFullName ? { repositoryFullName } : {}),
        ...(defaultBranch ? { defaultBranch } : {}),
        ...(localPath ? { localPath } : {}),
        ...(ownerNodeId ? { ownerNodeId } : {}),
        createdAt: now,
        updatedAt: now,
      };
      snapshot.projects.push(project);
      return {
        value: project,
        event: {
          id: randomUUID(),
          type: "project.registered",
          subjectId: project.id,
          occurredAt: now,
          actor: "local-user",
          detail: {
            name: project.name,
            ...(project.repositoryFullName ? { repositoryFullName: project.repositoryFullName } : {}),
            ...(project.ownerNodeId ? { ownerNodeId: project.ownerNodeId } : {}),
          },
        },
      };
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
      const node: RegisteredNode = {
        id,
        label,
        kind: input.kind,
        status: "online",
        capabilities,
        ...(platform ? { platform } : {}),
        ...(appVersion ? { appVersion } : {}),
        lastSeenAt: now,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
      };
      if (existing) snapshot.nodes[snapshot.nodes.indexOf(existing)] = node;
      else snapshot.nodes.push(node);

      return {
        value: node,
        event: {
          id: randomUUID(),
          type: "node.registered",
          subjectId: id,
          occurredAt: now,
          actor: "node",
          detail: { label, kind: input.kind, capabilities: capabilities.join(",") },
        },
      };
    });
  }

  async heartbeatNode(nodeId: string): Promise<RegisteredNode> {
    const id = requiredText(nodeId, "node_id", 80);
    return this.mutate((snapshot) => {
      const node = snapshot.nodes.find((item) => item.id === id);
      if (!node) throw new Error("UNKNOWN_NODE");
      const now = new Date().toISOString();
      node.status = "online";
      node.lastSeenAt = now;
      node.updatedAt = now;
      return {
        value: node,
        event: {
          id: randomUUID(),
          type: "node.heartbeat",
          subjectId: id,
          occurredAt: now,
          actor: "node",
        },
      };
    });
  }

  async setNodeStatus(nodeId: string, status: Exclude<NodeStatus, "unknown">): Promise<RegisteredNode> {
    const id = requiredText(nodeId, "node_id", 80);
    return this.mutate((snapshot) => {
      const node = snapshot.nodes.find((item) => item.id === id);
      if (!node) throw new Error("UNKNOWN_NODE");
      const now = new Date().toISOString();
      node.status = status;
      node.updatedAt = now;
      return {
        value: node,
        event: {
          id: randomUUID(),
          type: "node.status",
          subjectId: id,
          occurredAt: now,
          actor: "local-user",
          detail: { status },
        },
      };
    });
  }
}

let singleton: ControlPlaneRegistry | undefined;

export function getControlPlaneRegistry(): ControlPlaneRegistry {
  singleton ||= new ControlPlaneRegistry();
  return singleton;
}
