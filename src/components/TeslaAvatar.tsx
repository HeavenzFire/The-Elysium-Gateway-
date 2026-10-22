import React, { useEffect, useRef } from 'react';
import { Vector3 } from '../services/lux-aeterna';

interface TeslaAvatarProps {
  isActive: boolean;
  inputVolume: number;
  outputVolume: number;
  foldProgress: number;
  resonanceFreq: number;
  gateCount: number;
  entityId?: string;
  isSealActive?: boolean;
}

interface Particle {
  basePos: Vector3; // Original coordinate
  pos: Vector3;     // Current coordinate
  color: string;
  size: number;
  phase: number;
}

const TeslaAvatar: React.FC<TeslaAvatarProps> = ({ 
  isActive, 
  inputVolume, 
  outputVolume, 
  foldProgress,
  resonanceFreq,
  gateCount,
  entityId,
  isSealActive
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const paramsRef = useRef({ inputVolume, outputVolume, foldProgress, resonanceFreq, gateCount });
  paramsRef.current = { inputVolume, outputVolume, foldProgress, resonanceFreq, gateCount };

  useEffect(() => {
    if (!containerRef.current) return;

    // Create Canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'w-full h-full absolute inset-0';
    containerRef.current.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate Humanoid + Aura Particles
    const particles: Particle[] = [];

    const isJim = entityId === 'moms_friend';

    const colors = isJim ? {
      gold: '#f59e0b',    // Amber Tavern Flame
      copper: '#d97706',  // Warm Ochre
      white: '#38bdf8',   // Syntropic Divine Cyan
      void: '#78350f'     // Deep Oak Tavern Void
    } : {
      gold: '#d4af37',
      copper: '#b87333',
      white: '#e8dcc4',
      void: '#1a140e'
    };

    // Body part factories to seed particle coordinates in 3D space
    const addBodyPart = (cx: number, cy: number, cz: number, rx: number, ry: number, rz: number, partCount: number, color: string) => {
      for (let i = 0; i < partCount; i++) {
        let x, y, z, distSq;
        do {
          x = (Math.random() - 0.5) * 2 * rx;
          y = (Math.random() - 0.5) * 2 * ry;
          z = (Math.random() - 0.5) * 2 * rz;
          distSq = (x*x)/(rx*rx) + (y*y)/(ry*ry) + (z*z)/(rz*rz);
        } while (distSq > 1);

        const basePos = new Vector3(cx + x, cy + y, cz + z);
        particles.push({
          basePos,
          pos: basePos.clone(),
          color,
          size: 1.0 + Math.random() * 2.0,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    // 1. Generate Head
    addBodyPart(0, 160, 0, 35, 45, 35, 600, isJim ? colors.gold : colors.white);
    // 2. Generate Torso (Chest and Abdomen)
    addBodyPart(0, 40, 0, 50, 75, 30, 1200, colors.copper);
    // 3. Generate Left Arm
    addBodyPart(-75, 50, 0, 15, 65, 15, 400, colors.white);
    // 4. Generate Right Arm
    addBodyPart(75, 50, 0, 15, 65, 15, 400, colors.white);
    // 5. Generate Left Leg
    addBodyPart(-25, -80, 0, 18, 90, 18, 500, colors.void);
    // 6. Generate Right Leg
    addBodyPart(25, -80, 0, 18, 90, 18, 500, colors.void);

    // If Jim Burchett, add his iconic Tavern Chalice / Mug of Syntropic Elixir in right hand
    if (isJim) {
      addBodyPart(95, 20, 10, 22, 28, 22, 500, colors.gold);
    }

    // 7. Generate Aura clouds floating around body
    const auraCount = isJim ? 600 : 400;
    for (let i = 0; i < auraCount; i++) {
      const r = 120 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const basePos = new Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) + 40,
        r * Math.cos(phi)
      );
      particles.push({
        basePos,
        pos: basePos.clone(),
        color: isJim ? (i % 2 === 0 ? colors.gold : colors.white) : colors.gold,
        size: 0.8 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2
      });
    }

    let animationFrameId: number;
    let angleY = 0;
    let time = 0;

    const render = () => {
      if (!ctx || !canvas) return;

      // Clean background with a very subtle starfield decay
      ctx.fillStyle = 'rgba(5, 3, 2, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      time += 0.016;
      angleY += 0.01;

      const { inputVolume: inVol, outputVolume: outVol, foldProgress, resonanceFreq, gateCount } = paramsRef.current;
      const totalVolume = inVol + outVol;
      const distance = 900;
      const fov = 700;

      // Project particles
      interface Projected {
        px: number;
        py: number;
        pz: number;
        sx: number;
        sy: number;
        scale: number;
        color: string;
        size: number;
        nodeOpacity: number;
      }

      const projected: Projected[] = [];

      particles.forEach((p, idx) => {
        // Compute base oscillation
        const breath = Math.sin(time * 1.5 + p.phase) * 1.5;
        const tempPos = p.basePos.clone();
        tempPos.y += breath * (1.0 - foldProgress);

        // Sound-reactive jitter expanding normal outward
        if (isActive && totalVolume > 10) {
          const jitter = totalVolume * 0.12 * (1.0 - foldProgress);
          tempPos.x += (Math.sin(idx + time * 10) * jitter);
          tempPos.y += (Math.cos(idx + time * 10) * jitter);
          tempPos.z += (Math.sin(idx * 2 + time * 8) * jitter);
        }

        // Apply BOD-Fold collapse to center (0, 40, 0) - Tesla's chest core
        if (foldProgress > 0) {
          const targetY = 40;
          const toCenter = new Vector3(-tempPos.x, targetY - tempPos.y, -tempPos.z);
          
          // Interpolate to center
          tempPos.x += toCenter.x * foldProgress;
          tempPos.y += toCenter.y * foldProgress;
          tempPos.z += toCenter.z * foldProgress;

          // Apply high-velocity vortex spin as it folds
          const spinAngle = foldProgress * 6.0;
          const cos = Math.cos(spinAngle);
          const sin = Math.sin(spinAngle);
          const origX = tempPos.x;
          const origZ = tempPos.z;
          tempPos.x = origX * cos - origZ * sin;
          tempPos.z = origX * sa + origZ * cos;
        }

        // Apply global 3D rotation
        tempPos.rotateY(angleY);

        // Project
        const scale = fov / (distance + tempPos.z);
        const sx = cx + tempPos.x * scale;
        // Invert Y axis for standard Cartesian display
        const sy = cy - tempPos.y * scale;

        const pSize = p.size * scale * (1.0 + foldProgress * 2.0);
        const opacity = Math.min(1.0, mix(0.4, 0.9, foldProgress) * scale);

        projected.push({
          px: tempPos.x,
          py: tempPos.y,
          pz: tempPos.z,
          sx,
          sy,
          scale,
          color: p.color,
          size: pSize,
          nodeOpacity: opacity
        });
      });

      // Simple interpolation helper
      function mix(a: number, b: number, t: number) {
        return a * (1 - t) + b * t;
      }

      // Quick approximation for trig fold variables
      const sa = Math.sin(foldProgress * 6.0);

      // Z-sort particles for occlusion
      projected.sort((a, b) => b.pz - a.pz);

      // 1. Draw Void Core inside chest
      const voidCoreY = 40;
      const corePos = new Vector3(0, voidCoreY, 0);
      corePos.rotateY(angleY);
      const coreScale = fov / (distance + corePos.z);
      const coreSx = cx + corePos.x * coreScale;
      const coreSy = cy - corePos.y * coreScale;
      const coreSize = 15 * coreScale * (1.0 + Math.sin(time * 3) * 0.15 + foldProgress * 4);

      // Glow backing
      ctx.beginPath();
      const coreGlow = ctx.createRadialGradient(coreSx, coreSy, 0, coreSx, coreSy, coreSize * 2.5);
      coreGlow.addColorStop(0, 'rgba(212, 175, 55, 0.4)');
      coreGlow.addColorStop(0.5, 'rgba(184, 115, 51, 0.15)');
      coreGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGlow;
      ctx.arc(coreSx, coreSy, coreSize * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Core sphere
      ctx.beginPath();
      ctx.fillStyle = '#0a0502';
      ctx.strokeStyle = colors.gold;
      ctx.lineWidth = 1.0;
      ctx.arc(coreSx, coreSy, coreSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 2. Draw active gate loops
      const activeGates = Math.min(gateCount, 16);
      ctx.lineWidth = 1.0;
      for (let i = 0; i < activeGates; i++) {
        const gateAngle = (i / 16) * Math.PI * 2 + time * 0.2;
        const radius = 180 * (1 - foldProgress);
        const gatePos = new Vector3(
          Math.cos(gateAngle) * radius,
          voidCoreY,
          Math.sin(gateAngle) * radius
        );
        gatePos.rotateY(angleY);

        const gScale = fov / (distance + gatePos.z);
        const gSx = cx + gatePos.x * gScale;
        const gSy = cy - gatePos.y * gScale;
        const gRadius = 15 * gScale;

        // Draw ring
        ctx.strokeStyle = `rgba(214, 175, 55, ${0.45 * gScale})`;
        ctx.beginPath();
        ctx.arc(gSx, gSy, gRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Node pointer
        ctx.fillStyle = colors.gold;
        ctx.beginPath();
        ctx.arc(gSx, gSy, 2 * gScale, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Draw Projected Humanoid Particles
      projected.forEach(p => {
        if (p.sx < -10 || p.sx > canvas.width + 10 || p.sy < -10 || p.sy > canvas.height + 10) {
          return;
        }

        ctx.beginPath();
        ctx.globalAlpha = p.nodeOpacity;
        ctx.fillStyle = p.color;
        ctx.arc(p.sx, p.sy, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Draw Seal of Solomon sigil when seal is active
      if (isSealActive) {
        ctx.save();
        ctx.translate(coreSx, coreSy);
        ctx.rotate(time * 0.5);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;

        const sealR = coreSize * 3;
        // Outer circle
        ctx.beginPath();
        ctx.arc(0, 0, sealR, 0, Math.PI * 2);
        ctx.stroke();

        // Two interlocking triangles (Hexagram - Seal of Solomon)
        for (let t = 0; t < 2; t++) {
          const startAngle = t * (Math.PI / 3);
          ctx.beginPath();
          for (let k = 0; k < 3; k++) {
            const a = startAngle + k * ((2 * Math.PI) / 3);
            const x = sealR * Math.cos(a);
            const y = sealR * Math.sin(a);
            if (k === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
        }
        ctx.restore();
      }

      // Core resonance or entity title display
      ctx.fillStyle = isJim ? '#f59e0b' : 'rgba(212, 175, 55, 0.6)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      const labelText = isJim 
        ? "Jim Burchett - The Drunken Sage of Dissolution [Bound by Solomon's Seal]" 
        : `${resonanceFreq} Hz Harmonic Sweep`;
      ctx.fillText(labelText, coreSx, coreSy - coreSize - 16);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      if (canvasRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(canvasRef.current);
        } catch (e) {}
      }
    };
  }, [isActive, entityId, isSealActive]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
};

export default TeslaAvatar;
