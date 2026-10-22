import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Dna, 
  RotateCw, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Layers, 
  Palette,
  Eye,
  Info
} from 'lucide-react';

export type SceneMode = 'dna_helix' | 'protein_ribbon' | 'capsid_shell' | 'molecule_cpk';
export type ColorTheme = 'plddt' | 'spectrum' | 'cpk' | 'cyber';

interface ThreeBioSceneProps {
  initialMode?: SceneMode;
  targetTitle?: string;
  isEmbedded?: boolean;
}

export const ThreeBioScene: React.FC<ThreeBioSceneProps> = ({
  initialMode = 'dna_helix',
  targetTitle = 'B-DNA Dodecamer (Watson-Crick)',
  isEmbedded = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<SceneMode>(initialMode);
  const [colorTheme, setColorTheme] = useState<ColorTheme>('plddt');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.008);
  const [selectedAtom, setSelectedAtom] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // References to keep Three.js resources across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const animFrameId = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060814); // Deep space bio slate

    // 2. Camera setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 48);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.5); // Cyan key light
    dirLight1.position.set(20, 30, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe879f9, 2.0); // Violet rim light
    dirLight2.position.set(-20, -20, -10);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xfef08a, 1.8, 60); // Warm core light
    pointLight.position.set(0, 0, 15);
    scene.add(pointLight);

    // 5. Model Container Group
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    // Build the specific 3D biological entity based on mode
    buildModelGeometry(modelGroup, mode, colorTheme);

    // 6. Interactive Drag & Zoom Controls
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !modelGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      modelGroupRef.current.rotation.y += deltaX * 0.008;
      modelGroupRef.current.rotation.x += deltaY * 0.008;

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(15, Math.min(100, camera.position.z + e.deltaY * 0.04));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(container);

    // 8. Animation Loop
    let lastTime = performance.now();
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying && modelGroupRef.current) {
        modelGroupRef.current.rotation.y += rotationSpeed;
        modelGroupRef.current.rotation.x += rotationSpeed * 0.25;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 9. Cleanup
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      resizeObserver.disconnect();
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);

      // Deep disposal of scene objects
      modelGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else if (child.material) {
            child.material.dispose();
          }
        }
      });
      renderer.dispose();
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [mode, colorTheme, isPlaying, rotationSpeed]);

  // Geometry builder for biological modes
  function buildModelGeometry(group: THREE.Group, currentMode: SceneMode, theme: ColorTheme) {
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      }
    }

    if (currentMode === 'dna_helix') {
      buildDnaHelix(group, theme);
    } else if (currentMode === 'protein_ribbon') {
      buildProteinRibbon(group, theme);
    } else if (currentMode === 'capsid_shell') {
      buildCapsidShell(group, theme);
    } else if (currentMode === 'molecule_cpk') {
      buildCpkMolecule(group, theme);
    }
  }

  // 1. Double-Stranded B-DNA Helix Model
  function buildDnaHelix(group: THREE.Group, theme: ColorTheme) {
    const pairsCount = 36;
    const radius = 5.5;
    const pitch = 1.35;
    const twistPerPair = (Math.PI * 2) / 10.5; // ~10.5 base pairs per turn

    // Nucleotide base pair palette
    const colors = {
      adenine: 0xef4444,  // Red
      thymine: 0x3b82f6,  // Blue
      guanine: 0x10b981,  // Green
      cytosine: 0xf59e0b, // Amber
      backbone: 0x38bdf8  // Cyan phosphate
    };

    const backboneSphereGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const rungCylinderGeo = new THREE.CylinderGeometry(0.18, 0.18, 1, 12);
    const backboneMat = new THREE.MeshStandardMaterial({
      color: colors.backbone,
      roughness: 0.25,
      metalness: 0.8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.2
    });

    const strand1Points: THREE.Vector3[] = [];
    const strand2Points: THREE.Vector3[] = [];

    for (let i = 0; i < pairsCount; i++) {
      const angle = i * twistPerPair;
      const y = (i - pairsCount / 2) * pitch;

      // Strand 1 position
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const p1 = new THREE.Vector3(x1, y, z1);
      strand1Points.push(p1);

      // Strand 2 position (offset by 140 degrees for minor/major groove)
      const angle2 = angle + Math.PI + 0.35;
      const x2 = Math.cos(angle2) * radius;
      const z2 = Math.sin(angle2) * radius;
      const p2 = new THREE.Vector3(x2, y, z2);
      strand2Points.push(p2);

      // Phosphate atom spheres
      const node1 = new THREE.Mesh(backboneSphereGeo, backboneMat);
      node1.position.copy(p1);
      group.add(node1);

      const node2 = new THREE.Mesh(backboneSphereGeo, backboneMat);
      node2.position.copy(p2);
      group.add(node2);

      // Base pair bridge (Adenine-Thymine or Guanine-Cytosine)
      const isAT = i % 2 === 0;
      const c1 = isAT ? colors.adenine : colors.guanine;
      const c2 = isAT ? colors.thymine : colors.cytosine;

      // Half-rung 1
      const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const half1Geo = new THREE.CylinderGeometry(0.24, 0.24, p1.distanceTo(midPoint), 10);
      const half1Mat = new THREE.MeshStandardMaterial({ color: c1, roughness: 0.3, metalness: 0.3 });
      const half1 = new THREE.Mesh(half1Geo, half1Mat);
      half1.position.copy(p1).lerp(midPoint, 0.5);
      half1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), midPoint.clone().sub(p1).normalize());
      group.add(half1);

      // Half-rung 2
      const half2Geo = new THREE.CylinderGeometry(0.24, 0.24, p2.distanceTo(midPoint), 10);
      const half2Mat = new THREE.MeshStandardMaterial({ color: c2, roughness: 0.3, metalness: 0.3 });
      const half2 = new THREE.Mesh(half2Geo, half2Mat);
      half2.position.copy(p2).lerp(midPoint, 0.5);
      half2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), midPoint.clone().sub(p2).normalize());
      group.add(half2);

      // Hydrogen bond central bead
      const hBondGeo = new THREE.SphereGeometry(0.28, 12, 12);
      const hBondMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xa855f7, emissiveIntensity: 0.5 });
      const hBond = new THREE.Mesh(hBondGeo, hBondMat);
      hBond.position.copy(midPoint);
      group.add(hBond);
    }

    // Connect strands with smooth tube curves
    const curve1 = new THREE.CatmullRomCurve3(strand1Points);
    const tube1Geo = new THREE.TubeGeometry(curve1, 100, 0.32, 8, false);
    const tube1 = new THREE.Mesh(tube1Geo, backboneMat);
    group.add(tube1);

    const curve2 = new THREE.CatmullRomCurve3(strand2Points);
    const tube2Geo = new THREE.TubeGeometry(curve2, 100, 0.32, 8, false);
    const tube2 = new THREE.Mesh(tube2Geo, backboneMat);
    group.add(tube2);
  }

  // 2. AlphaFold 3D Protein Ribbon Model
  function buildProteinRibbon(group: THREE.Group, theme: ColorTheme) {
    const points: THREE.Vector3[] = [];
    const numResidues = 75;

    // Generate complex folded tertiary path with alpha-helices and beta-loops
    for (let i = 0; i < numResidues; i++) {
      const t = i * 0.3;
      let x = Math.sin(t * 1.5) * 8 + Math.cos(t * 0.4) * 4;
      let y = (i - numResidues / 2) * 0.45;
      let z = Math.cos(t * 1.5) * 8 + Math.sin(t * 0.5) * 5;

      // Add a distinct alpha helix bundle segment in the middle
      if (i > 25 && i < 50) {
        const hAngle = (i - 25) * 0.8;
        x = 6 + Math.cos(hAngle) * 3.5;
        z = Math.sin(hAngle) * 3.5;
      }
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 180, 0.75, 12, false);

    // AlphaFold pLDDT Confidence Color Gradient
    // >90: #0053D6, 70-90: #65CBF3, 50-70: #FFDB13, <50: #FF7D45
    const colorsArr: number[] = [];
    const count = tubeGeo.attributes.position.count;
    for (let i = 0; i < count; i++) {
      const frac = i / count;
      let c = new THREE.Color();
      if (theme === 'plddt') {
        if (frac < 0.45) c.setHex(0x0053d6); // Very high pLDDT > 90
        else if (frac < 0.70) c.setHex(0x65cbf3); // Confident 70-90
        else if (frac < 0.85) c.setHex(0xffdb13); // Low 50-70
        else c.setHex(0xff7d45); // Disordered < 50
      } else if (theme === 'spectrum') {
        c.setHSL(frac * 0.8, 0.9, 0.55); // Rainbow spectrum N to C
      } else {
        c.setHex(0x38bdf8);
      }
      colorsArr.push(c.r, c.g, c.b);
    }

    tubeGeo.setAttribute('color', new THREE.Float32BufferAttribute(colorsArr, 3));
    const ribbonMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.25,
      metalness: 0.5,
      wireframe: false
    });

    const ribbon = new THREE.Mesh(tubeGeo, ribbonMat);
    group.add(ribbon);

    // Add amino acid side-chain balls at active site coordinates
    const sideChainGeo = new THREE.SphereGeometry(0.65, 16, 16);
    for (let i = 0; i < points.length; i += 4) {
      const p = points[i];
      const mat = new THREE.MeshStandardMaterial({
        color: i % 8 === 0 ? 0xef4444 : 0x10b981,
        roughness: 0.3,
        metalness: 0.6
      });
      const sphere = new THREE.Mesh(sideChainGeo, mat);
      sphere.position.copy(p);
      group.add(sphere);
    }
  }

  // 3. Nanoscopic Bio-Capsid / Viral Shell
  function buildCapsidShell(group: THREE.Group, theme: ColorTheme) {
    const icoGeo = new THREE.IcosahedronGeometry(9, 2);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4
    });
    const capsidCore = new THREE.Mesh(icoGeo, wireMat);
    group.add(capsidCore);

    // Protein spike glycoproteins protruding from vertices
    const spikeGeo = new THREE.ConeGeometry(0.55, 3.2, 8);
    spikeGeo.translate(0, 1.6, 0);
    spikeGeo.rotateX(Math.PI / 2);

    const posAttr = icoGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i += 3) {
      const v = new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      const spikeMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xe879f9 : 0xfbbf24,
        roughness: 0.3,
        metalness: 0.7
      });
      const spike = new THREE.Mesh(spikeGeo, spikeMat);
      spike.position.copy(v);
      spike.lookAt(v.clone().multiplyScalar(2));
      group.add(spike);
    }

    // Inner RNA/DNA coiled payload
    const rnaCurvePoints: THREE.Vector3[] = [];
    for (let i = 0; i < 40; i++) {
      const t = i * 0.5;
      rnaCurvePoints.push(new THREE.Vector3(Math.sin(t * 2) * 4, (i - 20) * 0.35, Math.cos(t * 2) * 4));
    }
    const rnaCurve = new THREE.CatmullRomCurve3(rnaCurvePoints);
    const rnaTube = new THREE.Mesh(
      new THREE.TubeGeometry(rnaCurve, 60, 0.4, 8, false),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.6 })
    );
    group.add(rnaTube);
  }

  // 4. Ball-and-Stick CPK Small Molecule (ATP / Caffeine)
  function buildCpkMolecule(group: THREE.Group, theme: ColorTheme) {
    // Atom coordinates for a purine/caffeine ring framework
    const atoms = [
      { elem: 'N', color: 0x3b82f6, size: 0.95, pos: [0, 2.5, 0] },
      { elem: 'C', color: 0x475569, size: 1.05, pos: [2.1, 1.8, 0] },
      { elem: 'N', color: 0x3b82f6, size: 0.95, pos: [2.4, -0.6, 0] },
      { elem: 'C', color: 0x475569, size: 1.05, pos: [0.6, -1.9, 0] },
      { elem: 'C', color: 0x475569, size: 1.05, pos: [-1.4, -0.9, 0] },
      { elem: 'C', color: 0x475569, size: 1.05, pos: [-1.6, 1.4, 0] },
      { elem: 'O', color: 0xef4444, size: 0.95, pos: [-3.3, 2.2, 0.4] },
      { elem: 'O', color: 0xef4444, size: 0.95, pos: [1.2, -3.7, 0] },
      { elem: 'N', color: 0x3b82f6, size: 0.95, pos: [-3.1, -1.9, 0] },
      { elem: 'C', color: 0x475569, size: 1.05, pos: [-4.2, -0.3, 0] },
      { elem: 'N', color: 0x3b82f6, size: 0.95, pos: [-3.4, 0.9, 0] },
      // Methyl and Hydrogen pendants
      { elem: 'H', color: 0xf1f5f9, size: 0.65, pos: [3.4, 3.0, 0.5] },
      { elem: 'H', color: 0xf1f5f9, size: 0.65, pos: [3.8, -1.5, 0.4] },
      { elem: 'H', color: 0xf1f5f9, size: 0.65, pos: [-5.8, -0.6, 0] }
    ];

    const bonds = [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      [5, 6], [3, 7], [4, 8], [8, 9], [9, 10], [10, 5],
      [1, 11], [2, 12], [9, 13]
    ];

    // Build atoms
    atoms.forEach((a, idx) => {
      const geo = new THREE.SphereGeometry(a.size * 1.2, 24, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: a.color,
        roughness: 0.2,
        metalness: 0.6,
        emissive: a.color,
        emissiveIntensity: 0.15
      });
      const atomMesh = new THREE.Mesh(geo, mat);
      atomMesh.position.set(a.pos[0] * 2.2, a.pos[1] * 2.2, a.pos[2] * 2.2);
      group.add(atomMesh);
    });

    // Build covalent bond cylinders
    bonds.forEach(([i, j]) => {
      const p1 = new THREE.Vector3(atoms[i].pos[0] * 2.2, atoms[i].pos[1] * 2.2, atoms[i].pos[2] * 2.2);
      const p2 = new THREE.Vector3(atoms[j].pos[0] * 2.2, atoms[j].pos[1] * 2.2, atoms[j].pos[2] * 2.2);
      const distance = p1.distanceTo(p2);
      const bondGeo = new THREE.CylinderGeometry(0.32, 0.32, distance, 12);
      const bondMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.4 });
      const bond = new THREE.Mesh(bondGeo, bondMat);
      bond.position.copy(p1).lerp(p2, 0.5);
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
      group.add(bond);
    });
  }

  const resetView = () => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className={`relative flex flex-col rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950/80 shadow-2xl ${
      isFullscreen ? 'fixed inset-4 z-50 bg-slate-950' : isEmbedded ? 'h-[440px] w-full' : 'h-[520px] w-full'
    }`}>
      {/* Top HUD Controls */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/20 text-xs">
          <Dna className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-mono text-cyan-200 font-semibold uppercase tracking-wider">{targetTitle}</span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-[10px] text-cyan-300">
            WebGL PBR
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-slate-700/60 text-xs">
          <button
            onClick={() => setMode('dna_helix')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              mode === 'dna_helix' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            DNA Helix
          </button>
          <button
            onClick={() => setMode('protein_ribbon')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              mode === 'protein_ribbon' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            AlphaFold Ribbon
          </button>
          <button
            onClick={() => setMode('molecule_cpk')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              mode === 'molecule_cpk' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            CPK Molecule
          </button>
          <button
            onClick={() => setMode('capsid_shell')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              mode === 'capsid_shell' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bio-Capsid
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Color Theme Selector */}
        <div className="flex items-center gap-1 pointer-events-auto bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-cyan-500/20 text-xs">
          <Palette className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
          <button
            onClick={() => setColorTheme('plddt')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
              colorTheme === 'plddt' ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50' : 'text-slate-400'
            }`}
            title="Color by AlphaFold pLDDT confidence (Dark Blue >90, Light Blue 70-90, Yellow 50-70, Orange <50)"
          >
            pLDDT Confidence
          </button>
          <button
            onClick={() => setColorTheme('spectrum')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
              colorTheme === 'spectrum' ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' : 'text-slate-400'
            }`}
          >
            Spectrum N→C
          </button>
        </div>

        {/* Playback & View Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-cyan-500/20">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            title={isPlaying ? 'Pause Rotation' : 'Resume Thermal Rotation'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-cyan-400" /> : <Play className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            onClick={resetView}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            title="Reset View"
          >
            <RotateCw className="w-4 h-4 text-slate-400 hover:text-cyan-300" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>
    </div>
  );
};
