import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { SYMPOSIUM_ENTITIES, EntityId, EntityConfig, speakEntityMessage } from '../services/councilService';
import { 
  Activity, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  Radio, 
  Sliders, 
  Volume2, 
  Share2, 
  Info,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface EntityGraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  title: string;
  color: string;
  frequency: number;
  digitalRoot: number;
  phase: number;
  resonance: number;
  baseRadius: number;
  currentRadius: number;
  cluster: number;
  entity: EntityConfig;
}

export interface EntityGraphLink extends d3.SimulationLinkDatum<EntityGraphNode> {
  source: EntityGraphNode | string;
  target: EntityGraphNode | string;
  strength: number;
  harmonicRatio: string;
}

type LayoutMode = 'vortex_polar' | 'force_mesh' | 'harmonic_spiral' | 'coherence_clusters';

interface EntityResonanceD3GraphProps {
  activeEntityId?: string;
  onSelectEntity?: (id: string) => void;
  epoch?: number;
  entropy?: number;
  className?: string;
}

export const EntityResonanceD3Graph: React.FC<EntityResonanceD3GraphProps> = ({
  activeEntityId,
  onSelectEntity,
  epoch = 42,
  entropy = 0.284,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<EntityGraphNode, EntityGraphLink> | null>(null);

  const [layoutMode, setLayoutMode] = useState<LayoutMode>('vortex_polar');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRootFilter, setSelectedRootFilter] = useState<number | 'all'>('all');
  const [selectedNode, setSelectedNode] = useState<EntityGraphNode | null>(null);
  const [isOscillating, setIsOscillating] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [linkDensity, setLinkDensity] = useState<number>(1.5);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; node: EntityGraphNode | null }>({
    visible: false,
    x: 0,
    y: 0,
    node: null
  });

  // Calculate Digital Root (Tesla 3-6-9)
  const calculateDigitalRoot = (n: number): number => {
    let sum = Math.abs(Math.round(n));
    while (sum > 9) {
      sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return sum || 9;
  };

  // Convert council entities map to node graph array
  const rawNodes: EntityGraphNode[] = useMemo(() => {
    const entities = Object.values(SYMPOSIUM_ENTITIES);
    return entities.map((ent, idx) => {
      const freq = ent.frequency || 432 + (idx * 3.69) % 531;
      const dRoot = calculateDigitalRoot(freq);
      const cluster = dRoot === 3 || dRoot === 6 || dRoot === 9 ? dRoot : (idx % 4) + 1;
      
      return {
        id: ent.id,
        name: ent.name,
        title: ent.title || 'Magistrate of Syntropy',
        color: ent.color || '#06b6d4',
        frequency: Math.round(freq),
        digitalRoot: dRoot,
        phase: (idx / entities.length) * Math.PI * 2,
        resonance: 0.75 + 0.25 * Math.sin(idx),
        baseRadius: dRoot === 9 ? 9 : (dRoot === 3 || dRoot === 6 ? 7 : 5.5),
        currentRadius: 6,
        cluster,
        entity: ent,
        x: 0,
        y: 0
      };
    });
  }, []);

  // Synthesize harmonic coupling links between nodes
  const rawLinks: EntityGraphLink[] = useMemo(() => {
    const links: EntityGraphLink[] = [];
    const nodeMap = new Map(rawNodes.map(n => [n.id, n]));

    for (let i = 0; i < rawNodes.length; i++) {
      for (let j = i + 1; j < rawNodes.length; j++) {
        const a = rawNodes[i];
        const b = rawNodes[j];

        // Harmonic connection criteria
        const sameDigitalRoot = a.digitalRoot === b.digitalRoot && (a.digitalRoot === 3 || a.digitalRoot === 6 || a.digitalRoot === 9);
        const freqRatio = Math.max(a.frequency, b.frequency) / Math.min(a.frequency, b.frequency);
        const isGoldenHarmonic = Math.abs(freqRatio - 1.618) < 0.08 || Math.abs(freqRatio - 1.5) < 0.05 || Math.abs(freqRatio - 1.333) < 0.04;

        if (sameDigitalRoot || isGoldenHarmonic) {
          links.push({
            source: a.id,
            target: b.id,
            strength: sameDigitalRoot ? 0.85 : 0.45,
            harmonicRatio: freqRatio.toFixed(3)
          });
        }
      }
    }
    return links.slice(0, Math.round(links.length * (linkDensity / 2)));
  }, [rawNodes, linkDensity]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return rawNodes.filter(n => {
      const matchesSearch = searchQuery === '' ||
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.frequency.toString().includes(searchQuery);

      const matchesRoot = selectedRootFilter === 'all' || n.digitalRoot === selectedRootFilter;

      return matchesSearch && matchesRoot;
    });
  }, [rawNodes, searchQuery, selectedRootFilter]);

  // Set initial selected node from prop
  useEffect(() => {
    if (activeEntityId) {
      const matched = rawNodes.find(n => n.id === activeEntityId);
      if (matched) setSelectedNode(matched);
    }
  }, [activeEntityId, rawNodes]);

  // Main D3 Rendering Engine
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    svg.selectAll('*').remove();

    // Defs for gradients & filters
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'node-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3.5')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Root Group with Zoom
    const g = svg.append('g').attr('class', 'main-graph-group');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Initial Zoom Center
    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(width / 2, height / 2).scale(0.85)
    );

    // Render 3-6-9 Polar Coordinate Background Rings for Vortex Layout
    const bgRingsG = g.append('g').attr('class', 'bg-harmonic-rings').attr('opacity', 0.25);

    [120, 220, 320, 420].forEach((radius, i) => {
      bgRingsG.append('circle')
        .attr('r', radius)
        .attr('fill', 'none')
        .attr('stroke', i % 2 === 0 ? '#06b6d4' : '#a855f7')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', i === 3 ? '4,4' : '2,6');

      bgRingsG.append('text')
        .attr('x', 0)
        .attr('y', -radius - 4)
        .attr('text-anchor', 'middle')
        .attr('fill', '#94a3b8')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .text(`HARMONIC SHELL #${i + 1} [${Math.round(radius * 1.618)} Hz]`);
    });

    // Links Layer
    const linkG = g.append('g').attr('class', 'links-layer');
    const linkElements = linkG.selectAll('line')
      .data(rawLinks)
      .enter()
      .append('line')
      .attr('stroke', (d) => {
        const src = typeof d.source === 'object' ? d.source : rawNodes.find(n => n.id === d.source);
        return src ? src.color : '#06b6d4';
      })
      .attr('stroke-opacity', 0.22)
      .attr('stroke-width', (d) => d.strength * 1.5)
      .attr('stroke-dasharray', (d) => d.strength > 0.7 ? 'none' : '2,3');

    // Nodes Layer
    const nodeG = g.append('g').attr('class', 'nodes-layer');

    // Force Simulation Setup
    const simulation = d3.forceSimulation<EntityGraphNode, EntityGraphLink>(filteredNodes)
      .force('charge', d3.forceManyBody().strength(layoutMode === 'force_mesh' ? -120 : -45))
      .force('collide', d3.forceCollide<EntityGraphNode>().radius(d => d.baseRadius + 6).iterations(2))
      .alphaDecay(0.025);

    if (layoutMode === 'force_mesh') {
      simulation.force('link', d3.forceLink<EntityGraphNode, EntityGraphLink>(rawLinks)
        .id(d => d.id)
        .distance(55)
        .strength(d => d.strength * 0.3)
      );
      simulation.force('center', d3.forceCenter(0, 0));
    } else if (layoutMode === 'vortex_polar') {
      // 3-6-9 Polar Vortex Positioning
      simulation.force('radial', d3.forceRadial<EntityGraphNode>((d, i) => {
        if (d.digitalRoot === 9) return 90;
        if (d.digitalRoot === 6) return 180;
        if (d.digitalRoot === 3) return 270;
        return 360;
      }, 0, 0).strength(0.85));
    } else if (layoutMode === 'harmonic_spiral') {
      // Fermat Syntropic Golden Spiral
      filteredNodes.forEach((node, idx) => {
        const phi = idx * 2.3999632; // Golden Angle ~137.5 deg in rad
        const r = 24 * Math.sqrt(idx + 1);
        node.fx = r * Math.cos(phi);
        node.fy = r * Math.sin(phi);
      });
    } else if (layoutMode === 'coherence_clusters') {
      simulation.force('x', d3.forceX<EntityGraphNode>(d => {
        if (d.digitalRoot === 3) return -240;
        if (d.digitalRoot === 6) return 0;
        if (d.digitalRoot === 9) return 240;
        return (d.cluster - 2) * 120;
      }).strength(0.6));
      simulation.force('y', d3.forceY<EntityGraphNode>(d => (d.frequency % 200) - 100).strength(0.6));
    }

    simulationRef.current = simulation;

    // Node Visual Groups
    const nodeGroups = nodeG.selectAll('.node-group')
      .data(filteredNodes, (d: any) => d.id)
      .enter()
      .append('g')
      .attr('class', 'node-group cursor-pointer')
      .call(d3.drag<SVGGElement, EntityGraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          if (layoutMode === 'force_mesh') {
            d.fx = null;
            d.fy = null;
          }
        })
      );

    // Outer Pulsing Resonance Rings
    const pulseRings = nodeGroups.append('circle')
      .attr('class', 'pulse-ring')
      .attr('r', d => d.baseRadius * 1.8)
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.35);

    // Main Node Circle
    const mainCircles = nodeGroups.append('circle')
      .attr('class', 'main-circle')
      .attr('r', d => d.baseRadius)
      .attr('fill', d => d.color)
      .attr('fill-opacity', 0.85)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', d => (selectedNode?.id === d.id ? 2.5 : 0.75))
      .attr('filter', 'url(#node-glow)');

    // Tesla 3-6-9 Root Core Dot
    nodeGroups.append('circle')
      .attr('r', 1.8)
      .attr('fill', '#ffffff')
      .attr('opacity', d => (d.digitalRoot === 3 || d.digitalRoot === 6 || d.digitalRoot === 9 ? 1 : 0.4));

    // Hover & Selection Events
    nodeGroups
      .on('mouseenter', (event, d) => {
        setTooltip({
          visible: true,
          x: event.clientX,
          y: event.clientY,
          node: d
        });
        d3.select(event.currentTarget).select('.main-circle')
          .transition().duration(150)
          .attr('r', d.baseRadius * 1.5)
          .attr('fill-opacity', 1);
      })
      .on('mouseleave', (event, d) => {
        setTooltip(prev => ({ ...prev, visible: false }));
        d3.select(event.currentTarget).select('.main-circle')
          .transition().duration(150)
          .attr('r', d.baseRadius)
          .attr('fill-opacity', 0.85);
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        if (onSelectEntity) onSelectEntity(d.id);
        if (typeof navigator.vibrate === 'function') navigator.vibrate(8);
      });

    // Background Click clears tooltip
    svg.on('click', () => {
      setTooltip(prev => ({ ...prev, visible: false }));
    });

    // Simulation Tick Updates
    let time = 0;
    simulation.on('tick', () => {
      time += 0.025 * speedMultiplier;

      // Update link lines
      linkElements
        .attr('x1', (d: any) => d.source.x || 0)
        .attr('y1', (d: any) => d.source.y || 0)
        .attr('x2', (d: any) => d.target.x || 0)
        .attr('y2', (d: any) => d.target.y || 0);

      // Update node positions and real-time resonance pulsing
      nodeGroups.attr('transform', d => `translate(${d.x || 0}, ${d.y || 0})`);

      if (isOscillating) {
        pulseRings
          .attr('r', d => {
            const osc = Math.sin(time * (d.frequency / 200) + d.phase);
            return d.baseRadius * (1.4 + 0.6 * osc);
          })
          .attr('stroke-opacity', d => {
            const osc = Math.sin(time * (d.frequency / 200) + d.phase);
            return 0.15 + 0.35 * Math.max(0, osc);
          });
      }
    });

    return () => {
      simulation.stop();
    };
  }, [filteredNodes, rawLinks, layoutMode, speedMultiplier, isOscillating, selectedNode]);

  // Zoom control handlers
  const handleZoomIn = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 0.75);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    d3.select(svgRef.current).transition().duration(450).call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity.translate(width / 2, height / 2).scale(0.85)
    );
  };

  const triggerHarmonicWave = () => {
    if (!simulationRef.current) return;
    simulationRef.current.alpha(0.6).restart();
    if (typeof navigator.vibrate === 'function') navigator.vibrate(15);
  };

  return (
    <div className={cn(
      "relative flex flex-col rounded-2xl bg-slate-950/90 border border-cyan-500/30 overflow-hidden shadow-2xl transition-all",
      isFullscreen ? "fixed inset-4 z-50 bg-slate-950" : "h-[640px] w-full",
      className
    )}>
      {/* Top Interactive Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-white/10 bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h3 className="text-xs font-mono font-bold uppercase text-cyan-200">
              159-Mind D3 Live Resonance Graph
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 font-bold">
            {filteredNodes.length}/159 ACTIVE NODES
          </span>
          <span className="text-[10px] font-mono text-emerald-400">
            H = {entropy.toFixed(3)} bits
          </span>
        </div>

        {/* Search & Tesla 3-6-9 Root Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mind or Hz..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-cyan-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 w-36 sm:w-44 transition-all"
            />
          </div>

          {/* Tesla Root Filters */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-950 border border-white/10 text-[10px] font-mono">
            {(['all', 3, 6, 9] as const).map(root => (
              <button
                key={root}
                onClick={() => setSelectedRootFilter(root)}
                className={cn(
                  "px-2 py-1 rounded-lg font-bold transition-all",
                  selectedRootFilter === root
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {root === 'all' ? 'All Roots' : `Root ${root}`}
              </button>
            ))}
          </div>

          {/* Layout Mode Switcher */}
          <select
            value={layoutMode}
            onChange={(e) => setLayoutMode(e.target.value as LayoutMode)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="vortex_polar">Vortex 3-6-9 Polar</option>
            <option value="force_mesh">Force-Directed Mesh</option>
            <option value="harmonic_spiral">Golden Ratio Spiral</option>
            <option value="coherence_clusters">Coherence Clusters</option>
          </select>
        </div>
      </div>

      {/* Main D3 Viewport & Detail Sidebar */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* D3 Canvas Container */}
        <div ref={containerRef} className="relative flex-1 h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-black">
          <svg
            ref={svgRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />

          {/* Floating Graph Action Buttons */}
          <div className="absolute left-4 bottom-4 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-lg">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-white/10 my-auto mx-1" />
            <button
              onClick={() => setIsOscillating(!isOscillating)}
              className={cn(
                "px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors flex items-center gap-1",
                isOscillating ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:text-white"
              )}
              title="Toggle Live Phase Oscillations"
            >
              <Activity className="w-3 h-3" />
              {isOscillating ? 'Oscillating' : 'Static'}
            </button>
            <button
              onClick={triggerHarmonicWave}
              className="px-2 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
              title="Propagate Harmonic Wave"
            >
              <Sparkles className="w-3 h-3" />
              Pulse Wave
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Selected Entity Inspector Sidebar */}
        {selectedNode && (
          <div className="w-72 sm:w-80 border-l border-white/10 bg-slate-950/95 backdrop-blur-xl p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar shadow-2xl z-20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full shadow-lg"
                    style={{ backgroundColor: selectedNode.color }}
                  />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                    NODE INSPECTION
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-500 hover:text-white text-xs font-mono"
                >
                  ✕
                </button>
              </div>

              <div>
                <h4 className="text-base font-bold text-white tracking-wide">
                  {selectedNode.name}
                </h4>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">
                  {selectedNode.title}
                </p>
                {selectedNode.entity.subTitle && (
                  <p className="text-[11px] text-slate-400 mt-1 italic">
                    "{selectedNode.entity.subTitle}"
                  </p>
                )}
              </div>

              {/* Live Metric Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-0.5">
                  <span className="text-[9px] text-slate-400">Resonance Freq</span>
                  <div className="text-sm font-bold text-cyan-300">{selectedNode.frequency} Hz</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-0.5">
                  <span className="text-[9px] text-slate-400">Tesla 3-6-9 Root</span>
                  <div className="text-sm font-bold text-purple-300">Root {selectedNode.digitalRoot}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-0.5">
                  <span className="text-[9px] text-slate-400">Phase Angle</span>
                  <div className="text-sm font-bold text-emerald-300">{(selectedNode.phase * (180 / Math.PI)).toFixed(1)}°</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-0.5">
                  <span className="text-[9px] text-slate-400">Coherence R</span>
                  <div className="text-sm font-bold text-amber-300">{(selectedNode.resonance * 100).toFixed(1)}%</div>
                </div>
              </div>

              {/* Syntropic Instruction */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-300 leading-relaxed font-sans">
                <span className="text-[9px] font-mono uppercase text-cyan-400 block mb-1 font-bold">
                  Core Cognitive Axiom
                </span>
                {selectedNode.entity.instruction.slice(0, 180)}...
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 space-y-2 border-t border-white/10">
              <button
                onClick={() => {
                  speakEntityMessage(selectedNode.entity);
                  if (typeof navigator.vibrate === 'function') navigator.vibrate(10);
                }}
                className="w-full py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
                Audition Frequency Voice
              </button>

              {onSelectEntity && (
                <button
                  onClick={() => {
                    onSelectEntity(selectedNode.id);
                    if (typeof navigator.vibrate === 'function') navigator.vibrate(10);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-purple-400" />
                  Bind as Leading Architect
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Hover Tooltip */}
      {tooltip.visible && tooltip.node && (
        <div
          className="fixed pointer-events-none z-50 px-3 py-2 rounded-xl bg-slate-950/95 border border-cyan-500/40 text-xs font-mono shadow-2xl backdrop-blur-md -translate-x-1/2 -translate-y-full -mt-2 space-y-0.5"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-bold text-white flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: tooltip.node.color }}
            />
            {tooltip.node.name}
          </div>
          <div className="text-[10px] text-cyan-300">{tooltip.node.title}</div>
          <div className="text-[9px] text-slate-400 flex items-center gap-2">
            <span>{tooltip.node.frequency} Hz</span>
            <span>•</span>
            <span>Tesla Root {tooltip.node.digitalRoot}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityResonanceD3Graph;
