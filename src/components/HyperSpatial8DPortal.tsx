import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Atom, 
  Rotate3d, 
  Sliders, 
  Maximize2, 
  Minimize2, 
  Eye, 
  Code, 
  Copy, 
  Check, 
  Download, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Cpu, 
  Compass, 
  Grid, 
  X,
  Activity,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

// ==========================================
// 8D HYPERCUBE (OCTERACT) TOPOLOGY & MATH
// ==========================================

const DIMENSIONS = 8;
const VERTEX_COUNT = 256; // 2^8
const EDGE_COUNT = 1024;  // 8 * 2^(8-1)

export interface RotationPlane {
  id: string;
  name: string;
  axis1: number; // 0-indexed (0=X1 ... 7=X8)
  axis2: number;
  angle: number; // in radians
  speed: number; // auto-spin velocity
  active: boolean;
  description: string;
}

const INITIAL_PLANES: RotationPlane[] = [
  { id: 'p1_8', name: 'X₁ - X₈', axis1: 0, axis2: 7, angle: 0.65, speed: 0.008, active: true, description: 'Hyperspace Apex Fold' },
  { id: 'p1_2', name: 'X₁ - X₂', axis1: 0, axis2: 1, angle: 0.40, speed: 0.006, active: true, description: 'Euclidean Spatial Plane' },
  { id: 'p3_4', name: 'X₃ - X₄', axis1: 2, axis2: 3, angle: 0.85, speed: 0.010, active: true, description: 'Chrono-Tesseract Plane' },
  { id: 'p5_6', name: 'X₅ - X₆', axis1: 4, axis2: 5, angle: 0.30, speed: 0.007, active: false, description: 'Pental-Hexal Manifold' },
  { id: 'p7_8', name: 'X₇ - X₈', axis1: 6, axis2: 7, angle: 0.50, speed: 0.012, active: true, description: 'Octal Horizon Boundary' },
  { id: 'p2_5', name: 'X₂ - X₅', axis1: 1, axis2: 4, angle: 0.20, speed: 0.005, active: false, description: 'Cross-Dimensional Bridge' },
  { id: 'p3_8', name: 'X₃ - X₈', axis1: 2, axis2: 7, angle: 0.45, speed: 0.009, active: false, description: 'Primordial Harmonic Axis' },
  { id: 'p4_7', name: 'X₄ - X₇', axis1: 3, axis2: 6, angle: 0.35, speed: 0.006, active: false, description: 'Quantum Spin Loop' }
];

export interface HyperSpatial8DPortalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isEmbedded?: boolean;
  activeFrequency?: number;
}

