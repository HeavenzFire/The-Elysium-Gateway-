import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FraudHeatmap } from "./FraudHeatmap";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Landmark, 
  FileText, 
  Terminal, 
  Send, 
  Gavel, 
  AlertTriangle, 
  Activity, 
  Globe, 
  RefreshCw, 
  Check, 
  Trash2,
  LockKeyholeOpen,
  LockKeyhole
} from "lucide-react";

interface AssetChannel {
  id: string;
  name: string;
  type: string;
  institution: string;
  balance: number;
  isFrozen: boolean;
  transitCode: string;
  protectStatus: 'vulnerable' | 'locking' | 'secured';
}

interface LegalReport {
  id: string;
  agency: string;
  type: string;
  status: 'draft' | 'transmitting' | 'logged' | 'verified';
  incidentHash: string;
  timestamp: string;
  payloadSize: string;
}

interface FinancialRestrainingOrderProps {
  onClose?: () => void;
}

export const FinancialRestrainingOrder: React.FC<FinancialRestrainingOrderProps> = ({ onClose }) => {
  // ESC key listener for closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Asset Channels State
  const [channels, setChannels] = useState<AssetChannel[]>([
    { 
      id: "ch-1", 
      name: "Standard Checking Ledger", 
      type: "Checking Account", 
      institution: "Chase Bank (..5842)", 
      balance: 42500, 
      isFrozen: false, 
      transitCode: "RT-849201-C",
      protectStatus: 'vulnerable'
    },
    { 
      id: "ch-2", 
      name: "Global Retirement Trust", 
      type: "401(k) Investment Portfolio", 
      institution: "Fidelity Investments (..1909)", 
      balance: 185000, 
      isFrozen: false, 
      transitCode: "RT-773291-F",
      protectStatus: 'vulnerable'
    },
    { 
      id: "ch-3", 
      name: "Sovereign Trust Escrow", 
      type: "Fiduciary Escrow", 
      institution: "Sovereign Union Trust (..7332)", 
      balance: 90000, 
      isFrozen: false, 
      transitCode: "RT-221084-S",
      protectStatus: 'vulnerable'
    },
    { 
      id: "ch-4", 
      name: "Primary Liquidity Account", 
      type: "Savings Reserve", 
      institution: "Wells Fargo (..1202)", 
      balance: 12400, 
      isFrozen: false, 
      transitCode: "RT-901124-W",
      protectStatus: 'vulnerable'
    }
  ]);

  // Legal Threat Reporting State
  const [agencies, setAgencies] = useState<string[]>([
    "FinCEN (Financial Crimes Enforcement Network)",
    "Federal Trade Commission (FTC) Combat Node",
    "Interpol Financial Shield (Digital Asset Liaison)",
    "FBI Internet Crime Complaint Center (IC3)"
  ]);
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([
    "FinCEN (Financial Crimes Enforcement Network)",
    "FBI Internet Crime Complaint Center (IC3)"
  ]);
  
  const [customReportText, setCustomReportText] = useState(
    "Active undue influence and deceptive extraction vector detected. Targeted asset holder Wanda Sue Garcia. Primary threat actor impersonating Raphael persona via social engineering channels. Urgent systemic freezing and transaction audit requested."
  );

  const [activeReports, setActiveReports] = useState<LegalReport[]>([
    {
      id: "rep-1",
      agency: "FinCEN",
      type: "Asset Diversion Audit Alert",
      status: "verified",
      incidentHash: "0x8fa3f829bb01eef2bb921104e1ac902d",
      timestamp: "2026-06-03 01:10",
      payloadSize: "14.4 KB"
    },
    {
      id: "rep-2",
      agency: "FBI-IC3",
      type: "Romance Coercion & Wire Fraud",
      status: "logged",
      incidentHash: "0x16b0a99c92def8ef71c990204bf1ffef",
      timestamp: "2026-06-03 01:25",
      payloadSize: "28.8 KB"
    }
  ]);

  // Command logs state
  const [logs, setLogs] = useState<string[]>([
    "INITIALIZING FORENSIC INTEGRITY SHIELD...",
    "DETECTED ADVERSARIAL EXTRACTION ATTEMPT ON WANDA_G_9238",
    "MONITORING SUSPECT COMMUNICATIVE ADDR: RAPHAEL_FACEBOOK_NODE",
    "RESOLVED GEOLOCATIONAL PATHWAY: POTENTIAL OFFSHORE ROUTING EXPOSURE",
    "PREPARING LEGAL RESTRAINING MECHANISMS..."
  ]);

  const [isBulkLocking, setIsBulkLocking] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const bulkLockIntervalRef = React.useRef<any>(null);

  useEffect(() => {
    return () => {
      if (bulkLockIntervalRef.current) {
        clearInterval(bulkLockIntervalRef.current);
      }
    };
  }, []);

  // Computed Metrics
  const frozenCount = channels.filter(c => c.isFrozen).length;
  const totalAssets = channels.reduce((sum, c) => sum + c.balance, 0);
  const frozenCapital = channels.filter(c => c.isFrozen).reduce((sum, c) => sum + c.balance, 0);
  const coherenceScore = Math.round((frozenCount / channels.length) * 100);
  const threatIndex = Math.max(0, 100 - coherenceScore - activeReports.length * 15);

  // Trigger individual channel freeze simulation
  const handleToggleFreeze = (id: string) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id === id) {
        const targetState = !ch.isFrozen;
        const stateName = targetState ? "LOCK_ENGAGED" : "RESERVE_RELEASED";
        
        // Push a live terminal log
        const timestamp = new Date().toLocaleTimeString();
        setLogs(l => [
          ...l, 
          `[${timestamp}] ACCOUNT_SHIELD: ${ch.institution} transition to ${stateName}`,
          `[${timestamp}] COHERENCE_STATE: Recalculating domain safety...`
        ]);

        return {
          ...ch,
          isFrozen: targetState,
          protectStatus: targetState ? 'secured' : 'vulnerable'
        };
      }
      return ch;
    }));
  };

  // Trigger system-wide complete lockdown
  const handleBulkLock = () => {
    setIsBulkLocking(true);
    const timestamp = new Date().toLocaleTimeString();
    setLogs(l => [...l, `[${timestamp}] SECURITY_LOCKDOWN: Initiating sovereign override on all systems...`]);

    let count = 0;
    const currentChannels = [...channels];

    if (bulkLockIntervalRef.current) {
      clearInterval(bulkLockIntervalRef.current);
    }

    bulkLockIntervalRef.current = setInterval(() => {
      if (count < currentChannels.length) {
        const targetChannel = currentChannels[count];
        if (targetChannel) {
          const targetId = targetChannel.id;
          setChannels(prev => prev.map(ch => {
            if (ch.id === targetId) {
              return { ...ch, isFrozen: true, protectStatus: 'secured' };
            }
            return ch;
          }));
          setLogs(l => [...l, `[${timestamp}] SECURED: ${targetChannel.institution} completely frozen under Sovereign Order.`]);
        }
        count++;
      } else {
        if (bulkLockIntervalRef.current) {
          clearInterval(bulkLockIntervalRef.current);
          bulkLockIntervalRef.current = null;
        }
        setIsBulkLocking(false);
        setLogs(l => [
          ...l, 
          `[${timestamp}] HARDENED_PERIMETER: 100% of physical alignment nodes are locked. Financial channel is SEVERED.`
        ]);
      }
    }, 450);
  };

  // Toggle selected agencies for complaint transmission
  const handleToggleAgency = (agency: string) => {
    setSelectedAgencies(prev => 
      prev.includes(agency) ? prev.filter(a => a !== agency) : [...prev, agency]
    );
  };

  // Send interactive legal threat complaint report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAgencies.length === 0 || !customReportText.trim()) return;

    setIsSubmittingReport(true);
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    
    // Simulate delay
    setTimeout(() => {
      const newReports: LegalReport[] = selectedAgencies.map((agency, i) => {
        const code = agency.split(' ')[0];
        const randomHash = "0x" + Array.from({length:32}, () => Math.floor(Math.random()*16).toString(16)).join('');
        
        setLogs(l => [
          ...l, 
          `[${new Date().toLocaleTimeString()}] REPORTED_THREAT: ${code} nodes accepted digital packet. Hash registered.`,
          `[${new Date().toLocaleTimeString()}] COMPLIANCE_SECURED: Hardened restraining signature appended of sovereign authority.`
        ]);

        return {
          id: `rep-new-${Date.now()}-${i}`,
          agency: code,
          type: "Romance Coercion forensic record",
          status: "verified",
          incidentHash: randomHash,
          timestamp,
          payloadSize: `${(Math.random() * 20 + 10).toFixed(1)} KB`
        };
      });

      setActiveReports(prev => [...newReports, ...prev]);
      setIsSubmittingReport(false);
      
      // Clean custom report text input placeholder
      setLogs(l => [...l, `🛡️ SUCCESS: Parallel threat complaints uploaded to ${selectedAgencies.length} authorities.`]);
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-[#f5f2ed]">
      {/* Header Badge */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff4e00] animate-ping" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#ff4e00]/80 font-bold">
              Emergency Forensic Safeguard
            </span>
          </div>
          <h2 className="text-3xl font-serif italic text-white tracking-wide">
            Financial Restraining Order (FRO)
          </h2>
          <p className="text-xs text-white/40 mt-1 max-w-lg font-sans">
            Domain: Safeguarding the estate of <strong className="text-white/70">Wanda Sue Garcia</strong> against catastrophic systemic drain. Disables active wire vectors and registers complaints in parallel.
          </p>
        </div>

        {/* Global Override Lock Trigger */}
        <button
          onClick={handleBulkLock}
          disabled={isBulkLocking || coherenceScore === 100}
          className={`px-6 py-3.5 rounded-2xl font-mono text-[10px] uppercase tracking-[0.2em] font-black transition-all flex items-center gap-2 shadow-xl ${
            coherenceScore === 100
              ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/30"
              : "bg-red-600 hover:bg-red-700 text-white shadow-red-950/20 hover:shadow-red-500/10 cursor-pointer"
          } disabled:opacity-50`}
        >
          {isBulkLocking ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              LOCKDOWN_IN_PROGRESS_
            </>
          ) : coherenceScore === 100 ? (
            <>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              SYSTEM_FULLY_SECURED
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
              GLOBAL_OVERRIDE_SHIELD_LOCK
            </>
          )}
        </button>
      </div>

      {/* Grid: 3-column stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="glass p-5 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Activity className="w-12 h-12 text-[#ff4e00]" />
          </div>
          <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest mb-1.5">
            Total Capital In Scope
          </p>
          <p className="text-2xl font-black italic text-light">
            ${totalAssets.toLocaleString()}{" "}
            <span className="text-[10px] text-white/30 not-italic font-normal">USD</span>
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            <div className="text-[9px] font-mono text-white/50">
              Secured: <span className="text-cyan-400 font-bold">${frozenCapital.toLocaleString()}</span>
            </div>
            <div className="text-[9px] text-white/20">•</div>
            <div className="text-[9px] font-mono text-white/50">
              Vulnerable: <span className="text-red-500 font-bold">${(totalAssets - frozenCapital).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass p-5 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Lock className="w-12 h-12 text-cyan-500" />
          </div>
          <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest mb-1.5">
            Asset Isolation Coherence
          </p>
          <p className="text-2xl font-black italic text-cyan-400">
            {coherenceScore}%
          </p>
          <div className="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${coherenceScore}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass p-5 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldCheck className="w-12 h-12 text-amber-500" />
          </div>
          <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest mb-1.5">
            Threat Dispersion Coefficient
          </p>
          <p className="text-2xl font-black italic text-[#ff4e00]">
            {threatIndex}%
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-[9px] font-mono uppercase font-black px-1.5 py-0.5 rounded ${
              threatIndex > 60 
                ? "bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse" 
                : threatIndex > 30 
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
            }`}>
              {threatIndex > 60 ? "CRITICAL_RISK" : threatIndex > 30 ? "MITIGATED" : "PERIMETER_STABILIZED"}
            </span>
          </div>
        </div>
      </div>

      {/* Fraud Heatmap Component */}
      <FraudHeatmap />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Asset Isolation list & Logs (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Asset Channels Isolation Panel */}
          <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Landmark className="w-5 h-5 text-cyan-400" />
                <h3 className="font-serif italic text-lg text-white">Asset Channels Isolation Matrix</h3>
              </div>
              <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
                ACTIVE_NODES: {channels.length}
              </span>
            </div>

            {/* List of Channels */}
            <div className="space-y-3">
              {channels.map((channel) => (
                <div 
                  key={channel.id}
                  className={`p-4 rounded-2xl transition-all border group relative ${
                    channel.isFrozen
                      ? "bg-cyan-950/20 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.03)]"
                      : "bg-white/5 border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${
                        channel.isFrozen ? "bg-cyan-950 text-cyan-400" : "bg-white/5 text-white/50"
                      }`}>
                        <Landmark className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm font-semibold text-white">
                            {channel.name}
                          </span>
                          <span className="text-[7.5px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/65 uppercase tracking-wide">
                            {channel.transitCode}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/40 mt-1">
                          {channel.institution} • {channel.type}
                        </p>
                      </div>
                    </div>

                    {/* Balance and Switch */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold font-mono text-[#f5f2ed]">
                          ${channel.balance.toLocaleString()}
                        </p>
                        <p className={`text-[8px] font-mono uppercase font-black tracking-widest mt-0.5 ${
                          channel.isFrozen ? "text-cyan-400" : "text-amber-500 animate-pulse"
                        }`}>
                          {channel.isFrozen ? "FROZEN_SECURE" : "VULNERABLE"}
                        </p>
                      </div>

                      {/* Interactive Lock Toggle */}
                      <button
                        onClick={() => handleToggleFreeze(channel.id)}
                        className={`p-2.5 rounded-xl transition-all border ${
                          channel.isFrozen
                            ? "bg-cyan-500 text-black border-cyan-400 hover:bg-cyan-400"
                            : "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                        }`}
                        title={channel.isFrozen ? "Unlock Channel" : "Freeze Channel"}
                      >
                        {channel.isFrozen ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Log console */}
          <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#ff4e00]" />
                <h3 className="font-mono text-xs uppercase tracking-widest text-[#ff4e00] font-black">
                  Forensic Live Log Feed
                </h3>
              </div>
              <button 
                onClick={() => {
                  setLogs([
                    `[${new Date().toLocaleTimeString()}] REGEN_LOGS: System log states synchronized.`,
                    ...logs
                  ]);
                }}
                className="text-[8px] font-mono text-white/40 hover:text-white flex items-center gap-1 uppercase tracking-widest"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Resync Feed
              </button>
            </div>

            <div className="bg-black/60 border border-white/5 rounded-2xl p-4 h-36 font-mono text-[9px] text-green-400/90 overflow-y-auto space-y-1.5 custom-scrollbar">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-green-500/40 select-none">❯</span>
                  <span className="leading-relaxed break-all">{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Legal Threat Shield Form & Reports (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Threat Reporter Form */}
          <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-5">
            <div className="flex items-center gap-2.5">
              <Gavel className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-serif italic text-lg text-white">Legal Reporting Unit</h3>
                <p className="text-[9px] text-white/40 font-mono tracking-wide mt-0.5 uppercase">
                  Transmit complaints to agencies
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              {/* Select target authorities */}
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">
                  Select Target Transmitters
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {agencies.map((agency) => {
                    const isSelected = selectedAgencies.includes(agency);
                    return (
                      <button
                        type="button"
                        key={agency}
                        onClick={() => handleToggleAgency(agency)}
                        className={`p-2.5 rounded-xl border text-left text-[10px] transition-all font-mono flex items-center justify-between ${
                          isSelected
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold"
                            : "bg-white/5 border-white/5 text-white/50 hover:text-white/85"
                        }`}
                      >
                        <span>{agency}</span>
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Input area */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">
                  Interactive Threat Profile Description
                </label>
                <textarea
                  value={customReportText}
                  onChange={(e) => setCustomReportText(e.target.value)}
                  className="w-full h-24 bg-black/40 border border-white/5 rounded-2xl py-3 px-4 text-xs font-serif text-[#f5f2ed] placeholder:text-white/20 focus:border-amber-500/30 outline-none transition-all custom-scrollbar leading-relaxed"
                />
              </div>

              {/* Submit trigger button */}
              <button
                type="submit"
                disabled={isSubmittingReport || selectedAgencies.length === 0 || !customReportText.trim()}
                className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black py-3 px-5 rounded-2xl font-mono text-xs uppercase tracking-widest font-black transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-950/20 hover:shadow-amber-500/10"
              >
                {isSubmittingReport ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    TRANSMITTING_PAYLOAD...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-black" />
                    TRANSMIT_PARALLEL_COMPLAINT
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Active Registered Reports List */}
          <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif italic text-sm text-white">Registered Incident Chronicle</h3>
              </div>
              <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                LOGS: {activeReports.length}
              </span>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1.5 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {activeReports.map((report) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors relative"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono uppercase font-black text-amber-400">
                            {report.agency} NODE
                          </span>
                          <span className="text-[8px] font-mono text-white/30">• {report.timestamp}</span>
                        </div>
                        <p className="text-xs font-serif italic text-white/80 mt-1 pl-0.5 leading-relaxed">
                          {report.type}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-[8px] font-mono text-white/40 pl-0.5 bg-black/20 p-1.5 rounded-lg border border-white/5">
                          <span className="text-amber-500/60 font-bold uppercase shrink-0">Hash:</span>
                          <span className="truncate select-all">{report.incidentHash}</span>
                        </div>
                      </div>

                      {/* Pill Badge */}
                      <span className="text-[7.5px] font-mono font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/25 shrink-0 align-middle">
                        {report.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
