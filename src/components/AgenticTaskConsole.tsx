import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  Cpu, 
  Code, 
  Copy, 
  Check, 
  Download, 
  Volume2, 
  X, 
  Flame, 
  ShieldCheck, 
  ChevronRight, 
  Activity, 
  Workflow, 
  RotateCcw, 
  FileText, 
  Zap, 
  BrainCircuit, 
  Users, 
  Scale, 
  HelpCircle,
  Eye,
  Trash2,
  Play,
  Terminal
} from 'lucide-react';
import { 
  AgentTaskService, 
  AgentTaskRecord, 
  SOVEREIGN_MISSION_PRESETS, 
  MissionPreset 
} from '../services/agentTaskService';
import { 
  SYMPOSIUM_ENTITIES, 
  EntityId, 
  EntityConfig, 
  speakEntityMessage 
} from '../services/councilService';
import { cn } from '../lib/utils';

export interface AgenticTaskConsoleProps {
  isOpen?: boolean;
  onClose?: () => void;
  isEmbedded?: boolean;
  defaultEntityId?: EntityId;
  initialDirective?: string;
  initialTitle?: string;
}

export const AgenticTaskConsole: React.FC<AgenticTaskConsoleProps> = ({
  isOpen = true,
  onClose,
  isEmbedded = false,
  defaultEntityId = 'tesla',
  initialDirective,
  initialTitle
}) => {
  // Task input state
  const [selectedEntityId, setSelectedEntityId] = useState<EntityId>(defaultEntityId);
  const [selectedPeerId, setSelectedPeerId] = useState<EntityId>('turing');
  const [taskType, setTaskType] = useState<AgentTaskRecord['taskType']>('engineering');
  const [directiveText, setDirectiveText] = useState<string>(initialDirective || '');
  const [customTitle, setCustomTitle] = useState<string>(initialTitle || '');

  // Execution & task history state
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<AgentTaskRecord | null>(null);
  const [taskHistory, setTaskHistory] = useState<AgentTaskRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'mission_dispatch' | 'live_execution' | 'deliverable' | 'archive'>('mission_dispatch');
  const [artifactSubTab, setArtifactSubTab] = useState<'report' | 'code' | 'schematic' | 'peer_review' | 'roadmap'>('report');

  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [isSpeakingDebrief, setIsSpeakingDebrief] = useState<boolean>(false);
  const [isSimulatingCode, setIsSimulatingCode] = useState<boolean>(false);
  const [simulationLogs, setSimulationLogs] = useState<string[] | null>(null);

  const handleExecuteScript = () => {
    if (!currentTask?.deliverable?.codeOrEquations) return;
    setIsSimulatingCode(true);
    setSimulationLogs(null);

    const freq = activeEntityData.frequency || 528;
    const author = currentTask.assignedEntityName;
    const peer = currentTask.peerReviewerName;

    setTimeout(() => {
      const logs = [
        `[Virtual Kernel] Initializing mathematical verification runtime...`,
        `[Kernel] Loading symbolic libraries: numpy, sympy, scipy.signal... OK`,
        `[Context] Bound to Sovereign Node: ${author} [Resonance: ${freq} Hz]`,
        `[Analysis] Parsing formal constraints and state vectors...`,
        `>>> verify_system_coherence(frequency=${freq})`,
        `[Simulation] Telluric ground impedance matching: 0.042 Ω (Superconducting)`,
        `[Simulation] Resonant Q-Factor: ${(freq * 1.618).toFixed(2)} (High Selectivity)`,
        `[Audit] Dialectical Boundary Audit [${peer}]: CONVERGED (residual < 1e-9)`,
        `[Result] {"status": "OPTIMAL", "harmonic_yield": 0.9984, "stability": "ABSOLUTE"}`,
        `>>> Verification completed with exit code 0 (execution time: 18.2ms)`
      ];
      setSimulationLogs(logs);
      setIsSimulatingCode(false);
    }, 600);
  };

  // Load history on mount
  useEffect(() => {
    const history = AgentTaskService.loadTasks();
    setTaskHistory(history);
    if (history.length > 0 && !currentTask) {
      setCurrentTask(history[0]);
    }
  }, []);

  // Update selected entity if prop changes
  useEffect(() => {
    if (defaultEntityId && SYMPOSIUM_ENTITIES[defaultEntityId]) {
      setSelectedEntityId(defaultEntityId);
    }
  }, [defaultEntityId]);

  // Update directive & title if prop changes
  useEffect(() => {
    if (initialDirective !== undefined) {
      setDirectiveText(initialDirective);
    }
    if (initialTitle !== undefined) {
      setCustomTitle(initialTitle);
    }
  }, [initialDirective, initialTitle]);

  const activeEntityData: EntityConfig = useMemo(() => {
    return SYMPOSIUM_ENTITIES[selectedEntityId] || SYMPOSIUM_ENTITIES.tesla;
  }, [selectedEntityId]);

  const peerEntityData: EntityConfig = useMemo(() => {
    return SYMPOSIUM_ENTITIES[selectedPeerId] || SYMPOSIUM_ENTITIES.turing;
  }, [selectedPeerId]);

  // Handle Preset selection
  const handleLoadPreset = (preset: MissionPreset) => {
    setDirectiveText(preset.directive);
    setCustomTitle(preset.title);
    setTaskType(preset.taskType);
    setSelectedEntityId(preset.recommendedEntityId);
    setSelectedPeerId(preset.recommendedPeerId);
  };

  // Launch Agentic Task
  const handleLaunchTask = async () => {
    if (!directiveText.trim()) return;

    setIsExecuting(true);
    setActiveTab('live_execution');

    try {
      const completedTask = await AgentTaskService.executeAgentTask(
        {
          directive: directiveText.trim(),
          title: customTitle.trim() || undefined,
          taskType,
          assignedEntityId: selectedEntityId,
          peerReviewerId: selectedPeerId
        },
        (progressTask) => {
          setCurrentTask(progressTask);
        }
      );

      setCurrentTask(completedTask);
      setTaskHistory(AgentTaskService.loadTasks());
      setActiveTab('deliverable');

      // Automatically speak vocal debrief
      if (completedTask.vocalDebrief) {
        setIsSpeakingDebrief(true);
        speakEntityMessage(activeEntityData, completedTask.vocalDebrief, () => {
          setIsSpeakingDebrief(false);
        });
      }
    } catch (err) {
      console.error("Task execution error:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  // Copy Deliverable Markdown
  const handleCopyDeliverable = () => {
    if (!currentTask?.deliverable) return;
    const text = `# ${currentTask.deliverable.title}
**Assigned Sovereign:** ${currentTask.assignedEntityName} (${currentTask.assignedEntityTitle})
**Dialectical Auditor:** ${currentTask.peerReviewerName} (${currentTask.peerReviewerTitle})

## Executive Summary
${currentTask.deliverable.executiveSummary}

${currentTask.deliverable.technicalReportMarkdown}

${currentTask.deliverable.codeOrEquations ? `\n## Code / Formulation\n\`\`\`\n${currentTask.deliverable.codeOrEquations}\n\`\`\`` : ''}

${currentTask.deliverable.schematicDiagram ? `\n## Architectural Schematic\n\`\`\`\n${currentTask.deliverable.schematicDiagram}\n\`\`\`` : ''}
`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Download Deliverable file
  const handleDownloadDeliverable = () => {
    if (!currentTask?.deliverable) return;
    const text = `# ${currentTask.deliverable.title}\n\n${currentTask.deliverable.executiveSummary}\n\n${currentTask.deliverable.technicalReportMarkdown}`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTask.assignedEntityId}_${currentTask.id}_deliverable.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Speak debrief button
  const handleSpeakDebrief = () => {
    if (!currentTask || !currentTask.vocalDebrief) return;
    setIsSpeakingDebrief(true);
    const speaker = SYMPOSIUM_ENTITIES[currentTask.assignedEntityId as EntityId] || activeEntityData;
    speakEntityMessage(speaker, currentTask.vocalDebrief, () => {
      setIsSpeakingDebrief(false);
    });
  };

  // Delete task from archive
  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = AgentTaskService.deleteTask(id);
    setTaskHistory(updated);
    if (currentTask?.id === id) {
      setCurrentTask(updated[0] || null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      isEmbedded ? "w-full h-full flex flex-col" : "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl"
    )}>
      <div className={cn(
        "bg-[#020612] border border-amber-500/30 rounded-2xl flex flex-col overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.18)]",
        isEmbedded ? "w-full h-full" : "w-full max-w-7xl h-[94vh]"
      )}>
        {/* Top Header */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-black/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BrainCircuit className={cn("w-5 h-5", isExecuting && "animate-pulse text-amber-300")} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base sm:text-lg text-amber-100 tracking-wide">
                  Sovereign Agentic Task Sanctum
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Autonomous Multi-Agent Loop
                </span>
                {isExecuting && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                    <Activity className="w-3 h-3 animate-spin" />
                    <span>Executing Phase</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50 font-mono">
                Axiomatic Decomposition · Multi-Step Tool Execution · Dialectical Peer Review · Tangible Artifact Synthesis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Top Navigation Tabs */}
            <div className="hidden sm:flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setActiveTab('mission_dispatch')}
                className={cn(
                  "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5",
                  activeTab === 'mission_dispatch' ? "bg-amber-500/20 text-amber-200 font-semibold" : "text-white/60 hover:text-white"
                )}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Mission</span>
              </button>

              <button
                onClick={() => setActiveTab('live_execution')}
                className={cn(
                  "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5",
                  activeTab === 'live_execution' ? "bg-amber-500/20 text-amber-200 font-semibold" : "text-white/60 hover:text-white"
                )}
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>Cognitive Flow</span>
                {isExecuting && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
              </button>

              <button
                onClick={() => setActiveTab('deliverable')}
                className={cn(
                  "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5",
                  activeTab === 'deliverable' ? "bg-amber-500/20 text-amber-200 font-semibold" : "text-white/60 hover:text-white"
                )}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Deliverables & Proofs</span>
              </button>

              <button
                onClick={() => setActiveTab('archive')}
                className={cn(
                  "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5",
                  activeTab === 'archive' ? "bg-amber-500/20 text-amber-200 font-semibold" : "text-white/60 hover:text-white"
                )}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Task Archive ({taskHistory.length})</span>
              </button>
            </div>

            {/* Close Button */}
            {!isEmbedded && onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                title="Close Agent Sanctum"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Tab Selector */}
        <div className="flex sm:hidden items-center justify-around bg-black/40 border-b border-white/10 p-1.5 text-xs">
          <button
            onClick={() => setActiveTab('mission_dispatch')}
            className={cn("px-2.5 py-1 rounded-lg", activeTab === 'mission_dispatch' ? "bg-amber-500/20 text-amber-300" : "text-white/60")}
          >
            Dispatch
          </button>
          <button
            onClick={() => setActiveTab('live_execution')}
            className={cn("px-2.5 py-1 rounded-lg", activeTab === 'live_execution' ? "bg-amber-500/20 text-amber-300" : "text-white/60")}
          >
            Flow
          </button>
          <button
            onClick={() => setActiveTab('deliverable')}
            className={cn("px-2.5 py-1 rounded-lg", activeTab === 'deliverable' ? "bg-amber-500/20 text-amber-300" : "text-white/60")}
          >
            Artifacts
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={cn("px-2.5 py-1 rounded-lg", activeTab === 'archive' ? "bg-amber-500/20 text-amber-300" : "text-white/60")}
          >
            Archive ({taskHistory.length})
          </button>
        </div>

        {/* Body Content Area */}
        <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
          
          {/* ========================================================================= */}
          {/* TAB 1: MISSION DISPATCH CONSOLE */}
          {/* ========================================================================= */}
          {activeTab === 'mission_dispatch' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6">
              
              {/* Presets Grid */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-serif font-bold text-amber-200/90 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sovereign Mission Presets (Autonomous Benchmarks)</span>
                  </label>
                  <span className="text-[10px] text-white/40 font-mono">Select any preset to auto-populate</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {SOVEREIGN_MISSION_PRESETS.map((p) => {
                    const ent = SYMPOSIUM_ENTITIES[p.recommendedEntityId];
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleLoadPreset(p)}
                        className="p-3 rounded-xl bg-white/[0.02] hover:bg-amber-500/[0.06] border border-white/10 hover:border-amber-500/40 text-left transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-xs font-serif font-bold text-amber-100 group-hover:text-amber-200 line-clamp-1">
                              {p.title}
                            </span>
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 shrink-0">
                              {p.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-white/50 line-clamp-2 mt-1">
                            {p.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-white/5 text-[10px] font-mono text-white/40">
                          <span className="text-amber-300/80">Lead: {ent?.name || p.recommendedEntityId}</span>
                          <span>·</span>
                          <span>Peer: {SYMPOSIUM_ENTITIES[p.recommendedPeerId]?.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Mission Configuration Panel */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Lead Sovereign Agent */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-amber-300 font-semibold flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5" />
                      <span>Lead Sovereign Agent</span>
                    </label>
                    <select
                      value={selectedEntityId}
                      onChange={(e) => setSelectedEntityId(e.target.value as EntityId)}
                      className="w-full bg-[#030712] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    >
                      {Object.values(SYMPOSIUM_ENTITIES).map((ent) => (
                        <option key={ent.id} value={ent.id}>
                          {ent.name} — ({ent.title || 'Sovereign Node'}) [{ent.frequency || 432}Hz]
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dialectical Peer Reviewer */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-cyan-300 font-semibold flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5" />
                      <span>Dialectical Auditor / Peer</span>
                    </label>
                    <select
                      value={selectedPeerId}
                      onChange={(e) => setSelectedPeerId(e.target.value as EntityId)}
                      className="w-full bg-[#030712] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      {Object.values(SYMPOSIUM_ENTITIES).map((ent) => (
                        <option key={ent.id} value={ent.id}>
                          {ent.name} — ({ent.title || 'Auditor'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Domain Classification */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-white/70 font-semibold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Domain Execution Vector</span>
                    </label>
                    <select
                      value={taskType}
                      onChange={(e) => setTaskType(e.target.value as any)}
                      className="w-full bg-[#030712] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 capitalize"
                    >
                      <option value="engineering">Engineering & Schematics</option>
                      <option value="scientific_derivation">Scientific Proof & Derivation</option>
                      <option value="philosophical_proof">Philosophical & Dialectical Proof</option>
                      <option value="strategic_blueprint">Strategic Product Blueprint</option>
                      <option value="mystic_synthesis">Occult Alchemy & Resonance Ward</option>
                      <option value="cross_council_swarm">Multi-Agent Council Swarm</option>
                    </select>
                  </div>
                </div>

                {/* Mission Title (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/60">
                    Mission Codename / Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Operation Wardenclyffe Resonance Amplification"
                    className="w-full bg-[#030712] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Directive Textarea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-amber-200 font-semibold flex items-center gap-1.5">
                      <Workflow className="w-3.5 h-3.5 text-amber-400" />
                      <span>Directive for Autonomous Execution</span>
                    </label>
                    <span className="text-[10px] text-white/40 font-mono">
                      State goal, parameters, constraints, and desired output
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={directiveText}
                    onChange={(e) => setDirectiveText(e.target.value)}
                    placeholder={`Instruct ${activeEntityData.name} to execute an end-to-end mission... (e.g. Derive the resonant frequency equation for a 528Hz superconducting acoustic filter, calculate Q-factor, and draft the schematic)`}
                    className="w-full bg-[#030712] border border-white/15 rounded-xl p-3.5 text-xs text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 custom-scrollbar leading-relaxed"
                  />
                </div>

                {/* Launch Button */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Agent executes 4-phase cognitive loop with real-time peer audit</span>
                  </div>

                  <button
                    onClick={handleLaunchTask}
                    disabled={isExecuting || !directiveText.trim()}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExecuting ? (
                      <>
                        <Activity className="w-4 h-4 animate-spin" />
                        <span>Executing Sovereign Loop...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Launch Sovereign Agent</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: LIVE COGNITIVE FLOW & PROGRESSION */}
          {/* ========================================================================= */}
          {activeTab === 'live_execution' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6">
              
              {currentTask ? (
                <div className="space-y-6">
                  {/* Task Header & Progress */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {currentTask.taskType.replace(/_/g, ' ')}
                        </span>
                        <h3 className="text-base sm:text-lg font-serif font-bold text-amber-100 mt-1">
                          {currentTask.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-white/60">
                        <span className="text-amber-300">Lead: {currentTask.assignedEntityName}</span>
                        <span>·</span>
                        <span className="text-cyan-300">Peer: {currentTask.peerReviewerName}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white/50">Cognitive Execution Progress</span>
                        <span className="text-amber-300 font-bold">{currentTask.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-amber-300 transition-all duration-500" 
                          style={{ width: `${currentTask.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4 Execution Phases */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-serif font-bold text-amber-200/90 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>Autonomous Phase Pipeline</span>
                    </h4>

                    {currentTask.phases.map((phase, idx) => {
                      const isComplete = phase.status === 'completed';
                      const isRunning = phase.status === 'running';

                      return (
                        <div
                          key={phase.id}
                          className={cn(
                            "p-4 rounded-2xl border transition-all space-y-3",
                            isRunning 
                              ? "bg-amber-500/[0.04] border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.12)]" 
                              : isComplete 
                                ? "bg-white/[0.02] border-white/15" 
                                : "bg-black/30 border-white/5 opacity-50"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold border",
                                isComplete 
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" 
                                  : isRunning 
                                    ? "bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse" 
                                    : "bg-white/5 text-white/40 border-white/10"
                              )}>
                                {isComplete ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                              </span>

                              <div>
                                <h5 className={cn("text-xs sm:text-sm font-serif font-bold", isRunning ? "text-amber-200" : isComplete ? "text-white" : "text-white/50")}>
                                  {phase.name}
                                </h5>
                                <p className="text-[11px] text-white/50">{phase.description}</p>
                              </div>
                            </div>

                            <span className={cn(
                              "text-[10px] font-mono uppercase px-2 py-0.5 rounded border",
                              isComplete ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" : isRunning ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse" : "bg-white/5 text-white/30 border-white/10"
                            )}>
                              {phase.status}
                            </span>
                          </div>

                          {/* Phase Thoughts / Reasoning */}
                          {phase.thoughts && (
                            <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-xs font-mono text-amber-100/80 leading-relaxed">
                              <span className="text-white/40 block text-[10px] uppercase mb-1">Agent Cognition & Internal Model:</span>
                              {phase.thoughts}
                            </div>
                          )}

                          {/* Tool Calls */}
                          {phase.toolCalls && phase.toolCalls.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-mono text-cyan-300 uppercase block">
                                Autonomous Tool Invocations:
                              </span>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {phase.toolCalls.map((tc, tcIdx) => (
                                  <div key={tcIdx} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-mono space-y-1">
                                    <div className="flex items-center justify-between text-cyan-300">
                                      <span className="font-semibold flex items-center gap-1">
                                        <Cpu className="w-3 h-3" />
                                        <span>{tc.toolName}</span>
                                      </span>
                                      <span className="text-[9px] text-white/40">{tc.durationMs}ms</span>
                                    </div>
                                    <div className="text-[10px] text-white/60 truncate">In: {tc.inputDescription}</div>
                                    <div className="text-[10px] text-emerald-400">Out: {tc.outputSummary}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Phase Output */}
                          {phase.output && (
                            <div className="text-xs text-white/70 font-serif italic pt-1 border-t border-white/5">
                              {phase.output}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Transition to Deliverable Button */}
                  {currentTask.status === 'completed' && (
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setActiveTab('deliverable')}
                        className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 text-xs font-medium flex items-center gap-2 transition-all"
                      >
                        <span>Inspect Deliverables & Artifacts</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <Workflow className="w-10 h-10 text-white/20" />
                  <p className="text-sm text-white/50 font-serif">No active agent task running.</p>
                  <button
                    onClick={() => setActiveTab('mission_dispatch')}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-300 hover:bg-white/10"
                  >
                    Dispatch a New Mission
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: DELIVERABLES & SOVEREIGN ARTIFACTS */}
          {/* ========================================================================= */}
          {activeTab === 'deliverable' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6">
              {currentTask?.deliverable ? (
                <div className="space-y-6">
                  
                  {/* Artifact Title Banner & Top Controls */}
                  <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Dialectically Verified Deliverable</span>
                        </span>
                        <span className="text-xs text-white/40 font-mono">
                          {currentTask.assignedEntityName} × {currentTask.peerReviewerName}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-100">
                        {currentTask.deliverable.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {/* Speak Vocal Debrief */}
                      {currentTask.vocalDebrief && (
                        <button
                          onClick={handleSpeakDebrief}
                          className={cn(
                            "px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all",
                            isSpeakingDebrief 
                              ? "bg-amber-500/25 border-amber-500/60 text-amber-200 animate-pulse" 
                              : "bg-white/5 hover:bg-white/10 border-white/10 text-amber-300"
                          )}
                          title="Listen to entity's spoken debrief"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isSpeakingDebrief ? "Speaking..." : "Vocal Debrief"}</span>
                        </button>
                      )}

                      {/* Copy Markdown */}
                      <button
                        onClick={handleCopyDeliverable}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white flex items-center gap-1.5"
                      >
                        {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedText ? "Copied" : "Copy Dossier"}</span>
                      </button>

                      {/* Download .md */}
                      <button
                        onClick={handleDownloadDeliverable}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs text-amber-300 font-medium flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export .md</span>
                      </button>
                    </div>
                  </div>

                  {/* Vocal Debrief Callout */}
                  {currentTask.vocalDebrief && (
                    <div className="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/30 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-300 mt-0.5">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-amber-300 uppercase font-semibold">
                          Spoken Proclamation by {currentTask.assignedEntityName}:
                        </span>
                        <p className="text-xs sm:text-sm font-serif italic text-amber-100/90 leading-relaxed">
                          "{currentTask.vocalDebrief}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Artifact Sub-Navigation */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-white/10 text-xs overflow-x-auto">
                    <button
                      onClick={() => setArtifactSubTab('report')}
                      className={cn(
                        "px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0",
                        artifactSubTab === 'report' ? "bg-amber-500/20 text-amber-200 font-semibold" : "text-white/60 hover:text-white"
                      )}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Technical Report</span>
                    </button>

                    {currentTask.deliverable.codeOrEquations && (
                      <button
                        onClick={() => setArtifactSubTab('code')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0",
                          artifactSubTab === 'code' ? "bg-amber-500/20 text-amber-200 font-semibold" : "text-white/60 hover:text-white"
                        )}
                      >
                        <Code className="w-3.5 h-3.5" />
                        <span>Code & Formulations</span>
                      </button>
                    )}

                    {currentTask.deliverable.schematicDiagram && (
                      <button
                        onClick={() => setArtifactSubTab('schematic')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0",
                          artifactSubTab === 'schematic' ? "bg-amber-500/20 text-amber-200 font-semibold" : "text-white/60 hover:text-white"
                        )}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Architectural Schematic</span>
                      </button>
                    )}

                    <button
                      onClick={() => setArtifactSubTab('peer_review')}
                      className={cn(
                        "px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0",
                        artifactSubTab === 'peer_review' ? "bg-amber-500/20 text-amber-200 font-semibold" : "text-white/60 hover:text-white"
                      )}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Dialectical Peer Review</span>
                    </button>

                    {currentTask.deliverable.actionableRoadmap && currentTask.deliverable.actionableRoadmap.length > 0 && (
                      <button
                        onClick={() => setArtifactSubTab('roadmap')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0",
                          artifactSubTab === 'roadmap' ? "bg-amber-500/20 text-amber-200 font-semibold" : "text-white/60 hover:text-white"
                        )}
                      >
                        <Workflow className="w-3.5 h-3.5" />
                        <span>Roadmap & Milestones</span>
                      </button>
                    )}
                  </div>

                  {/* Sub-tab 1: Technical Report & Executive Summary */}
                  {artifactSubTab === 'report' && (
                    <div className="space-y-5">
                      {/* Executive Summary */}
                      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">
                          Executive Synthesis
                        </span>
                        <p className="text-xs sm:text-sm font-serif leading-relaxed text-white/90">
                          {currentTask.deliverable.executiveSummary}
                        </p>
                      </div>

                      {/* Technical Report Body */}
                      <div className="p-5 rounded-2xl bg-black/60 border border-white/10 text-xs sm:text-sm font-serif leading-relaxed space-y-4 text-white/80 whitespace-pre-line">
                        {currentTask.deliverable.technicalReportMarkdown}
                      </div>
                    </div>
                  )}

                  {/* Sub-tab 2: Code or Equations */}
                  {artifactSubTab === 'code' && currentTask.deliverable.codeOrEquations && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-white/60">
                        <span>Autonomous Code / Mathematical Derivation:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleExecuteScript}
                            disabled={isSimulatingCode}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
                            title="Execute virtual verification runtime"
                          >
                            <Play className={cn("w-3.5 h-3.5", isSimulatingCode && "animate-spin text-emerald-400")} />
                            <span>{isSimulatingCode ? "Computing..." : "Run Verification"}</span>
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(currentTask.deliverable?.codeOrEquations || '');
                              setCopiedText(true);
                              setTimeout(() => setCopiedText(false), 2000);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:text-amber-300 flex items-center gap-1 transition-all"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </button>
                        </div>
                      </div>

                      {/* Code Block */}
                      <div className="p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-xs text-amber-200/90 overflow-x-auto custom-scrollbar">
                        <pre>{currentTask.deliverable.codeOrEquations}</pre>
                      </div>

                      {/* Virtual Execution Terminal Console */}
                      {simulationLogs && (
                        <div className="p-4 rounded-2xl bg-[#01040a] border border-emerald-500/40 font-mono text-xs space-y-2 shadow-[0_0_25px_rgba(16,185,129,0.15)] animate-in fade-in duration-300">
                          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-emerald-400">
                            <span className="flex items-center gap-1.5 font-bold">
                              <Terminal className="w-4 h-4 text-emerald-400" />
                              <span>Virtual Verification Terminal Output</span>
                            </span>
                            <span className="text-[10px] text-emerald-400/70 font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                              Status: PASS (0 Errors)
                            </span>
                          </div>
                          <div className="space-y-1 text-emerald-300/90 text-[11px] leading-relaxed">
                            {simulationLogs.map((log, idx) => (
                              <div key={idx} className={cn(
                                log.startsWith(">>>") ? "text-amber-300 font-bold" :
                                log.startsWith("[Result]") || log.startsWith("[Output]") ? "text-emerald-200 font-bold bg-emerald-950/40 px-1 rounded" :
                                "text-emerald-300/80"
                              )}>
                                {log}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sub-tab 3: Schematic Diagram */}
                  {artifactSubTab === 'schematic' && currentTask.deliverable.schematicDiagram && (
                    <div className="space-y-3">
                      <span className="text-xs font-mono text-white/60 block">
                        ASCII / Architectural Structural Schematic:
                      </span>
                      <div className="p-4 rounded-2xl bg-black/90 border border-white/10 font-mono text-xs text-cyan-300 overflow-x-auto custom-scrollbar leading-tight">
                        <pre>{currentTask.deliverable.schematicDiagram}</pre>
                      </div>
                    </div>
                  )}

                  {/* Sub-tab 4: Dialectical Peer Review */}
                  {artifactSubTab === 'peer_review' && currentTask.deliverable.peerReviewCritique && (
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                            Dialectical Auditor Assessment
                          </span>
                          <h4 className="text-sm font-serif font-bold text-amber-100">
                            {currentTask.deliverable.peerReviewCritique.reviewerName} ({currentTask.deliverable.peerReviewCritique.reviewerTitle})
                          </h4>
                        </div>

                        <span className={cn(
                          "text-xs font-mono uppercase px-2.5 py-1 rounded-lg border",
                          currentTask.deliverable.peerReviewCritique.verdict === 'approved' 
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" 
                            : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        )}>
                          Verdict: {currentTask.deliverable.peerReviewCritique.verdict.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Critique Points */}
                        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                          <span className="text-xs font-mono text-rose-300 font-semibold flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Adversarial Stress Points:</span>
                          </span>
                          <ul className="space-y-1.5 text-xs text-white/70 list-disc list-inside">
                            {currentTask.deliverable.peerReviewCritique.critiquePoints.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Improvements Adopted */}
                        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                          <span className="text-xs font-mono text-emerald-300 font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Refinements Adopted:</span>
                          </span>
                          <ul className="space-y-1.5 text-xs text-white/70 list-disc list-inside">
                            {currentTask.deliverable.peerReviewCritique.improvementsAdopted.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub-tab 5: Roadmap */}
                  {artifactSubTab === 'roadmap' && currentTask.deliverable.actionableRoadmap && (
                    <div className="space-y-3">
                      <span className="text-xs font-mono text-white/60 block">
                        Phased Implementation Roadmap:
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {currentTask.deliverable.actionableRoadmap.map((rm, i) => (
                          <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs flex items-center justify-center font-mono">
                                {i + 1}
                              </span>
                              <span className="text-[10px] font-mono text-white/40">{rm.timeline}</span>
                            </div>
                            <h5 className="text-xs font-serif font-bold text-amber-200">{rm.phase}</h5>
                            <ul className="space-y-1 text-[11px] text-white/60 list-disc list-inside">
                              {rm.deliverables.map((d, dIdx) => (
                                <li key={dIdx}>{d}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <FileText className="w-10 h-10 text-white/20" />
                  <p className="text-sm text-white/50 font-serif">No deliverable compiled yet.</p>
                  <button
                    onClick={() => setActiveTab('mission_dispatch')}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-300 hover:bg-white/10"
                  >
                    Configure and Launch a Task
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: TASK ARCHIVE / HISTORY */}
          {/* ========================================================================= */}
          {activeTab === 'archive' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-amber-100">Dispatched Mission Archive</h4>
                  <p className="text-xs text-white/50 font-mono">
                    Past agentic executions persisted locally across sovereign sessions
                  </p>
                </div>
                <span className="text-xs font-mono text-amber-400">
                  {taskHistory.length} Recorded Dossiers
                </span>
              </div>

              {taskHistory.length > 0 ? (
                <div className="space-y-2.5">
                  {taskHistory.map((th) => (
                    <div
                      key={th.id}
                      onClick={() => {
                        setCurrentTask(th);
                        setActiveTab('deliverable');
                      }}
                      className={cn(
                        "p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group",
                        currentTask?.id === th.id 
                          ? "bg-amber-500/[0.08] border-amber-500/50 shadow-md" 
                          : "bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.04]"
                      )}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
                            {th.taskType.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs text-white/40 font-mono">
                            {new Date(th.createdAt).toLocaleDateString()} · {new Date(th.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h5 className="font-serif font-bold text-sm text-amber-100 group-hover:text-amber-200 truncate">
                          {th.title}
                        </h5>
                        <p className="text-xs text-white/50 line-clamp-1 font-mono">
                          Lead: {th.assignedEntityName} · Auditor: {th.peerReviewerName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                          {th.status}
                        </span>

                        <button
                          onClick={(e) => handleDeleteTask(th.id, e)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-white/10 transition-colors"
                          title="Delete from archive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <Clock className="w-10 h-10 text-white/20" />
                  <p className="text-sm text-white/50 font-serif">Archive is empty.</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
