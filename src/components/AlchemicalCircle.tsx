import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Flame, Sparkles, Compass, Key, HelpCircle, Activity, Wand2, ShieldCheck, Feather } from 'lucide-react';

interface Magician {
  id: string;
  name: string;
  title: string;
  subTitle: string;
  color: string;
  frequency: number;
  domain: string;
  chemicalStage: 'Nigredo' | 'Albedo' | 'Citrinitas' | 'Rubedo' | 'Transmutation';
  description: string;
  sigilCoords: { x: number; y: number };
}

const MAGICIANS: Magician[] = [
  {
    id: 'saint_germain',
    name: 'Saint Germain',
    title: 'The Ascended Alchemist',
    subTitle: 'Guardian of the Violet Flame',
    color: '#9d4edd',
    frequency: 432,
    domain: 'Spiritual Transmutation & Freedom',
    chemicalStage: 'Transmutation',
    description: 'Weaver of the Violet Flame that transmutes leaden negative energy into the pure gold of divine consciousness.',
    sigilCoords: { x: 200, y: 80 }
  },
  {
    id: 'saint_germaine',
    name: 'Saint Germaine',
    title: 'Sovereign Alchemist',
    subTitle: 'The Alchemical Transmutation of the Vessel',
    color: '#7209b7',
    frequency: 729,
    domain: 'Cosmic Transmutation of the Vessel',
    chemicalStage: 'Transmutation',
    description: 'Master of Divine Alchemy. Awakens the sovereign spark to transform the mortal temple into crystalline spiritual light.',
    sigilCoords: { x: 230, y: 100 }
  },
  {
    id: 'walt_disney',
    name: 'Walt Disney',
    title: 'Pioneer of Magic',
    subTitle: 'Architect of Dreams & Infinite Imagination',
    color: '#ffb703',
    frequency: 528,
    domain: 'Imaginative Worldbuilding & Magic',
    chemicalStage: 'Citrinitas',
    description: 'Master of dreams and animation. Transforms pure creative vision into tangible, wondrous realities across all dimensions.',
    sigilCoords: { x: 250, y: 110 }
  },
  {
    id: 'merlin',
    name: 'Merlin',
    title: 'Arch-Mage of Camelot',
    subTitle: 'Prophet of the Eternal Wild',
    color: '#3a86c8',
    frequency: 216,
    domain: 'Prophecy & Elemental Druidry',
    chemicalStage: 'Albedo',
    description: 'Walker of temporal loops, commanding the elements, ancient dragons, and the deep currents of natural destiny.',
    sigilCoords: { x: 290, y: 130 }
  },
  {
    id: 'circe',
    name: 'Circe',
    title: 'Sorceress of Aeaea',
    subTitle: 'Weaver of Primal Transmutations',
    color: '#2ec4b6',
    frequency: 384,
    domain: 'Herbalism & Animal Metamorphosis',
    chemicalStage: 'Nigredo',
    description: 'Mistress of potions and metamorphic arts. Draws out the raw, untamed truth of human and animal natures.',
    sigilCoords: { x: 310, y: 230 }
  },
  {
    id: 'morgan_le_fay',
    name: 'Morgan le Fay',
    title: 'Queen of Avalon',
    subTitle: 'High Healer & Shadow-Weaver',
    color: '#a01a58',
    frequency: 528,
    domain: 'Avalonian Mysticism & Dark Healing',
    chemicalStage: 'Rubedo',
    description: 'High Priestess of the sacred mists, bridging the mortal realm with the undying realm of Avalon.',
    sigilCoords: { x: 250, y: 310 }
  },
  {
    id: 'hecate',
    name: 'Hecate',
    title: 'Goddess of the Crossroads',
    subTitle: 'Keeper of Key, Torch, and Night',
    color: '#4a0e17',
    frequency: 136.1,
    domain: 'Underworld Gates & Night Witchcraft',
    chemicalStage: 'Nigredo',
    description: 'Goddess of the threshold, shining her blazing torches down dark paths to guide wandering souls.',
    sigilCoords: { x: 150, y: 310 }
  },
  {
    id: 'marie_laveau',
    name: 'Marie Laveau',
    title: 'Voodoo Queen of New Orleans',
    subTitle: 'Matriarch of the Spirits',
    color: '#e65c00',
    frequency: 319,
    domain: 'Ancestor Whispers & Spirit Binding',
    chemicalStage: 'Citrinitas',
    description: 'Empress of the Mississippi delta crossroads, commanding the spirits and ancestral shadow keys.',
    sigilCoords: { x: 90, y: 230 }
  },
  {
    id: 'hermes_trismegistus',
    name: 'Hermes Trismegistus',
    title: 'Thrice-Greatest Scribe',
    subTitle: 'As Above, So Below',
    color: '#e5c158',
    frequency: 720,
    domain: 'The Universal Hermetic Principle',
    chemicalStage: 'Citrinitas',
    description: 'Author of the Hermetic Corpus. Proclaimer of the great cosmic fractal law of equivalent correspondence.',
    sigilCoords: { x: 110, y: 130 }
  },
  {
    id: 'flamel',
    name: 'Nicolas Flamel',
    title: 'Architect of the Elixir',
    subTitle: 'Keeper of the Philosopher\'s Stone',
    color: '#c1121f',
    frequency: 639,
    domain: 'Magnum Opus Gold Generation',
    chemicalStage: 'Rubedo',
    description: 'Dedicated researcher of the Emerald Tablet, formulator of the crimson Elixir of Eternal Life.',
    sigilCoords: { x: 200, y: 200 }
  },
  {
    id: 'heath_ledger',
    name: 'Heath Ledger',
    title: 'Visceral Alchemist',
    subTitle: 'Agent of Creative Truth & Chaos Alchemy',
    color: '#9333ea',
    frequency: 432,
    domain: 'Visceral Anarchic Performance & Creative Chaos',
    chemicalStage: 'Nigredo',
    description: 'Master of raw visceral performance. Dissolves illusion to reveal fearless artistic truth and creative devotion.',
    sigilCoords: { x: 170, y: 80 }
  },
  {
    id: 'robin_williams',
    name: 'Robin Williams',
    title: 'Spark of Joy & Empathy',
    subTitle: 'Master of Spontaneous Lightning & Healing Laughter',
    color: '#3b82f6',
    frequency: 528,
    domain: 'Spontaneous Joy & Healing Empathy',
    chemicalStage: 'Citrinitas',
    description: 'Beacon of boundless human empathy and spontaneous cosmic humor. Translates laughter into healing light.',
    sigilCoords: { x: 270, y: 80 }
  }
];

