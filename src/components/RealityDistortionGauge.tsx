import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Shield, Globe, Cpu, Sliders, Maximize2, Radio } from 'lucide-react';

interface RealityDistortionGaugeProps {
  distortionMagnitude: number;
  setDistortionMagnitude: (val: number) => void;
  isOverdrive: boolean;
  setIsOverdrive: (val: boolean) => void;
  outputVolume: number;
  inputVolume: number;
  onExpandUniverse: () => void;
}

export const RealityDistortionGauge: React.FC<RealityDistortionGaugeProps> = ({
  distortionMagnitude,
  setDistortionMagnitude,
  isOverdrive,
  setIsOverdrive,
  outputVolume,
  inputVolume,
  onExpandUniverse
}) => {
  const [pulse, setPulse] = useState(1);

  // Dynamic audio reactive pulse
  useEffect(() => {
    const audioLevel = (inputVolume + outputVolume) / 2;
    setPulse(1 + (audioLevel / 100) * 0.3);
  }, [inputVolume, outputVolume]);

  const effectiveMagnitude = isOverdrive ? Math.min(100, distortionMagnitude * 1.25) : distortionMagnitude;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="relative w-full max-w-2xl mx-auto my-4 bg-black/80 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 shadow-[0_0_50px_rgba(255,255,255,0.1)] overflow-hidden font-mono"
    >
      {/* Background Ambient Glow */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${isOverdrive ? '#ff4e00' : '#ffffff'} 0%, transparent 70%)`
        }}
      />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner">
            <Zap className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
              Steve Jobs Reality Distortion Field
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-white/10 text-white border border-white/20">
                {isOverdrive ? 'OVERDRIVE ACTIVE' : 'QUANTUM SYNC'}
              </span>
            </div>
            <div className="text-[10px] text-white/50">
              Bending perception • Simplicity Engine • Insanely Great
            </div>
          </div>
        </div>

        {/* Overdrive Toggle */}
        <button
          onClick={() => setIsOverdrive(!isOverdrive)}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
            isOverdrive 
              ? 'bg-amber-500 text-black border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105' 
              : 'bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          {isOverdrive ? '100% OVERDRIVE' : 'BOOST FIELD'}
        </button>
      </div>

      {/* Main Gauge & Microdimensional Bubble Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center relative z-10">
        
        {/* Left Column: Intensity Progress Bar & Magnitude Display */}
        <div className="md:col-span-2 space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-amber-400" />
              Distortion Magnitude
            </span>
            <span className="text-xl font-bold font-mono text-white tracking-tight flex items-center gap-1">
              {effectiveMagnitude.toFixed(1)}
              <span className="text-xs text-amber-400">%</span>
            </span>
          </div>

          {/* Animated Progress Bar */}
          <div className="relative h-4 w-full bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/15">
            <motion.div 
              className={`h-full rounded-full transition-all duration-300 ${
                isOverdrive 
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-white shadow-[0_0_15px_rgba(255,215,0,0.8)]' 
                  : 'bg-gradient-to-r from-slate-400 via-white to-amber-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]'
              }`}
              style={{ width: `${effectiveMagnitude}%` }}
              animate={{
                scaleY: [1, 1.08, 1],
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            
            {/* Ticks overlay */}
            <div className="absolute inset-0 flex justify-between px-2 pointer-events-none items-center">
              {[20, 40, 60, 80].map((tick) => (
                <div key={tick} className="w-0.5 h-2 bg-black/40" />
              ))}
            </div>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-3 pt-1">
            <input 
              type="range"
              min="10"
              max="100"
              step="0.5"
              value={distortionMagnitude}
              onChange={(e) => setDistortionMagnitude(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white hover:accent-amber-400"
            />
          </div>

          {/* Sub-Metrics Row */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div>
              <div className="text-[8px] text-white/40 uppercase">Curved Space</div>
              <div className="text-[11px] font-bold text-amber-300 font-mono">{(effectiveMagnitude * 0.1).toFixed(2)}x</div>
            </div>
            <div>
              <div className="text-[8px] text-white/40 uppercase">Aesthetic Focus</div>
              <div className="text-[11px] font-bold text-white font-mono">INSANELY GREAT</div>
            </div>
            <div>
              <div className="text-[8px] text-white/40 uppercase">Simplicity Index</div>
              <div className="text-[11px] font-bold text-cyan-300 font-mono">100% PURE</div>
            </div>
          </div>
        </div>

        {/* Right Column: Microdimensional Bubble Trigger Orb */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-white/10 to-black/60 p-4 rounded-2xl border border-white/15 hover:border-amber-400/50 transition-all group">
          <button
            onClick={onExpandUniverse}
            className="relative flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
            title="Click to expand Microdimensional Bubble into its own Universe"
          >
            {/* Pulsating Microdimensional Orb */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Outer Ripple Rings */}
              <motion.div 
                className="absolute inset-0 rounded-full border border-amber-400/40"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              />
              <motion.div 
                className="absolute inset-0 rounded-full border border-cyan-400/30"
                animate={{ scale: [1.2, 1.7, 1.2], opacity: [0.4, 0, 0.4] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
              />

              {/* Shimmering Core Bubble */}
              <motion.div 
                className="w-12 h-12 rounded-full bg-gradient-to-br from-white via-amber-200 to-purple-600 shadow-[0_0_35px_rgba(255,255,255,0.8)] border border-white/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{ transform: `scale(${pulse})` }}
                animate={{
                  rotate: [0, 360],
                  boxShadow: [
                    '0 0 20px rgba(255, 255, 255, 0.5)',
                    '0 0 40px rgba(245, 158, 11, 0.8)',
                    '0 0 20px rgba(255, 255, 255, 0.5)'
                  ]
                }}
                transition={{ rotate: { duration: 12, repeat: Infinity, ease: 'linear' }, boxShadow: { duration: 2, repeat: Infinity } }}
              >
                <Maximize2 className="w-5 h-5 text-black group-hover:rotate-90 transition-transform duration-500" />
              </motion.div>
            </div>

            <div className="text-center mt-1">
              <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider group-hover:text-white transition-colors flex items-center justify-center gap-1">
                <Globe className="w-3 h-3 text-amber-400" />
                Microdimensional Bubble
              </div>
              <div className="text-[9px] text-white/50 group-hover:text-amber-200 transition-colors">
                Touch to Expand Universe →
              </div>
            </div>
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default RealityDistortionGauge;
