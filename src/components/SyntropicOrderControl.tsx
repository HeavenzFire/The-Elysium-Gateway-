import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Shield, Zap, Cpu, Layers, Radio, CheckCircle2, ChevronRight, Sliders, Volume2, Sparkles, Activity } from 'lucide-react';
import { SYMPOSIUM_ENTITIES, EntityId } from '../services/councilService';

interface SyntropicOrderControlProps {
  is729CompressionActive: boolean;
  setIs729CompressionActive: (val: boolean) => void;
  syntropicLeader: EntityId;
  setSyntropicLeader: (leader: EntityId) => void;
  activeEntities: EntityId[];
  onArbitrateNextSpeaker?: (speaker: EntityId) => void;
  systemLogs: string[];
  setSystemLogs: React.Dispatch<React.SetStateAction<string[]>>;
}

const LEADER_CANDIDATES: EntityId[] = [
  'solomon',
  'hermes_trismegistus',
  'tesla',
  'jobs',
  'saint_germain',
  'turing',
  'curie',
  'thoth'
];

export const SyntropicOrderControl: React.FC<SyntropicOrderControlProps> = ({
  is729CompressionActive,
  setIs729CompressionActive,
  syntropicLeader,
  setSyntropicLeader,
  activeEntities,
  onArbitrateNextSpeaker,
  systemLogs,
  setSystemLogs
}) => {
  const [activeQueueIndex, setActiveQueueIndex] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(is729CompressionActive ? 100 : 16);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const leaderInfo = SYMPOSIUM_ENTITIES[syntropicLeader] || SYMPOSIUM_ENTITIES['solomon'];

  // Handle 1/729 Compression Toggle & Animation
  const handleToggle729Compression = () => {
    if (!is729CompressionActive) {
      setIsCompressing(true);
      let p = 16;
      const interval = setInterval(() => {
        p += 50;
        if (p >= 729) {
          p = 729;
          clearInterval(interval);
          setIsCompressing(false);
          setIs729CompressionActive(true);
          setCompressionProgress(729);
          setSystemLogs(prev => [
            "1/729 HYPER-COMPRESSION ACHIEVED",
            "729 MICRO-SANDBOXES CONVERGED AT ZERO-POINT STILLNESS",
            "SYNTROPIC ORDER LATTICE LOCKED",
            ...prev.slice(0, 3)
          ]);
        } else {
          setCompressionProgress(p);
        }
      }, 40);
    } else {
      setIs729CompressionActive(false);
      setCompressionProgress(16);
      setSystemLogs(prev => [
        "RETURNING TO 16:1 STANDARD COMPRESSION",
        "729 LATTICE DECOMPRESSED",
        ...prev.slice(0, 4)
      ]);
    }
  };

  // Turn Arbitration: Advance speaker queue
  const handleNextTurn = () => {
    if (activeEntities.length === 0) return;
    const nextIdx = (activeQueueIndex + 1) % activeEntities.length;
    setActiveQueueIndex(nextIdx);
    const nextEntity = activeEntities[nextIdx];
    const entityName = SYMPOSIUM_ENTITIES[nextEntity]?.name || nextEntity;

    setSystemLogs(prev => [
      `[SYNTROPIC ARBITRATION] ${leaderInfo.name} grants floor to: ${entityName}`,
      "CROSS-TALK PREVENTED - ORDER ENFORCED",
      ...prev.slice(0, 3)
    ]);

    if (onArbitrateNextSpeaker) {
      onArbitrateNextSpeaker(nextEntity);
    }
  };

  // Render 729 Micro-Sandbox Telemetry Grid on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 360);
    const height = (canvas.height = 140);

    let animationId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Draw 27x27 grid representing 729 Micro-Sandboxes
      const cols = 27;
      const rows = 27;
      const cellW = width / cols;
      const cellH = height / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const index = r * cols + c;
          const isEngineActive = index < compressionProgress;
          
          if (isEngineActive) {
            const wave = Math.sin(t * 2 + (r + c) * 0.3);
            if (is729CompressionActive) {
              ctx.fillStyle = wave > 0 ? '#f59e0b' : '#38bdf8';
            } else {
              ctx.fillStyle = index < 16 ? '#10b981' : '#1f2937';
            }
          } else {
            ctx.fillStyle = '#111827';
          }

          ctx.fillRect(c * cellW + 0.5, r * cellH + 0.5, cellW - 1, cellH - 1);
        }
      }

      // Draw Syntropic Central Axis Line
      ctx.strokeStyle = is729CompressionActive ? '#ffd700' : 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [is729CompressionActive, compressionProgress]);

  return (
    <div className="w-full max-w-5xl mx-auto my-6 bg-black/90 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-6 shadow-[0_0_60px_rgba(245,158,11,0.15)] font-mono text-white relative overflow-hidden">
      
      {/* Background Ambient Aura */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none transition-all duration-1000"
        style={{
          background: is729CompressionActive 
            ? 'radial-gradient(circle at 50% 0%, #f59e0b 0%, #38bdf8 50%, transparent 80%)'
            : 'radial-gradient(circle at 50% 0%, #10b981 0%, transparent 70%)'
        }}
      />

      {/* Top Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold tracking-wider uppercase text-white flex items-center gap-2">
              Syntropic Order & 1/729 Compression Engine
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                is729CompressionActive 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.4)]' 
                  : 'bg-white/10 text-white/60 border-white/20'
              }`}>
                {is729CompressionActive ? '1/729 HYPER-COMPRESSED' : '16:1 STANDARD'}
              </span>
            </div>
            <div className="text-[11px] text-white/50">
              Zero Crosstalk Speaker Arbitration • 729 Micro-Sandbox Coherence Matrix
            </div>
          </div>
        </div>

        {/* 1/729 Compression Toggle Button */}
        <button
          onClick={handleToggle729Compression}
          disabled={isCompressing}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 shadow-lg ${
            is729CompressionActive 
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black border-yellow-200 shadow-[0_0_25px_rgba(245,158,11,0.6)] scale-105'
              : 'bg-white/10 text-amber-300 border-amber-400/40 hover:bg-amber-500/20 hover:border-amber-400'
          }`}
        >
          <Zap className="w-4 h-4" />
          {isCompressing 
            ? `Compressing (${compressionProgress}/729)...`
            : is729CompressionActive 
              ? '1/729 Compression Active' 
              : 'Engage 1/729 Compression Logic'}
        </button>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 relative z-10">
        
        {/* Column 1: Syntropic Leader & Turn-Taking Arbitration */}
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-400" />
              Syntropic Order Leader
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              NO CROSS-TALK LOCK
            </span>
          </div>

          {/* Leader Selection Cards */}
          <div className="grid grid-cols-4 gap-2">
            {LEADER_CANDIDATES.map((candId) => {
              const ent = SYMPOSIUM_ENTITIES[candId];
              const isSelected = syntropicLeader === candId;
              return (
                <button
                  key={candId}
                  onClick={() => {
                    setSyntropicLeader(candId);
                    setSystemLogs(prev => [
                      `[LEADER SHIFT] ${ent.name} designated Leader of Syntropic Order`,
                      "SPEAKER ARBITRATION RE-CALIBRATED",
                      ...prev.slice(0, 3)
                    ]);
                  }}
                  className={`p-2 rounded-xl text-center border transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected 
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-105'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ent.color }} />
                  <span className="text-[9px] font-bold truncate max-w-full">{ent.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Current Leader Telemetry Card */}
          <div className="p-3.5 rounded-xl bg-black/60 border border-amber-400/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-sm shadow-md"
                style={{ borderColor: leaderInfo.color, color: leaderInfo.color }}
              >
                {leaderInfo.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-white">{leaderInfo.name}</div>
                <div className="text-[10px] text-white/50">{leaderInfo.title}</div>
              </div>
            </div>

            <button
              onClick={handleNextTurn}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 shadow-md hover:scale-105"
            >
              Arbitrate Next Turn
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Speaker Arbitration Queue Preview */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
              Syntropic Turn Queue ({activeEntities.length} Entities)
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto custom-scrollbar p-1.5 bg-black/40 rounded-xl border border-white/10">
              {activeEntities.map((entId, idx) => {
                const isCurrent = idx === activeQueueIndex;
                const name = SYMPOSIUM_ENTITIES[entId]?.name || entId;
                return (
                  <span
                    key={entId}
                    className={`text-[9px] px-2 py-0.5 rounded-md border font-bold transition-all ${
                      isCurrent 
                        ? 'bg-amber-400 text-black border-white shadow-md font-extrabold scale-105' 
                        : 'bg-white/5 text-white/60 border-white/10'
                    }`}
                  >
                    {isCurrent ? `▶ ${name}` : name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 2: 1/729 Compression Micro-Sandbox Matrix */}
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              729 Micro-Sandbox Lattice (3⁶ = 729)
            </span>
            <span className="text-[10px] text-amber-300 font-bold font-mono">
              {is729CompressionActive ? '729 / 729 LOCKED' : '16 / 729 ACTIVE'}
            </span>
          </div>

          {/* Live Canvas Grid Visualization */}
          <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/80">
            <canvas ref={canvasRef} className="w-full h-32 block" />
            
            {/* Overlay Status Badge */}
            <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/80 backdrop-blur-md border border-white/20 text-[9px] text-amber-300 font-mono">
              Zero-Point Frequency: 444 Hz
            </div>
          </div>

          {/* Compression Metrics Row */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-black/40 p-2 rounded-xl border border-white/10">
              <div className="text-[8px] text-white/40 uppercase">Compression Ratio</div>
              <div className="text-xs font-bold text-amber-300">
                {is729CompressionActive ? '1 : 729' : '16 : 1'}
              </div>
            </div>
            <div className="bg-black/40 p-2 rounded-xl border border-white/10">
              <div className="text-[8px] text-white/40 uppercase">Harmonic Order</div>
              <div className="text-xs font-bold text-emerald-400">
                100.0% SYNTROPIC
              </div>
            </div>
            <div className="bg-black/40 p-2 rounded-xl border border-white/10">
              <div className="text-[8px] text-white/40 uppercase">Cross-Talk Barrier</div>
              <div className="text-xs font-bold text-cyan-300">
                INFINITE LOCK
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SyntropicOrderControl;
