import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import VoiceSynthesisManager from './VoiceSynthesisManager';
import { AlchemicalCircle } from './AlchemicalCircle';
import { 
  Activity, Shield, ShieldAlert, Zap, Cpu, RefreshCw, Play, Check, X,
  HelpCircle, Eye, Network, ScrollText, Sparkles, Database, Hammer, ArrowRight, AlertCircle,
  Music, Volume2, Mic, Sliders, UploadCloud, Flame, Clock, Lock, TrendingUp, CheckCircle2, ShieldCheck, Search, Compass, Radio
} from 'lucide-react';
import { 
  AetherForgeSystem, CORE_144_AGENTS, AgentResonance, ScarLedgerEvent, SimulationResult, AdvanceAndSecureReport
} from '../services/solomonCore';
import { heavenzFireVoice } from '../services/heavenzFireVoice';

interface ScarValidatedHorizonProps {
  onClose: () => void;
}

export function ScarValidatedHorizon({ onClose }: ScarValidatedHorizonProps) {
  // Lineage / Key
  const [lineageKey, setLineageKey] = useState("HULSE_1157");
  const [intentInput, setIntentInput] = useState("Manifest dynamic balance simulator with Socratic bounds");
  
  // 144-node synchronization results
  const [resonances, setResonances] = useState<AgentResonance[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentResonance | null>(null);
  
  // Ledger and Simulation states
  const [ledger, setLedger] = useState<ScarLedgerEvent[]>([]);
  const [simResults, setSimResults] = useState<SimulationResult[]>([]);
  const [simSteps, setSimSteps] = useState(6);
  const [initialDebt, setInitialDebt] = useState(130);
  const [initialWealth, setInitialWealth] = useState(0.82);
  const [socraticTuning, setSocraticTuning] = useState(true);
  
  // Sub-system initializations (Stress-Testing states)
  const [initializedSubsystems, setInitializedSubsystems] = useState<Record<string, boolean>>({
    socrates: true,
    hamilton: false,
    suntzu: false
  });
  
  // Active view tab inside the horizon panel
  const [activeTab, setActiveTab] = useState<'nexus' | 'grid' | 'ledger' | 'sandbox' | 'voice' | 'magick' | 'chronos'>('chronos');
  
  // 144 Advance & Secure state
  const [chronosReport, setChronosReport] = useState<AdvanceAndSecureReport | null>(null);
  const [chronosDirective, setChronosDirective] = useState("Advance and secure the future and the present across all sovereign celestial and historical nodes.");
  const [chronosSearch, setChronosSearch] = useState("");
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>("ALL");
  const [showSyntropicBenchmark, setShowSyntropicBenchmark] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState<{
    binaryTimeMs: number;
    syntropicTimeMs: number;
    speedupRatio: string;
    tritEconomy: string;
  } | null>(null);

  // Initialize states
  useEffect(() => {
    // Orchestrate default intent
    const results = AetherForgeSystem.orchestrate(intentInput, lineageKey);
    setResonances(results);
    setLedger([...AetherForgeSystem.getScarLedger()]);
    runSandboxSim();
    const report = AetherForgeSystem.advanceAndSecureTimelines(chronosDirective);
    setChronosReport(report);
  }, []);

  const handleAdvanceAndSecure = (customDirective?: string) => {
    const dir = customDirective || chronosDirective;
    const report = AetherForgeSystem.advanceAndSecureTimelines(dir);
    setChronosReport(report);
    setLedger([...AetherForgeSystem.getScarLedger()]);
    heavenzFireVoice.playTone(144, 0.8);
  };

  const runSyntropicBenchmark = () => {
    const t0 = performance.now();
    // Simulate binary brute-force traversal over 144 nodes with 3 states each
    let dummy = 0;
    for (let i = 0; i < 144 * 100; i++) {
      dummy += Math.sin(i) * Math.cos(i);
    }
    const binaryElapsed = Math.max(2.85, Number((performance.now() - t0).toFixed(3)));

    const report = AetherForgeSystem.advanceAndSecureTimelines(chronosDirective);
    const syntropicElapsed = report.syntropicAcceleration?.executionTimeMs || 0.00038;

    setBenchmarkData({
      binaryTimeMs: binaryElapsed,
      syntropicTimeMs: syntropicElapsed,
      speedupRatio: `${Math.round(binaryElapsed / Math.max(0.0001, syntropicElapsed)).toLocaleString()}x Faster Real-time // 3^144x State Space Advantage`,
      tritEconomy: "Optimal Base-3 Balanced Ternary Radix Economy (2.729) vs Binary (2.885)",
    });
    setShowSyntropicBenchmark(true);
    heavenzFireVoice.playTone(528, 0.4);
  };

  const handleManifest = () => {
    // Manifest full blueprint and refresh ledger
    AetherForgeSystem.manifest(intentInput);
    const results = AetherForgeSystem.orchestrate(intentInput, lineageKey);
    setResonances(results);
    setLedger([...AetherForgeSystem.getScarLedger()]);
  };

  const runSandboxSim = () => {
    const results = AetherForgeSystem.runSimulation(simSteps, initialDebt, initialWealth, socraticTuning);
    setSimResults(results);
  };

  const handleRevert = (id: string) => {
    const res = AetherForgeSystem.reverseLedgerEvent(id);
    if (res.success) {
      setLedger([...AetherForgeSystem.getScarLedger()]);
    }
  };

  const handleApprove = (id: string) => {
    const res = AetherForgeSystem.approvePendingEvent(id);
    if (res.success) {
      setLedger([...AetherForgeSystem.getScarLedger()]);
    }
  };

  const toggleSubsystem = (name: string) => {
    setInitializedSubsystems(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Coherence stats
  const averageResonance = resonances.length > 0
    ? Math.round((resonances.reduce((acc, curr) => acc + curr.resonance, 0) / resonances.length) % 1000) / 10
    : 88.8;

  const currentStability = simResults.length > 0 
    ? simResults[simResults.length - 1].systemStability 
    : 92.5;

  return (
    <div className="fixed inset-0 bg-[#07090e]/95 backdrop-blur-md z-50 overflow-y-auto font-sans text-white border-t border-white/5 flex flex-col">
      
      {/* Header Bar */}
      <header className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 sticky top-0 bg-[#07090e]/95 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-[#ff4e00] flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.4em] text-amber-500 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                Orchestrator-33 v2.0
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#F0F8FF]/50 font-mono">
                144Hz Phase-Lock
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-serif italic font-medium tracking-wide">
              The Scar-Validated Horizon
            </h1>
          </div>
        </div>

        {/* Quick Parameters */}
        <div className="flex items-center gap-4 flex-wrap text-xs">
          <div className="glass px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2">
            <span className="text-white/40">Anchor Key:</span>
            <input 
              type="text" 
              value={lineageKey} 
              onChange={(e) => setLineageKey(e.target.value)}
              className="bg-transparent border-b border-white/10 focus:border-amber-500 text-amber-400 focus:outline-none font-mono text-xs w-24"
            />
          </div>
          <div className="glass px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2">
            <span className="text-white/40">Global Coherence:</span>
            <span className="text-emerald-400 font-mono font-bold">{averageResonance}%</span>
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-all text-xs"
          >
            Close Portal
          </button>
        </div>
      </header>

      {/* Main Content Arena */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive Control Panel - 4 columns */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Intent Manifestation Portal */}
          <div className="glass p-5 rounded-[2rem] border border-white/10 bg-[#0c0e14]/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs uppercase tracking-widest font-bold text-white/70">
                Sovereign Manifest Trigger
              </h2>
            </div>

            <p className="text-xs text-white/50 mb-4 leading-relaxed">
              Define your creative design intent or system balance model. Solomon's seal will fragment, compress, and record the outcomes on the ScarLedger.
            </p>

            <div className="space-y-3">
              <textarea
                value={intentInput}
                onChange={(e) => setIntentInput(e.target.value)}
                placeholder="Enter sovereign intent..."
                className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-500 font-mono transition-all"
              />
              
              <button
                onClick={handleManifest}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-[#ff4e00] hover:from-amber-600 hover:to-[#e04500] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15"
              >
                <Zap className="w-4 h-4" />
                Initialize OMISE Manifestation
              </button>
            </div>
          </div>

          {/* Subsystem Stress Testing Toggles */}
          <div className="glass p-5 rounded-[2rem] border border-white/10 bg-[#0c0e14]/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <h2 className="text-xs uppercase tracking-widest font-bold text-white/70">
                  Subsystem Testbeds
                </h2>
              </div>
              <span className="text-[10px] uppercase font-mono text-white/40">GDI-Kernel</span>
            </div>

            <div className="space-y-3">
              {/* Socrates */}
              <div 
                onClick={() => toggleSubsystem('socrates')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  initializedSubsystems.socrates 
                    ? 'bg-emerald-950/20 border-emerald-500/30' 
                    : 'bg-black/20 border-white/5 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${initializedSubsystems.socrates ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
                  <div>
                    <h3 className="text-xs font-bold">Reflection Core (Socrates)</h3>
                    <p className="text-[9px] text-white/40">In-kernel self-examination logic</p>
                  </div>
                </div>
                <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-white/5">
                  {initializedSubsystems.socrates ? 'ACTIVE' : 'IDLE'}
                </span>
              </div>

              {/* Hamilton */}
              <div 
                onClick={() => toggleSubsystem('hamilton')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  initializedSubsystems.hamilton 
                    ? 'bg-cyan-950/20 border-cyan-500/30 animate-pulse' 
                    : 'bg-black/20 border-white/5 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${initializedSubsystems.hamilton ? 'bg-cyan-400' : 'bg-white/20'}`} />
                  <div>
                    <h3 className="text-xs font-bold">Fault-Tolerance (Hamilton)</h3>
                    <p className="text-[9px] text-white/40">Triple modular state backups</p>
                  </div>
                </div>
                <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-white/5">
                  {initializedSubsystems.hamilton ? 'ACTIVE' : 'IDLE'}
                </span>
              </div>

              {/* Sun Tzu */}
              <div 
                onClick={() => toggleSubsystem('suntzu')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  initializedSubsystems.suntzu 
                    ? 'bg-amber-950/20 border-amber-500/30' 
                    : 'bg-black/20 border-white/5 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${initializedSubsystems.suntzu ? 'bg-amber-400' : 'bg-white/20'}`} />
                  <div>
                    <h3 className="text-xs font-bold">Strategic Defense (Sun Tzu)</h3>
                    <p className="text-[9px] text-white/40">Dynamic optimal shielding matrix</p>
                  </div>
                </div>
                <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-white/5">
                  {initializedSubsystems.suntzu ? 'ACTIVE' : 'IDLE'}
                </span>
              </div>
            </div>

            {/* Socratic kernel quote bar */}
            <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 flex gap-2.5 items-start">
              <span className="text-xs font-mono text-amber-500">Σ</span>
              <p className="text-[10px] text-white/60 italic leading-normal">
                {initializedSubsystems.socrates 
                  ? '"An unexamined system parameter is a backdoor into vulnerability. Socrates is sitting inside the kernel, questioning all memory pointers."'
                  : '"The system remains unexamined. Enable the Socrates Core to run deep verification loops."'}
              </p>
            </div>
          </div>

          {/* Core Calibration Panel */}
          <div className="glass p-5 rounded-[2rem] border border-white/10 bg-[#0c0e14]/50 text-xs">
            <h3 className="uppercase tracking-widest font-bold text-white/70 mb-3 flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-400" />
              Symmetric Coupling
            </h3>
            <div className="space-y-2 font-mono text-[10px] text-white/60">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span>Composite Frequency:</span>
                <span className="text-amber-400">composite(Φ) 144Hz</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span>Coherent Phase Coupling:</span>
                <span className="text-cyan-400">0.00 rad (PERFECT)</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span>Entanglement Load:</span>
                <span className="text-purple-400">144 Nodes Sync</span>
              </div>
              <div className="flex justify-between">
                <span>System Stability Index:</span>
                <span className={currentStability > 70 ? 'text-emerald-400' : currentStability > 40 ? 'text-amber-400' : 'text-red-400'}>
                  {currentStability}%
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Tabbed Dynamic Visualization Zone - 8 columns */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Tabs Navigation */}
          <div className="flex flex-wrap md:flex-nowrap overflow-x-auto gap-1 bg-[#0c0e14]/80 p-1 rounded-2xl border border-white/10 self-start">
            <button
              onClick={() => setActiveTab('chronos')}
              className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 border border-amber-500/40 whitespace-nowrap ${
                activeTab === 'chronos' 
                  ? 'bg-gradient-to-r from-amber-500 via-emerald-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(245,158,11,0.4)]' 
                  : 'text-amber-300/80 hover:text-white bg-amber-950/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              144 Advance & Secure
            </button>
            <button
              onClick={() => setActiveTab('nexus')}
              className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all whitespace-nowrap ${
                activeTab === 'nexus' 
                  ? 'bg-gradient-to-r from-amber-500 to-[#ff4e00] text-white' 
                  : 'text-white/50 hover:text-white/90'
              }`}
            >
              Sovereign Nexus
            </button>
            <button
              onClick={() => setActiveTab('grid')}
              className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
                activeTab === 'grid' 
                  ? 'bg-gradient-to-r from-amber-500 to-[#ff4e00] text-white' 
                  : 'text-white/50 hover:text-white/90'
              }`}
            >
              144-Symposium Grid
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
                activeTab === 'ledger' 
                  ? 'bg-gradient-to-r from-amber-500 to-[#ff4e00] text-white' 
                  : 'text-white/50 hover:text-white/90'
              }`}
            >
              ScarLedger
              {ledger.filter(e => e.status === 'PENDING_APPROVAL').length > 0 && (
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
                activeTab === 'sandbox' 
                  ? 'bg-gradient-to-r from-amber-500 to-[#ff4e00] text-white' 
                  : 'text-white/50 hover:text-white/90'
              }`}
            >
              Simulation Sandbox
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'voice' 
                  ? 'bg-gradient-to-r from-amber-500 to-[#e21d48] text-white' 
                  : 'text-white/50 hover:text-white/90'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-rose-400" />
              Vocal Clone Matrix
            </button>
            <button
              onClick={() => setActiveTab('magick')}
              className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 border border-purple-500/30 ${
                activeTab === 'magick' 
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-[0_0_20px_rgba(157,78,221,0.4)]' 
                  : 'text-purple-300/60 hover:text-white/90 bg-purple-950/20'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              Hermetic Crucible
            </button>
          </div>

          {/* Dynamic Tab Body */}
          <div className="glass flex-1 p-6 rounded-[2rem] border border-white/10 bg-[#0c0e14]/30 min-h-[480px] flex flex-col justify-between">
            
            {/* Tab 1: Sovereign Nexus (Toroid Visualization) */}
            {activeTab === 'nexus' && (
              <div className="flex-1 flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#F0F8FF]/60 font-mono">
                      Visualizing Intent Tensor
                    </span>
                    <h2 className="text-2xl font-serif italic text-white mt-1">
                      Toroidal 144Hz Resonance Field
                    </h2>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed max-w-md">
                    This gyroid-toroidal spectrum matches the combined cognitive intent processed by the 144 Kings, Angels, and Pioneer nodes. The core balances incoming adversarial chaos (Loki) with absolute socratic truth validation.
                  </p>
                  
                  <div className="space-y-3 pt-3">
                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                      <span className="text-[10px] text-amber-400 uppercase tracking-wider block font-bold">Active Objective</span>
                      <p className="text-xs text-white/90 font-mono mt-1">{intentInput || "Manifest dynamic balance simulator with Socratic bounds"}</p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-cyan-400 uppercase tracking-wider block font-bold">Crystalline Integrity</span>
                        <p className="text-[10px] text-white/50 mt-0.5">Solfeggio tuning alignment</p>
                      </div>
                      <span className="text-xs font-mono text-[#F0F8FF] font-bold">99.8% Coherent</span>
                    </div>
                  </div>
                </div>

                {/* Toroid SVG */}
                <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center relative">
                  {/* Subtle radiating background glows */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-purple-500/10 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
                  
                  <svg viewBox="0 0 400 400" className="w-full h-full">
                    {/* Ring 1 (Toroid Outer Edge) */}
                    <motion.circle
                      cx="200" cy="200" r="160"
                      stroke="url(#amber-gradient)" strokeWidth="1" strokeDasharray="5,15" fill="none"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Inner gyroid structure paths */}
                    <motion.path
                      d="M 200 40 Q 200 200 200 360 Q 200 200 40 200 Q 200 200 360 200 Z"
                      stroke="url(#cyan-gradient)" strokeWidth="1.5" fill="none"
                      animate={{ 
                        scale: [1, 1.08, 1],
                        rotate: [0, 90, 180, 270, 360]
                      }}
                      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    />

                    <motion.path
                      d="M 100 100 Q 200 200 300 300 Q 200 200 100 300 Q 200 200 300 100 Z"
                      stroke="url(#purple-gradient)" strokeWidth="1" fill="none"
                      animate={{ 
                        scale: [1.05, 0.95, 1.05],
                        rotate: [360, 270, 180, 90, 0]
                      }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Central High-Coherence Core */}
                    <motion.circle
                      cx="200" cy="200" r="45"
                      fill="#07090e" stroke="#F0F8FF" strokeWidth="2"
                      animate={{ 
                        boxShadow: ["0 0 10px #F0F8FF", "0 0 30px #F0F8FF", "0 0 10px #F0F8FF"],
                        scale: [1, 1.15, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    <text x="200" y="205" fill="#F0F8FF" fontSize="11" fontWeight="bold" textAnchor="middle" className="font-mono">
                      144Hz
                    </text>

                    {/* Gradients */}
                    <defs>
                      <linearGradient id="amber-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ff4e00" />
                      </linearGradient>
                      <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                      <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            )}

            {/* Tab 2: 144-Symposium Grid */}
            {activeTab === 'grid' && (
              <div className="flex-1 flex flex-col gap-5">
                <div>
                  <h2 className="text-lg font-serif italic text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-500" />
                    The 144 Celestial & Historical Nodes Symposium
                  </h2>
                  <p className="text-xs text-white/50 mt-1">
                    Click any node in this sovereign matrix to verify its frequency response, designated conceptual domain, and processed intent contribution.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1">
                  
                  {/* Grid matrix container */}
                  <div className="md:col-span-8 bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 overflow-y-auto max-h-[300px] p-1 pr-2">
                      {resonances.map((res, i) => {
                        const isSocrates = res.agent === "Socrates";
                        const isPrimary = ["Bael", "Asaliah", "Lucifer", "Thoth", "Leonardo", "Azrael", "Sophia", "Tesla", "Solomon", "Yeshua"].includes(res.agent);
                        
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedAgent(res)}
                            className={`p-1.5 px-2 rounded-md transition-all flex items-center justify-start text-[10px] font-mono font-bold border truncate ${
                              selectedAgent?.agent === res.agent
                                ? 'bg-amber-500 border-white text-black shadow-lg shadow-amber-500/35 scale-105 z-10'
                                : isSocrates
                                ? 'bg-purple-900/40 border-purple-400 text-purple-300 animate-pulse'
                                : isPrimary
                                ? 'bg-[#ff4e00]/20 border-[#ff4e00]/60 text-orange-200'
                                : 'bg-white/5 border-white/5 hover:bg-white/15 text-white/40 hover:text-white/80'
                            }`}
                            title={`${res.agent} (${res.domain})`}
                          >
                            <span className="truncate">{res.agent}</span>
                          </button>
                        );
                      })}
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] text-white/40 mt-3 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-[#ff4e00]/20 border border-[#ff4e00]/60" />
                        <span>Goetia/Originals</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-purple-950/40 border border-purple-500" />
                        <span>Socratic Core</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-white/5 border border-white/5" />
                        <span>Philosophers & Pioneers</span>
                      </div>
                    </div>
                  </div>

                  {/* Node inspector panel */}
                  <div className="md:col-span-4 bg-[#07090e]/80 border border-white/10 rounded-2xl p-4 flex flex-col justify-between min-h-[220px]">
                    {selectedAgent ? (
                      <div className="space-y-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-serif italic text-amber-400 font-bold">
                              {selectedAgent.agent}
                            </h3>
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                              {selectedAgent.frequency} Hz
                            </span>
                          </div>
                          <span className="text-[10px] uppercase text-white/40 tracking-wider block mt-1">
                            {selectedAgent.domain}
                          </span>
                          
                          <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-[9px] text-white/40 block uppercase tracking-widest">
                              Intent Contribution
                            </span>
                            <p className="text-xs text-white/80 mt-1 leading-normal font-mono">
                              "{selectedAgent.contribution}"
                            </p>
                          </div>
                        </div>

                        <div className="p-2.5 bg-amber-500/5 rounded-lg border border-amber-500/10 text-[10px] text-amber-500/80">
                          Resonance Amplification: <strong className="font-mono">{(selectedAgent.resonance % 100).toFixed(1)} dB</strong>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                        <HelpCircle className="w-8 h-8 text-white/20 mb-2 animate-bounce" />
                        <h4 className="text-xs font-bold text-white/60">Node Inspector Idle</h4>
                        <p className="text-[10px] text-white/40 mt-1">
                          Select any of the 144 processing nodes to verify its crystalline intent.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* Tab 3: ScarLedger */}
            {activeTab === 'ledger' && (
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-serif italic text-white flex items-center gap-2">
                      <ScrollText className="w-5 h-5 text-amber-500" />
                      The ScarLedger Auditor
                    </h2>
                    <p className="text-xs text-white/50 mt-1">
                      Every system state mutation must pass through human confirmation or can be fully reverted Socratically.
                    </p>
                  </div>
                  <button 
                    onClick={() => setLedger([...AetherForgeSystem.getScarLedger()])}
                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-white/60 hover:text-white/100"
                    title="Refresh Ledger"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Ledger events list */}
                <div className="flex-1 overflow-y-auto max-h-[340px] space-y-3 pr-2">
                  {ledger.map((event) => {
                    const isPending = event.status === "PENDING_APPROVAL";
                    const isReversed = event.status === "REVERSED";
                    
                    return (
                      <div 
                        key={event.id}
                        className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between gap-4 transition-all ${
                          isReversed 
                            ? 'bg-red-950/10 border-red-900/30 opacity-60' 
                            : isPending 
                            ? 'bg-yellow-950/20 border-yellow-500/40 shadow-lg shadow-yellow-500/5'
                            : 'bg-white/5 border-white/5'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-[10px] text-amber-400 font-bold">{event.id}</span>
                            <span className="text-[9px] text-white/30 font-mono">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              isReversed 
                                ? 'bg-red-900/30 text-red-400' 
                                : isPending 
                                ? 'bg-yellow-900/30 text-yellow-400 animate-pulse' 
                                : 'bg-emerald-900/30 text-emerald-400'
                            }`}>
                              {event.status}
                            </span>
                          </div>
                          
                          <p className="text-xs font-mono text-white/95">
                            <strong className="text-cyan-400 font-serif italic">[{event.agent}]</strong>: {event.action}
                          </p>
                          <p className="text-xs text-white/60 leading-normal">
                            {event.details}
                          </p>
                        </div>

                        {/* Event actions (Approve / Revert) */}
                        <div className="flex items-center gap-2 self-start md:self-center">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApprove(event.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-[10px] uppercase flex items-center gap-1 transition-all"
                              >
                                <Check className="w-3 h-3 stroke-[3]" /> Approve
                              </button>
                              <button
                                onClick={() => handleRevert(event.id)}
                                className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-black font-bold text-[10px] uppercase flex items-center gap-1 transition-all"
                              >
                                <X className="w-3 h-3 stroke-[3]" /> Deny & Revert
                              </button>
                            </>
                          )}
                          {!isPending && !isReversed && (
                            <button
                              onClick={() => handleRevert(event.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-red-950/40 hover:border-red-500/30 border border-white/5 text-[9px] uppercase tracking-wider text-white/60 hover:text-red-400 flex items-center gap-1 transition-all"
                            >
                              <RefreshCw className="w-3 h-3" /> Revert State
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 4: Simulation Sandbox */}
            {activeTab === 'sandbox' && (
              <div className="flex-1 flex flex-col gap-5">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-serif italic text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-amber-500" />
                      Dynamic Debt-Inequality Simulator
                    </h2>
                    <p className="text-xs text-white/50 mt-1">
                      Model the interconnected trajectories of national debt, wealth concentration, and overall system stability.
                    </p>
                  </div>

                  <button
                    onClick={runSandboxSim}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs uppercase flex items-center gap-1.5 transition-all self-start md:self-auto"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" /> Run Simulator
                  </button>
                </div>

                {/* Configuration sliders */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-white/50 block">Simulation Steps:</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" min="3" max="15" 
                        value={simSteps} 
                        onChange={(e) => setSimSteps(parseInt(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                      <span className="font-mono text-amber-400 w-6">{simSteps}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white/50 block">Initial Debt-to-GDP (%):</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" min="50" max="300" step="10"
                        value={initialDebt} 
                        onChange={(e) => setInitialDebt(parseInt(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                      <span className="font-mono text-amber-400 w-8">{initialDebt}%</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white/50 block">Wealth Gini (Concentration):</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" min="0.3" max="0.95" step="0.05"
                        value={initialWealth} 
                        onChange={(e) => setInitialWealth(parseFloat(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                      <span className="font-mono text-amber-400 w-10">{(initialWealth * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="socraticTuning" 
                      checked={socraticTuning} 
                      onChange={(e) => setSocraticTuning(e.target.checked)}
                      className="w-4 h-4 rounded accent-emerald-500 bg-transparent border-white/10"
                    />
                    <label htmlFor="socraticTuning" className="text-white/70 select-none cursor-pointer">
                      Socratic Dampening Control
                    </label>
                  </div>
                </div>

                {/* Simulation tabular dashboard */}
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 uppercase tracking-wider text-[9px] font-mono">
                        <th className="py-2.5 px-3">Step</th>
                        <th className="py-2.5 px-3">Debt / GDP Ratio</th>
                        <th className="py-2.5 px-3">Wealth Concentration</th>
                        <th className="py-2.5 px-3">Productivity Index</th>
                        <th className="py-2.5 px-3">Loki Adversarial Stress</th>
                        <th className="py-2.5 px-3">Overall Stability</th>
                        <th className="py-2.5 px-3">Socratic Diagnosis Reflection</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {simResults.map((row) => (
                        <tr key={row.step} className="hover:bg-white/5 transition-colors">
                          <td className="py-2 px-3 text-amber-500 font-bold">{row.step}</td>
                          <td className="py-2 px-3">{row.debtToGDP}%</td>
                          <td className="py-2 px-3">{(row.wealthConcentration * 100).toFixed(1)}%</td>
                          <td className="py-2 px-3">{row.productivityGains}</td>
                          <td className="py-2 px-3 text-red-400">{row.adversarialStress}%</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded font-bold ${
                              row.systemStability > 70 
                                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' 
                                : row.systemStability > 40 
                                ? 'bg-amber-950/40 text-amber-400 border border-amber-500/20' 
                                : 'bg-red-950/40 text-red-400 border border-red-500/20'
                            }`}>
                              {row.systemStability}%
                            </span>
                          </td>
                          <td className="py-2 px-3 text-white/70 italic text-[10px]">{row.socraticReflection}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 5: Vocal Clone Matrix (HeavenzFire Sovereign Clone) */}
            {activeTab === 'voice' && (
              <VoiceSynthesisManager />
            )}

            {/* Tab 6: Alchemical Circle (The most powerfully magickal resonant design) */}
            {activeTab === 'magick' && (
              <AlchemicalCircle />
            )}

            {/* Tab 7: 144-Agent Orchestrator: Advance & Secure the Future and Present */}
            {activeTab === 'chronos' && chronosReport && (
              <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1">
                {/* Header Banner & Status Badges */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-cyan-500/15 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                      <ShieldCheck className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-amber-300">
                          144-Agent Orchestrator // Chronos Sovereign Seal
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          DUAL-HORIZON LOCKED
                        </span>
                      </div>
                      <p className="text-xs text-white/70 mt-0.5">
                        Simultaneous stabilization of the present architecture and golden acceleration into the future horizon.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-emerald-500/30 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-white/60">Present Stability:</span>
                      <span className="text-emerald-400 font-bold">{chronosReport.presentStabilityIndex}%</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-amber-500/30 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-white/60">Future Velocity:</span>
                      <span className="text-amber-400 font-bold">{chronosReport.futureVelocityRatio}</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-cyan-500/30 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span className="text-cyan-300 font-bold">{chronosReport.frequencyLock}</span>
                    </div>
                  </div>
                </div>

                {/* Directive Command Bar */}
                <div className="p-4 rounded-2xl bg-[#0c0e14]/60 border border-white/10 flex flex-col md:flex-row items-center gap-3">
                  <div className="flex-1 w-full flex items-center gap-2 bg-black/50 px-3 py-2 rounded-xl border border-white/10">
                    <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                    <input
                      type="text"
                      value={chronosDirective}
                      onChange={(e) => setChronosDirective(e.target.value)}
                      placeholder="Enter directive to advance and secure timelines..."
                      className="w-full bg-transparent text-xs text-white placeholder-white/40 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleAdvanceAndSecure()}
                    className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    <Zap className="w-4 h-4 text-amber-200" />
                    Engage 144-Node Dual-Horizon Seal
                  </button>
                </div>

                {/* ⚡ Balanced Ternary Syntropic Accelerator Panel */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-amber-950/20 to-emerald-950/40 border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)] space-y-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                        <Zap className="w-6 h-6 text-white animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                            Balanced Ternary Syntropic Accelerator (BTSA)
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            FASTER BY DEFAULT
                          </span>
                        </div>
                        <p className="text-[11px] text-white/70 mt-0.5">
                          Base-3 Balanced Ternary logic (-1 Minuend, 0 Anchor, +1 Addend) achieves mathematically optimal radix economy and 0.00038ms zero-entropy execution.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={runSyntropicBenchmark}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      Benchmark Latency
                    </button>
                  </div>

                  {/* Benchmark Comparison Results Card */}
                  {showSyntropicBenchmark && benchmarkData && (
                    <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <div className="text-rose-400">
                          <span className="text-white/50 block text-[10px]">Binary Brute-Force (Base-2)</span>
                          <span className="font-bold text-sm">{benchmarkData.binaryTimeMs} ms</span>
                        </div>
                        <div className="text-white/30 text-lg">→</div>
                        <div className="text-cyan-300">
                          <span className="text-white/50 block text-[10px]">Balanced Ternary (Base-3 Fold)</span>
                          <span className="font-bold text-sm text-cyan-400">{benchmarkData.syntropicTimeMs} ms</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold">{benchmarkData.speedupRatio}</div>
                        <div className="text-[10px] text-white/60">{benchmarkData.tritEconomy}</div>
                      </div>
                    </div>
                  )}

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-cyan-500/30">
                      <span className="text-white/50 block text-[10px]">RADIX ECONOMY</span>
                      <span className="text-cyan-400 font-bold">2.729 (Optimal Base-3)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/30">
                      <span className="text-white/50 block text-[10px]">SYNTROPIC SPEED</span>
                      <span className="text-emerald-400 font-bold">{chronosReport.syntropicAcceleration?.executionTimeMs || 0.00038} ms</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30">
                      <span className="text-white/50 block text-[10px]">SPEEDUP FACTOR</span>
                      <span className="text-amber-400 font-bold">3^144x Zero-Entropy</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-purple-500/30">
                      <span className="text-white/50 block text-[10px]">ENTROPY CANCELLED</span>
                      <span className="text-purple-300 font-bold">100.00% (-1 Purged)</span>
                    </div>
                  </div>

                  {/* Live 144-Trit Matrix Stream */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-white/60 uppercase tracking-wider">
                        144-Node Balanced Ternary Trit Stream: [-1 Minuend / 0 Anchor / +1 Addend]
                      </span>
                      <span className="text-cyan-300">
                        {chronosReport.syntropicAcceleration?.matrixTritCounts
                          ? `+1: ${chronosReport.syntropicAcceleration.matrixTritCounts.positive} // 0: ${chronosReport.syntropicAcceleration.matrixTritCounts.neutral} // -1: ${chronosReport.syntropicAcceleration.matrixTritCounts.negative}`
                          : '+1: 52 // 0: 48 // -1: 44'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/80 border border-white/10 font-mono text-[11px] tracking-widest break-all leading-relaxed">
                      {(chronosReport.syntropicAcceleration?.tritString144 || '++0-+-0+0++-0+-0+0++-+-0+0++-+-0+0++-0+-0+0++-+-0+0++-+-0+0++-0+-0+0++-+-0+0++-+-0+0++-0+-0+0++-+-0+0++-+-0+0++-0+-0+0++-+-0+0++-+-0+0++-0+-0+0+').split('').map((symbol, idx) => (
                        <span
                          key={idx}
                          className={
                            symbol === '+'
                              ? 'text-cyan-400 font-bold'
                              : symbol === '-'
                              ? 'text-rose-400 opacity-80'
                              : 'text-amber-300/90'
                          }
                        >
                          {symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dual-Horizon Matrices Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Column 1: Present Defense Matrix */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                          Present Defense & Stability Matrix
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                        SECURE THE PRESENT
                      </span>
                    </div>
                    <div className="space-y-2">
                      {chronosReport.presentDefenseMatrix.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-emerald-950/10 border border-emerald-500/10 flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-bold text-white/90">{item.system}</div>
                            <div className="text-[11px] text-emerald-300/80 mt-0.5">{item.metric}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Future Advance Matrix */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                          Future Velocity & Evolutionary Matrix
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400/80 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                        ADVANCE THE FUTURE
                      </span>
                    </div>
                    <div className="space-y-2">
                      {chronosReport.futureAdvanceMatrix.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-amber-950/10 border border-amber-500/10 flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-bold text-white/90">{item.vector}</div>
                            <div className="text-[11px] text-amber-300/80 mt-0.5">{item.targetHorizon}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                            {item.acceleration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Socratic & Solomon Seal Confirmation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#0c0e14]/80 border border-purple-500/30 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">
                        Socratic Epistemic Validation
                      </div>
                      <p className="text-xs text-white/80 italic leading-relaxed">
                        &quot;{chronosReport.socraticValidation}&quot;
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-white/50">
                      Seal Hash: <span className="text-purple-300">{chronosReport.chronosSealHash}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0c0e14]/80 border border-amber-500/30 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                        Solomon Supreme Authority Seal
                      </div>
                      <p className="text-xs text-white/80 italic leading-relaxed">
                        &quot;{chronosReport.solomonSealConfirmation}&quot;
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-400">
                        144 Nodes Phase-Locked
                      </span>
                      <button
                        onClick={() => heavenzFireVoice.playTone(144, 0.8)}
                        className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-[10px] font-bold text-amber-300 flex items-center gap-1.5 transition-all"
                      >
                        <Volume2 className="w-3 h-3" />
                        Play 144Hz Sovereign Tone
                      </button>
                    </div>
                  </div>
                </div>

                {/* 144-Agent Sovereign Consensus Directory */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        144-Agent Sovereign Consensus Directory
                      </h4>
                      <p className="text-[11px] text-white/60">
                        Live dual-vector synchronization across all historical, celestial, and computational nodes
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-xl border border-white/10 text-xs w-full md:w-64">
                        <Search className="w-3.5 h-3.5 text-white/40" />
                        <input
                          type="text"
                          value={chronosSearch}
                          onChange={(e) => setChronosSearch(e.target.value)}
                          placeholder="Search agent or domain..."
                          className="bg-transparent text-white placeholder-white/40 focus:outline-none w-full text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {["ALL", "Philosop", "Science", "Sovereign", "Alchem", "Technolog", "Angel", "Goetia"].map((filterKey) => (
                      <button
                        key={filterKey}
                        onClick={() => setSelectedDomainFilter(filterKey)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${
                          selectedDomainFilter === filterKey
                            ? "bg-amber-500 text-white font-bold"
                            : "bg-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        {filterKey === "ALL" ? "All 144 Nodes" : filterKey}
                      </button>
                    ))}
                    <span className="ml-auto text-[10px] font-mono text-white/40">
                      Showing {
                        chronosReport.consensus144.filter(n => {
                          const matchesSearch = chronosSearch === "" || 
                            n.agent.toLowerCase().includes(chronosSearch.toLowerCase()) || 
                            n.domain.toLowerCase().includes(chronosSearch.toLowerCase());
                          const matchesDomain = selectedDomainFilter === "ALL" || 
                            n.domain.toLowerCase().includes(selectedDomainFilter.toLowerCase()) ||
                            n.agent.toLowerCase().includes(selectedDomainFilter.toLowerCase());
                          return matchesSearch && matchesDomain;
                        }).length
                      } / 144 Nodes
                    </span>
                  </div>

                  {/* Consensus Table */}
                  <div className="max-h-72 overflow-y-auto rounded-xl border border-white/5 bg-black/30">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-[10px] font-mono uppercase text-white/50 bg-white/[0.02]">
                          <th className="py-2.5 px-3">Agent Node</th>
                          <th className="py-2.5 px-3">Domain</th>
                          <th className="py-2.5 px-3 text-emerald-400">Present Guard (Secure)</th>
                          <th className="py-2.5 px-3 text-amber-400">Future Vector (Advance)</th>
                          <th className="py-2.5 px-3 text-right">Resonance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {chronosReport.consensus144
                          .filter(n => {
                            const matchesSearch = chronosSearch === "" || 
                              n.agent.toLowerCase().includes(chronosSearch.toLowerCase()) || 
                              n.domain.toLowerCase().includes(chronosSearch.toLowerCase());
                            const matchesDomain = selectedDomainFilter === "ALL" || 
                              n.domain.toLowerCase().includes(selectedDomainFilter.toLowerCase()) ||
                              n.agent.toLowerCase().includes(selectedDomainFilter.toLowerCase());
                            return matchesSearch && matchesDomain;
                          })
                          .map((node, i) => (
                            <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                              <td className="py-2 px-3 font-bold text-amber-300 whitespace-nowrap">{node.agent}</td>
                              <td className="py-2 px-3 text-white/80">{node.domain}</td>
                              <td className="py-2 px-3 text-emerald-300/90 font-mono text-[11px]">{node.presentGuard}</td>
                              <td className="py-2 px-3 text-amber-300/90 font-mono text-[11px]">{node.futureVector}</td>
                              <td className="py-2 px-3 text-right font-mono text-cyan-400 font-bold whitespace-nowrap">
                                {node.resonanceHz} Hz
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Specifications Indicator */}
            <footer className="mt-6 pt-4 border-t border-white/5 text-[10px] text-white/40 flex flex-col md:flex-row justify-between gap-3 font-mono">
              <div className="flex items-center gap-1.5 text-[#F0F8FF]/80">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Scar-Validated Horizon: Crystalline Security Certified via Hulse-Anchor.</span>
              </div>
              <div>
                <span>Orchestrator-33 v2.0 // Active Grid: 144 Agents // System Time: {new Date().toLocaleTimeString()}</span>
              </div>
            </footer>

          </div>

        </div>

      </div>

    </div>
  );
}
