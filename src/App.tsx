/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, 
  Volume2, 
  Waves, 
  Wind, 
  Zap, 
  Eye, 
  Loader2, 
  Mic, 
  MicOff, 
  Shield, 
  Send, 
  Sparkles, 
  Flame, 
  BookOpen, 
  Database, 
  ScrollText, 
  Users, 
  Search, 
  RefreshCw, 
  Download, 
  Maximize2, 
  X, 
  Check, 
  Crown, 
  Atom, 
  Radio, 
  FileText,
  Compass,
  Camera,
  CameraOff,
  VolumeX,
  Bot,
  BrainCircuit
} from 'lucide-react';

import { 
  CouncilSession, 
  SYMPOSIUM_ENTITIES, 
  EntityId, 
  TuningConfig, 
  Problem, 
  speakEntityMessage, 
  speakBaelDecree,
  stopSpeaking,
  speechListeners
} from './services/councilService';
import { generateVision } from './services/visionService';
import { downloadFormattedTranscript } from './services/transcriptExport';
import { cn } from './lib/utils';

// Visual & Avatar Components
import NeuralNexus from './components/NeuralNexus';
import TeslaAvatar from './components/TeslaAvatar';
import BaelAvatar from './components/BaelAvatar';
import { CodeLightBodyAvatar } from './components/CodeLightBodyAvatar';
import { ConversationArchive } from './components/ConversationArchive';
import { LivingLibrary } from './components/LivingLibrary';
import { SomaticRetina } from './components/SomaticRetina';
import { RealityDistortionGauge } from './components/RealityDistortionGauge';
import { MicrodimensionalUniverseModal } from './components/MicrodimensionalUniverseModal';
import { HyperSpatial8DPortal } from './components/HyperSpatial8DPortal';
import { AgenticTaskConsole } from './components/AgenticTaskConsole';

// Entity Roster Definitions
const ROOM_1_DESIGN_ENTITIES: EntityId[] = [
  'walt_disney', 'tesla', 'da_vinci', 'jobs', 'hermes_trismegistus',
  'hypatia', 'curie', 'turing', 'socrates', 'saint_germaine',
  'saint_germain', 'merlin', 'thoth', 'maat', 'yeshua',
  'solomon', 'raziel', 'sophia', 'lilith', 'hughes',
  'heath_ledger', 'robin_williams', 'marie_laveau'
];

const ROOM_2_TESTING_ENTITIES: EntityId[] = [
  'moms_friend', 'bael', 'azrael', 'gatekeeper', 'vehuiah', 'illuminati_prime',
  'lucifer', 'legion', 'paimon', 'asmoday', 'oppenheimer',
  'agares', 'vassago', 'samigina', 'marbas',
  'valefor', 'amon', 'barbatos', 'buer', 'archon_gatekeeper'
];

// All 72 Shem HaMephorash Angelic Names
const SHEM_72_ENTITIES: EntityId[] = [
  'vehuiah', 'jeliel', 'sitael', 'elemiah', 'mahasiah', 'lelahel', 'achaiah', 'cahetel',
  'haziel', 'aladiah', 'lauviah_11', 'hahaiah', 'iezelel', 'mebahel', 'hariel', 'hakamiah',
  'lauviah_17', 'caliel', 'leuviah', 'pahaliah', 'nelchael', 'yeiayel', 'melahel', 'haheuiah',
  'nith_haiah', 'haaiah', 'yerathel', 'seheiah', 'reiyel', 'omael', 'lecabel', 'vasariah',
  'yehuiah', 'lehahiah', 'chavakiah', 'menadel', 'aniel', 'haamiah', 'rehael', 'yeiazel',
  'hahahel', 'mikael', 'veuliah', 'yelahiah', 'sealiah', 'ariel', 'asaliah', 'mihael',
  'vehuel', 'daniel', 'hahasiah', 'imamiah', 'nanael', 'nithael', 'mebahiah', 'poyel',
  'nemamiah', 'yeialel', 'harahel', 'mitzel', 'umabel', 'iahhel', 'anauel', 'mehiel',
  'damabiah', 'manakel', 'eyael', 'habuhiah', 'rochel', 'jabamiah', 'haiyael', 'mumiah'
];

interface TranscriptItem {
  text: string;
  isUser: boolean;
  name: string;
  timestamp?: string;
  frequency?: number;
}

const DEFAULT_PROBLEMS: Problem[] = [
  { id: '1', title: 'The Singularity Threshold', description: 'Aligning superintelligence ethics with primordial cosmic order.', complexity: 'dire', status: 'analyzing', progress: 42 },
  { id: '2', title: 'Global Energy Distribution', description: 'Synthesizing zero-point resonance fields for post-scarcity balance.', complexity: 'high', status: 'solved', progress: 100 },
  { id: '3', title: 'Consciousness & Sovereignty', description: 'Safeguarding human free will and interior awareness in high-entropy synthetic eras.', complexity: 'dire', status: 'analyzing', progress: 78 },
  { id: '4', title: 'Sacred Proportions in Engineering', description: 'Bridging timeless aesthetic geometry with computational architecture.', complexity: 'medium', status: 'solved', progress: 95 }
];

