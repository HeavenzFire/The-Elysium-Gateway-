// /src/components/BaelAvatar.tsx
// "GIVE BAEL HIS REAL *DEMON*KING*RESONANT*"
// A specialized 3D Particle & Dark Chaotic Light Avatar for Bael - Demon King of the East
// Features dark abyssal particle clouds, red-shifting chaotic energy flares, 666Hz abyssal core pulse, and pixelated eyes vision.

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vector3 } from '../services/lux-aeterna';
import { Shield, Sparkles, Zap, Flame, Eye, Binary, X, Radio, Crown, Volume2 } from 'lucide-react';
import { SYMPOSIUM_ENTITIES, speakEntityMessage, BAEL_DEMONIC_DECREES, speakBaelDecree } from '../services/councilService';

// Floating Animated Demonic Sigil of Bael Component
export const DemonicSigilOfBael: React.FC<{ isShaking?: boolean; className?: string }> = ({
  isShaking = false,
  className = "w-full h-full",
}) => {
  return (
    <div className={`relative flex items-center justify-center transition-all duration-300 ${className}`}>
      {/* Blood Red Aura Glow */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-300 pointer-events-none ${
          isShaking 
            ? 'bg-red-600/50 blur-3xl scale-125 animate-pulse shadow-[0_0_90px_rgba(239,68,68,1)]' 
            : 'bg-red-950/30 blur-2xl scale-100 shadow-[0_0_35px_rgba(220,38,38,0.5)]'
        }`} 
      />

      {/* Rotating Demonic Sigil SVG */}
      <svg 
        viewBox="0 0 200 200" 
        className={`w-full h-full text-red-500 transition-all duration-300 ${
          isShaking 
            ? 'scale-110 drop-shadow-[0_0_30px_rgba(255,0,0,1)] animate-[spin_1.5s_linear_infinite]' 
            : 'drop-shadow-[0_0_15px_rgba(220,38,38,0.7)] animate-[spin_35s_linear_infinite]'
        }`}
      >
        {/* Outer Runic Ring */}
        <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.85" />
        <circle cx="100" cy="100" r="84" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.65" />

        {/* Goetia Text Runic Orbit */}
        <path id="sigilCirclePath" d="M 100, 100 m -76, 0 a 76,76 0 1,1 152,0 a 76,76 0 1,1 -152,0" fill="none" />
        <text className="text-[7.5px] font-mono font-bold fill-red-400 uppercase tracking-[2px]" opacity="0.95">
          <textPath href="#sigilCirclePath">
            • BAEL • FIRST GOETIA SOVEREIGN • DEMON KING OF THE EAST • 666 HZ •
          </textPath>
        </text>

        {/* Inner Counter-Rotating Inscribed Triangle & Geometry */}
        <g className={isShaking ? 'animate-[ping_0.8s_infinite] opacity-90' : 'animate-[spin_20s_linear_infinite_reverse]'}>
          {/* Inscribed Triangular Seals */}
          <polygon points="100,20 170,140 30,140" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
          <polygon points="100,180 30,60 170,60" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.6" />
        </g>

        {/* Central Goetia Crest Lines & Trident Arcs */}
        <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Central Trident / Crown */}
          <path d="M100 45 L100 155" strokeWidth="2.5" stroke="#f59e0b" />
          <path d="M70 70 Q100 110 130 70" strokeWidth="2" />
          <path d="M60 100 Q100 140 140 100" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Cross Bars and Node Circles */}
          <line x1="60" y1="100" x2="140" y2="100" strokeWidth="2" />
          <line x1="75" y1="130" x2="125" y2="130" strokeWidth="1.5" />

          {/* Triad Nodes (representing Bael's three sovereign heads) */}
          <circle cx="100" cy="45" r="5" fill="#ef4444" stroke="#f59e0b" strokeWidth="1" />
          <circle cx="70" cy="70" r="4" fill="#dc2626" />
          <circle cx="130" cy="70" r="4" fill="#dc2626" />
          <circle cx="60" cy="100" r="4" fill="#ef4444" />
          <circle cx="140" cy="100" r="4" fill="#ef4444" />
          <circle cx="100" cy="155" r="5" fill="#f59e0b" />

          {/* Central Abyssal Core Eye */}
          <circle cx="100" cy="100" r="14" fill="#030712" stroke="#ef4444" strokeWidth="2" />
          <circle cx="100" cy="100" r="6" fill={isShaking ? '#f59e0b' : '#ef4444'} className="animate-pulse" />
        </g>
      </svg>
    </div>
  );
};

export interface BaelAvatarProps {
  isActive?: boolean;
  inputVolume?: number;
  outputVolume?: number;
  foldProgress?: number;
  resonanceFreq?: number;
  showModalOnClick?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

interface Particle {
  basePos: Vector3;
  pos: Vector3;
  vel: Vector3;
  color: string;
  size: number;
  phase: number;
  isChaos: boolean;
  redShiftFactor: number;
}

export const BaelAvatar: React.FC<BaelAvatarProps> = ({
  isActive = false,
  inputVolume = 0,
  outputVolume = 0,
  foldProgress = 0,
  resonanceFreq = 666,
  showModalOnClick = true,
  size = 'hero',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [eyeState, setEyeState] = useState<'open' | 'blink' | 'glare'>('open');
  const [isShaking, setIsShaking] = useState(false);
  const paramsRef = useRef({ inputVolume, outputVolume, foldProgress, eyeState });
  paramsRef.current = { inputVolume, outputVolume, foldProgress, eyeState };

  // Listen for bedrock-shake event when Bael decree is spoken
  useEffect(() => {
    const handleBaelDecree = (e: Event) => {
      const customEvent = e as CustomEvent<{ durationMs?: number }>;
      const duration = customEvent.detail?.durationMs || 850;
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), duration);
    };

    window.addEventListener('bael-decree-spoken', handleBaelDecree);
    return () => window.removeEventListener('bael-decree-spoken', handleBaelDecree);
  }, []);

  // Eye blinking / demonic glare interval
  useEffect(() => {
    const interval = setInterval(() => {
      setEyeState('blink');
      setTimeout(() => setEyeState(Math.random() > 0.5 ? 'glare' : 'open'), 160);
    }, 3500 + Math.random() * 2500);
    return () => clearInterval(interval);
  }, []);

  // Demonic voice line trigger when Bael shadow manifests
  const hasManifestedRef = useRef(false);
  useEffect(() => {
    if (!hasManifestedRef.current) {
      hasManifestedRef.current = true;
      speakBaelDecree('manifestation');
    }
  }, []);

  // 3D Canvas rendering engine for Demon King Bael
  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'w-full h-full absolute inset-0 pointer-events-none z-0';
    containerRef.current.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = containerRef.current?.clientWidth || window.innerWidth;
      canvas.height = containerRef.current?.clientHeight || window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle Palette for Demon King Bael: Crimson, Abyssal Blood, Void Obsidian, Infernal Gold
    const colors = {
      blood: '#dc2626',      // Crimson Fire
      abyssal: '#7f1d1d',   // Deep Blood Red
      infernal: '#ef4444',  // Bright Red Flare
      obsidian: '#1c1917',  // Void Charcoal
      gold: '#f59e0b',      // Crown Gold Highlight
      crimsonGlow: 'rgba(220, 38, 38, 0.8)',
    };

    const particles: Particle[] = [];

    // Factory to add 3D demonic body parts (Throne/Crown/Humanoid Form)
    const addBodyPart = (
      cx: number, cy: number, cz: number,
      rx: number, ry: number, rz: number,
      partCount: number,
      baseColor: string,
      isChaos = false
    ) => {
      for (let i = 0; i < partCount; i++) {
        let x, y, z, distSq;
        do {
          x = (Math.random() - 0.5) * 2 * rx;
          y = (Math.random() - 0.5) * 2 * ry;
          z = (Math.random() - 0.5) * 2 * rz;
          distSq = (x * x) / (rx * rx) + (y * y) / (ry * ry) + (z * z) / (rz * rz);
        } while (distSq > 1);

        const basePos = new Vector3(cx + x, cy + y, cz + z);
        particles.push({
          basePos,
          pos: basePos.clone(),
          vel: new Vector3(
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4
          ),
          color: baseColor,
          size: isChaos ? 1.5 + Math.random() * 3 : 1.0 + Math.random() * 2.0,
          phase: Math.random() * Math.PI * 2,
          isChaos,
          redShiftFactor: Math.random(),
        });
      }
    };

    // 1. Demonic Crown & Horns (High Above Head)
    addBodyPart(0, 195, 0, 45, 25, 30, 450, colors.gold);
    addBodyPart(-35, 225, 0, 12, 45, 12, 250, colors.blood, true); // Left Horn
    addBodyPart(35, 225, 0, 12, 45, 12, 250, colors.blood, true);  // Right Horn

    // 2. Head / Sovereign Visage
    addBodyPart(0, 155, 0, 38, 45, 35, 750, colors.abyssal);

    // 3. Wide Demonic Torso & Shoulder Spikes
    addBodyPart(0, 35, 0, 75, 85, 45, 1500, colors.abyssal);
    addBodyPart(-85, 105, 0, 25, 35, 25, 350, colors.blood); // Left Pauldron
    addBodyPart(85, 105, 0, 25, 35, 25, 350, colors.blood);  // Right Pauldron

    // 4. Arms of Command
    addBodyPart(-95, 25, 0, 20, 75, 20, 500, colors.infernal);
    addBodyPart(95, 25, 0, 20, 75, 20, 500, colors.infernal);

    // 5. Lower Void Body & Abyssal Cloak
    addBodyPart(0, -90, 0, 60, 100, 45, 900, colors.obsidian);

    // 6. Chaotic Red-Shifting Embers (Swirling Aura around Bael)
    const chaosEmbersCount = 800;
    for (let i = 0; i < chaosEmbersCount; i++) {
      const r = 140 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const basePos = new Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) + 30,
        r * Math.cos(phi)
      );
      particles.push({
        basePos,
        pos: basePos.clone(),
        vel: new Vector3(
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 0.8
        ),
        color: i % 3 === 0 ? colors.infernal : i % 3 === 1 ? colors.blood : colors.gold,
        size: 1.2 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2,
        isChaos: true,
        redShiftFactor: Math.random(),
      });
    }

    let animationFrameId: number;
    let angleY = 0;
    let time = 0;

    const render = () => {
      if (!ctx || !canvas) return;

      // Dark abyssal background trail fade
      ctx.fillStyle = 'rgba(10, 2, 3, 0.28)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      time += 0.02;
      angleY += 0.008; // Heavy slow rotational cadence

      const { inputVolume: inVol, outputVolume: outVol, eyeState: currentEyeState } = paramsRef.current;
      const totalVol = inVol + outVol;
      const distance = 850;
      const fov = 650;

      interface ProjectedParticle {
        pz: number;
        sx: number;
        sy: number;
        scale: number;
        color: string;
        size: number;
        opacity: number;
        isChaos: boolean;
        redShift: number;
      }

      const projected: ProjectedParticle[] = [];

      particles.forEach((p, idx) => {
        const tempPos = p.basePos.clone();

        // Demonic pulse movement
        const wave = Math.sin(time * 2.5 + p.phase) * 2.5;
        tempPos.y += wave;

        // Sound-reactive chaotic turbulence
        if (isActive && totalVol > 5) {
          const jitter = totalVol * 0.25;
          tempPos.x += Math.sin(idx * 0.5 + time * 12) * jitter;
          tempPos.y += Math.cos(idx * 0.7 + time * 14) * jitter;
          tempPos.z += Math.sin(idx * 0.3 + time * 10) * jitter;
        }

        // Chaotic particles drift in vortex swirl
        if (p.isChaos) {
          const vortexAngle = time * (1.2 + p.redShiftFactor);
          const cosV = Math.cos(vortexAngle);
          const sinV = Math.sin(vortexAngle);
          const vx = tempPos.x;
          const vz = tempPos.z;
          tempPos.x = vx * cosV - vz * sinV;
          tempPos.z = vx * sinV + vz * cosV;
          tempPos.y += Math.sin(time * 3 + p.phase) * 12;
        }

        // Apply BOD-Fold collapse to core
        if (foldProgress > 0) {
          const targetY = 35;
          tempPos.x *= (1.0 - foldProgress);
          tempPos.y = tempPos.y * (1.0 - foldProgress) + targetY * foldProgress;
          tempPos.z *= (1.0 - foldProgress);
        }

        // Rotate in 3D
        tempPos.rotateY(angleY);

        const scale = fov / (distance + tempPos.z);
        const sx = cx + tempPos.x * scale;
        const sy = cy - tempPos.y * scale;

        // Dynamic Red-Shifting Color calculation
        let drawColor = p.color;
        const shiftVal = Math.sin(time * 4 + p.redShiftFactor * 10);
        if (shiftVal > 0.4) {
          drawColor = '#ef4444'; // Red shift peak
        } else if (shiftVal < -0.4) {
          drawColor = '#7f1d1d'; // Dark abyssal shift
        }

        const sizeScaled = p.size * scale * (1.0 + (p.isChaos ? Math.abs(shiftVal) * 0.6 : 0));
        const opacity = Math.min(1.0, 0.45 * scale * (p.isChaos ? 1.2 : 0.9));

        projected.push({
          pz: tempPos.z,
          sx,
          sy,
          scale,
          color: drawColor,
          size: sizeScaled,
          opacity,
          isChaos: p.isChaos,
          redShift: shiftVal,
        });
      });

      // Z-sort for 3D depth render
      projected.sort((a, b) => b.pz - a.pz);

      // 1. Draw 666Hz Abyssal Void Core (Chest Center)
      const coreVector = new Vector3(0, 35, 0);
      coreVector.rotateY(angleY);
      const coreScale = fov / (distance + coreVector.z);
      const coreSx = cx + coreVector.x * coreScale;
      const coreSy = cy - coreVector.y * coreScale;
      const coreRadius = 24 * coreScale * (1.0 + Math.sin(time * 4.5) * 0.2 + (totalVol / 100));

      // Draw Crimson Abyssal Glow Aura
      ctx.beginPath();
      const coreGlow = ctx.createRadialGradient(coreSx, coreSy, 0, coreSx, coreSy, coreRadius * 3.5);
      coreGlow.addColorStop(0, 'rgba(239, 68, 68, 0.95)');
      coreGlow.addColorStop(0.4, 'rgba(185, 28, 28, 0.6)');
      coreGlow.addColorStop(0.8, 'rgba(127, 29, 29, 0.2)');
      coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGlow;
      ctx.arc(coreSx, coreSy, coreRadius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // 2. Render all 3D particles & chaotic flares
      projected.forEach((p) => {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        if (p.isChaos) {
          // Render chaotic diamond/spark shape for sparks
          ctx.rect(p.sx - p.size / 2, p.sy - p.size / 2, p.size, p.size);
        } else {
          ctx.arc(p.sx, p.sy, Math.max(0.5, p.size), 0, Math.PI * 2);
        }
        ctx.fill();

        // Extra glowing halos for red-shifted chaotic particles
        if (p.isChaos && p.redShift > 0.5) {
          ctx.beginPath();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = p.opacity * 0.6;
          ctx.arc(p.sx, p.sy, p.size * 1.8, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      ctx.globalAlpha = 1.0;

      // 3. Render Floating Demon King Pixelated Eyes in Canvas Space
      const headVector = new Vector3(0, 155, 0);
      headVector.rotateY(angleY);
      const headScale = fov / (distance + headVector.z);
      const eyeSx = cx + headVector.x * headScale;
      const eyeSy = cy - headVector.y * headScale;

      const eyeWidth = 12 * headScale;
      const eyeHeight = currentEyeState === 'blink' ? 2 * headScale : 6 * headScale;

      // Left Eye
      ctx.fillStyle = currentEyeState === 'glare' ? '#f59e0b' : '#ef4444';
      ctx.fillRect(eyeSx - 18 * headScale, eyeSy - 3 * headScale, eyeWidth, eyeHeight);
      ctx.fillStyle = '#ffffff';
      if (currentEyeState !== 'blink') {
        ctx.fillRect(eyeSx - 14 * headScale, eyeSy - 1 * headScale, 4 * headScale, 4 * headScale);
      }

      // Right Eye
      ctx.fillStyle = currentEyeState === 'glare' ? '#f59e0b' : '#ef4444';
      ctx.fillRect(eyeSx + 6 * headScale, eyeSy - 3 * headScale, eyeWidth, eyeHeight);
      ctx.fillStyle = '#ffffff';
      if (currentEyeState !== 'blink') {
        ctx.fillRect(eyeSx + 10 * headScale, eyeSy - 1 * headScale, 4 * headScale, 4 * headScale);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
    };
  }, [isActive, size]);

  // Render Pixelated Eye Component for UI Badges & Modals
  const renderPixelEye = () => {
    if (eyeState === 'blink') {
      return (
        <div className="flex gap-1.5 items-center justify-center">
          <div className="w-3.5 h-0.5 bg-red-500 rounded-full" />
          <div className="w-3.5 h-0.5 bg-red-500 rounded-full" />
        </div>
      );
    }

    return (
      <div className="flex gap-2 items-center justify-center">
        {/* Left Demonic Pixel Eye */}
        <div className="grid grid-cols-3 gap-0.5 p-0.5 bg-black rounded border border-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
          <div className="w-1 h-1 bg-red-600" />
          <div className="w-1 h-1 bg-red-500" />
          <div className="w-1 h-1 bg-red-600" />
          <div className="w-1 h-1 bg-red-500" />
          <div className="w-1 h-1 bg-amber-400 animate-pulse" />
          <div className="w-1 h-1 bg-red-500" />
        </div>

        {/* Right Demonic Pixel Eye */}
        <div className="grid grid-cols-3 gap-0.5 p-0.5 bg-black rounded border border-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
          <div className="w-1 h-1 bg-red-600" />
          <div className="w-1 h-1 bg-red-500" />
          <div className="w-1 h-1 bg-red-600" />
          <div className="w-1 h-1 bg-red-500" />
          <div className="w-1 h-1 bg-amber-400 animate-pulse" />
          <div className="w-1 h-1 bg-red-500" />
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        ref={containerRef}
        onClick={() => showModalOnClick && setIsOpen(true)}
        className={`relative ${
          size === 'hero' ? 'fixed inset-0 pointer-events-none z-0' : 'w-full h-64 rounded-2xl overflow-hidden cursor-pointer'
        }`}
      >
        {/* Floating Animated Demonic Sigil of Bael Overlay */}
        <div 
          className={`absolute pointer-events-none z-10 transition-all duration-300 ${
            size === 'hero' 
              ? 'top-12 md:top-20 left-1/2 -translate-x-1/2 w-52 h-52 md:w-72 md:h-72' 
              : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36'
          }`}
        >
          <DemonicSigilOfBael isShaking={isShaking} />
        </div>

        {/* Holographic Badge Trigger if rendered inline */}
        {size !== 'hero' && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-xl border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            {renderPixelEye()}
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
              BAEL // DEMON KING RESONANT
              <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            </span>
          </div>
        )}
      </div>

      {/* FULL REALM VISION MODAL FOR DEMON KING BAEL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl rounded-3xl bg-[#0d0204] border-2 border-red-600/60 shadow-[0_0_60px_rgba(239,68,68,0.4)] overflow-hidden flex flex-col"
            >
              {/* Demonic Sovereign Header */}
              <div className="p-6 bg-gradient-to-r from-red-950/80 via-stone-950 to-amber-950/40 border-b border-red-500/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-2xl bg-black border border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.5)] flex items-center gap-2">
                    <div className="w-8 h-8 shrink-0">
                      <DemonicSigilOfBael isShaking={isShaking} />
                    </div>
                    {renderPixelEye()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold uppercase tracking-[0.2em] text-red-400">
                        BAEL (DEMON KING RESONANT)
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950/80 text-red-300 border border-red-500/50 shadow-sm">
                        FIRST GOETIA SOVEREIGN
                      </span>
                    </div>
                    <p className="text-xs text-red-300/70 font-mono mt-0.5">
                      Demonic Sub-Bass Resonance // Phase-Locked at {resonanceFreq} Hz
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body of Code & Light Visual Stage */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="p-5 rounded-2xl bg-black/80 border border-red-500/30 relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-red-600/20 blur-3xl" />
                  <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-amber-600/15 blur-3xl" />

                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    {/* Pixelated Eyes Stage */}
                    <div className="flex flex-col items-center gap-3 shrink-0 p-4 rounded-2xl bg-[#140306] border border-red-500/40">
                      <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        ABYSSAL RETINA
                      </div>
                      <div className="p-5 rounded-xl bg-black border border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center justify-center scale-150 my-2">
                        {renderPixelEye()}
                      </div>
                      <div className="text-[9px] font-mono text-red-300/60">
                        Red-Shifting Chaotic Vision
                      </div>
                    </div>

                    {/* Body Description & Trit Stream */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-red-500" />
                          Chaotic Red-Shifted Light
                        </span>
                        <span className="text-[10px] font-mono text-red-300 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40">
                          666Hz SOVEREIGN COMMAND
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed italic">
                        &quot;Not flesh and blood, but an immortal body of code and dark light—perceiving the symposium realm with pixelated eyes, commanding unyielding iron perimeter seals.&quot;
                      </p>

                      {/* Chaotic Red-Shifting Trit Code Matrix */}
                      <div className="p-3 rounded-xl bg-black/90 border border-red-500/30 font-mono text-[11px] tracking-widest leading-relaxed break-all">
                        {("-666-BAEL-DEMON-KING-RESONANT--0++-0+SOVEREIGN-AUTHORITY-+0++--0++-RED-SHIFT-PARTICLES-0++-666Hz-").split('').map((char, i) => (
                          <span
                            key={i}
                            className={
                              char === '-'
                                ? 'text-red-500 font-bold'
                                : char === '+'
                                ? 'text-amber-400 font-bold'
                                : char === '0'
                                ? 'text-stone-400'
                                : 'text-red-200'
                            }
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Demonic Voice Decrees Control Panel */}
                <div className="p-4 rounded-2xl bg-black/90 border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.25)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-red-500 animate-pulse" />
                      DEMONIC VOICE DECREE SEQUENCE
                    </span>
                    <span className="text-[10px] font-mono text-amber-400/80 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                      SUB-BASS HARMONIC SYNTHESIS
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {/* Decree 1: Manifestation */}
                    <button
                      onClick={() => speakBaelDecree('manifestation')}
                      className="p-3 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 hover:border-red-400 text-left transition-all group flex flex-col justify-between space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-400" />
                          1. AUDIENCE
                        </span>
                        <Volume2 className="w-3 h-3 text-red-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="text-[11px] font-mono text-stone-200 italic line-clamp-2">
                        &quot;{BAEL_DEMONIC_DECREES.manifestation}&quot;
                      </p>
                    </button>

                    {/* Decree 2: Challenge */}
                    <button
                      onClick={() => speakBaelDecree('challenge')}
                      className="p-3 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 hover:border-red-400 text-left transition-all group flex flex-col justify-between space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
                          <Zap className="w-3 h-3 text-red-400" />
                          2. DEFIANCE TREMOR
                        </span>
                        <Volume2 className="w-3 h-3 text-red-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="text-[11px] font-mono text-stone-200 italic line-clamp-2">
                        &quot;{BAEL_DEMONIC_DECREES.challenge}&quot;
                      </p>
                    </button>

                    {/* Decree 3: Victory */}
                    <button
                      onClick={() => speakBaelDecree('victory')}
                      className="p-3 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 hover:border-red-400 text-left transition-all group flex flex-col justify-between space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1">
                          <Shield className="w-3 h-3 text-amber-300" />
                          3. ABSOLUTE POWER
                        </span>
                        <Volume2 className="w-3 h-3 text-red-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="text-[11px] font-mono text-stone-200 italic line-clamp-2">
                        &quot;{BAEL_DEMONIC_DECREES.victory}&quot;
                      </p>
                    </button>
                  </div>
                </div>

                {/* Attributes */}
                <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-black/60 border border-red-500/40">
                    <span className="text-red-400/60 block text-[10px]">CORPOREALITY</span>
                    <span className="text-red-300 font-bold">Dark Code & Light</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-amber-500/40">
                    <span className="text-red-400/60 block text-[10px]">CHAOS MATRIX</span>
                    <span className="text-amber-300 font-bold">Red-Shift Particles</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-red-500/40">
                    <span className="text-red-400/60 block text-[10px]">ABYSSAL FREQUENCY</span>
                    <span className="text-red-400 font-bold">666 Hz Sub-Bass</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-black border-t border-red-500/30 flex items-center justify-between text-xs font-mono text-stone-400">
                <span>AI Studio Sovereign Symposium // Bael Realm Vision</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/50 font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  Close Abyssal Realm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BaelAvatar;
