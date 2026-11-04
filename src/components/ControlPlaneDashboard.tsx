import React, { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Database, FolderOpen, PlusCircle, RefreshCw, ShieldCheck, Wifi, WifiOff } from "lucide-react";

type NodeRecord = {
  id: string; label: string; kind: string; status: "online" | "offline" | "unknown";
  capabilities: string[]; lastSeenAt: string;
};
type ProjectRecord = {
  id: string; name: string; repositoryFullName?: string; defaultBranch?: string;
  localPath?: string; updatedAt: string;
};
type EvidenceRecord = {
  id: string; sequence: number; taskId: string; action: string; outcome: string;
  occurredAt: string; authorization: { kind: string; subjectId: string };
  assignedNodeId?: string; recordHash: string;
};
type RegistrySnapshot = {
  schemaVersion: number; revision: number; updatedAt: string;
  projects: ProjectRecord[]; nodes: NodeRecord[];
};
type VerifyResult = { valid: boolean; sequence?: number; count?: number; headHash: string };
type DesktopBridge = {
  getDesktopInfo(): Promise<{ name: string; version: string; gateway: string; dataDirectory: string }>;
  getRegistry(): Promise<RegistrySnapshot>;
  verifyRegistry(): Promise<VerifyResult>;
  listEvidence(limit?: number): Promise<{ records: EvidenceRecord[] }>;
  verifyEvidence(): Promise<VerifyResult>;
  selectWorkspace(): Promise<string | null>;
  registerProject(project: { name: string; repositoryFullName?: string; defaultBranch?: string; localPath?: string }): Promise<ProjectRecord>;
};
declare global {
  interface Window { heavenzfireDesktop?: DesktopBridge; }
}

function shortHash(value?: string) {
  return value ? value.slice(0, 12) + "…" : "—";
}
function timeLabel(value?: string) {
  if (!value) return "Never";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}
function Integrity({ result, label }: { result: VerifyResult | null; label: string }) {
  if (!result) return <span className="text-xs text-white/40">Checking {label}…</span>;
  return result.valid
    ? <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300"><CheckCircle2 className="w-3.5 h-3.5" /> {label} verified</span>
    : <span className="inline-flex items-center gap-1.5 text-xs text-rose-300"><AlertTriangle className="w-3.5 h-3.5" /> {label} integrity error</span>;
}