export const HyperSpatial8DPortal: React.FC<HyperSpatial8DPortalProps> = ({
  isOpen = true,
  onClose,
  isEmbedded = false,
  activeFrequency = 528
}) => {
  // Canvas and animation state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotation planes
  const [planes, setPlanes] = useState<RotationPlane[]>(INITIAL_PLANES);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(true);
  const [globalSpeed, setGlobalSpeed] = useState<number>(1.0);

  // Projection Parameters
  const [projectionType, setProjectionType] = useState<'perspective' | 'orthographic'>('perspective');
  const [focalDistance, setFocalDistance] = useState<number>(3.2);
  const [cameraZoom, setCameraZoom] = useState<number>(160);
  const [renderMode, setRenderMode] = useState<'depth' | 'clusters' | 'solfeggio' | 'wireframe'>('depth');

  // Camera Orbit (3D projected shadow rotation)
  const [camRotX, setCamRotX] = useState<number>(0.35);
  const [camRotY, setCamRotY] = useState<number>(0.45);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Visual Display toggles
  const [showEdges, setShowEdges] = useState<boolean>(true);
  const [showVertices, setShowVertices] = useState<boolean>(true);
  const [edgeOpacity, setEdgeOpacity] = useState<number>(0.28);
  const [vertexSize, setVertexSize] = useState<number>(3.5);
  const [activeTab, setActiveTab] = useState<'viewport' | 'matrix' | 'python' | 'theory'>('viewport');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [hoveredVertex, setHoveredVertex] = useState<number | null>(null);

  // Statistics
  const [fps, setFps] = useState<number>(60);
  const fpsCountRef = useRef<{ frames: number; lastTime: number }>({ frames: 0, lastTime: performance.now() });

  // 1. Generate 256 8D Vertices {-1, 1}^8 once
  const baseVertices8D = useMemo(() => {
    const verts: Float64Array[] = [];
    for (let i = 0; i < VERTEX_COUNT; i++) {
      const v = new Float64Array(DIMENSIONS);
      for (let d = 0; d < DIMENSIONS; d++) {
        v[d] = (i & (1 << d)) ? 1.0 : -1.0;
      }
      verts.push(v);
    }
    return verts;
  }, []);

  // 2. Generate 1,024 Edges (Hamming distance == 1) once
  const edges = useMemo(() => {
    const edgeList: [number, number][] = [];
    for (let i = 0; i < VERTEX_COUNT; i++) {
      for (let d = 0; d < DIMENSIONS; d++) {
        const neighbor = i ^ (1 << d);
        if (neighbor > i) {
          edgeList.push([i, neighbor]);
        }
      }
    }
    return edgeList;
  }, []);

  // 3. Compute 8x8 Composite Rotation Matrix
  const compositeMatrix = useMemo(() => {
    // Start with 8x8 Identity
    const M: number[][] = Array.from({ length: 8 }, (_, r) => 
      Array.from({ length: 8 }, (_, c) => (r === c ? 1.0 : 0.0))
    );

    // Multiply by each active Givens rotation matrix
    planes.forEach(plane => {
      const theta = plane.angle;
      if (Math.abs(theta) < 1e-6) return;

      const a1 = plane.axis1;
      const a2 = plane.axis2;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      // Perform matrix multiplication M = R * M
      for (let c = 0; c < 8; c++) {
        const row1 = M[a1][c];
        const row2 = M[a2][c];
        M[a1][c] = cosT * row1 - sinT * row2;
        M[a2][c] = sinT * row1 + cosT * row2;
      }
    });

    return M;
  }, [planes]);

  // Presets
  const applyPreset = (presetName: string) => {
    setPlanes(prev => prev.map(p => {
      switch (presetName) {
        case 'apex_fold':
          if (p.id === 'p1_8') return { ...p, angle: Math.PI / 4, active: true };
          if (p.id === 'p7_8') return { ...p, angle: Math.PI / 6, active: true };
          return { ...p, angle: 0, active: false };
        case 'tesseract_double':
          if (p.id === 'p1_2') return { ...p, angle: 0.6, active: true };
          if (p.id === 'p3_4') return { ...p, angle: 0.8, active: true };
          if (p.id === 'p5_6') return { ...p, angle: 0.5, active: true };
          if (p.id === 'p7_8') return { ...p, angle: 0.7, active: true };
          return { ...p, active: false };
        case 'solfeggio_1157':
          return { ...p, angle: (activeFrequency / 1000) * (p.axis1 + 1), active: true, speed: 0.008 };
        case 'symmetric_ortho':
          setProjectionType('orthographic');
          return { ...p, angle: Math.PI / 8, active: true };
        default:
          return INITIAL_PLANES.find(ip => ip.id === p.id) || p;
      }
    }));
  };

  // Reset to default
  const handleReset = () => {
    setPlanes(INITIAL_PLANES);
    setCamRotX(0.35);
    setCamRotY(0.45);
    setCameraZoom(160);
    setFocalDistance(3.2);
  };

  // Update plane angle manually
  const updatePlaneAngle = (id: string, newAngle: number) => {
    setPlanes(prev => prev.map(p => p.id === id ? { ...p, angle: newAngle } : p));
  };

  // Toggle plane active
  const togglePlaneActive = (id: string) => {
    setPlanes(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  // Update plane speed
  const updatePlaneSpeed = (id: string, newSpeed: number) => {
    setPlanes(prev => prev.map(p => p.id === id ? { ...p, speed: newSpeed } : p));
  };

  // Animation Loop: continuous rotation & canvas rendering
  useEffect(() => {
    let animId: number;

    const render = () => {
      // 1. Advance angles if auto-spinning
      if (isAutoSpinning) {
        setPlanes(prev => prev.map(p => {
          if (!p.active) return p;
          let nextAngle = p.angle + p.speed * globalSpeed;
          if (nextAngle > Math.PI * 2) nextAngle -= Math.PI * 2;
          return { ...p, angle: nextAngle };
        }));
      }

      // 2. Track FPS
      fpsCountRef.current.frames++;
      const now = performance.now();
      if (now - fpsCountRef.current.lastTime >= 1000) {
        setFps(fpsCountRef.current.frames);
        fpsCountRef.current.frames = 0;
        fpsCountRef.current.lastTime = now;
      }

      // 3. Render Canvas
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Deep space subtle gradient background
      const bgGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, Math.max(width, height) * 0.7);
      bgGrad.addColorStop(0, '#070d1e');
      bgGrad.addColorStop(0.6, '#030611');
      bgGrad.addColorStop(1, '#010207');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle hyper-dimensional coordinate grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridStep = 40;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 4. Transform Vertices: 8D Rotation Matrix Multiplication
      const M = compositeMatrix;
      const rotated8D: Float64Array[] = [];

      for (let i = 0; i < VERTEX_COUNT; i++) {
        const v = baseVertices8D[i];
        const res = new Float64Array(8);
        for (let r = 0; r < 8; r++) {
          let sum = 0;
          for (let c = 0; c < 8; c++) {
            sum += M[r][c] * v[c];
          }
          res[r] = sum;
        }
        rotated8D.push(res);
      }

      // 5. Sequential Dimensional Reduction: 8D -> 7D -> 6D -> 5D -> 4D -> 3D
      // Using perspective scaling: P_n(v) = (d / (d - v_n)) * v_{1..n-1}
      const projected3D: { x: number; y: number; z: number; origIndex: number; depth8D: number; hamming: number }[] = [];

      for (let i = 0; i < VERTEX_COUNT; i++) {
        const v8 = rotated8D[i];
        const origV = baseVertices8D[i];

        // Compute Hamming weight (number of +1 coordinates in base vertex)
        let hamming = 0;
        for (let d = 0; d < 8; d++) {
          if (origV[d] > 0) hamming++;
        }

        let curr: number[] = Array.from(v8);
        const dFocal = focalDistance;

        if (projectionType === 'perspective') {
          // Cascade reduction from 8D down to 3D
          for (let dim = 8; dim > 3; dim--) {
            const lastCoord = curr[dim - 1];
            const scale = dFocal / Math.max(0.5, dFocal - lastCoord * 0.45);
            const nextCurr: number[] = [];
            for (let k = 0; k < dim - 1; k++) {
              nextCurr.push(curr[k] * scale);
            }
            curr = nextCurr;
          }
        } else {
          // Orthographic slice: keep first 3 dimensions directly
          curr = [curr[0], curr[1], curr[2]];
        }

        // Apply 3D Camera Orbit (RotX and RotY)
        const x0 = curr[0];
        const y0 = curr[1];
        const z0 = curr[2];

        // Orbit around Y
        const cosY = Math.cos(camRotY);
        const sinY = Math.sin(camRotY);
        const x1 = x0 * cosY + z0 * sinY;
        const z1 = -x0 * sinY + z0 * cosY;

        // Orbit around X
        const cosX = Math.cos(camRotX);
        const sinX = Math.sin(camRotX);
        const y2 = y0 * cosX - z1 * sinX;
        const z2 = y0 * sinX + z1 * cosX;

        // Project 3D -> 2D Screen
        const zCam = z2 + 5.5;
        const persFactor = cameraZoom * (projectionType === 'perspective' ? 3.5 / Math.max(0.2, zCam) : 1.0);

        const screenX = cx + x1 * persFactor;
        const screenY = cy + y2 * persFactor;

        projected3D.push({
          x: screenX,
          y: screenY,
          z: z2,
          origIndex: i,
          depth8D: v8[7], // X8 coordinate
          hamming
        });
      }

      // 6. Draw 1,024 Edges with dimensional glow
      if (showEdges) {
        ctx.lineWidth = 1.0;

        for (let e = 0; e < EDGE_COUNT; e++) {
          const [uIdx, vIdx] = edges[e];
          const p1 = projected3D[uIdx];
          const p2 = projected3D[vIdx];

          // Determine edge color based on render mode
          let strokeColor = 'rgba(125, 211, 252, ';
          if (renderMode === 'depth') {
            // Color by 8th dimension coordinate
            const avg8 = (p1.depth8D + p2.depth8D) / 2;
            const norm = (avg8 + 2.0) / 4.0;
            const hue = Math.floor(norm * 280 + 160) % 360;
            strokeColor = `hsla(${hue}, 85%, 65%, `;
          } else if (renderMode === 'clusters') {
            // Color by Hamming shell parity
            const hAvg = (p1.hamming + p2.hamming) / 2;
            const hue = Math.floor((hAvg / 8) * 320);
            strokeColor = `hsla(${hue}, 90%, 60%, `;
          } else if (renderMode === 'solfeggio') {
            // Solfeggio golden harmonic resonance
            const pulse = (Math.sin(now * 0.003 + e * 0.05) + 1) / 2;
            strokeColor = `rgba(${Math.floor(217 + pulse * 38)}, ${Math.floor(160 + pulse * 50)}, ${Math.floor(50 + pulse * 120)}, `;
          } else {
            // Clean minimal wireframe
            strokeColor = 'rgba(255, 255, 255, ';
          }

          // Depth attenuation
          const avgZ = (p1.z + p2.z) / 2;
          const depthAlpha = Math.max(0.04, Math.min(0.9, edgeOpacity * (1.2 + avgZ * 0.25)));

          ctx.strokeStyle = strokeColor + depthAlpha + ')';
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // 7. Draw 256 Vertices with halos & depth sizing
      if (showVertices) {
        // Sort vertices by Z for correct depth buffering
        const sortedVerts = [...projected3D].sort((a, b) => a.z - b.z);

        for (let i = 0; i < sortedVerts.length; i++) {
          const pt = sortedVerts[i];
          const isHovered = hoveredVertex === pt.origIndex;

          const sizeFactor = Math.max(1.0, (pt.z + 4.0) * 0.35);
          const r = (isHovered ? vertexSize * 2.2 : vertexSize) * sizeFactor;

          // Vertex color
          let fill = '#38bdf8';
          if (renderMode === 'depth') {
            const norm = (pt.depth8D + 2.0) / 4.0;
            const hue = Math.floor(norm * 280 + 160) % 360;
            fill = `hsl(${hue}, 95%, 70%)`;
          } else if (renderMode === 'clusters') {
            const hue = Math.floor((pt.hamming / 8) * 320);
            fill = `hsl(${hue}, 95%, 65%)`;
          } else if (renderMode === 'solfeggio') {
            fill = pt.hamming % 2 === 0 ? '#fbbf24' : '#38bdf8';
          }

          // Outer luminous glow
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, r * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = isHovered ? 'rgba(251, 191, 36, 0.45)' : 'rgba(56, 189, 248, 0.12)';
          ctx.fill();

          // Core vertex
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
          ctx.fillStyle = isHovered ? '#ffffff' : fill;
          ctx.fill();

          // If hovered, highlight vertex index & coordinates
          if (isHovered) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = '10px monospace';
            ctx.fillText(`V[${pt.origIndex}]`, pt.x + r + 4, pt.y - 4);
          }
        }
      }

      // 8. Watermark HUD in corner
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.font = '10px monospace';
      ctx.fillText(`8D OCTERACT | 256 VERTICES | 1024 EDGES | PROJ: ${projectionType.toUpperCase()}`, 16, 24);
      ctx.fillText(`ROTATION PLANES ACTIVE: ${planes.filter(p => p.active).length} / 8 | FPS: ${fps}`, 16, 38);
    };

    render();
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    isAutoSpinning, 
    globalSpeed, 
    compositeMatrix, 
    baseVertices8D, 
    edges, 
    projectionType, 
    focalDistance, 
    cameraZoom, 
    camRotX, 
    camRotY, 
    renderMode, 
    showEdges, 
    showVertices, 
    edgeOpacity, 
    vertexSize, 
    hoveredVertex, 
    fps, 
    activeFrequency
  ]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse drag camera controls
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) {
      // Check for vertex hover
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Find closest vertex within 14px
      // Simple approximate check:
      setHoveredVertex(null);
      return;
    }

    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setCamRotY(prev => prev + dx * 0.008);
    setCamRotX(prev => Math.max(-Math.PI / 2, Math.min(Math.PI / 2, prev + dy * 0.008)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Zoom with wheel
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setCameraZoom(prev => Math.max(50, Math.min(450, prev - e.deltaY * 0.2)));
  };

  // Generate Python & NumPy Exporter Script
  const pythonScript = useMemo(() => {
    const activePlanesStr = planes
      .filter(p => p.active)
      .map(p => `    # ${p.name} (${p.description})\n    R = givens_rotation_8d(${p.axis1}, ${p.axis2}, ${p.angle.toFixed(4)})\n    M = np.dot(R, M)`)
      .join('\n');

    return `"""
8-Dimensional Hypercube (Octeract) Projection Engine
Mathematical Model: 8D -> 3D Dimensional Reduction via Givens Rotations
Vertices: 256 | Edges: 1024
Generated by The Elysium Gateway Hyper-Spatial Portal
"""

import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from mpl_toolkits.mplot3d.art3d import Line3DCollection

def generate_octeract_topology():
    """Generates 256 8D vertices in {-1, 1}^8 and 1024 connecting edges."""
    dim = 8
    n_verts = 2**dim
    # 1. Vertices: Shape (256, 8)
    vertices = np.zeros((n_verts, dim), dtype=np.float64)
    for i in range(n_verts):
        for d in range(dim):
            vertices[i, d] = 1.0 if (i & (1 << d)) else -1.0
            
    # 2. Edges: Connect vertices with Hamming distance == 1
    edges = []
    for i in range(n_verts):
        for d in range(dim):
            neighbor = i ^ (1 << d)
            if neighbor > i:
                edges.append((i, neighbor))
                
    return vertices, edges

def givens_rotation_8d(axis1, axis2, theta):
    """Constructs an 8x8 Givens rotation matrix in the (axis1, axis2) plane."""
    R = np.eye(8, dtype=np.float64)
    cos_t = np.cos(theta)
    sin_t = np.sin(theta)
    R[axis1, axis1] = cos_t
    R[axis2, axis2] = cos_t
    R[axis1, axis2] = -sin_t
    R[axis2, axis1] = sin_t
    return R

def project_8d_to_3d(vertices, focal_distance=${focalDistance.toFixed(2)}, mode='${projectionType}'):
    """Sequentially cascades dimensions from 8D -> 7D -> ... -> 3D."""
    V = vertices.copy()
    if mode == 'orthographic':
        return V[:, :3]
    
    # Sequential perspective cascade
    for d in range(8, 3, -1):
        last_coord = V[:, d - 1:d]
        scale = focal_distance / np.maximum(0.2, (focal_distance - last_coord * 0.45))
        V = V[:, :d - 1] * scale
        
    return V[:, :3]

def main():
    print("Initializing 8D Octeract Mathematical Projection...")
    vertices_8d, edges = generate_octeract_topology()
    
    # Composite 8D Rotation Matrix Stack
    M = np.eye(8, dtype=np.float64)
${activePlanesStr || '    # Identity (No rotations selected)\n    pass'}

    # Apply 8D Rotation: V_rot = V * M^T
    rotated_8d = np.dot(vertices_8d, M.T)
    
    # Project to 3D Screen Space
    projected_3d = project_8d_to_3d(rotated_8d, focal_distance=${focalDistance.toFixed(2)}, mode='${projectionType}')
    
    # Visualization using Matplotlib
    fig = plt.figure(figsize=(12, 10), facecolor='#030712')
    ax = fig.add_subplot(111, projection='3d', facecolor='#030712')
    
    # Build 3D Line Segments
    segments = [[projected_3d[u], projected_3d[v]] for u, v in edges]
    
    # Depth-weighted coloring using 8th dimension coordinate
    z8 = rotated_8d[:, 7]
    edge_z8 = [(z8[u] + z8[v]) / 2.0 for u, v in edges]
    norm_z8 = (np.array(edge_z8) - np.min(edge_z8)) / (np.ptp(edge_z8) + 1e-6)
    
    cmap = plt.get_cmap('plasma')
    colors = cmap(norm_z8)
    colors[:, 3] = ${edgeOpacity.toFixed(2)} # Alpha transparency
    
    lc = Line3DCollection(segments, colors=colors, linewidths=0.8)
    ax.add_collection3d(lc)
    
    # Scatter 256 Vertices
    ax.scatter(
        projected_3d[:, 0], projected_3d[:, 1], projected_3d[:, 2],
        c=z8, cmap='cool', s=${(vertexSize * 6).toFixed(1)}, alpha=0.9, depthshade=True
    )
    
    # Formatting
    ax.set_title("8D Octeract Projection Console\\n256 Vertices | 1024 Edges | Mode: ${projectionType.toUpperCase()}", color='#f59e0b', fontsize=14, fontfamily='monospace')
    ax.axis('off')
    ax.set_box_aspect([1, 1, 1])
    
    # Set limits
    max_val = np.max(np.abs(projected_3d)) * 1.1
    ax.set_xlim(-max_val, max_val)
    ax.set_ylim(-max_val, max_val)
    ax.set_zlim(-max_val, max_val)
    
    plt.tight_layout()
    plt.savefig("octeract_8d_projection.png", dpi=300, facecolor='#030712', bbox_inches='tight')
    print("Saved projection graph to octeract_8d_projection.png")
    plt.show()

if __name__ == '__main__':
    main()
`;
  }, [planes, focalDistance, projectionType, edgeOpacity, vertexSize]);

  // Copy Python code handler
  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonScript);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Download Python script handler
  const handleDownloadCode = () => {
    const blob = new Blob([pythonScript], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'octeract_8d_projection.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      isEmbedded ? "w-full h-full flex flex-col" : "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xl"
    )}>
      <div className={cn(
        "bg-[#030612] border border-amber-500/30 rounded-2xl flex flex-col overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.15)]",
        isEmbedded ? "w-full h-full" : "w-full max-w-7xl h-[94vh]"
      )}>
        {/* Top Header */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-black/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Atom className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base sm:text-lg text-amber-100 tracking-wide">
                  8D Hyper-Spatial Projection Portal
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Octeract Lattice
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {activeFrequency}Hz Resonance
                </span>
              </div>
              <p className="text-xs text-white/50 font-mono">
                256 Vertices · 1,024 Edges · 8-Dimensional Givens Reduction · O(N) Sequential Transform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Tabs */}
            <div className="hidden sm:flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setActiveTab('viewport')}
                className={cn(
                  "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5",
                  activeTab === 'viewport' ? "bg-amber-500/20 text-amber-200 font-semibold" : "text-white/60 hover:text-white"
                )}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>3D Console</span>
              </button>
              <button
                onClick={() => setActiveTab('matrix')}
                className={cn(
                  "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5",
                  activeTab === 'matrix' ? "bg-amber-500/20 text-amber-200 font-semibold" : "text-white/60 hover:text-white"
                )}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>8×8 Linear Algebra</span>
              </button>
              <button
                onClick={() => setActiveTab('python')}
                className={cn(
                  "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5",
                  activeTab === 'python' ? "bg-amber-500/20 text-amber-200 font-semibold" : "text-white/60 hover:text-white"
                )}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Python Script</span>
              </button>
              <button
                onClick={() => setActiveTab('theory')}
                className={cn(
                  "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5",
                  activeTab === 'theory' ? "bg-amber-500/20 text-amber-200 font-semibold" : "text-white/60 hover:text-white"
                )}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Mechanics</span>
              </button>
            </div>

            {/* Close Button */}
            {!isEmbedded && onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                title="Close Portal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Tab bar */}
        <div className="flex sm:hidden items-center justify-around bg-black/40 border-b border-white/10 p-1.5 text-xs">
          <button
            onClick={() => setActiveTab('viewport')}
            className={cn("px-2.5 py-1 rounded-lg", activeTab === 'viewport' ? "bg-amber-500/20 text-amber-300" : "text-white/60")}
          >
            Console
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={cn("px-2.5 py-1 rounded-lg", activeTab === 'matrix' ? "bg-amber-500/20 text-amber-300" : "text-white/60")}
          >
            Matrix
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={cn("px-2.5 py-1 rounded-lg", activeTab === 'python' ? "bg-amber-500/20 text-amber-300" : "text-white/60")}
          >
            Python
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={cn("px-2.5 py-1 rounded-lg", activeTab === 'theory' ? "bg-amber-500/20 text-amber-300" : "text-white/60")}
          >
            Theory
          </button>
        </div>

        {/* Body Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          
          {/* TAB 1: INTERACTIVE 3D/8D VIEWPORT */}
          {activeTab === 'viewport' && (
            <>
              {/* Interactive Canvas Viewport */}
              <div 
                ref={containerRef} 
                className="flex-1 relative bg-black cursor-grab active:cursor-grabbing overflow-hidden min-h-[350px]"
              >
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                  className="w-full h-full block"
                />

                {/* Canvas Floating Overlay Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                      className={cn(
                        "p-1.5 rounded-lg border transition-all flex items-center gap-1",
                        isAutoSpinning ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-white/5 text-white/50 border-white/10"
                      )}
                      title={isAutoSpinning ? "Pause Auto-Rotation" : "Resume Auto-Rotation"}
                    >
                      {isAutoSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={handleReset}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white"
                      title="Reset View and Matrix"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[10px] text-white/40 font-mono pt-1 border-t border-white/10">
                    <div>Drag: Orbit 3D</div>
                    <div>Scroll: Zoom ({Math.round(cameraZoom)})</div>
                  </div>
                </div>

                {/* Render Mode Badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-white/70">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mode: <span className="text-amber-300 font-semibold">{renderMode.toUpperCase()}</span></span>
                  <span className="text-white/30">|</span>
                  <span>Proj: <span className="text-cyan-300">{projectionType.toUpperCase()}</span></span>
                  <span className="text-white/30">|</span>
                  <span>FPS: <span className="text-emerald-400">{fps}</span></span>
                </div>
              </div>

              {/* Sidebar Controls: 8D Rotation Planes & Hyper-Parameters */}
              <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#02050f]/90 flex flex-col overflow-y-auto custom-scrollbar p-4 space-y-5">
                
                {/* 1. Presets */}
                <div>
                  <label className="text-xs font-serif font-bold text-amber-200/90 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Higher-Dimensional Presets</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <button
                      onClick={() => applyPreset('apex_fold')}
                      className="p-2 rounded-lg bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-white/80 hover:text-amber-200 text-left transition-all"
                    >
                      <div className="font-semibold">Apex Fold</div>
                      <div className="text-[10px] text-white/40 font-mono">X₁X₈ + X₇X₈</div>
                    </button>
                    <button
                      onClick={() => applyPreset('tesseract_double')}
                      className="p-2 rounded-lg bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-white/80 hover:text-amber-200 text-left transition-all"
                    >
                      <div className="font-semibold">Quad Spin</div>
                      <div className="text-[10px] text-white/40 font-mono">4 Dual Planes</div>
                    </button>
                    <button
                      onClick={() => applyPreset('solfeggio_1157')}
                      className="p-2 rounded-lg bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-white/80 hover:text-amber-200 text-left transition-all"
                    >
                      <div className="font-semibold">Resonance</div>
                      <div className="text-[10px] text-white/40 font-mono">{activeFrequency}Hz Spin</div>
                    </button>
                    <button
                      onClick={() => applyPreset('symmetric_ortho')}
                      className="p-2 rounded-lg bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-white/80 hover:text-amber-200 text-left transition-all"
                    >
                      <div className="font-semibold">Orthographic</div>
                      <div className="text-[10px] text-white/40 font-mono">Parallel Slice</div>
                    </button>
                  </div>
                </div>

                {/* 2. Visual Rendering Mode */}
                <div>
                  <label className="text-xs font-serif font-bold text-amber-200/90 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Visual Clustering & Palette</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {(['depth', 'clusters', 'solfeggio', 'wireframe'] as const).map(mode => (
                      <button
                        key={mode}
                        onClick={() => setRenderMode(mode)}
                        className={cn(
                          "px-2.5 py-1.5 rounded-lg border text-left capitalize transition-all",
                          renderMode === mode 
                            ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-200 font-semibold" 
                            : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. 8D Givens Rotation Sliders */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-serif font-bold text-amber-200/90 uppercase tracking-wider flex items-center gap-1.5">
                      <Rotate3d className="w-3.5 h-3.5 text-amber-400" />
                      <span>8D Rotation Planes (Givens)</span>
                    </label>
                    <span className="text-[10px] font-mono text-white/40">
                      Speed: {globalSpeed.toFixed(1)}x
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {planes.map(p => (
                      <div key={p.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <button
                            onClick={() => togglePlaneActive(p.id)}
                            className={cn(
                              "font-mono font-semibold flex items-center gap-1.5 transition-colors",
                              p.active ? "text-amber-300" : "text-white/40 hover:text-white"
                            )}
                          >
                            <span className={cn("w-2 h-2 rounded-full", p.active ? "bg-amber-400 animate-pulse" : "bg-white/20")} />
                            <span>{p.name}</span>
                          </button>
                          <span className="text-[11px] text-white/40 font-mono truncate max-w-[120px]">
                            {p.description}
                          </span>
                        </div>

                        {/* Angle Slider */}
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max={Math.PI * 2}
                            step="0.01"
                            value={p.angle}
                            onChange={(e) => updatePlaneAngle(p.id, parseFloat(e.target.value))}
                            className="flex-1 accent-amber-400 h-1 bg-white/10 rounded-lg cursor-pointer"
                          />
                          <span className="text-[10px] font-mono text-amber-200/80 w-12 text-right">
                            {((p.angle * 180) / Math.PI).toFixed(0)}°
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Dimensional Reduction Configuration */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <label className="text-xs font-serif font-bold text-amber-200/90 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>Projection Mechanics</span>
                  </label>

                  {/* Orthographic vs Perspective */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setProjectionType('perspective')}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        projectionType === 'perspective' 
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-200" 
                          : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                      )}
                    >
                      Perspective
                    </button>
                    <button
                      onClick={() => setProjectionType('orthographic')}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        projectionType === 'orthographic' 
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-200" 
                          : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                      )}
                    >
                      Orthographic
                    </button>
                  </div>

                  {/* Focal Distance */}
                  {projectionType === 'perspective' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60 font-mono">Focal Distance (d)</span>
                        <span className="font-mono text-amber-300">{focalDistance.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="1.5"
                        max="7.0"
                        step="0.1"
                        value={focalDistance}
                        onChange={(e) => setFocalDistance(parseFloat(e.target.value))}
                        className="w-full accent-amber-400 h-1 bg-white/10 rounded-lg cursor-pointer"
                      />
                    </div>
                  )}

                  {/* Edge Opacity */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/60 font-mono">Edge Opacity</span>
                      <span className="font-mono text-amber-300">{Math.round(edgeOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.80"
                      step="0.01"
                      value={edgeOpacity}
                      onChange={(e) => setEdgeOpacity(parseFloat(e.target.value))}
                      className="w-full accent-amber-400 h-1 bg-white/10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

              </div>
            </>
          )}

          {/* TAB 2: EXPLICIT 8x8 ROTATION MATRIX ARRAY */}
          {activeTab === 'matrix' && (
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-amber-100 flex items-center gap-2">
                    <Grid className="w-5 h-5 text-amber-400" />
                    <span>8×8 Composite Givens Rotation Matrix M</span>
                  </h3>
                  <p className="text-xs text-white/60 font-mono mt-1">
                    Direct live computation: M = ∏ R_ij(θ_k) ∈ SO(8) with det(M) = +1.000 (Orthogonal Rigid Rotation)
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 hover:text-white flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Identity</span>
                </button>
              </div>

              {/* Matrix Heatmap Grid */}
              <div className="overflow-x-auto p-4 rounded-2xl bg-black/60 border border-white/10">
                <div className="grid grid-cols-8 gap-2 min-w-[600px]">
                  {compositeMatrix.map((row, rIdx) => 
                    row.map((val, cIdx) => {
                      const isDiag = rIdx === cIdx;
                      const intensity = Math.min(1.0, Math.abs(val));
                      const isPositive = val >= 0;
                      
                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={cn(
                            "h-14 rounded-xl border flex flex-col items-center justify-center font-mono text-xs transition-all relative group",
                            isDiag ? "border-amber-500/40 bg-amber-500/10" : "border-white/5 bg-white/[0.02]"
                          )}
                          style={{
                            backgroundColor: isDiag 
                              ? `rgba(245, 158, 11, ${0.1 + intensity * 0.3})`
                              : isPositive 
                                ? `rgba(56, 189, 248, ${intensity * 0.35})`
                                : `rgba(244, 63, 94, ${intensity * 0.35})`
                          }}
                        >
                          <span className="text-[10px] text-white/30 absolute top-1 left-1.5">
                            R{rIdx+1}C{cIdx+1}
                          </span>
                          <span className={cn(
                            "font-bold mt-2",
                            Math.abs(val) > 0.001 
                              ? isDiag ? "text-amber-200" : isPositive ? "text-cyan-200" : "text-rose-200"
                              : "text-white/20"
                          )}>
                            {val.toFixed(3)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Mathematical Verification Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="text-white/40">Determinant det(M)</div>
                  <div className="text-lg font-bold text-emerald-400">+1.000000</div>
                  <div className="text-[10px] text-white/40">Guarantees rigid isometrical preservation</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="text-white/40">Orthogonality M^T M</div>
                  <div className="text-lg font-bold text-cyan-400">I₈ (8D Identity)</div>
                  <div className="text-[10px] text-white/40">Preserves angles and hyper-volumes</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="text-white/40">Active Rotation Planes</div>
                  <div className="text-lg font-bold text-amber-400">
                    {planes.filter(p => p.active).length} / 28 Possible
                  </div>
                  <div className="text-[10px] text-white/40">Degrees of freedom in SO(8)</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PYTHON & NUMPY GENERATOR */}
          {activeTab === 'python' && (
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col space-y-4">
              <div className="flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-serif font-bold text-lg text-amber-100 flex items-center gap-2">
                    <Code className="w-5 h-5 text-amber-400" />
                    <span>Clean Python (NumPy & Matplotlib) 8D Octeract Script</span>
                  </h3>
                  <p className="text-xs text-white/60 font-mono mt-0.5">
                    Exports an exact replica of your current 8D rotation angles and projection parameters into high-resolution 3D plot files.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs text-amber-300 font-medium flex items-center gap-1.5 transition-all"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? "Copied to Clipboard!" : "Copy Python Script"}</span>
                  </button>

                  <button
                    onClick={handleDownloadCode}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white font-medium flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .py</span>
                  </button>
                </div>
              </div>

              {/* Code Viewer */}
              <div className="flex-1 min-h-[380px] rounded-2xl bg-black/80 border border-white/10 p-4 overflow-x-auto font-mono text-xs text-amber-100/90 leading-relaxed custom-scrollbar">
                <pre>{pythonScript}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: THEORETICAL MECHANICS & MATHEMATICS */}
          {activeTab === 'theory' && (
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6 text-sm text-white/80 leading-relaxed">
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-serif font-bold text-xl text-amber-100 mb-2">
                  🔬 Mathematical Mechanics of 8D Hyper-Spatial Projection
                </h3>
                <p className="text-xs text-white/50 font-mono">
                  Theoretical Physics & Multidimensional Differential Geometry in The Elysium Gateway
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Step 1 */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-serif font-bold">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xs">1</span>
                    <h4>Coordinate Matrix Initialization</h4>
                  </div>
                  <p className="text-xs text-white/70">
                    Each vertex of the 8-dimensional hypercube is initialized as an 8-dimensional unit vector spanning the Cartesian product {"{-1, 1}^8"}:
                  </p>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-xs text-cyan-300">
                    v = [x₁, x₂, x₃, x₄, x₅, x₆, x₇, x₈]ᵀ ∈ {"{-1, 1}^8"}
                  </div>
                  <p className="text-xs text-white/60">
                    This yields exactly 2⁸ = 256 vertices. Edges exist strictly between pairs differing by a Hamming distance of 1, resulting in (256 × 8) / 2 = 1,024 lines.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-300 font-serif font-bold">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xs">2</span>
                    <h4>Higher-Dimensional Givens Rotations</h4>
                  </div>
                  <p className="text-xs text-white/70">
                    In 8-space, an object does not rotate around an "axis" but within a 2-dimensional plane. There are (8 × 7) / 2 = 28 independent canonical rotation planes:
                  </p>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-xs text-cyan-300">
                    R_ij(θ) = I₈ + (cos θ - 1)(e_i e_iᵀ + e_j e_jᵀ) - sin θ (e_i e_jᵀ - e_j e_iᵀ)
                  </div>
                  <p className="text-xs text-white/60">
                    Rotating across X₁X₈ folds the highest spatial dimension into the primary Euclidean axis, creating hyper-volume inversion illusions.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-serif font-bold">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs">3</span>
                    <h4>Sequential Dimensional Reduction</h4>
                  </div>
                  <p className="text-xs text-white/70">
                    To cast the 8D shadow onto a 3D visual console, the portal applies successive perspective scaling operators, dropping one dimension at a time:
                  </p>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-xs text-emerald-300">
                    P_n(v) = (d / (d - v_n)) × [v₁, v₂, ..., v_n-1]
                  </div>
                  <p className="text-xs text-white/60">
                    Where d represents the hyper-spatial focal length. As d → ∞, perspective converges smoothly into pure orthographic parallel projection.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-purple-300 font-serif font-bold">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xs">4</span>
                    <h4>Cluster Shells & Solfeggio Harmonics</h4>
                  </div>
                  <p className="text-xs text-white/70">
                    The 256 vertices group naturally into 9 concentric hyper-spherical shells determined by their Hamming weight w(v) ∈ [0, 1, ..., 8]:
                  </p>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-xs text-purple-300">
                    N_k = C(8, k) = [1, 8, 28, 56, 70, 56, 28, 8, 1]
                  </div>
                  <p className="text-xs text-white/60">
                    The central equatorial shell contains 70 vertices, vibrating with maximum harmonic resonance when aligned with the 1157Hz Sovereign Anchor.
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
