import { timingSafeEqual } from "node:crypto";
import path from "node:path";
import type { Express, NextFunction, Request, Response } from "express";
import { getControlPlaneRegistry } from "./registry";
import { TaskEvidenceLedger, type TaskEvidenceInput } from "./evidenceLedger";

function isLoopback(address = ""): boolean {
  return address === "::1" ||
    address === "127.0.0.1" ||
    address.startsWith("127.") ||
    address.startsWith("::ffff:127.");
}

function controlPlaneAuth(req: Request, res: Response, next: NextFunction): void {
  const expected = process.env.HEAVENZFIRE_CONTROL_TOKEN || "";
  if (!expected) {
    res.status(503).json({ error: "DESKTOP_CONTROL_TOKEN_NOT_CONFIGURED" });
    return;
  }

  if (!isLoopback(req.socket.remoteAddress || "")) {
    res.status(403).json({ error: "LOOPBACK_ACCESS_REQUIRED" });
    return;
  }

  const authorization = req.get("authorization") || "";
  const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const expectedBytes = Buffer.from(expected, "utf8");
  const suppliedBytes = Buffer.from(supplied, "utf8");
  if (expectedBytes.length !== suppliedBytes.length || !timingSafeEqual(expectedBytes, suppliedBytes)) {
    res.status(401).json({ error: "INVALID_CONTROL_PLANE_CREDENTIAL" });
    return;
  }
  next();
}

function sendRegistryError(res: Response, error: unknown): void {
  const message = error instanceof Error ? error.message : "REGISTRY_OPERATION_FAILED";
  const status =
    message === "UNKNOWN_NODE" || message === "UNKNOWN_OWNER_NODE" ? 404 :
    message === "DUPLICATE_PROJECT_LINK" ? 409 :
    message.startsWith("INVALID_") ||
    message === "LOCAL_PATH_MUST_BE_ABSOLUTE" ||
    message === "PROJECT_REQUIRES_REPOSITORY_OR_LOCAL_PATH" ||
    message === "UNSUPPORTED_NODE_CAPABILITY" ? 400 : 500;

  res.status(status).json({ error: status === 500 ? "REGISTRY_OPERATION_FAILED" : message });
}

export function registerControlPlaneRoutes(app: Express): void {
  const registry = getControlPlaneRegistry();
  const evidence = new TaskEvidenceLedger(path.dirname(registry.filePath));
  app.use("/api/control-plane", controlPlaneAuth);

  app.get("/api/control-plane/registry/verify", async (_req, res) => {
    try { res.json(await registry.verifyLedger()); }
    catch (error) { sendRegistryError(res, error); }
  });

  app.get("/api/control-plane/evidence", async (req, res) => {
    try {
      const rawLimit = req.query.limit;
      const limit = rawLimit === undefined ? 100 : Number(rawLimit);
      res.json({ records: await evidence.list(limit) });
    } catch (error) { sendRegistryError(res, error); }
  });

  app.get("/api/control-plane/evidence/verify", async (_req, res) => {
    try { res.json(await evidence.verify()); }
    catch (error) { sendRegistryError(res, error); }
  });

  app.post("/api/control-plane/evidence", async (req, res) => {
    try {
      const record = await evidence.append((req.body || {}) as TaskEvidenceInput);
      res.status(201).json(record);
    } catch (error) { sendRegistryError(res, error); }
  });

  app.get("/api/control-plane/registry", async (_req, res) => {
    try {
      res.json(await registry.getSnapshot());
    } catch (error) {
      sendRegistryError(res, error);
    }
  });

  app.post("/api/control-plane/projects", async (req, res) => {
    try {
      const project = await registry.registerProject(req.body || {});
      res.status(201).json(project);
    } catch (error) {
      sendRegistryError(res, error);
    }
  });

  app.post("/api/control-plane/nodes", async (req, res) => {
    try {
      const node = await registry.registerNode(req.body || {});
      res.status(201).json(node);
    } catch (error) {
      sendRegistryError(res, error);
    }
  });

  app.post("/api/control-plane/nodes/:nodeId/heartbeat", async (req, res) => {
    try {
      res.json(await registry.heartbeatNode(req.params.nodeId, req.body?.health));
    } catch (error) {
      sendRegistryError(res, error);
    }
  });

  app.patch("/api/control-plane/nodes/:nodeId/status", async (req, res) => {
    try {
      const status = req.body?.status;
      if (status !== "online" && status !== "offline") {
        res.status(400).json({ error: "INVALID_NODE_STATUS" });
        return;
      }
      res.json(await registry.setNodeStatus(req.params.nodeId, status));
    } catch (error) {
      sendRegistryError(res, error);
    }
  });
}