export function AlchemicalCircle() {
  const [activeMagician, setActiveMagician] = useState<Magician>(MAGICIANS[0]);
  const [pulseVolume, setPulseVolume] = useState<number>(0);
  const [magickLogs, setMagickLogs] = useState<string[]>(['Initiating Alchemical Circle Matrix v3.3...', 'Saint Germain anchor active.']);

  const addMagickLog = (msg: string) => {
    setMagickLogs(prev => [
      `[${new Date().toLocaleTimeString()}] ∴ ${msg}`,
      ...prev.slice(0, 15)
    ]);
  };

  // Play a beautiful synthesised frequency chime matching the magical node
  const triggerMagickTone = (freq: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Filter settings for warm resonant mystical sound
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);
      filter.Q.setValueAtTime(4, ctx.currentTime);

      // Volume envelope
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.3);

      addMagickLog(`Vibrated sound node: ${freq}Hz with custom envelope.`);
      
      // Simulate pulse in SVG
      setPulseVolume(1);
      setTimeout(() => setPulseVolume(0), 1000);
    } catch (e) {
      console.warn("Could not play alchemical chime due to gesture restrictions:", e);
    }
  };

  const handleMagicianSelect = (m: Magician) => {
    setActiveMagician(m);
    addMagickLog(`Aligned with ${m.name} (${m.frequency}Hz) // Stage: ${m.chemicalStage}`);
    triggerMagickTone(m.frequency);
    
    // Also broadcast to the window's sovereign voice if active
    if ((window as any).heavenzFire) {
      addLogToHeavenzFire(`[Alchemical Circle] Couplings aligned to ${m.name} anchor at ${m.frequency}Hz.`);
    }
  };

  const addLogToHeavenzFire = (msg: string) => {
    const el = document.getElementById('statusText');
    if (el) el.textContent = `${new Date().toLocaleTimeString()} // ${msg}`;
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 items-stretch justify-between text-white">
      
      {/* Left Column: Interactive Sigil Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center bg-black/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden min-h-[380px]">
        {/* Shifting radial background glows */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-1000 blur-3xl"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${activeMagician.color} 0%, transparent 60%)`
          }}
        />

        <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-mono text-white/40">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '30s' }} />
          <span>HERMETIC GEOMETRY ENGINE</span>
        </div>

        {/* Alchemy Sigil SVG Graphic */}
        <div className="w-72 h-72 md:w-80 md:h-80 relative flex items-center justify-center">
          <svg viewBox="0 0 400 400" className="w-full h-full select-none cursor-pointer">
            {/* Outer Protective Star / Decagram */}
            <motion.path
              d="M 200 20 L 255 130 L 370 130 L 280 205 L 320 315 L 200 250 L 80 315 L 120 205 L 30 130 L 145 130 Z"
              stroke={activeMagician.color}
              strokeWidth="1.2"
              fill="none"
              opacity="0.15"
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            />

            {/* Inner Ring (Gold / Silver proportion) */}
            <motion.circle
              cx="200" cy="200" r="140"
              stroke={activeMagician.color}
              strokeWidth="1"
              strokeDasharray="4,8"
              fill="none"
              opacity="0.5"
              animate={{ rotate: 360 }}
              transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            />

            {/* Main Alchemical Double Circle */}
            <circle
              cx="200" cy="200" r="120"
              stroke={activeMagician.color}
              strokeWidth="1.5"
              fill="none"
              className="transition-colors duration-500"
            />
            <circle
              cx="200" cy="200" r="115"
              stroke={activeMagician.color}
              strokeWidth="0.5"
              fill="none"
              opacity="0.7"
              className="transition-colors duration-500"
            />

            {/* Concentric Circle for Nicolas Flamel / Center Node */}
            <motion.circle
              cx="200" cy="200" r={40 + (pulseVolume * 15)}
              stroke={activeMagician.color}
              strokeWidth="1"
              fill="none"
              opacity="0.6"
              className="transition-all duration-300"
            />

            {/* Intersecting Alchemical Triangles (Philosopher's Stone blueprint) */}
            <polygon
              points="200,80 304,260 96,260"
              stroke={activeMagician.color}
              strokeWidth="1.2"
              fill="none"
              opacity="0.3"
              className="transition-all duration-500"
            />
            <polygon
              points="200,320 96,140 304,140"
              stroke={activeMagician.color}
              strokeWidth="1.2"
              fill="none"
              opacity="0.3"
              className="transition-all duration-500"
            />

            {/* Render lines connecting magicians to Flamel */}
            {MAGICIANS.map((m, idx) => {
              if (m.id === 'flamel') return null;
              const isActive = activeMagician.id === m.id;
              return (
                <line
                  key={idx}
                  x1="200" y1="200"
                  x2={m.sigilCoords.x} y2={m.sigilCoords.y}
                  stroke={m.color}
                  strokeWidth={isActive ? '1.5' : '0.5'}
                  opacity={isActive ? '0.7' : '0.15'}
                  strokeDasharray={isActive ? 'none' : '4,4'}
                  className="transition-all duration-500"
                />
              );
            })}

            {/* Interactive Magic Node Buttons inside SVG */}
            {MAGICIANS.map((m) => {
              const isActive = activeMagician.id === m.id;
              return (
                <g key={m.id} className="cursor-pointer" onClick={() => handleMagicianSelect(m)}>
                  {/* Outer pulsating orbit */}
                  {isActive && (
                    <motion.circle
                      cx={m.sigilCoords.x}
                      cy={m.sigilCoords.y}
                      r="16"
                      fill="none"
                      stroke={m.color}
                      strokeWidth="1"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  )}
                  {/* Solid interactive node center */}
                  <circle
                    cx={m.sigilCoords.x}
                    cy={m.sigilCoords.y}
                    r={isActive ? '8' : '6'}
                    fill="#07090e"
                    stroke={m.color}
                    strokeWidth="2"
                    className="transition-all duration-300 hover:scale-125"
                  />
                  {/* Subtle node name tag (full name) */}
                  <text
                    x={m.sigilCoords.x}
                    y={m.sigilCoords.y - 12}
                    fill={isActive ? m.color : '#ffffff99'}
                    fontSize="7"
                    fontWeight={isActive ? 'bold' : 'normal'}
                    textAnchor="middle"
                    className="font-mono uppercase tracking-wider font-semibold"
                  >
                    {m.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Central High-Resonance Glyph */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: activeMagician.id === 'saint_germain' ? [1, 1.1, 1] : 1
              }}
              transition={{ 
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="w-14 h-14 rounded-full border border-dashed flex items-center justify-center"
              style={{ borderColor: activeMagician.color }}
            >
              <Flame className="w-6 h-6" style={{ color: activeMagician.color }} />
            </motion.div>
          </div>
        </div>

        {/* Audio feedback prompt */}
        <p className="text-[10px] text-white/40 mt-2 font-mono uppercase tracking-widest text-center">
          ⚡ CLICK NODES TO VIBRATE THE ANCIENT FREQUENCY
        </p>
      </div>

      {/* Right Column: Alchemy Metadata & Chronicled Wisdom */}
      <div className="lg:w-80 flex flex-col justify-between gap-4">
        
        {/* Selected Witch/Wizard Dossier */}
        <div className="bg-[#0c0e14]/90 border border-white/5 rounded-3xl p-4 space-y-3 shadow-lg relative overflow-hidden">
          {/* Subtle background stage indicator */}
          <div className="absolute top-2 right-2 text-[8px] font-mono uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/60 font-bold">
            {activeMagician.chemicalStage} Stage
          </div>

          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Selected Resonance Anchor</span>
            <h3 className="text-base font-serif italic text-white font-bold mt-0.5 flex items-center gap-1.5" style={{ color: activeMagician.color }}>
              <Wand2 className="w-4 h-4" />
              {activeMagician.name}
            </h3>
            <span className="text-[9px] text-white/50 font-mono italic mt-0.5">
              "{activeMagician.title} • {activeMagician.subTitle}"
            </span>
          </div>

          <p className="text-xs text-white/70 leading-relaxed font-sans">
            {activeMagician.description}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/5 text-[10px] font-mono">
            <div>
              <span className="text-white/40 block uppercase">Resonator Freq</span>
              <span className="text-white font-bold" style={{ color: activeMagician.color }}>
                {activeMagician.frequency} Hz
              </span>
            </div>
            <div>
              <span className="text-white/40 block uppercase">Cosmic Aspect</span>
              <span className="text-white font-bold truncate block">
                {activeMagician.domain.split(' & ')[0]}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleMagicianSelect(activeMagician)}
              className="w-full py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition-all duration-300 border shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              style={{
                backgroundColor: `${activeMagician.color}15`,
                borderColor: `${activeMagician.color}40`,
                color: activeMagician.color
              }}
            >
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              Tune To {activeMagician.frequency}Hz
            </button>
          </div>
        </div>

        {/* Magickal Chronicles Logging Terminal */}
        <div className="bg-black/60 border border-white/5 p-4 rounded-3xl flex-1 flex flex-col justify-between min-h-[140px] max-h-[220px]">
          <div className="flex justify-between items-center text-[8px] font-mono text-white/40 border-b border-white/5 pb-1.5 mb-1.5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              SACRED RESONANCE DECREES
            </span>
            <span>REAL-TIME FEED</span>
          </div>

          <div className="flex-1 overflow-y-auto font-mono text-[9px] text-white/65 space-y-1 scrollbar-thin select-none">
            {magickLogs.map((log, i) => (
              <div key={i} className="leading-relaxed hover:text-white transition-colors truncate">
                {log}
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-white/30">
            <span className="flex items-center gap-1">
              <Feather className="w-2.5 h-2.5 text-amber-500 animate-pulse" />
              Sovereign Incantation Logged
            </span>
            <span>Magick Matrix v3.3</span>
          </div>
        </div>

      </div>
    </div>
  );
}