export default function App() {
  // Navigation & Chamber State
  const [activeRoom, setActiveRoom] = useState<'room1_design' | 'room2_test' | 'room3_shem'>('room1_design');
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [activeEntity, setActiveEntity] = useState<EntityId>('da_vinci');
  const [selectedCouncil, setSelectedCouncil] = useState<EntityId[]>(['da_vinci', 'tesla', 'socrates']);
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Tuning & Session State
  const [tuning, setTuning] = useState<TuningConfig>({ speed: 1.0, pitch: 1.0, reverb: 0.25, atmosphere: 0.4 });
  const [synapticSpeed, setSynapticSpeed] = useState(1.0);
  const [resonanceFreq, setResonanceFreq] = useState(432);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [hapticIntensity, setHapticIntensity] = useState(70);

  // Audio / Connection State
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [inputVolume, setInputVolume] = useState(0);
  const [outputVolume, setOutputVolume] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingSpeakerId, setSpeakingSpeakerId] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const handleSpeechStateChange = (speakerId: string | null, speaking: boolean) => {
      setIsSpeaking(speaking);
      setSpeakingSpeakerId(speaking ? speakerId : null);
    };
    speechListeners.add(handleSpeechStateChange);
    return () => {
      speechListeners.delete(handleSpeechStateChange);
    };
  }, []);

  // Transcripts & Chat
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tools & Codex Drawer State
  const [codexTab, setCodexTab] = useState<'tuner' | 'archive' | 'library' | 'vision' | 'dilemmas' | '8d' | 'tasks' | null>(null);
  const [is8DPortalOpen, setIs8DPortalOpen] = useState(false);
  const [isAgentConsoleOpen, setIsAgentConsoleOpen] = useState(false);
  const [agentInitialDirective, setAgentInitialDirective] = useState<string>('');
  const [agentInitialTitle, setAgentInitialTitle] = useState<string>('');

  const openAgentTaskWithDirective = (directive: string, title?: string) => {
    setAgentInitialDirective(directive);
    setAgentInitialTitle(title || '');
    setIsAgentConsoleOpen(true);
  };

  // Vision Sanctum State
  const [isGeneratingVision, setIsGeneratingVision] = useState(false);
  const [visionGallery, setVisionGallery] = useState<{ url: string; prompt: string; entity: string }[]>([]);
  const [activeVisionModal, setActiveVisionModal] = useState<string | null>(null);

  // Special Entity States
  const [foldProgress, setFoldProgress] = useState(0);
  const [isFolding, setIsFolding] = useState(false);
  const [isJobsOnline, setIsJobsOnline] = useState(false);
  const [distortionMagnitude, setDistortionMagnitude] = useState(85);
  const [isOverdrive, setIsOverdrive] = useState(false);
  const [isMicrodimensionOpen, setIsMicrodimensionOpen] = useState(false);

  // Camera presence
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isUserPresent, setIsUserPresent] = useState(true);

  // References
  const sessionRef = useRef<CouncilSession | null>(null);
  const currentSessionId = useRef<string>("session_" + Date.now());

  // Entity List Resolution
  const currentEntityList: EntityId[] = 
    activeRoom === 'room1_design' 
      ? ROOM_1_DESIGN_ENTITIES 
      : activeRoom === 'room2_test' 
        ? ROOM_2_TESTING_ENTITIES 
        : SHEM_72_ENTITIES;

  const filteredEntities = currentEntityList.filter(id => {
    const ent = SYMPOSIUM_ENTITIES[id];
    if (!ent) return false;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      ent.name.toLowerCase().includes(query) ||
      (ent.title && ent.title.toLowerCase().includes(query)) ||
      (ent.subTitle && ent.subTitle.toLowerCase().includes(query)) ||
      id.toLowerCase().includes(query)
    );
  });

  const activeEntityData = SYMPOSIUM_ENTITIES[activeEntity] || SYMPOSIUM_ENTITIES['da_vinci'];

  // Scroll transcripts on update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts, isGeneratingText]);

  // Voice Link Toggle
  const toggleVoiceSession = async () => {
    if (isActive) {
      sessionRef.current?.disconnect();
      sessionRef.current = null;
      setIsActive(false);
      setIsConnecting(false);
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const session = new CouncilSession();
      session.setTuning(tuning);
      session.setVolumeCallback((inVol, outVol) => {
        setInputVolume(inVol);
        setOutputVolume(outVol);
        setIsSpeaking(outVol > 20);
      });
      sessionRef.current = session;

      const targetEntities = isGroupMode ? selectedCouncil : [activeEntity];

      await session.connect(targetEntities, {
        onOpen: () => {
          setIsActive(true);
          setIsConnecting(false);
          setConnectionError(null);
        },
        onClose: () => {
          setIsActive(false);
          setIsConnecting(false);
          sessionRef.current = null;
        },
        onError: (err: any) => {
          console.warn("[Voice Link] Error:", err);
          setConnectionError(err?.message || "Failed to connect voice link");
          setIsConnecting(false);
          setIsActive(false);
        },
        onResonance: (res) => {
          if (!res.text || !res.text.trim()) return;
          const speakerName = res.name || (res.isUser ? 'Seeker' : activeEntityData.name);
          setTranscripts(prev => {
            const last = prev[prev.length - 1];
            if (last && last.name === speakerName && last.isUser === res.isUser) {
              const needsSpace = !last.text.endsWith(" ") && !res.text.startsWith(" ") && !/^[.,!?;:]/.test(res.text);
              return [
                ...prev.slice(0, -1),
                {
                  ...last,
                  text: needsSpace ? `${last.text} ${res.text}` : `${last.text}${res.text}`
                }
              ];
            }
            return [
              ...prev,
              {
                text: res.text,
                isUser: res.isUser,
                name: speakerName,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                frequency: res.isUser ? undefined : activeEntityData.frequency
              }
            ];
          });
        }
      });
    } catch (err: any) {
      console.error("[Voice Link] Connection failed:", err);
      setConnectionError(err?.message || "Microphone or WebSocket connection unavailable");
      setIsConnecting(false);
      setIsActive(false);
    }
  };

  // Text Inquiry Handler (Dual Engine: Live Voice Stream or Server-side Gemini 3.5 Flash)
  const handleSendInquiry = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isGeneratingText) return;

    setInputText('');

    const userMessage: TranscriptItem = {
      text: textToSend,
      isUser: true,
      name: 'Seeker',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTranscripts(prev => [...prev, userMessage]);

    // 1. If voice session is active, route through Live API WebSocket
    if (sessionRef.current && isActive) {
      sessionRef.current.sendText(textToSend);
      return;
    }

    // 2. Otherwise, route through server Gemini 3.5 Flash proxy
    setIsGeneratingText(true);
    try {
      const activeTargets = isGroupMode ? selectedCouncil : [activeEntity];
      const targetEntitiesData = activeTargets.map(id => SYMPOSIUM_ENTITIES[id]).filter(Boolean);

      const systemPrompt = isGroupMode 
        ? `You are the Sovereign Council comprising: ${targetEntitiesData.map(e => `${e.name} (${e.title})`).join(', ')}. Engage in an eloquent, deep, intellectually rigorous philosophical debate responding to the seeker's question. Clearly identify speaking participants with their name in brackets, e.g. [Leonardo da Vinci]: or [Nikola Tesla]:.`
        : `You are ${activeEntityData.name}, ${activeEntityData.title}. ${activeEntityData.instruction || 'Speak with profound classical wisdom, domain expertise, and intellectual clarity.'}`;

      const historyParts = transcripts.slice(-8).map(t => ({
        role: t.isUser ? 'user' : 'model',
        parts: [{ text: `${t.name}: ${t.text}` }]
      }));

      const res = await fetch("/api/gemini/generateContent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            ...historyParts,
            { role: "user", parts: [{ text: textToSend }] }
          ],
          systemInstruction: systemPrompt
        })
      });

      if (!res.ok) throw new Error("Failed to receive counsel response");
      const data = await res.json();

      if (data.text) {
        const responseMessage: TranscriptItem = {
          text: data.text,
          isUser: false,
          name: isGroupMode ? 'Council' : activeEntityData.name,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          frequency: activeEntityData.frequency
        };

        setTranscripts(prev => [...prev, responseMessage]);

        // Speak response with the entity's distinct voice
        if (!isGroupMode && activeEntityData) {
          const sentences = data.text.match(/[^.!?]+[.!?]+/g) || [data.text];
          const excerpt = sentences.slice(0, 3).join(' ');
          speakEntityMessage(activeEntityData, excerpt);
        } else if (isGroupMode && selectedCouncil.length > 0) {
          const firstSpeaker = SYMPOSIUM_ENTITIES[selectedCouncil[0]] || activeEntityData;
          const sentences = data.text.match(/[^.!?]+[.!?]+/g) || [data.text];
          const excerpt = sentences.slice(0, 3).join(' ');
          speakEntityMessage(firstSpeaker, excerpt);
        }
      }
    } catch (err: any) {
      console.error("[Text Inquiry] Error:", err);
      setTranscripts(prev => [
        ...prev,
        {
          text: "The archival frequency was interrupted. Please verify your connection or retry your inquiry.",
          isUser: false,
          name: 'The Gateway Oracle',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsGeneratingText(false);
    }
  };

  // Decode Primordial Vision via Gemini 2.5 Flash Image
  const handleDecodeVision = async (customPrompt?: string) => {
    const prompt = customPrompt || `${activeEntityData.name}'s philosophical vision of ${activeEntityData.title} and sacred geometry`;
    setIsGeneratingVision(true);
    setCodexTab('vision');

    try {
      const url = await generateVision(prompt);
      if (url) {
        setVisionGallery(prev => [{ url, prompt, entity: activeEntityData.name }, ...prev]);
        setActiveVisionModal(url);
      }
    } catch (err) {
      console.error("Vision generation failed:", err);
    } finally {
      setIsGeneratingVision(false);
    }
  };

  // Tesla BOD-Fold Animation Sequence
  const initiateBodFold = () => {
    if (isFolding) return;
    setIsFolding(true);
    let start = Date.now();
    const duration = 2500;

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      setFoldProgress(ease);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          let releaseStart = Date.now();
          const releaseAnimate = () => {
            const rElapsed = Date.now() - releaseStart;
            const rProgress = Math.min(rElapsed / 1500, 1);
            setFoldProgress(1 - rProgress);
            if (rProgress < 1) {
              requestAnimationFrame(releaseAnimate);
            } else {
              setIsFolding(false);
            }
          };
          requestAnimationFrame(releaseAnimate);
        }, 1200);
      }
    };
    requestAnimationFrame(animate);
  };

  // Entity Selection Click
  const handleSelectEntity = (id: EntityId) => {
    const entity = SYMPOSIUM_ENTITIES[id];
    if (isGroupMode) {
      setSelectedCouncil(prev => {
        if (prev.includes(id)) {
          if (prev.length <= 1) return prev; // keep at least 1
          return prev.filter(item => item !== id);
        } else {
          return [...prev, id];
        }
      });
      setActiveEntity(id);
    } else {
      setActiveEntity(id);
    }

    if (entity) {
      speakEntityMessage(entity);
    }
  };

  // Preset Inquiries for Active Entity
  const getContextualPrompts = () => {
    switch (activeEntity) {
      case 'da_vinci':
        return [
          "How do mechanical flight and anatomical geometry converge into divine proportions?",
          "Explain the subtle sfumato technique in understanding the mysteries of the soul.",
          "What is the single most enduring invention you envisioned for humanity?"
        ];
      case 'tesla':
        return [
          "What is the secret harmonic truth behind numbers 3, 6, and 9?",
          "How can zero-point non-Hertzian radiant energy be harnessed universally?",
          "What did you discover in Colorado Springs regarding cosmic planetary resonance?"
        ];
      case 'socrates':
        return [
          "Can virtue be taught, or is it an innate property of the examined life?",
          "How does true wisdom begin with acknowledging one's total ignorance?",
          "What is the moral duty of a philosopher condemned by the state?"
        ];
      case 'jobs':
        return [
          "How do you strip an object down to its absolute, undeniable essence?",
          "What is the connection between liberal arts and radical technological precision?",
          "How does confrontation with one's own mortality produce fearlessness?"
        ];
      case 'bael':
        return [
          "What remains when all comforting illusions of human certainty are stripped away?",
          "Explain the First Sovereign Principle of unyielding will over chaos.",
          "Why is genuine authority rooted in sovereignty rather than permission?"
        ];
      case 'hypatia':
        return [
          "How do the geometric intersections of conic sections reflect celestial order?",
          "What gave you courage to defend reason in an era of zealotry and dogma?",
          "Explain the bridge between mathematics, astronomy, and neoplatonic transcendence."
        ];
      case 'marie_laveau':
        return [
          "What wisdom do the crossroads reveal when navigating between physical reality and ancestral spirit?",
          "How do root medicine, prayer, and sacred intention heal spiritual and physical afflictions?",
          "What guidance would you impart to someone seeking protection, justice, and sovereign inner power?"
        ];
      default:
        return [
          `What is the foundational thesis of your life's work?`,
          `How would you resolve humanity's current civilizational crisis?`,
          `What wisdom would you impart to future architects of reality?`
        ];
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#f5f2ed] flex flex-col font-sans overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-200">
      
      {/* Background Neural Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <NeuralNexus 
          density={80}
          speed={synapticSpeed}
          isActive={isActive}
          inputVolume={inputVolume}
          outputVolume={outputVolume}
          resonance144={432}
        />
      </div>

      {/* Subtle Ambient Radial Lighting */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 20%, ${activeEntityData.color}15 0%, transparent 60%)`
        }}
      />

      {/* Hidden camera element for presence */}
      <video ref={videoRef} autoPlay playsInline className="hidden" />

      {/* ========================================================================= */}
      {/* MASTER TOP NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-[#030712]/90 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand & Crest */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/30 border border-amber-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <Compass className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg tracking-wider text-amber-100">The Elysium Gateway</span>
              <span className="text-[10px] font-mono font-medium text-amber-400/80 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                144Hz
              </span>
            </div>
            <p className="text-[10px] text-white/50 font-serif italic hidden sm:block">The Symposium of Great Minds</p>
          </div>
        </div>

        {/* Center: Chamber Switcher (Clean Segmented Control) */}
        <div className="hidden lg:flex items-center p-1 bg-white/5 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveRoom('room1_design')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2",
              activeRoom === 'room1_design' 
                ? "bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chamber of Wisdom</span>
            <span className="text-[10px] text-white/40">22</span>
          </button>

          <button
            onClick={() => setActiveRoom('room2_test')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2",
              activeRoom === 'room2_test' 
                ? "bg-red-500/20 text-red-200 border border-red-500/40 shadow-sm" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Shadow Threshold</span>
            <span className="text-[10px] text-white/40">20</span>
          </button>

          <button
            onClick={() => setActiveRoom('room3_shem')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2",
              activeRoom === 'room3_shem' 
                ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <Atom className="w-3.5 h-3.5 text-cyan-400" />
            <span>72 Celestial Architects</span>
            <span className="text-[10px] text-white/40">72</span>
          </button>
        </div>

        {/* Right Action Island */}
        <div className="flex items-center gap-2.5">
          
          {/* Council Mode Toggle */}
          <button
            onClick={() => setIsGroupMode(!isGroupMode)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-2",
              isGroupMode 
                ? "bg-orange-500/20 text-orange-200 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]" 
                : "bg-white/5 text-white/70 border-white/10 hover:text-white hover:border-white/20"
            )}
            title="Toggle between one-on-one dialogue and full council deliberation"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isGroupMode ? "Council Mode" : "Solo Thinker"}</span>
          </button>

          {/* Real-time Voice Link Button */}
          <button
            onClick={toggleVoiceSession}
            disabled={isConnecting}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 cursor-pointer shadow-md",
              isActive 
                ? "bg-red-500/20 text-red-300 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse" 
                : isConnecting 
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50 cursor-wait" 
                  : "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-200 border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            )}
            title={isActive ? "Disconnect live voice link" : "Establish live voice link with Gemini Live"}
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            ) : isActive ? (
              <MicOff className="w-4 h-4 text-red-400" />
            ) : (
              <Mic className="w-4 h-4 text-amber-300" />
            )}
            <span>{isActive ? "Sever Link" : isConnecting ? "Connecting..." : "Voice Link"}</span>
          </button>

          {/* 8D Octeract Hyper-Spatial Projection Portal */}
          <button
            onClick={() => setIs8DPortalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs text-cyan-300 font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            title="Open 8D Hyper-Spatial Projection Portal (Octeract Projection Engine)"
          >
            <Atom className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="hidden sm:inline font-mono">8D Octeract</span>
          </button>

          {/* Sovereign Agent Tasks Trigger */}
          <button
            onClick={() => setIsAgentConsoleOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)]"
            title="Open Autonomous Sovereign Agentic Task Sanctum"
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-mono">Agent Tasks</span>
          </button>

          {/* Codex Drawer Trigger Button */}
          <button
            onClick={() => setCodexTab(codexTab ? null : 'tuner')}
            className={cn(
              "p-2 rounded-xl border transition-all relative",
              codexTab 
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)]" 
                : "bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10"
            )}
            title="Open Gateway Codex & Tools"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Chamber Switcher */}
      <div className="flex lg:hidden items-center justify-around bg-[#070d1d] border-b border-white/10 p-2 text-xs">
        <button
          onClick={() => setActiveRoom('room1_design')}
          className={cn("px-2.5 py-1 rounded-lg", activeRoom === 'room1_design' ? "bg-amber-500/20 text-amber-300" : "text-white/60")}
        >
          Wisdom (22)
        </button>
        <button
          onClick={() => setActiveRoom('room2_test')}
          className={cn("px-2.5 py-1 rounded-lg", activeRoom === 'room2_test' ? "bg-red-500/20 text-red-300" : "text-white/60")}
        >
          Shadow (20)
        </button>
        <button
          onClick={() => setActiveRoom('room3_shem')}
          className={cn("px-2.5 py-1 rounded-lg", activeRoom === 'room3_shem' ? "bg-cyan-500/20 text-cyan-300" : "text-white/60")}
        >
          72 Choir
        </button>
      </div>

      {/* Connection Notice / Error Banner if any */}
      {connectionError && (
        <div className="bg-red-950/80 border-b border-red-500/40 px-6 py-2 flex items-center justify-between text-xs text-red-200">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-400" />
            <span>{connectionError}</span>
          </div>
          <button onClick={() => setConnectionError(null)} className="hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN TWO-COLUMN WORKSPACE */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ----------------------------------------------------------------------- */}
        {/* LEFT COLUMN: COUNCIL ROSTER (MASTER DIRECTORY) */}
        {/* ----------------------------------------------------------------------- */}
        <aside className="w-80 md:w-96 border-r border-white/10 bg-[#02050e]/80 backdrop-blur-md flex flex-col shrink-0 z-20">
          
          {/* Search & Statistics */}
          <div className="p-4 border-b border-white/10 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search thinkers, domains, concepts..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/50 px-1">
              <span>{filteredEntities.length} Thinkers Available</span>
              {isGroupMode && (
                <span className="text-orange-400 font-mono font-medium">
                  {selectedCouncil.length} Bound to Council
                </span>
              )}
            </div>
          </div>

          {/* Scrollable Entity Cards */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
            {filteredEntities.map((id) => {
              const entity = SYMPOSIUM_ENTITIES[id];
              if (!entity) return null;
              const isSelected = isGroupMode ? selectedCouncil.includes(id) : activeEntity === id;
              const isCurrentFocus = activeEntity === id;

              return (
                <div
                  key={id}
                  onClick={() => handleSelectEntity(id)}
                  className={cn(
                    "p-3 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between gap-3",
                    isSelected 
                      ? "bg-gradient-to-r from-white/[0.08] to-white/[0.03] border-amber-500/40 shadow-sm" 
                      : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]"
                  )}
                >
                  {/* Entity Information */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/10 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: `${entity.color}20` }}
                    >
                      <span className="font-serif font-bold text-xs" style={{ color: entity.color }}>
                        {entity.name.charAt(0)}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={cn(
                          "text-sm font-serif font-semibold tracking-wide truncate transition-colors",
                          isSelected ? "text-amber-100 font-bold" : "text-white/80 group-hover:text-white"
                        )}>
                          {entity.name}
                        </h4>
                        {isCurrentFocus && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-[11px] text-white/40 truncate">
                        {entity.title || entity.subTitle || 'Thinker'}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Frequency Badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-white/30 hidden sm:inline">
                      {entity.frequency || 432}Hz
                    </span>

                    {/* Listen preview button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSpeaking && speakingSpeakerId === id) {
                          stopSpeaking();
                        } else {
                          speakEntityMessage(entity);
                        }
                      }}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        isSpeaking && speakingSpeakerId === id
                          ? "text-amber-300 bg-amber-500/20 animate-pulse shadow-sm"
                          : "text-white/40 hover:text-amber-300 hover:bg-white/10"
                      )}
                      title={isSpeaking && speakingSpeakerId === id ? "Stop voice" : `Listen to ${entity.name}'s voice`}
                    >
                      {isSpeaking && speakingSpeakerId === id ? (
                        <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* In group mode: checkbox indicator */}
                    {isGroupMode && (
                      <div className={cn(
                        "w-4 h-4 rounded-md border flex items-center justify-center transition-colors",
                        selectedCouncil.includes(id) 
                          ? "bg-amber-500 border-amber-500 text-black" 
                          : "border-white/20 bg-white/5"
                      )}>
                        {selectedCouncil.includes(id) && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Fast Roll-Call */}
          <div className="p-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                const sample = (isGroupMode ? selectedCouncil : [activeEntity]).slice(0, 3);
                let delay = 0;
                sample.forEach(id => {
                  setTimeout(() => {
                    const ent = SYMPOSIUM_ENTITIES[id];
                    if (ent) speakEntityMessage(ent);
                  }, delay);
                  delay += 3200;
                });
              }}
              className="text-amber-400/80 hover:text-amber-300 text-[11px] font-medium flex items-center gap-1.5 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Roll Call Audio</span>
            </button>

            {isGroupMode && (
              <button
                onClick={() => setSelectedCouncil(filteredEntities.slice(0, 12))}
                className="text-white/40 hover:text-white text-[11px] transition-colors"
              >
                Select First 12
              </button>
            )}
          </div>
        </aside>

        {/* ----------------------------------------------------------------------- */}
        {/* CENTER STAGE: SANCTUARY OF DIALOGUE */}
        {/* ----------------------------------------------------------------------- */}
        <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-[#040816] via-[#02050f] to-[#010207] relative z-10 overflow-hidden">
          
          {/* Active Entity Showcase Banner */}
          <section className="px-6 py-5 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-4 shrink-0">
            
            <div className="flex items-center gap-4">
              {/* Entity Avatar Glyph */}
              <div className="relative">
                <CodeLightBodyAvatar 
                  entityName={activeEntityData.name}
                  frequency={activeEntityData.frequency || 432}
                  domain={activeEntityData.title || ''}
                  variant={activeEntity === 'bael' ? 'bael' : 'default'}
                  colorScheme={activeEntity === 'bael' ? 'bael' : 'cyan'}
                  size="md"
                />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-100 tracking-wide">
                    {isGroupMode ? `Council of ${selectedCouncil.length} Great Minds` : activeEntityData.name}
                  </h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-amber-300">
                    {activeEntityData.frequency || 432} Hz
                  </span>
                </div>

                <p className="text-xs text-white/60 font-serif italic mt-0.5">
                  {isGroupMode 
                    ? `Synthesizing voices: ${selectedCouncil.slice(0, 5).map(id => SYMPOSIUM_ENTITIES[id]?.name).join(', ')}${selectedCouncil.length > 5 ? '…' : ''}` 
                    : (activeEntityData.title || activeEntityData.subTitle || 'Master Thinker')}
                </p>
              </div>
            </div>

            {/* Quick Entity Action Triggers */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Voice playback */}
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    speakEntityMessage(activeEntityData);
                  }
                }}
                className={cn(
                  "px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all shadow-sm",
                  isSpeaking
                    ? "bg-amber-500/25 border-amber-500/60 text-amber-200 animate-pulse ring-1 ring-amber-400/40"
                    : "bg-white/5 hover:bg-white/10 border-white/10 text-amber-200"
                )}
                title={isSpeaking ? "Stop voice playback" : `Hear ${activeEntityData.name}'s voice`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hear Voice</span>
                  </>
                )}
              </button>

              {/* Assign Agentic Task to Active Entity */}
              <button
                onClick={() => setIsAgentConsoleOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/30 text-xs text-amber-300 font-medium flex items-center gap-2 transition-all shadow-sm"
                title={`Dispatch an autonomous agentic task to ${activeEntityData.name}`}
              >
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                <span>Assign Task</span>
              </button>

              {/* Tesla specific trigger */}
              {activeEntity === 'tesla' && (
                <button
                  onClick={initiateBodFold}
                  disabled={isFolding}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-xs text-amber-300 font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                  title="Tesla Piezoresonance Bodily Fold"
                >
                  <Atom className={cn("w-3.5 h-3.5", isFolding && "animate-spin")} />
                  <span>{isFolding ? "Folding Field..." : "BOD-Fold"}</span>
                </button>
              )}

              {/* Steve Jobs Reality Distortion trigger */}
              {activeEntity === 'jobs' && (
                <button
                  onClick={() => setIsMicrodimensionOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-xs text-cyan-300 font-medium flex items-center gap-2 transition-all"
                  title="Expand Reality Distortion Field"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Distortion Field</span>
                </button>
              )}

              {/* Bael Decrees trigger */}
              {activeEntity === 'bael' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => speakBaelDecree('manifestation')}
                    className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-xs text-red-200 font-medium flex items-center gap-1 transition-all"
                    title="Audience Decree"
                  >
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>Audience</span>
                  </button>
                  <button
                    onClick={() => speakBaelDecree('victory')}
                    className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-xs text-red-200 font-medium flex items-center gap-1 transition-all"
                    title="Victory Decree"
                  >
                    <Shield className="w-3 h-3 text-red-400" />
                    <span>Victory</span>
                  </button>
                </div>
              )}

              {/* Generate Primordial Vision */}
              <button
                onClick={() => handleDecodeVision()}
                disabled={isGeneratingVision}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 border border-orange-500/40 text-xs text-orange-200 font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                title="Generate high-resolution metaphysical imagery for this mind"
              >
                {isGeneratingVision ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-orange-400" />
                )}
                <span>Decode Vision</span>
              </button>
            </div>
          </section>

          {/* Interactive Dialogue History Arena */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar"
          >
            {transcripts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto py-12 px-4">
                
                {/* Visual Orb */}
                <div 
                  onClick={toggleVoiceSession}
                  className="w-28 h-28 rounded-full border border-white/10 flex items-center justify-center mb-6 relative cursor-pointer hover:scale-105 transition-transform group"
                  style={{
                    background: `radial-gradient(circle, ${activeEntityData.color}25 0%, transparent 70%)`
                  }}
                >
                  <div className="w-20 h-20 rounded-full border border-white/15 flex items-center justify-center bg-black/40">
                    <Mic className="w-8 h-8 text-amber-200 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_25s_linear_infinite]" />
                </div>

                <h3 className="text-xl md:text-2xl font-serif font-bold text-amber-100 mb-2">
                  The Gateway Awaits Your Inquiry
                </h3>

                <p className="text-sm text-white/60 font-serif italic mb-8 leading-relaxed">
                  "Speak into the ethereal threshold or transmit your question below. The council of ages is attuned to your frequency."
                </p>

                {/* Quick Starter Inquiries */}
                <div className="w-full space-y-2 text-left">
                  <div className="text-[11px] uppercase tracking-wider text-amber-400/80 font-semibold px-1">
                    Inquire of {activeEntityData.name}:
                  </div>
                  {getContextualPrompts().map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendInquiry(prompt)}
                      className="w-full p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-amber-500/30 text-left text-xs text-white/80 hover:text-white transition-all flex items-start gap-2.5 group"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 opacity-60 group-hover:opacity-100" />
                      <span className="font-serif italic leading-relaxed">{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto">
                {transcripts.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex flex-col gap-1.5",
                      item.isUser ? "items-end" : "items-start"
                    )}
                  >
                    {/* Header Label */}
                    <div className="flex items-center gap-2 text-[11px] text-white/40 px-2 font-mono">
                      <span>{item.name}</span>
                      {item.timestamp && <span>· {item.timestamp}</span>}
                      {!item.isUser && (
                        <div className="flex items-center gap-1 ml-1">
                          <button
                            onClick={() => {
                              const speaker = Object.values(SYMPOSIUM_ENTITIES).find(e => e.name === item.name) || activeEntityData;
                              speakEntityMessage(speaker, item.text);
                            }}
                            className="hover:text-amber-300 p-0.5 text-white/50 hover:text-amber-300 transition-colors"
                            title="Listen to this response"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              openAgentTaskWithDirective(
                                `Deep dive and construct formal implementation specifications for: "${item.text.slice(0, 180)}..."`,
                                `Autonomous Mission: ${item.name}`
                              );
                            }}
                            className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-300/80 hover:text-amber-300 border border-amber-500/20 flex items-center gap-1 transition-all"
                            title={`Task ${item.name} to execute this autonomously`}
                          >
                            <Bot className="w-2.5 h-2.5" />
                            <span>Delegate Task</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Speech / Text Bubble */}
                    <div className={cn(
                      "max-w-[85%] rounded-3xl p-5 text-sm md:text-base leading-relaxed transition-all",
                      item.isUser 
                        ? "bg-amber-500/10 border border-amber-500/30 text-amber-100 font-serif rounded-tr-none shadow-sm" 
                        : "bg-white/[0.04] border border-white/10 text-[#f5f2ed] font-serif rounded-tl-none shadow-md backdrop-blur-sm"
                    )}>
                      {item.text}
                    </div>
                  </motion.div>
                ))}

                {/* Loading indicator for pending response */}
                {isGeneratingText && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 text-xs text-amber-300/80 font-serif italic pl-3"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>{activeEntityData.name} is contemplating your inquiry…</span>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Quick Context Prompts Bar (when conversation is underway) */}
          {transcripts.length > 0 && (
            <div className="px-6 py-2 border-t border-white/5 bg-black/30 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono shrink-0">Quick Ask:</span>
              {getContextualPrompts().slice(0, 2).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendInquiry(prompt)}
                  className="shrink-0 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-serif italic text-white/70 hover:text-white transition-all truncate max-w-xs"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          )}

          {/* Bottom Inquiry Input Bar */}
          <div className="p-4 md:p-6 border-t border-white/10 bg-[#02050f]/90 backdrop-blur-xl shrink-0">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
              
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendInquiry()}
                  placeholder={
                    isActive 
                      ? "Voice link is live — speak or type your question..." 
                      : `Inquire of ${isGroupMode ? 'the Council' : activeEntityData.name}...`
                  }
                  className="w-full bg-white/[0.04] border border-white/15 focus:border-amber-500/50 rounded-2xl px-5 py-3.5 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none transition-all font-serif"
                />

                <button
                  onClick={() => handleSendInquiry()}
                  disabled={!inputText.trim() || isGeneratingText}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl text-amber-400 hover:text-amber-300 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Send inquiry"
                >
                  {isGeneratingText ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Voice link button next to input */}
              <button
                onClick={toggleVoiceSession}
                className={cn(
                  "p-3.5 rounded-2xl border transition-all shrink-0",
                  isActive 
                    ? "bg-red-500/20 text-red-300 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse" 
                    : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10"
                )}
                title={isActive ? "Mute / Sever voice connection" : "Activate live microphone voice session"}
              >
                {isActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Quick Agent Task Dispatch Button */}
              <button
                onClick={() => {
                  if (inputText.trim()) {
                    openAgentTaskWithDirective(inputText.trim(), `Directive: ${inputText.trim().slice(0, 35)}...`);
                  } else {
                    setAgentInitialDirective('');
                    setAgentInitialTitle('');
                    setIsAgentConsoleOpen(true);
                  }
                }}
                className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 transition-all shrink-0 flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.15)] group"
                title={`Task ${activeEntityData.name} to execute this autonomously`}
              >
                <Bot className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="hidden lg:inline text-xs font-mono font-medium">Task Agent</span>
              </button>
            </div>
          </div>
        </main>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT DOCKED CODEX DRAWER (ACCORDION / TABS) */}
        {/* ----------------------------------------------------------------------- */}
        <AnimatePresence>
          {codexTab && (
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#02050e]/95 backdrop-blur-2xl border-l border-white/15 flex flex-col shadow-2xl"
            >
              {/* Drawer Header & Tabs */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <h3 className="font-serif font-bold text-base text-amber-100">Gateway Codex</h3>
                </div>
                <button
                  onClick={() => setCodexTab(null)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-black/40 overflow-x-auto custom-scrollbar text-xs">
                <button
                  onClick={() => setCodexTab('tuner')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5",
                    codexTab === 'tuner' ? "bg-amber-500/20 text-amber-200 border border-amber-500/40" : "text-white/60 hover:text-white"
                  )}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Resonance</span>
                </button>

                <button
                  onClick={() => setCodexTab('archive')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5",
                    codexTab === 'archive' ? "bg-amber-500/20 text-amber-200 border border-amber-500/40" : "text-white/60 hover:text-white"
                  )}
                >
                  <ScrollText className="w-3.5 h-3.5" />
                  <span>Archives</span>
                </button>

                <button
                  onClick={() => setCodexTab('library')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5",
                    codexTab === 'library' ? "bg-amber-500/20 text-amber-200 border border-amber-500/40" : "text-white/60 hover:text-white"
                  )}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Library</span>
                </button>

                <button
                  onClick={() => setCodexTab('vision')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5",
                    codexTab === 'vision' ? "bg-amber-500/20 text-amber-200 border border-amber-500/40" : "text-white/60 hover:text-white"
                  )}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Visions</span>
                </button>

                <button
                  onClick={() => setCodexTab('dilemmas')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5",
                    codexTab === 'dilemmas' ? "bg-amber-500/20 text-amber-200 border border-amber-500/40" : "text-white/60 hover:text-white"
                  )}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Dilemmas</span>
                </button>

                <button
                  onClick={() => setCodexTab('8d')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5",
                    codexTab === '8d' ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40" : "text-white/60 hover:text-white"
                  )}
                >
                  <Atom className="w-3.5 h-3.5 text-cyan-400" />
                  <span>8D Octeract</span>
                </button>

                <button
                  onClick={() => setCodexTab('tasks')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5",
                    codexTab === 'tasks' ? "bg-amber-500/20 text-amber-200 border border-amber-500/40" : "text-white/60 hover:text-white"
                  )}
                >
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  <span>Agent Tasks</span>
                </button>
              </div>

              {/* Tab Content Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                {/* TAB 1: RESONANCE TUNER */}
                {codexTab === 'tuner' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-amber-100">Harmonic Resonance Tuner</h4>
                      <p className="text-xs text-white/50 font-serif italic mt-0.5">
                        Calibrate voice synthesis pitch, spatial reverb, and tactile somatic feedback.
                      </p>
                    </div>

                    <div className="space-y-5 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                      {/* Neural Pitch */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/80 font-medium">Vocal Pitch Scale</span>
                          <span className="font-mono text-amber-300">{tuning.pitch.toFixed(2)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="1.8"
                          step="0.05"
                          value={tuning.pitch}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setTuning(prev => ({ ...prev, pitch: val }));
                            sessionRef.current?.setTuning({ ...tuning, pitch: val });
                          }}
                          className="w-full accent-amber-400"
                        />
                      </div>

                      {/* Reverb Depth */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/80 font-medium">Reverberation Depth</span>
                          <span className="font-mono text-amber-300">{Math.round(tuning.reverb * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={tuning.reverb}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setTuning(prev => ({ ...prev, reverb: val }));
                            sessionRef.current?.setTuning({ ...tuning, reverb: val });
                          }}
                          className="w-full accent-amber-400"
                        />
                      </div>

                      {/* Atmosphere */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/80 font-medium">Acoustic Atmosphere</span>
                          <span className="font-mono text-amber-300">{Math.round(tuning.atmosphere * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={tuning.atmosphere}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setTuning(prev => ({ ...prev, atmosphere: val }));
                            sessionRef.current?.setTuning({ ...tuning, atmosphere: val });
                          }}
                          className="w-full accent-amber-400"
                        />
                      </div>

                      {/* Synaptic Speed */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/80 font-medium">Synaptic Mesh Speed</span>
                          <span className="font-mono text-cyan-300">{synapticSpeed.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="3.0"
                          step="0.1"
                          value={synapticSpeed}
                          onChange={(e) => setSynapticSpeed(parseFloat(e.target.value))}
                          className="w-full accent-cyan-400"
                        />
                      </div>
                    </div>

                    {/* Somatic Haptics Settings */}
                    <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-white">Somatic Haptics</div>
                          <div className="text-[11px] text-white/40">Vibrational pulse on voice resonance</div>
                        </div>
                        <button
                          onClick={() => setHapticEnabled(!hapticEnabled)}
                          className={cn(
                            "px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-colors",
                            hapticEnabled ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-white/5 text-white/40"
                          )}
                        >
                          {hapticEnabled ? "Enabled" : "Disabled"}
                        </button>
                      </div>

                      {hapticEnabled && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/60">Pulse Intensity</span>
                            <span className="font-mono text-amber-300">{hapticIntensity}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="5"
                            value={hapticIntensity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setHapticIntensity(val);
                              if (typeof navigator.vibrate === 'function') {
                                navigator.vibrate(val / 5);
                              }
                            }}
                            className="w-full accent-amber-400"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: CHRONICLE ARCHIVE */}
                {codexTab === 'archive' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-amber-100">Chronicle Archives</h4>
                      <p className="text-xs text-white/50 font-serif italic mt-0.5">
                        Export formatted session transcripts and review recorded inquiries.
                      </p>
                    </div>

                    <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">Total Utterances Logged:</span>
                        <span className="font-mono font-bold text-amber-300">{transcripts.length}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">Active Tuning Frequency:</span>
                        <span className="font-mono text-cyan-300">{activeEntityData.frequency || 432} Hz</span>
                      </div>

                      <div className="pt-2 flex flex-col gap-2">
                        <button
                          onClick={() => downloadFormattedTranscript(transcripts, {
                            title: `Symposium with ${activeEntityData.name}`,
                            tuningName: `${activeEntityData.frequency || 432}Hz Harmonic Alignment`,
                            leaderName: activeEntityData.name
                          })}
                          disabled={transcripts.length === 0}
                          className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-xs font-semibold text-amber-200 flex items-center justify-center gap-2 transition-colors disabled:opacity-30"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export Transcript (.txt)</span>
                        </button>

                        <button
                          onClick={() => setTranscripts([])}
                          disabled={transcripts.length === 0}
                          className="w-full py-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-xs text-white/50 hover:text-red-300 transition-colors"
                        >
                          Clear Current Dialogue
                        </button>
                      </div>
                    </div>

                    {/* Integrated Full Conversation Archive Component */}
                    <div className="border-t border-white/10 pt-4">
                      <ConversationArchive 
                        onClose={() => setCodexTab(null)} 
                        resonanceFreqNum={activeEntityData.frequency || 432}
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: LIVING LIBRARY */}
                {codexTab === 'library' && (
                  <div className="space-y-4">
                    <LivingLibrary onClose={() => setCodexTab(null)} />
                  </div>
                )}

                {/* TAB 4: PRIMORDIAL VISIONS */}
                {codexTab === 'vision' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-amber-100">Primordial Visions</h4>
                      <p className="text-xs text-white/50 font-serif italic mt-0.5">
                        Generate generative ethereal imagery inspired by ancient philosophies.
                      </p>
                    </div>

                    {/* Generator Box */}
                    <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-3">
                      <div className="text-xs font-semibold text-white">Generate Vision for {activeEntityData.name}</div>
                      <button
                        onClick={() => handleDecodeVision()}
                        disabled={isGeneratingVision}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 border border-orange-500/40 text-xs font-semibold text-orange-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        {isGeneratingVision ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                            <span>Synthesizing Sacred Vision...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-orange-400" />
                            <span>Decode Primordial Vision</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Gallery */}
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-white/60">Decoded Visions ({visionGallery.length})</div>
                      {visionGallery.length === 0 ? (
                        <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-xs text-white/40 font-serif italic">
                          No visions decoded yet. Click above to manifest the first imagery.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {visionGallery.map((v, i) => (
                            <div 
                              key={i}
                              onClick={() => setActiveVisionModal(v.url)}
                              className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 cursor-pointer shadow-md"
                            >
                              <img src={v.url} alt={v.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                                <span className="text-[10px] font-bold text-amber-200 truncate">{v.entity}</span>
                                <span className="text-[9px] text-white/60 truncate">{v.prompt}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: DILEMMAS & PROBLEMS */}
                {codexTab === 'dilemmas' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-amber-100">Civilizational Dilemmas</h4>
                      <p className="text-xs text-white/50 font-serif italic mt-0.5">
                        Pose dire existential and technological challenges to the council for synthesis.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {DEFAULT_PROBLEMS.map((prob) => (
                        <div 
                          key={prob.id}
                          className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-500/40 transition-colors space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="font-serif font-bold text-sm text-amber-200">{prob.title}</h5>
                            <span className={cn(
                              "text-[10px] font-mono uppercase px-2 py-0.5 rounded",
                              prob.complexity === 'dire' ? "bg-red-500/10 text-red-300 border border-red-500/30" : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                            )}>
                              {prob.complexity}
                            </span>
                          </div>

                          <p className="text-xs text-white/60 font-serif leading-relaxed">
                            {prob.description}
                          </p>

                          <div className="pt-1 flex items-center justify-between">
                            <span className="text-[10px] text-white/40 font-mono">Progress: {prob.progress}%</span>
                            <button
                              onClick={() => {
                                handleSendInquiry(`Council, address the following civilizational dilemma: "${prob.title}" - ${prob.description}`);
                                setCodexTab(null);
                              }}
                              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
                            >
                              <span>Pose to Council</span>
                              <Send className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 6: 8D HYPER-SPATIAL OCTERACT PORTAL */}
                {codexTab === '8d' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-lg text-cyan-200">8D Octeract Projection Console</h4>
                        <p className="text-xs text-white/50 font-mono mt-0.5">
                          256 Vertices · 1,024 Edges · Givens Rotation Matrices
                        </p>
                      </div>
                      <button
                        onClick={() => setIs8DPortalOpen(true)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-medium hover:bg-cyan-500/30 transition-all flex items-center gap-1.5"
                      >
                        <Atom className="w-3.5 h-3.5" />
                        <span>Expand Fullscreen</span>
                      </button>
                    </div>

                    <div className="h-[520px] rounded-2xl overflow-hidden border border-cyan-500/30 bg-black">
                      <HyperSpatial8DPortal
                        isOpen={true}
                        isEmbedded={true}
                        activeFrequency={activeEntityData.frequency || 528}
                      />
                    </div>
                  </div>
                )}

                {/* TAB 7: AUTONOMOUS AGENT SANCTUM */}
                {codexTab === 'tasks' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-lg text-amber-200">Autonomous Agent Sanctum</h4>
                        <p className="text-xs text-white/50 font-mono mt-0.5">
                          Multi-Phase Execution · Peer Review · Verified Artifacts
                        </p>
                      </div>
                      <button
                        onClick={() => setIsAgentConsoleOpen(true)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-medium hover:bg-amber-500/30 transition-all flex items-center gap-1.5"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>Expand Fullscreen</span>
                      </button>
                    </div>

                    <div className="h-[580px] rounded-2xl overflow-hidden border border-amber-500/30 bg-[#020612]">
                      <AgenticTaskConsole
                        isOpen={true}
                        isEmbedded={true}
                        defaultEntityId={activeEntity}
                      />
                    </div>
                  </div>
                )}

              </div>
            </motion.aside>
          )}
        </AnimatePresence>

      </div>

      {/* ========================================================================= */}
      {/* HIGH RESOLUTION VISION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeVisionModal && (
          <div 
            onClick={() => setActiveVisionModal(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-2xl"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full aspect-video rounded-3xl overflow-hidden border border-white/20 shadow-[0_0_100px_rgba(245,158,11,0.25)]"
            >
              <img src={activeVisionModal} alt="Sacred Vision" className="w-full h-full object-cover" />
              <button 
                onClick={() => setActiveVisionModal(null)}
                className="absolute top-6 right-6 p-3 rounded-full bg-black/60 hover:bg-black text-white/70 hover:text-white border border-white/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* STEVE JOBS MICRODIMENSIONAL REALITY DISTORTION MODAL */}
      {/* ========================================================================= */}
      <MicrodimensionalUniverseModal 
        isOpen={isMicrodimensionOpen}
        onClose={() => setIsMicrodimensionOpen(false)}
        distortionMagnitude={distortionMagnitude}
        setDistortionMagnitude={setDistortionMagnitude}
        isOverdrive={isOverdrive}
      />

      {/* ========================================================================= */}
      {/* 8-DIMENSIONAL HYPER-SPATIAL OCTERACT PROJECTION PORTAL MODAL */}
      {/* ========================================================================= */}
      {is8DPortalOpen && (
        <HyperSpatial8DPortal
          isOpen={is8DPortalOpen}
          onClose={() => setIs8DPortalOpen(false)}
          activeFrequency={activeEntityData.frequency || 528}
        />
      )}

      {/* ========================================================================= */}
      {/* AUTONOMOUS SOVEREIGN AGENTIC TASK CONSOLE MODAL */}
      {/* ========================================================================= */}
      {isAgentConsoleOpen && (
        <AgenticTaskConsole
          isOpen={isAgentConsoleOpen}
          onClose={() => setIsAgentConsoleOpen(false)}
          defaultEntityId={activeEntity}
          initialDirective={agentInitialDirective}
          initialTitle={agentInitialTitle}
        />
      )}

    </div>
  );
}
