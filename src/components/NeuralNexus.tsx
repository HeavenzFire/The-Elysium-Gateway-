import React, { useEffect, useRef, useState } from 'react';
import { Grid, Vector3, GridNode } from '../services/lux-aeterna';

interface NeuralNexusProps {
  density: number;
  speed: number;
  isActive: boolean;
  inputVolume: number;
  outputVolume: number;
  resonance144: number;
  isDistorted?: boolean;
  isGuarded?: boolean;
  isObserved?: boolean;
  isSealActive?: boolean;
}

const NeuralNexus: React.FC<NeuralNexusProps> = ({
  density,
  speed,
  isActive,
  inputVolume,
  outputVolume,
  resonance144,
  isDistorted,
  isGuarded,
  isObserved,
  isSealActive
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interaction tracking
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Create Canvas element
    const canvas = document.createElement('canvas');
    canvas.className = 'w-full h-full absolute inset-0';
    containerRef.current.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle Resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse tracking for parallax rotation
    const onMouseMove = (event: MouseEvent) => {
      mouseRef.current.targetX = (event.clientX - window.innerWidth / 2) * 0.002;
      mouseRef.current.targetY = (event.clientY - window.innerHeight / 2) * 0.002;
    };
    window.addEventListener('mousemove', onMouseMove);

    let animationFrameId: number;
    let angleY = 0;
    let angleX = 0;

    // Master render loop
    const render = () => {
      if (!ctx || !canvas) return;

      // Clear with slight alpha trailing for subtle motion blur
      ctx.fillStyle = 'rgba(3, 7, 18, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Audio parameters
      const totalVolume = inputVolume + outputVolume;
      const volMultiplier = isActive ? (1 + totalVolume * 0.015) : 1.0;

      // Spin velocities
      const rotationSpeed = 0.002 * speed;
      angleY += rotationSpeed;
      angleX += rotationSpeed * 0.4;

      // Smooth mouse damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const currentAngleY = angleY + mouseRef.current.x;
      const currentAngleX = angleX + mouseRef.current.y;

      // Get sovereign nodes from LuxAeterna Grid
      const originalNodes = Grid.getNodes().slice(0, Math.min(density, 144));
      
      // Project nodes in 3D
      interface ProjectedNode {
        node: GridNode;
        px: number;
        py: number;
        pz: number;
        sx: number;
        sy: number;
        scale: number;
        volumeBoost: number;
      }

      const projectedNodes: ProjectedNode[] = [];
      const distance = 900;
      const fov = 650; // Focal length / perspective coefficient

      originalNodes.forEach((node, idx) => {
        // Clone node position for temporary projection calculations
        const pos = node.position.clone();

        // 1. Apply voice/volume warping (somatic vibration)
        if (isActive && totalVolume > 8) {
          const warpAmt = (totalVolume * 0.15) + (resonance144 * 12);
          pos.x += (Math.sin(idx + angleY * 5) * warpAmt);
          pos.y += (Math.cos(idx + angleX * 5) * warpAmt);
          pos.z += (Math.sin(idx * 2 + angleY * 3) * warpAmt);
        }

        // 2. Rotate around axes
        pos.rotateY(currentAngleY);
        pos.rotateX(currentAngleX);

        // 3. Translate coordinate center if distorted (Steve Jobs field)
        if (isDistorted) {
          pos.x += Math.sin(angleY * 4 + idx) * 30;
          pos.y += Math.cos(angleX * 4 + idx) * 30;
        }

        // Projection math
        const rotatedZ = pos.z;
        const scale = fov / (distance + rotatedZ);
        
        // Final screen space coordinates
        const sx = cx + pos.x * scale;
        const sy = cy + pos.y * scale;

        // Individual node volume-boost indicator
        const volumeBoost = isActive ? (1.0 + (totalVolume * 0.008) * (idx % 2 === 0 ? 1 : 0.5)) : 1.0;

        projectedNodes.push({
          node,
          px: pos.x,
          py: pos.y,
          pz: pos.z,
          sx,
          sy,
          scale,
          volumeBoost
        });
      });

      // Z-sorting for proper occlusion rendering
      projectedNodes.sort((a, b) => b.pz - a.pz);

      // Draw connections/lines
      const connectionMaxDist = (160 + (isActive ? totalVolume * 0.4 : 0) + (resonance144 * 220)) * (isDistorted ? 1.4 : 1);
      
      // Determine sovereign color scheme
      let strokeColor = 'rgba(0, 242, 255, ';
      let pointColor = '#00f2ff';
      let opacityFactor = 0.15 + (isActive ? (totalVolume * 0.003) + (resonance144 * 0.4) : 0);

      if (isSealActive) {
        // Blue - Masonic Craft
        strokeColor = 'rgba(0, 71, 171, ';
        pointColor = '#0047ab';
      } else if (isObserved) {
        // Gold - Illuminati Prime
        strokeColor = 'rgba(212, 175, 55, ';
        pointColor = '#d4af37';
      } else if (isGuarded) {
        // Deep Red - Gatekeeper Guard
        strokeColor = 'rgba(153, 0, 0, ';
        pointColor = '#990000';
      } else if (isDistorted) {
        // Silver / White - Jobs Distortion
        strokeColor = 'rgba(245, 242, 237, ';
        pointColor = '#f5f2ed';
      } else if (isActive) {
        // Active - Orange Spark
        strokeColor = 'rgba(255, 78, 0, ';
        pointColor = '#ff4e00';
      }

      ctx.lineWidth = 1.0;

      // Draw active resonance sweep front if sweeping
      const sweepProgress = Grid.getSweepProgress();
      const sweepActive = Grid.isSweepRunning();

      for (let i = 0; i < projectedNodes.length; i++) {
        const nodeA = projectedNodes[i];

        // Skip off-screen rendering
        if (nodeA.sx < -100 || nodeA.sx > canvas.width + 100 || nodeA.sy < -100 || nodeA.sy > canvas.height + 100) {
          continue;
        }

        for (let j = i + 1; j < projectedNodes.length; j++) {
          const nodeB = projectedNodes[j];

          // 3D Distance check
          const dx = nodeA.node.position.x - nodeB.node.position.x;
          const dy = nodeA.node.position.y - nodeB.node.position.y;
          const dz = nodeA.node.position.z - nodeB.node.position.z;
          const dist3d = Math.sqrt(dx*dx + dy*dy + dz*dz);

          if (dist3d < connectionMaxDist) {
            // Fade lines based on 3D proximity distance and relative z-depth
            const distFade = 1.0 - (dist3d / connectionMaxDist);
            const lineOpacity = opacityFactor * distFade * Math.max(0.1, nodeA.scale * 0.5);

            ctx.strokeStyle = `${strokeColor}${lineOpacity})`;
            ctx.beginPath();
            ctx.moveTo(nodeA.sx, nodeA.sy);
            ctx.lineTo(nodeB.sx, nodeB.sy);
            ctx.stroke();
          }
        }
      }

      // Draw Node points and text indicators
      projectedNodes.forEach((pNode, idx) => {
        // Skip off-screen nodes
        if (pNode.sx < -50 || pNode.sx > canvas.width + 50 || pNode.sy < -50 || pNode.sy > canvas.height + 50) {
          return;
        }

        const size = Math.max(0.5, (3.5 + pNode.node.resonance * 2.5) * pNode.scale * pNode.volumeBoost);
        const nodeOpacity = Math.min(1.0, (0.3 + pNode.node.resonance * 0.7) * pNode.scale);

        // Draw outer glow circle
        ctx.beginPath();
        const radGradient = ctx.createRadialGradient(
          pNode.sx, pNode.sy, 0,
          pNode.sx, pNode.sy, size * (1.5 + pNode.node.resonance * 2.0)
        );
        radGradient.addColorStop(0, `${pointColor}`);
        radGradient.addColorStop(0.3, `${pointColor}77`);
        radGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = radGradient;
        ctx.arc(pNode.sx, pNode.sy, size * (1.5 + pNode.node.resonance * 2.0), 0, Math.PI * 2);
        ctx.fill();

        // Core solid node
        ctx.beginPath();
        ctx.fillStyle = pointColor;
        ctx.globalAlpha = nodeOpacity;
        ctx.arc(pNode.sx, pNode.sy, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Draw resonance sweep halo if active
        if (sweepActive) {
          const sweepRadius = sweepProgress * 500;
          const nodeDistFromCenter = Math.sqrt(pNode.node.position.x**2 + pNode.node.position.y**2 + pNode.node.position.z**2);
          
          if (Math.abs(nodeDistFromCenter - sweepRadius) < 60) {
            const sweepOpacity = (1.0 - Math.abs(nodeDistFromCenter - sweepRadius) / 60) * 0.8;
            ctx.strokeStyle = `rgba(0, 242, 255, ${sweepOpacity})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(pNode.sx, pNode.sy, size * 5 * sweepProgress, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        // Render names/labels for primary nodes to enrich craftsmanship
        if (idx < 12 && pNode.scale > 0.6) {
          ctx.fillStyle = `rgba(245, 242, 237, ${0.4 * pNode.scale})`;
          ctx.font = '8px monospace';
          ctx.fillText(pNode.node.name || `Prime ${idx}`, pNode.sx + size + 4, pNode.sy + 3);
        }
      });

      // Render a global ambient space horizon grid at the bottom
      ctx.strokeStyle = `${strokeColor}0.02)`;
      ctx.lineWidth = 0.5;
      const horizonY = canvas.height * 0.85;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(canvas.width, horizonY);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      if (canvasRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(canvasRef.current);
        } catch (e) {}
      }
    };
  }, [density, speed, isActive, inputVolume, outputVolume, resonance144, isDistorted, isGuarded, isObserved, isSealActive]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
};

export default NeuralNexus;