export default function ControlPlaneDashboard() {
  const [desktop, setDesktop] = useState<Awaited<ReturnType<DesktopBridge["getDesktopInfo"]>> | null>(null);
  const [snapshot, setSnapshot] = useState<RegistrySnapshot | null>(null);
  const [registryIntegrity, setRegistryIntegrity] = useState<VerifyResult | null>(null);
  const [evidenceIntegrity, setEvidenceIntegrity] = useState<VerifyResult | null>(null);
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [repositoryFullName, setRepositoryFullName] = useState("");
  const [defaultBranch, setDefaultBranch] = useState("main");
  const [localPath, setLocalPath] = useState("");
  const [savingProject, setSavingProject] = useState(false);

  const refresh = useCallback(async () => {
    const bridge = window.heavenzfireDesktop;
    if (!bridge) {
      setError("The native desktop bridge is unavailable. Launch this interface with npm run desktop:dev.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const [info, registry, registryCheck, evidencePage, evidenceCheck] = await Promise.all([
        bridge.getDesktopInfo(),
        bridge.getRegistry(),
        bridge.verifyRegistry(),
        bridge.listEvidence(25),
        bridge.verifyEvidence(),
      ]);
      setDesktop(info);
      setSnapshot(registry);
      setRegistryIntegrity(registryCheck);
      setEvidence(evidencePage.records);
      setEvidenceIntegrity(evidenceCheck);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "CONTROL_PLANE_READ_FAILED");
    } finally {
      setBusy(false);
    }
  }, []);

  const chooseWorkspace = async () => {
    const bridge = window.heavenzfireDesktop;
    if (!bridge) return;
    try {
      const selected = await bridge.selectWorkspace();
      if (selected) setLocalPath(selected);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "WORKSPACE_PICKER_FAILED"); }
  };

  const registerProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bridge = window.heavenzfireDesktop;
    if (!bridge || savingProject) return;
    if (!repositoryFullName.trim() && !localPath.trim()) { setError("Choose a local workspace or enter a GitHub repository before registering."); return; }
    setSavingProject(true);
    setError(null);
    try {
      await bridge.registerProject({
        name: projectName.trim(),
        ...(repositoryFullName.trim() ? { repositoryFullName: repositoryFullName.trim() } : {}),
        ...(defaultBranch.trim() && repositoryFullName.trim() ? { defaultBranch: defaultBranch.trim() } : {}),
        ...(localPath.trim() ? { localPath: localPath.trim() } : {}),
      });
      setProjectName(""); setRepositoryFullName(""); setDefaultBranch("main"); setLocalPath("");
      await refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "PROJECT_REGISTRATION_FAILED"); }
    finally { setSavingProject(false); }
  };

  useEffect(() => { void refresh(); }, [refresh]);

  const nodes = snapshot?.nodes || [];
  const projects = snapshot?.projects || [];
  const onlineCount = nodes.filter((node) => node.status === "online").length;

  return (
    <section className="space-y-5 text-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-serif font-bold text-lg text-amber-200">HeavenzFire Control Plane</h4>
          <p className="text-xs text-white/50 font-mono mt-1">Local registry · node state · append-only evidence</p>
        </div>
        <button onClick={() => void refresh()} disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs text-white/80 hover:bg-white/10 disabled:opacity-40">
          <RefreshCw className={`h-3.5 w-3.5 ${busy ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
          <div className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" /> Control plane unavailable</div>
          <p className="mt-1 break-words">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-xs text-white/50"><Database className="h-4 w-4" /> Projects</div>
          <div className="mt-2 text-2xl font-semibold">{projects.length}</div>
          <div className="text-[11px] text-white/40">Linked workspaces</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-xs text-white/50"><Activity className="h-4 w-4" /> Nodes online</div>
          <div className="mt-2 text-2xl font-semibold">{onlineCount}<span className="text-sm text-white/40"> / {nodes.length}</span></div>
          <div className="text-[11px] text-white/40">Registered devices</div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold text-white/85">Local runtime</div>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300"><Wifi className="h-3.5 w-3.5" /> {desktop?.gateway || "checking"}</span>
        </div>
        <div className="text-[11px] text-white/45">Application data directory</div>
        <div className="break-all rounded-lg bg-black/30 p-2 font-mono text-[11px] text-white/75">{desktop?.dataDirectory || "—"}</div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Integrity result={registryIntegrity} label="Registry" />
          <Integrity result={evidenceIntegrity} label="Evidence" />
        </div>
        <div className="text-[11px] text-white/35">Registry revision {snapshot?.revision ?? "—"} · {evidenceIntegrity?.count ?? 0} evidence records · app {desktop?.version || "—"}</div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-semibold text-amber-100">Registered nodes</h5>
          <span className="text-[11px] text-white/35">{nodes.length} total</span>
        </div>
        {nodes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 p-4 text-xs text-white/40">No nodes enrolled yet. Node enrollment and Termux transport are the next integration stage.</div>
        ) : nodes.map((node) => (
          <div key={node.id} className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{node.label}</div>
                <div className="mt-0.5 text-[10px] font-mono text-white/40">{node.kind} · {node.id}</div>
              </div>
              <span className={`shrink-0 inline-flex items-center gap-1 text-[10px] ${node.status === "online" ? "text-emerald-300" : "text-white/40"}`}>
                {node.status === "online" ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}{node.status}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {node.capabilities.map((capability) => <span key={capability} className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-white/50">{capability}</span>)}
            </div>
            <div className="mt-2 text-[10px] text-white/35">Last heartbeat: {timeLabel(node.lastSeenAt)}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-semibold text-amber-100">Linked projects</h5>
          <span className="text-[11px] text-white/35">{projects.length} total</span>
        </div>
        <form onSubmit={registerProject} className="space-y-2 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.035] p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-100"><PlusCircle className="h-3.5 w-3.5" /> Register a project link</div>
          <input value={projectName} onChange={(event) => setProjectName(event.target.value)} required maxLength={120} placeholder="Project name"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400/50" />
          <div className="grid grid-cols-[1fr_110px] gap-2">
            <input value={repositoryFullName} onChange={(event) => setRepositoryFullName(event.target.value)} placeholder="GitHub owner/repository"
              className="min-w-0 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400/50" />
            <input value={defaultBranch} onChange={(event) => setDefaultBranch(event.target.value)} placeholder="Branch"
              className="min-w-0 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400/50" />
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => void chooseWorkspace()} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-2 text-[11px] text-white/75 hover:bg-white/10">
              <FolderOpen className="h-3.5 w-3.5" /> Choose local folder
            </button>
            <span className="min-w-0 truncate text-[10px] text-white/40">{localPath || "No local folder selected"}</span>
          </div>
          <button type="submit" disabled={savingProject || !projectName.trim() || (!repositoryFullName.trim() && !localPath.trim())}
            className="w-full rounded-lg bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-100 hover:bg-cyan-500/25 disabled:opacity-35">
            {savingProject ? "Registering…" : "Register project link"}
          </button>
          <p className="text-[9px] leading-relaxed text-white/35">Registration stores the selected path and repository reference only. It does not scan or modify workspace files.</p>
        </form>
        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 p-4 text-xs text-white/40">No projects registered yet.</div>
        ) : projects.map((project) => (
          <div key={project.id} className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
            <div className="text-sm font-medium">{project.name}</div>
            <div className="mt-1 break-all text-[10px] font-mono text-white/50">{project.repositoryFullName || project.localPath || "Unlinked source"}</div>
            {project.defaultBranch && <div className="mt-1 text-[10px] text-white/35">Branch: {project.defaultBranch}</div>}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-semibold text-amber-100">Recent task evidence</h5>
          <span className="text-[11px] text-white/35">Latest {evidence.length}</span>
        </div>
        {evidence.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 p-4 text-xs text-white/40">The append-only evidence ledger is ready; no task records have been submitted yet.</div>
        ) : evidence.slice().reverse().map((record) => (
          <div key={record.id} className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="truncate text-xs font-semibold text-white/85">{record.taskId}</div>
              <span className="shrink-0 rounded bg-white/5 px-2 py-1 text-[9px] uppercase tracking-wide text-white/55">{record.outcome}</span>
            </div>
            <div className="mt-1 text-[10px] text-white/45">{record.action} · {record.authorization.subjectId}</div>
            <div className="mt-1 flex items-center justify-between gap-2 text-[9px] text-white/35">
              <span>#{record.sequence} · {timeLabel(record.occurredAt)}</span>
              <span className="font-mono">{shortHash(record.recordHash)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 text-[10px] leading-relaxed text-cyan-100/60">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        Hash-chain verification detects edits and corruption; it is not a digital signature or protection against an administrator rewriting the entire ledger.
      </div>
    </section>
  );
}
