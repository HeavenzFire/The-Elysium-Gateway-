import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Activity, Zap, Sparkles, Waves, Radio, Heart } from 'lucide-react';

interface ResonanceGaugeProps {
  resonanceFreq: number;
  setResonanceFreq: (freq: number) => void;
  isActive: boolean;
  outputVolume?: number;
}

export function ResonanceGauge({ resonanceFreq, setResonanceFreq, isActive, outputVolume = 0 }: ResonanceGaugeProps) {
  const [time, setTime] = useState(0);
  const activeBaseline = Math.abs(resonanceFreq - 432) < Math.abs(resonanceFreq - 963) ? 432 : 963;
  const delta = Math.abs(resonanceFreq - activeBaseline);
  
  // Calculate a "Resonance Sync" coherence percentage
  const maxDistance = 300; // max reasonable range for coupling
  const syncPercentage = Math.max(0, Math.min(100, 100 - (delta / maxDistance) * 100));

  // Determine the primary harmonic coupling regime
  const couplingType = activeBaseline === 432 
    ? { title: "Organic / Cardiac Integration", color: "text-emerald-400", hex: "#10b981", desc: "Pythagorean cosmic tuning for physiological and planet-grid alignment." }
    : { title: "Sovereign / Divine Crown Coupling", color: "text-[#ff4e00]", hex: "#ff4e00", desc: "Crown-Solfeggio state for neural-gate activation and spiritual focus." };

  // Live wave simulation loop
  useEffect(() => {
    let animationId: number;
    const startTime = performance.now();
    const update = () => {
      setTime((performance.now() - startTime) / 1000);
      animationId = requestAnimationFrame(update);
    };
    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // SVG circular arc path math (radius 60, center 75,75)
  // Arc goes from -200 deg to 20 deg (220 degree sweep)
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  // Maps values 100–1000 to needle angles from -135 to 135 degrees
  const valToAngle = (val: number) => {
    const minVal = 100;
    const maxVal = 1000;
    const minAngle = -135;
    const maxAngle = 135;
    const pct = (val - minVal) / (maxVal - minVal);
    return minAngle + pct * (maxAngle - minAngle);
  };

  const currentAngle = valToAngle(resonanceFreq);
  const angle432 = valToAngle(432);
  const angle963 = valToAngle(963);

  // Generate an oscilloscope trace illustrating composite waves
  const generateOscilloscopePath = () => {
    const points: string[] = [];
    const width = 280;
    const height = 48;
    const midY = height / 2;
    
    // Create dual wave overlay
    for (let x = 0; x <= width; x += 2) {
      // Frequency representation (scaled for look)
      const kFactor = (resonanceFreq / 100) * 0.5;
      const primarySin = Math.sin(x * 0.08 * kFactor + time * 3.5);
      
      // Add subtle noise or volume-based ripple
      const ripple = isActive ? Math.sin(x * 0.15 + time * 10) * (outputVolume / 30) : 0;
      
      // Calculate active baseline reference wave contribution
      const baseFactor = (activeBaseline / 100) * 0.5;
      const baseSin = Math.sin(x * 0.08 * baseFactor + time * 2);
      
      // Composite superposition
      const composite = (primarySin * 10) + (baseSin * 6) + ripple;
      
      points.push(`${x},${midY + composite}`);
    }
    return `M ${points.join(" L ")}`;
  };

  return (
    <div className="w-full glass rounded-[2.5rem] p-6 md:p-8 border border-white/5 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background radial highlight */}
      <div 
        className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full opacity-[0.03] pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${couplingType.hex} 0%, transparent 70%)`
        }}
      />

      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        
        {/* Needle Gauge / Visual */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 150 150">
            {/* Background Arc */}
            <path
              d={describeArc(75, 75, 60, -45, 225)}
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            
            {/* Active Range Fill */}
            <path
              d={describeArc(75, 75, 60, -45, currentAngle + 135 - 45)}
              fill="none"
              stroke={couplingType.hex}
              strokeWidth="4"
              strokeLinecap="round"
              className="opacity-40 transition-all duration-300"
            />

            {/* 432 Hz Baseline Tick Marker */}
            <circle
              cx={75 + 60 * Math.sin((angle432 * Math.PI) / 180)}
              cy={75 - 60 * Math.cos((angle432 * Math.PI) / 180)}
              r="4"
              className="fill-emerald-400 stroke-black stroke-2 shadow-lg"
            >
              <title>432Hz Baseline</title>
            </circle>
            
            {/* 963 Hz Baseline Tick Marker */}
            <circle
              cx={75 + 60 * Math.sin((angle963 * Math.PI) / 180)}
              cy={75 - 60 * Math.cos((angle963 * Math.PI) / 180)}
              r="4"
              className="fill-[#ff4e00] stroke-black stroke-2 shadow-lg"
            >
              <title>963Hz Baseline</title>
            </circle>

            {/* Needle */}
            <g transform={`rotate(${currentAngle} 75 75)`} className="transition-transform duration-300">
              <line
                x1="75"
                y1="75"
                x2="75"
                y2="18"
                stroke={couplingType.hex}
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 4px ${couplingType.hex})` }}
              />
              <circle cx="75" cy="75" r="5" fill="#111827" stroke={couplingType.hex} strokeWidth="2" />
            </g>

            {/* Interactive ticks */}
            {[-135, -90, -45, 0, 45, 90, 135].map((angle, k) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 75 + 50 * Math.sin(rad);
              const y1 = 75 - 50 * Math.cos(rad);
              const x2 = 75 + 54 * Math.sin(rad);
              const y2 = 75 - 54 * Math.cos(rad);
              return (
                <line
                  key={k}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="1"
                />
              );
            })}
          </svg>

          {/* Central status readout inside the dial */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-4 select-none">
            <span className="text-[9px] uppercase tracking-wider text-white/40">Resonance</span>
            <div className="text-xl font-bold text-white font-mono flex items-baseline tracking-tight">
              {resonanceFreq}
              <span className="text-[10px] text-white/50 font-normal ml-0.5">Hz</span>
            </div>
            <div className="text-[7px] font-mono uppercase tracking-widest text-white/40 bg-white/5 px-2 py-0.5 rounded-full mt-1 border border-white/5">
              Sync: {syncPercentage.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Dashboard Readout Panels */}
        <div className="flex-1 w-full space-y-4 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#ff4e00]" />
                <h3 className="text-[10px] uppercase tracking-[0.25em] font-sans font-black text-white/80">Harmonic Frequency Shift</h3>
              </div>
              <p className="text-[9px] text-white/40 mt-0.5">Real-time spectrum monitoring against Solfeggio/Organon matrix anchors.</p>
            </div>
            
            {/* Quick calibration controls */}
            <div className="flex items-center gap-2 mt-1 md:mt-0">
              <button
                onClick={() => setResonanceFreq(432)}
                className={`px-3 py-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-tight transition-all border ${
                  resonanceFreq === 432
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'bg-white/5 text-white/50 border-white/5 hover:text-white hover:border-white/10'
                }`}
              >
                TUNE 432Hz
              </button>
              <button
                onClick={() => setResonanceFreq(963)}
                className={`px-3 py-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-tight transition-all border ${
                  resonanceFreq === 963
                    ? 'bg-[#ff4e00]/10 text-[#ff4e00] border-[#ff4e00]/20 shadow-[0_0_10px_rgba(255,78,0,0.2)]'
                    : 'bg-white/5 text-white/50 border-white/5 hover:text-white hover:border-white/10'
                }`}
              >
                TUNE 963Hz
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Coupling metrics */}
            <div className="space-y-2">
              <div className="bg-black/20 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold block">Current Active Anchor</span>
                <span className={`text-[11px] font-bold ${couplingType.color} block`}>
                  {activeBaseline} Hz // {耦合Label(resonanceFreq)}
                </span>
                <p className="text-[9px] text-white/60 leading-relaxed font-sans mt-0.5">
                  The system resides within the {couplingType.title}. {couplingType.desc}
                </p>
              </div>
            </div>

            {/* Waves dynamic oscilloscope simulation */}
            <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-1">
                  <Waves className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                  Oscilloscope Superposition
                </span>
                <span className="text-[8px] font-mono text-cyan-400">composite(Φ)</span>
              </div>
              <div className="bg-black/40 h-12 rounded-lg border border-white/5 overflow-hidden flex items-center relative">
                <svg className="w-full h-full pointer-events-none opacity-80" viewBox="0 0 280 48">
                  <path
                    d={generateOscilloscopePath()}
                    fill="none"
                    stroke={resonanceFreq === 432 ? "#10b981" : resonanceFreq === 963 ? "#ff4e00" : "#22d3ee"}
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                  />
                  {/* Baseline center dotted guide */}
                  <line x1="0" y1="24" x2="280" y2="24" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,4" />
                </svg>
              </div>
              <div className="flex justify-between text-[7px] font-mono text-white/30 uppercase mt-1">
                <span>Phase Shift: {(delta * 0.12).toFixed(2)} rad</span>
                <span>Coherent Coupling</span>
              </div>
            </div>

          </div>

          {/* Interactive slider inside the monitor */}
          <div className="space-y-1 bg-black/10 p-3 rounded-xl border border-white/5">
            <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase font-black">
              <span>Manual Baseline Sweep</span>
              <span className="text-white/60">100Hz — 1000Hz Scale</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="100"
                max="1000"
                step="1"
                value={resonanceFreq}
                onChange={(e) => setResonanceFreq(parseInt(e.target.value))}
                className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff4e00] hover:accent-amber-500 transition-all"
              />
              <span className="font-mono text-[9px] text-[#ff4e00] font-bold w-12 text-right shrink-0">
                Δ={delta}Hz
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper to describe coupling regimes in real-time
function 耦合Label(freq: number) {
  if (freq === 432) return "PERFECT HARMONIC SYNC";
  if (freq === 963) return "PERFECT CROWN SYNC";
  const delta432 = Math.abs(freq - 432);
  const delta963 = Math.abs(freq - 963);
  if (delta432 < 20) return "Solfeggio Resonance Alpha";
  if (delta963 < 20) return "Solfeggio Resonance Omega";
  return `Phase Offset (${Math.min(delta432, delta963)}Hz)`;
}
