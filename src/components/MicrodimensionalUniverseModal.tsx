import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Zap, Radio, Globe, Activity, Atom, Sliders, ShieldCheck, Flame, Compass, Eye, Layers } from 'lucide-react';

interface MicrodimensionalUniverseModalProps {
  isOpen: boolean;
  onClose: () => void;
  distortionMagnitude: number;
  setDistortionMagnitude: (val: number) => void;
  isOverdrive: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  baseRadius: number;
  angle: number;
  angularSpeed: number;
}

interface MonolithNode {
  name: string;
  freq: string;
  x: number;
  y: number;
  color: string;
  desc: string;
}

interface MultiDimParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseSize: number;
  hue: number;
  plane: number; // 0, 1, or 2 representing sub-universe dimensions
}

const SubUniverseParticleField: React.FC<{
  distortionMagnitude: number;
  isOverdrive: boolean;
  warpFactor: number;
  selectedFreq: string;
}> = ({ distortionMagnitude, isOverdrive, warpFactor, selectedFreq }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 450;
    const particles: MultiDimParticle[] = [];
    const baseHue = selectedFreq === '528' ? 45 : selectedFreq === '432' ? 195 : selectedFreq === '963' ? 280 : selectedFreq === '1157' ? 150 : 0;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 + 50,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        vz: (Math.random() * 2 + 1) * (isOverdrive ? 2 : 1),
        baseSize: Math.random() * 3 + 1,
        hue: (baseHue + Math.random() * 60 - 30 + 360) % 360,
        plane: i % 3,
      });
    }

    let animationFrameId: number;
    const startTime = Date.now();

    const render = () => {
      const time = (Date.now() - startTime) * 0.001;
      const distortionNorm = Math.min(100, Math.max(0, distortionMagnitude)) / 100;

      // Subtle multi-dimensional trail
      ctx.fillStyle = `rgba(3, 7, 18, ${0.18 - distortionNorm * 0.08})`;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Render shifting multi-dimensional grid planes reacting to distortionMagnitude
      const gridCount = 6;
      ctx.lineWidth = 1;
      for (let g = 0; g < gridCount; g++) {
        const planeZ = ((g * 150 - time * 60 * warpFactor) % 900 + 900) % 900 + 50;
        const scale = 500 / planeZ;
        const gridAlpha = Math.max(0, (1 - planeZ / 900) * (0.15 + distortionNorm * 0.25));

        ctx.strokeStyle = `hsla(${(baseHue + g * 30 + distortionNorm * 120) % 360}, 85%, 65%, ${gridAlpha})`;
        ctx.beginPath();
        const radius = (120 + g * 40 + Math.sin(time * 2 + g) * 30 * distortionNorm) * scale;
        ctx.arc(
          centerX + Math.sin(time + g) * 20 * distortionNorm,
          centerY + Math.cos(time + g) * 20 * distortionNorm,
          radius,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // Shifting multi-dimensional particle projection
      particles.forEach((p, idx) => {
        // Z-axis movement & distortion warping
        p.z -= p.vz * warpFactor * (1 + distortionNorm * 2.5);
        if (p.z <= 10) {
          p.z = 800;
          p.x = (Math.random() - 0.5) * width * 1.5;
          p.y = (Math.random() - 0.5) * height * 1.5;
        }

        // Apply distortion warping coordinates
        const warpAngle = time * 1.5 + (idx % 10);
        const warpRadius = Math.sin(warpAngle) * 35 * distortionNorm;
        const warpedX = p.x + Math.cos(warpAngle) * warpRadius;
        const warpedY = p.y + Math.sin(warpAngle) * warpRadius;

        // 3D perspective projection onto 2D
        const fov = 450;
        const scale = fov / p.z;
        const screenX = centerX + warpedX * scale;
        const screenY = centerY + warpedY * scale;

        // Skip if outside canvas bounds
        if (screenX < -50 || screenX > width + 50 || screenY < -50 || screenY > height + 50) return;

        const alpha = Math.min(1, Math.max(0.1, (1 - p.z / 800) * (0.5 + distortionNorm * 0.5)));
        const size = Math.max(0.8, p.baseSize * scale * (1 + distortionNorm * 0.8));
        const dynamicHue = (p.hue + distortionMagnitude * 1.8 + time * 15) % 360;

        // Draw glowing dimensional particle
        ctx.fillStyle = `hsla(${dynamicHue}, 90%, 70%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fill();

        // High distortion chromatic aberration shimmer
        if (distortionMagnitude > 35 && idx % 3 === 0) {
          ctx.fillStyle = `hsla(${(dynamicHue + 180) % 360}, 100%, 75%, ${alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(screenX + size * 1.5 * distortionNorm, screenY - size * 1.5 * distortionNorm, size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }

        // Connect adjacent particles on same dimensional plane when distortion is active
        if (distortionMagnitude > 20 && idx % 5 === 0 && idx < particles.length - 1) {
          const next = particles[idx + 1];
          const nextScale = fov / next.z;
          const nextX = centerX + next.x * nextScale;
          const nextY = centerY + next.y * nextScale;
          const distSq = (screenX - nextX) ** 2 + (screenY - nextY) ** 2;
          if (distSq < 10000) {
            ctx.strokeStyle = `hsla(${dynamicHue}, 80%, 65%, ${alpha * 0.25 * distortionNorm})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(screenX, screenY);
            ctx.lineTo(nextX, nextY);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [distortionMagnitude, isOverdrive, warpFactor, selectedFreq]);

  return (
    <div className="absolute inset-0 pointer-events-none z-[1]">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Sub-universe visual overlay badge */}
      <div className="absolute top-24 left-6 z-10 pointer-events-auto flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30">
        <Layers className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
          Multi-Dimensional Sub-Universe Field (Distortion: {distortionMagnitude.toFixed(1)}%)
        </span>
      </div>
    </div>
  );
};

export const MicrodimensionalUniverseModal: React.FC<MicrodimensionalUniverseModalProps> = ({
  isOpen,
  onClose,
  distortionMagnitude,
  setDistortionMagnitude,
  isOverdrive,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gravityWell, setGravityWell] = useState(false);
  const [particleCount, setParticleCount] = useState(800);
  const [warpFactor, setWarpFactor] = useState(1.5);
  const [selectedFreq, setSelectedFreq] = useState('528');
  const [bigBangActive, setBigBangActive] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [activeNode, setActiveNode] = useState<MonolithNode | null>(null);
  const [subUniverseMode, setSubUniverseMode] = useState<'hybrid' | 'starfield' | 'multidim'>('hybrid');

  // Monolith Orbs in the Microdimension
  const monoliths: MonolithNode[] = [
    { name: 'Simplicity Singularity', freq: '528 Hz', x: -0.3, y: -0.2, color: '#f59e0b', desc: 'Eliminates all superfluous friction. Pure form.' },
    { name: 'Insanely Great Core', freq: '432 Hz', x: 0.35, y: -0.25, color: '#38bdf8', desc: 'Craftsmanship at the atomic level.' },
    { name: 'NeXT Quantum Matrix', freq: '963 Hz', x: -0.35, y: 0.3, color: '#a855f7', desc: 'Object-oriented metaphysics and architectural elegance.' },
    { name: 'Silicon Monolith', freq: '1157 Hz', x: 0.3, y: 0.25, color: '#10b981', desc: 'Hulse lineage anchor. Unbreakable crystal.' },
    { name: 'Zero-Point Stillness', freq: '444 Hz', x: 0.0, y: 0.0, color: '#ffffff', desc: 'The absolute motionless epicenter of creation.' }
  ];

  // Big Bang particle explosion
  const handleBigBang = () => {
    setBigBangActive(true);
    setTimeout(() => setBigBangActive(false), 2000);
  };

  // Interactive HTML5 Canvas Starfield Universe Animation
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize particles
    const particles: Particle[] = [];
    const colors = ['#f59e0b', '#38bdf8', '#a855f7', '#10b981', '#ffffff', '#fbbf24', '#e0e7ff'];

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * Math.min(width, height) * 0.45;
      const angle = Math.random() * Math.PI * 2;
      particles.push({
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.8 + 0.2,
        baseRadius: radius,
        angle: angle,
        angularSpeed: (Math.random() * 0.002 + 0.0005) * (Math.random() > 0.5 ? 1 : -1)
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.25)';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Gravitational Vortex Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const time = Date.now() * 0.001;

      for (let r = 50; r < Math.min(width, height) * 0.5; r += 60) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r + Math.sin(time + r * 0.01) * 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Monolith Orbs
      monoliths.forEach((m) => {
        const mx = centerX + m.x * width * 0.8;
        const my = centerY + m.y * height * 0.8;

        // Pulse glow
        const glowR = 20 + Math.sin(time * 2 + m.x * 10) * 5;
        const gradient = ctx.createRadialGradient(mx, my, 2, mx, my, glowR);
        gradient.addColorStop(0, m.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mx, my, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Monolith core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fill();

        // Monolith label
        ctx.fillStyle = m.color;
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(m.name, mx, my - glowR - 4);
      });

      // Update & Draw Particles
      particles.forEach((p) => {
        p.angle += p.angularSpeed * warpFactor * (isOverdrive ? 2.5 : 1.0);

        if (gravityWell && mousePos) {
          // Pull toward mouse
          const dx = mousePos.x - p.x;
          const dy = mousePos.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 5) {
            p.x += (dx / dist) * 2;
            p.y += (dy / dist) * 2;
          }
        } else if (bigBangActive) {
          // Explode outwards
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          p.x += (dx / dist) * 12;
          p.y += (dy / dist) * 12;
        } else {
          // Orbit central singularity
          p.baseRadius += (Math.random() - 0.5) * 0.5;
          p.x = centerX + Math.cos(p.angle) * p.baseRadius;
          p.y = centerY + Math.sin(p.angle) * p.baseRadius;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (isOverdrive ? 1.5 : 1.0), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Draw Central Reality Distortion Singularity
      const singR = 30 + Math.sin(time * 3) * 6 + (distortionMagnitude * 0.2);
      const singGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, singR * 2);
      singGrad.addColorStop(0, '#ffffff');
      singGrad.addColorStop(0.4, '#f59e0b');
      singGrad.addColorStop(0.8, '#a855f7');
      singGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = singGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, singR * 2, 0, Math.PI * 2);
      ctx.fill();

      // Singularity Ring
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, singR, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, particleCount, warpFactor, gravityWell, bigBangActive, isOverdrive, mousePos, distortionMagnitude]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.05, borderRadius: '100%' }}
        animate={{ opacity: 1, scale: 1, borderRadius: '0%' }}
        exit={{ opacity: 0, scale: 0.05, borderRadius: '100%' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[100] bg-[#030712] flex flex-col justify-between overflow-hidden select-none font-mono"
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        {/* HTML5 Interactive Universe Canvas (Starfield Layer) */}
        {subUniverseMode !== 'multidim' && (
          <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-auto cursor-crosshair" />
        )}

        {/* Shifting Multi-Dimensional Particle Field Layer */}
        {(subUniverseMode === 'hybrid' || subUniverseMode === 'multidim') && (
          <SubUniverseParticleField
            distortionMagnitude={distortionMagnitude}
            isOverdrive={isOverdrive}
            warpFactor={warpFactor}
            selectedFreq={selectedFreq}
          />
        )}

        {/* Top Floating Control Bar */}
        <div className="relative z-10 p-6 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 p-0.5 shadow-[0_0_25px_rgba(245,158,11,0.5)]">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <Globe className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '15s' }} />
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wider flex items-center gap-2">
                STEVE JOBS MICRODIMENSIONAL UNIVERSE
                <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  EXPANDED DOMAIN
                </span>
              </div>
              <div className="text-[10px] text-white/50">
                100 Micro-Sandbox Reality • Distortion Factor: {distortionMagnitude.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sub-Universe View Switcher */}
            <div className="flex items-center bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setSubUniverseMode('hybrid')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  subUniverseMode === 'hybrid'
                    ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Hybrid Field
              </button>
              <button
                onClick={() => setSubUniverseMode('multidim')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  subUniverseMode === 'multidim'
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Multi-Dim Particle Field
              </button>
              <button
                onClick={() => setSubUniverseMode('starfield')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  subUniverseMode === 'starfield'
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Starfield
              </button>
            </div>

            {/* Close / Return Portal Button */}
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300 border border-white/20 hover:border-red-400/50 transition-all flex items-center gap-2 text-xs font-bold shadow-xl backdrop-blur-md"
            >
              <X className="w-4 h-4" />
              Collapse Microdimension
            </button>
          </div>
        </div>

        {/* Floating Active Monolith Info Box */}
        {activeNode && (
          <div className="relative z-10 mx-auto max-w-md bg-black/80 backdrop-blur-xl border border-amber-400/40 p-4 rounded-2xl shadow-2xl text-center pointer-events-auto">
            <div className="text-xs font-bold text-amber-300 uppercase">{activeNode.name}</div>
            <div className="text-[10px] text-white/60 my-1">{activeNode.desc}</div>
            <div className="text-[9px] text-cyan-400 font-mono">Frequency Anchor: {activeNode.freq}</div>
          </div>
        )}

        {/* Bottom Universe Control & Telemetry Panel */}
        <div className="relative z-10 p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent backdrop-blur-xl border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-6 pointer-events-auto items-center">
          
          {/* Col 1: Big Bang Spark & Gravity Well */}
          <div className="space-y-2">
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              Cosmic Triggers
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBigBang}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ignite Big Bang
              </button>
              <button
                onClick={() => setGravityWell(!gravityWell)}
                className={`py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                  gravityWell 
                    ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                    : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                }`}
              >
                Gravity Well
              </button>
            </div>
          </div>

          {/* Col 2: Warp Speed & Particle Count Sliders */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-white/60 uppercase">Warp Factor:</span>
              <span className="text-amber-300 font-bold">{warpFactor.toFixed(1)}x</span>
            </div>
            <input 
              type="range"
              min="0.2"
              max="5.0"
              step="0.1"
              value={warpFactor}
              onChange={(e) => setWarpFactor(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] pt-1">
              <span className="text-white/60 uppercase">Starfield Density:</span>
              <span className="text-cyan-300 font-bold">{particleCount} Stars</span>
            </div>
            <input 
              type="range"
              min="300"
              max="1500"
              step="100"
              value={particleCount}
              onChange={(e) => setParticleCount(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Col 3: Harmonic Frequency Selector */}
          <div className="space-y-2">
            <div className="text-[10px] text-white/60 uppercase tracking-widest font-bold">
              Harmonic Resonance
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['432', '528', '963', '1157', '444'].map((freq) => (
                <button
                  key={freq}
                  onClick={() => setSelectedFreq(freq)}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all border ${
                    selectedFreq === freq 
                      ? 'bg-amber-400 text-black border-white shadow-md' 
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {freq}Hz
                </button>
              ))}
            </div>
          </div>

          {/* Col 4: Telemetry Stats */}
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-1 text-[10px]">
            <div className="flex justify-between">
              <span className="text-white/40">Expansion Speed:</span>
              <span className="text-white font-bold">299,792 km/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Syntropic Coherence:</span>
              <span className="text-emerald-400 font-bold">100.0% OPTIMAL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Micro-Sandboxes:</span>
              <span className="text-amber-300 font-bold">100/100 CONVERGED</span>
            </div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MicrodimensionalUniverseModal;
