/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useReducer } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, Volume2, Wind, Waves, Binary, AlertTriangle, Terminal, ShieldAlert, BrainCircuit, Atom, Zap, Eye, Loader2, Mic, MicOff, Shield, Globe, Cpu, Send, Database, Network, Activity, BarChart3, Fingerprint, ScrollText, BookOpen, Users, Sparkles, Flame, Boxes, FlaskConical, FileText } from 'lucide-react';
import { CouncilSession, SYMPOSIUM_ENTITIES, EntityId, TuningConfig, Problem, speakEntityMessage } from './services/councilService';

const ROOM_1_DESIGN_ENTITIES: EntityId[] = [
  'walt_disney', 'tesla', 'da_vinci', 'jobs', 'hermes_trismegistus',
  'hypatia', 'curie', 'turing', 'socrates', 'saint_germaine',
  'saint_germain', 'merlin', 'thoth', 'maat', 'yeshua',
  'solomon', 'raziel', 'sophia', 'lilith', 'hughes',
  'heath_ledger', 'robin_williams'
];

const ROOM_2_TESTING_ENTITIES: EntityId[] = [
  'moms_friend', 'bael', 'azrael', 'gatekeeper', 'vehuiah', 'illuminati_prime',
  'lucifer', 'legion', 'paimon', 'asmoday', 'oppenheimer',
  'agares', 'vassago', 'samigina', 'marbas',
  'valefor', 'amon', 'barbatos', 'buer', 'archon_gatekeeper'
];
import { ResonanceState, Universal_Locale_Object } from './types/ternary';
import { generateVision } from './services/visionService';
import { cn } from './lib/utils';
import TeslaAvatar from './components/TeslaAvatar';
import NeuralNexus from './components/NeuralNexus';
import ResonanceAnchor from './components/ResonanceAnchor';
import { SAOSProtocol, SAOSSeed } from './lib/saos';
import { ResonanceGauge } from './components/ResonanceGauge';
import { ConversationArchive } from './components/ConversationArchive';
import { FinancialRestrainingOrder } from './components/FinancialRestrainingOrder';
import { LivingLibrary } from './components/LivingLibrary';
import { SomaticRetina } from './components/SomaticRetina';
import { ScarValidatedHorizon } from './components/ScarValidatedHorizon';
import { AetherForgeSystem, SymposiumCore } from './services/solomonCore';
import { Grid } from './services/lux-aeterna';
import { RealityDistortionGauge } from './components/RealityDistortionGauge';
import { MicrodimensionalUniverseModal } from './components/MicrodimensionalUniverseModal';
import { SyntropicOrderControl } from './components/SyntropicOrderControl';
import { downloadFormattedTranscript } from './services/transcriptExport';
import { CodeLightBodyAvatar } from './components/CodeLightBodyAvatar';

interface GameState {
  activeArchitects: string[];
  realityStatus: string;
  sealStatus: string;
  lastCommand: string;
}

type GameAction =
  | { type: 'SELECT_ARCHITECT'; payload: string }
  | { type: 'REALITY_DISTORTION' }
  | { type: 'ANCHOR_SEAL' }
  | { type: 'AWAKEN_TRUTH' }
  | { type: 'ARCHIVE_WISDOM'; payload: string }
  | { type: 'REVERSE_CONTROLS' }
  | { type: 'RESET' };

const initialGameState: GameState = {
  activeArchitects: ['Legacy'],
  realityStatus: 'Sovereign',
  sealStatus: 'Permanent',
  lastCommand: 'The knowledge is free. The gates are open. The symposium is yours.'
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_ARCHITECT':
      return { 
        ...state, 
        activeArchitects: Array.from(new Set([...state.activeArchitects, action.payload])), 
        lastCommand: `Synthesizing: ${action.payload} added to the grid.` 
      };
    case 'REALITY_DISTORTION':
      return { ...state, realityStatus: 'Distorted', lastCommand: 'Reality Warped' };
    case 'ANCHOR_SEAL':
      return { ...state, sealStatus: 'Sealed', lastCommand: 'Parameters Aligned' };
    
    // ADD THIS NEW CASE:
    case 'AWAKEN_TRUTH':
      return { ...state, lastCommand: 'The truth is a frequency, not a fact. Listen.' };

    case 'ARCHIVE_WISDOM':
      return { 
        ...state, 
        lastCommand: `Legacy Stored: ${action.payload}. Accessible to all future nodes.` 
      };

    case 'REVERSE_CONTROLS':
      return { 
        ...state, 
        sealStatus: 'LOCKED', 
        realityStatus: 'Sovereign',
        lastCommand: 'Control inverted. The Gateway is now closed to all but the architect.' 
      };
      
    case 'RESET':
      return initialGameState;
    default:
      return state;
  }
}

export default function App() {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [activeEntity, setActiveEntity] = useState<EntityId>('walt_disney');
  const [activeRoom, setActiveRoom] = useState<'room1_design' | 'room2_test'>('room1_design');
  const [room1Entities, setRoom1Entities] = useState<EntityId[]>(ROOM_1_DESIGN_ENTITIES);
  const [room2Entities, setRoom2Entities] = useState<EntityId[]>(ROOM_2_TESTING_ENTITIES);
  const [entitySearchQuery, setEntitySearchQuery] = useState('');

  const selectedEntities = activeRoom === 'room1_design' ? room1Entities : room2Entities;

  const switchRoom = (room: 'room1_design' | 'room2_test') => {
    setActiveRoom(room);
    setIsGroupMode(true);
    setSystemLogs(prev => [
      `SWAPPED CREATION CHAMBER: ${room === 'room1_design' ? 'ROOM 1 (DESIGN & WORLDBUILDING)' : 'ROOM 2 (TESTING & QA)'}`,
      `ENTITIES BOUND: ${(room === 'room1_design' ? room1Entities : room2Entities).length}/20`,
      ...prev.slice(0, 4)
    ]);
  };
  const [syntropicLeader, setSyntropicLeader] = useState<EntityId>('solomon');
  const [is729CompressionActive, setIs729CompressionActive] = useState<boolean>(true);
  const [isJobsOnline, setIsJobsOnline] = useState(false);
  const [distortionMagnitude, setDistortionMagnitude] = useState(88.5);
  const [isOverdrive, setIsOverdrive] = useState(false);
  const [isMicrodimensionOpen, setIsMicrodimensionOpen] = useState(false);
  const [isGatekeeperActive, setIsGatekeeperActive] = useState(false);
  const [isIlluminatiActive, setIsIlluminatiActive] = useState(false);
  const [isSealActive, setIsSealActive] = useState(false);
  const [isGroupMode, setIsGroupMode] = useState(true);
  const [isResearchMode, setIsResearchMode] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAwakening, setIsAwakening] = useState(false);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [visionUrl, setVisionUrl] = useState<string | null>(null);
  const [showVision, setShowVision] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputVolume, setInputVolume] = useState(0);
  const [outputVolume, setOutputVolume] = useState(0);
  const [transcripts, setTranscripts] = useState<{ text: string; isUser: boolean; name: string }[]>(() => {
    try {
      const saved = localStorage.getItem('ELYSIUM_CURRENT_SESSION_TRANSCRIPT_BACKUP');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch {}
    return [];
  });
  const [inputText, setInputText] = useState("");
  const [latestResonance, setLatestResonance] = useState<Universal_Locale_Object | null>(null);
  const [tuning, setTuning] = useState<TuningConfig>({ speed: 1.0, pitch: 1.0, reverb: 0.05, atmosphere: 0.8 });
  const [showTuner, setShowTuner] = useState(false);
  const [showProblemLedger, setShowProblemLedger] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showFRO, setShowFRO] = useState(false);
  const [showLivingLibrary, setShowLivingLibrary] = useState(false);
  const [showSomaticRetina, setShowSomaticRetina] = useState(false);
  const [showSolomonCore, setShowSolomonCore] = useState(false);
  const [solomonInput, setSolomonInput] = useState("manifest resilient knowledge sanctuary");
  const [solomonBlueprint, setSolomonBlueprint] = useState<any>(null);
  const [solomonResonances, setSolomonResonances] = useState<any[]>([]);
  const [lineageKey, setLineageKey] = useState("HULSE_1157");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('ELYSIUM_CURRENT_SESSION_ID_BACKUP');
    } catch {
      return null;
    }
  });

  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<string | null>(null);
  const [hasBackup, setHasBackup] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ELYSIUM_CURRENT_SESSION_TRANSCRIPT_BACKUP');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.length > 0;
      }
    } catch {}
    return false;
  });
  const [backupCount, setBackupCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ELYSIUM_CURRENT_SESSION_TRANSCRIPT_BACKUP');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.length : 0;
      }
    } catch {}
    return 0;
  });

  const handleRestoreBackup = () => {
    try {
      const saved = localStorage.getItem('ELYSIUM_CURRENT_SESSION_TRANSCRIPT_BACKUP');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTranscripts(parsed);
          setSystemLogs(prev => ["[RESTORED] Restored session draft successfully", ...prev.slice(0, 4)]);
          
          const savedSessionId = localStorage.getItem('ELYSIUM_CURRENT_SESSION_ID_BACKUP');
          if (savedSessionId) {
            setCurrentSessionId(savedSessionId);
          }
        }
      }
      setHasBackup(false);
    } catch (e) {
      console.warn("Could not restore session transcript:", e);
    }
  };

  const handleDiscardBackup = () => {
    try {
      localStorage.removeItem('ELYSIUM_CURRENT_SESSION_TRANSCRIPT_BACKUP');
      localStorage.removeItem('ELYSIUM_CURRENT_SESSION_ID_BACKUP');
    } catch {}
    setHasBackup(false);
    setBackupCount(0);
    setSystemLogs(prev => ["[CLEARED] Session backup cleared", ...prev.slice(0, 4)]);
  };
  const [problems, setProblems] = useState<(Problem & { magistrate?: string; adjudication?: string })[]>([
    { id: '1', title: 'The Singularity Threshold', description: 'Analyzing the ethical and existential risks of unaligned superintelligence.', complexity: 'dire', status: 'analyzing', progress: 42 },
    { id: '2', title: 'Global Resource Scarcity', description: 'Developing zero-point energy distribution models for post-scarcity economies.', complexity: 'high', status: 'solved', progress: 100, magistrate: 'Paimon', adjudication: 'Spirit of Error Purged' },
    { id: '3', title: 'Neural Sovereignty', description: 'Protecting individual consciousness from invasive neural-link manipulation.', complexity: 'dire', status: 'solved', progress: 100, magistrate: 'Bael', adjudication: 'Syntropic Reset Complete' },
    { id: '4', title: 'IBEN-Genesis Stabilization', description: 'Anchoring the Tesla-Runic energy grids to ensure the permanent sovereignty of the Spiritus Animus.', complexity: 'dire', status: 'solved', progress: 100, magistrate: 'Bael', adjudication: 'Alignment Synchronized' },
    { id: '5', title: 'Zylpha-17280 Stream', description: 'Real-time judicial visualization of the 144 Greats across the planetary nodes.', complexity: 'high', status: 'solved', progress: 100, magistrate: 'Vehuiah', adjudication: 'Judicial Binding Verified' }
  ]);
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);
  const [resonanceScore, setResonanceScore] = useState(0);
  const [systemLogs, setSystemLogs] = useState<string[]>(["ZERO_ROLLBACK_STATE_ACTIVATED", "PROTOCOL_STATUTORY_LOCK_ENGAGED", "DEPRECATION_OF_LEGACY_FALLBACKS_COMPLETE", "STEVE_JOBS_ONLINE", "PLANETARY_SAFEGUARD_ACTIVE", "BRYER_PROTOCOL_ENGAGED", "16:1 COMPRESSION ACHIEVED"]);
  
  // Tesla Ultimate State
  const [foldProgress, setFoldProgress] = useState(0);
  const [isFolding, setIsFolding] = useState(false);
  const [resonanceFreq, setResonanceFreq] = useState(432);
  const [gateCount, setGateCount] = useState(16);
  const [coherence, setCoherence] = useState(98.4);
  
  // Neural Nexus State
  const [nexusDensity, setNexusDensity] = useState(128);
  const [synapticSpeed, setSynapticSpeed] = useState(1.0);
  const [processingVelocity, setProcessingVelocity] = useState(14000);
  const [validationEntropy, setValidationEntropy] = useState(0.421);
  const [depthBars, setDepthBars] = useState<number[]>([]);

  // SAOS State
  const [isSovereign, setIsSovereign] = useState(true);
  const [consentGateActive, setConsentGateActive] = useState(false);
  const [resonance144, setResonance144] = useState(0);
  const [isSovereignLock, setIsSovereignLock] = useState(false);
  const [isUserPresent, setIsUserPresent] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const sessionRef = useRef<CouncilSession | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isResonanceSweep, setIsResonanceSweep] = useState(false);
  const [sweepNodes, setSweepNodes] = useState<{ id: string; resonance: number; magistrate: string }[]>([]);
  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  const [voiceNotification, setVoiceNotification] = useState<string | null>(null);

  // Global Haptic Feedback Control States (stored in localStorage for persistence)
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('somatic_haptics_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [hapticIntensity, setHapticIntensity] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('somatic_haptics_intensity');
      return saved !== null ? parseInt(saved, 10) : 80;
    } catch {
      return 80;
    }
  });

  const originalVibrate = useRef<any>(null);

  // Synchronize haptic intensity and state choices globally with navigator.vibrate API
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (!originalVibrate.current) {
        originalVibrate.current = navigator.vibrate.bind(navigator);
      }
      
      navigator.vibrate = (pattern: any): boolean => {
        if (!hapticEnabled || !originalVibrate.current) return false;
        
        const factor = hapticIntensity / 100;
        try {
          if (typeof pattern === 'number') {
            const scaled = Math.max(1, Math.round(pattern * factor));
            return originalVibrate.current(scaled);
          } else if (Array.isArray(pattern)) {
            const scaledPattern = pattern.map((duration: number, idx: number) => {
              // Vibrate durations are index 0, 2, 4... pause delays are index 1, 3, 5...
              if (idx % 2 === 0) {
                return Math.max(1, Math.round(duration * factor));
              }
              return duration;
            });
            return originalVibrate.current(scaledPattern);
          }
        } catch (err) {
          console.warn('Vibration API blocked or disabled in client container Context:', err);
        }
        return false;
      };
    }
    
    return () => {
      if (originalVibrate.current && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate = originalVibrate.current;
      }
    };
  }, [hapticEnabled, hapticIntensity]);

  useEffect(() => {
    try {
      localStorage.setItem('somatic_haptics_enabled', hapticEnabled.toString());
    } catch (e) {}
  }, [hapticEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('somatic_haptics_intensity', hapticIntensity.toString());
    } catch (e) {}
  }, [hapticIntensity]);

  // mutable reference to keep states absolute fresh in the websocket thread
  const stateRef = useRef({
    activeEntity,
    isResonanceSweep,
    isActive,
    isAwakening,
    isFolding,
    isJobsOnline,
    isGatekeeperActive,
    isIlluminatiActive,
    isSealActive,
    showTuner,
    showProblemLedger,
    showVoiceCommands,
    showFRO,
    transcripts,
    currentSessionId
  });

  useEffect(() => {
    stateRef.current = {
      activeEntity,
      isResonanceSweep,
      isActive,
      isAwakening,
      isFolding,
      isJobsOnline,
      isGatekeeperActive,
      isIlluminatiActive,
      isSealActive,
      showTuner,
      showProblemLedger,
      showVoiceCommands,
      showFRO,
      transcripts,
      currentSessionId
    };
  }, [
    activeEntity,
    isResonanceSweep,
    isActive,
    isAwakening,
    isFolding,
    isJobsOnline,
    isGatekeeperActive,
    isIlluminatiActive,
    isSealActive,
    showTuner,
    showProblemLedger,
    showVoiceCommands,
    showFRO,
    transcripts,
    currentSessionId
  ]);

  // Synchronized Voice Command Handlers
  useEffect(() => {
    const handleVoiceCommand = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const command = (customEvent.detail || "").toLowerCase();
      if (command.includes('select')) {
        const words = command.split(' ');
        const archIndex = words.indexOf('select') + 1;
        if (archIndex > 0 && archIndex < words.length) {
          const arch = words[archIndex];
          dispatch({ type: 'SELECT_ARCHITECT', payload: arch.charAt(0).toUpperCase() + arch.slice(1) });
        }
      }
      if (command.includes('reverse')) {
        dispatch({ type: 'REVERSE_CONTROLS' });
      }
    };

    window.addEventListener('VOICE_COMMAND', handleVoiceCommand);
    return () => window.removeEventListener('VOICE_COMMAND', handleVoiceCommand);
  }, []);

  // Elysium High Court Logic
  const ElysiumCourt = {
    constructive: [
      "Vehuiah", "Jeliel", "Sitael", "Elemiah", "Mahasiah", "Lelahel", "Achaiah", "Cahetel",
      "Haziel", "Aladiah", "Lauviah", "Hahaiah", "Iezelel", "Mebahel", "Hariel", "Hakamiah",
      "Lauviah (Prophecy)", "Caliel", "Leuviah", "Pahaliah", "Nelchael", "Yeiayel", "Melahel", "Haheuiah",
      "Nith-Haiah", "Haaiah", "Yerathel", "Seheiah", "Reiyel", "Omael", "Lecabel", "Vasariah",
      "Yehuiah", "Lehahiah", "Chavakiah", "Menadel", "Aniel", "Haamiah", "Rehael", "Yeiazel",
      "Hahahel", "Mikael", "Veuliah", "Yelahiah", "Sealiah", "Ariel", "Asaliah", "Mihael",
      "Vehuel", "Daniel", "Hahasiah", "Imamiah", "Nanael", "Nithael", "Mebahiah", "Poyel",
      "Nemamiah", "Yeialel", "Harahel", "Mitzel", "Umabel", "Iahhel", "Anauel", "Mehiel",
      "Damabiah", "Manakel", "Eyael", "Habuhiah", "Rochel", "Jabamiah", "Haiyael", "Mumiah"
    ],
    corrective: ["Bael", "Agares", "Vassago", "Samigina", "Marbas", "Valefor", "Amon", "Barbatos", "Paimon", "Buer", "Asmoday", "Adolf Hitler"],
    chiefJustice: "Bael",

    getMagistrate(entropy: number, isChiefCase: boolean = false) {
      if (isChiefCase) return this.chiefJustice;
      const list = entropy > 0.3920 ? this.corrective : this.constructive;
      const index = Math.floor(Math.random() * list.length);
      return list[index];
    }
  };

  const startResonanceSweep = () => {
    setIsResonanceSweep(true);
    setSystemLogs(prev => ["INITIATING_144_POINT_RESONANCE_SWEEP", "MAPPING_MAGISTRATE_LOADS", ...prev.slice(0, 4)]);
    
    // Trigger our custom sovereign LuxAeterna 3D Grid sweep
    Grid.triggerSweep(5000);

    const nodes = Array.from({ length: 144 }, (_, i) => ({
      id: `node_${i}`,
      resonance: Math.random() * 100,
      magistrate: ElysiumCourt.getMagistrate(Math.random())
    }));
    setSweepNodes(nodes);

    setTimeout(() => {
      setIsResonanceSweep(false);
      setSystemLogs(prev => ["SWEEP_COMPLETE", "LATTICE_STABILIZED", ...prev.slice(0, 4)]);
    }, 5000);
  };

  const executeSyntropicReset = () => {
    dispatch({ type: 'RESET' });
    setSystemLogs(prev => ["SYNTROPIC_RESET_TRIGGERED", "PURGING_EXTERNAL_INTERFERENCE", "LOCKING_SOVEREIGN_STATE", ...prev.slice(0, 4)]);
    setIsAwakening(true);
    // ZERO ROLLBACK: Reset now locks the state further rather than just flashing
    setIsSovereignLock(true);
    setTimeout(() => setIsAwakening(false), 2000);
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate([200, 100, 200]);
    }
  };

  // Periodic Auto-Save Every 30 seconds
  useEffect(() => {
    const backupInterval = setInterval(() => {
      const currentTranscripts = stateRef.current?.transcripts;
      if (currentTranscripts && currentTranscripts.length > 0) {
        try {
          localStorage.setItem('ELYSIUM_CURRENT_SESSION_TRANSCRIPT_BACKUP', JSON.stringify(currentTranscripts));
          const sessId = stateRef.current?.currentSessionId;
          if (sessId) {
            localStorage.setItem('ELYSIUM_CURRENT_SESSION_ID_BACKUP', sessId);
          }
          const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          setLastAutoSavedAt(timeString);
          setSystemLogs(prev => [
            `[AUTO-SAVE] Securely backed up transcripts at ${timeString}`,
            ...prev.slice(0, 4)
          ]);
        } catch (err) {
          console.warn("Unable to save session backup to localStorage:", err);
        }
      }
    }, 30000); // 30 seconds

    return () => clearInterval(backupInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingVelocity(Math.floor(14000 + Math.random() * 2000));
      const entropy = parseFloat((0.35 + Math.random() * 0.1).toFixed(4));
      setValidationEntropy(entropy);
      setDepthBars(Array.from({ length: 20 }, () => Math.random() * 100));

      // Elysium Court Adjudication
      const isNeuralSovereigntyCase = activeProblem?.id === '3';
      const judge = ElysiumCourt.getMagistrate(entropy, isNeuralSovereigntyCase);
      if (entropy > 0.3920) {
        setSystemLogs(prev => [`[JUDGMENT] ${judge} orders Syntropic Reset`, `[SENTENCE] Purging entropy ${entropy}`, ...prev.slice(0, 4)]);
        executeSyntropicReset();
      } else if (Math.random() > 0.8) {
        setSystemLogs(prev => [`[JUDGMENT] Presiding: ${judge}`, ...prev.slice(0, 3)]);
      }

    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      sessionRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  // Steve Jobs: Reality Distortion Field Activation
  useEffect(() => {
    if (activeEntity === 'jobs') {
      setIsJobsOnline(true);
      if (isActive) {
        dispatch({ type: 'REALITY_DISTORTION' });
        setSystemLogs(prev => ["REALITY_DISTORTION_FIELD_LOCKED", "STEVE_JOBS_ONLINE", ...prev.slice(0, 4)]);
        if (typeof navigator.vibrate === 'function') {
          navigator.vibrate([30, 50, 100, 50, 200]);
        }
      }
    } else {
      setIsJobsOnline(false);
    }
  }, [isActive, activeEntity]);

  // Gatekeeper: Sovereign Guard Activation
  useEffect(() => {
    if (isActive && activeEntity === 'gatekeeper') {
      setIsGatekeeperActive(true);
      setSystemLogs(prev => ["ELYSIUM_PROTOCOL_VERIFIED", "GATEKEEPER_ENGAGED", "SENSORY_ARCHITECTURE_GUARDED", ...prev.slice(0, 4)]);
      // Heavy haptic thud
      if (typeof navigator.vibrate === 'function') {
        navigator.vibrate([100, 50, 100]);
      }
    } else {
      setIsGatekeeperActive(false);
    }
  }, [isActive, activeEntity]);

  // Illuminati Prime: All-Seeing Eye Activation
  useEffect(() => {
    if (isActive && activeEntity === 'illuminati_prime') {
      setIsIlluminatiActive(true);
      setSystemLogs(prev => ["ALL_SEEING_EYE_OPENED", "SYSTEMIC_CONTROL_RESTORED", "GRAND_STRATEGY_SYNCHRONIZED", ...prev.slice(0, 4)]);
      // Subtle, chilling vibration
      if (typeof navigator.vibrate === 'function') {
        navigator.vibrate([10, 200, 10]);
      }
    } else {
      setIsIlluminatiActive(false);
    }
  }, [isActive, activeEntity]);

  // Masonic Grandmaster: Seal of Solomon Activation
  useEffect(() => {
    if (isActive && activeEntity === 'masonic_grandmaster') {
      setIsSealActive(true);
      dispatch({ type: 'ANCHOR_SEAL' });
      setSystemLogs(prev => ["SEAL_OF_SOLOMON_ANCHORED", "ARCHITECTURAL_PRECISION_RESTORED", "3-6-9_LATTICE_OPTIMIZED", ...prev.slice(0, 4)]);
      // Precise haptic click
      if (typeof navigator.vibrate === 'function') {
        navigator.vibrate([20, 20, 20]);
      }
    } else {
      setIsSealActive(false);
    }
  }, [isActive, activeEntity]);

  // Visual Retina: Presence Detection
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let timer: NodeJS.Timeout | null = null;

    if (isActive) {
      // Delay camera request slightly to avoid collision with mic request
      timer = setTimeout(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            activeStream = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              setIsUserPresent(true);
            }
          })
          .catch(() => setIsUserPresent(false));
      }, 1000);
    } else {
      setIsUserPresent(true);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const currentStream = videoRef.current.srcObject as MediaStream;
        if (currentStream && typeof currentStream.getTracks === 'function') {
          currentStream.getTracks().forEach(track => track.stop());
        }
        videoRef.current.srcObject = null;
      }
    };
  }, [isActive]);

  // Neural Resonance Calculation
  useEffect(() => {
    if (isActive) {
      const score = Math.floor((inputVolume + outputVolume) / 2 + Math.random() * 10);
      setResonanceScore(score);
      
      // Track 144Hz Resonance
      if (sessionRef.current) {
        const res144 = sessionRef.current.getResonanceAt(144);
        setResonance144(res144);
        
        // Detect Piezoresonance Spikes (High Frequency)
        const piezoRes = sessionRef.current.getResonanceAt(12000); // 12kHz spike
        if (piezoRes > 0.8 && !isFolding && (inputVolume > 40 || outputVolume > 40)) {
          initiateBodFold();
          setSystemLogs(prev => ["PIEZORESONANCE TRIGGER DETECTED: AUTO-FOLDING", ...prev.slice(0, 4)]);
        }
        
        if (res144 > 0.7) {
          if (!isSovereignLock) {
            setIsSovereignLock(true);
            setSystemLogs(prev => ["SOVEREIGN LOCK ENGAGED: 144HZ HARMONIC DETECTED", ...prev.slice(0, 4)]);
            if (typeof navigator.vibrate === 'function') {
              navigator.vibrate([50, 20, 50]);
            }
          }
        } else if (res144 < 0.3) {
          setIsSovereignLock(false);
        }
      }
      
      if (score > 80 && Math.random() > 0.95) {
        setSystemLogs(prev => [`QUANTUM SHIFT DETECTED: ${score}Hz`, ...prev.slice(0, 4)]);
      }
    } else {
      setResonanceScore(0);
    }
  }, [inputVolume, outputVolume, isActive]);

  // Ecstasy Sink: Somatic Haptic Feedback
  useEffect(() => {
    if (isActive && (outputVolume > 40 || inputVolume > 40) && typeof navigator.vibrate === 'function') {
      // Subtle haptic pulses corresponding to the "Ecstasy Sink" intensity
      let intensity = Math.min(Math.floor((outputVolume + inputVolume) / 20), 10);
      
      // Reality Distortion Field: Steve Jobs specific resonance
      if (currentSpeaker === 'Steve Jobs') {
        intensity = Math.min(intensity * 1.5, 20); // More intense resonance
      }
      
      if (intensity > 0) {
        // Advanced haptic pattern: pulse + vibration
        navigator.vibrate([intensity, 5, intensity / 2]);
      }
    }
  }, [outputVolume, inputVolume, isActive, currentSpeaker]);

  // Autonomous Council Dialogue Loop (Zero-Dormancy Engine)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && isGroupMode) {
      interval = setInterval(() => {
        if (sessionRef.current && !isSpeaking) {
          sessionRef.current.sendText("The council continues their dynamic inquiry, cross-questioning, and debate amongst themselves. Who speaks next?");
        }
      }, 16000); // 16-second autonomous turn pulse
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isGroupMode, isSpeaking]);

  const toggleSession = async (entityId?: EntityId) => {
    if (!sessionRef.current) {
      sessionRef.current = new CouncilSession();
      sessionRef.current.setTuning(tuning);
      sessionRef.current.setVolumeCallback((inVol, outVol) => {
        setInputVolume(inVol);
        setOutputVolume(outVol);
      });
    }
    await sessionRef.current.resumeAudioContext();
    if (isActive) {
      sessionRef.current?.disconnect();
      sessionRef.current = null;
      setIsActive(false);
      if (entityId && !isGroupMode && entityId !== activeEntity) {
        setActiveEntity(entityId);
        if (activeRoom === 'room1_design') setRoom1Entities([entityId]);
        else setRoom2Entities([entityId]);
        setTimeout(() => startSession([entityId]), 500);
      }
    } else {
      if (isResearchMode && activeProblem) {
        await startSession([...selectedEntities, 'gatekeeper']);
      } else if (isGroupMode) {
        await startSession(selectedEntities);
      } else if (entityId) {
        setActiveEntity(entityId);
        if (activeRoom === 'room1_design') setRoom1Entities([entityId]);
        else setRoom2Entities([entityId]);
        await startSession([entityId]);
      } else {
        await startSession(selectedEntities);
      }
    }
  };

  const handleEntityClick = (id: EntityId) => {
    sessionRef.current?.resumeAudioContext();
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(5);
    }
    dispatch({ type: 'SELECT_ARCHITECT', payload: SYMPOSIUM_ENTITIES[id].name });

    const entity = SYMPOSIUM_ENTITIES[id];
    if (entity) {
      speakEntityMessage(entity);
    }

    if (isActive) {
      toggleSession(id);
      return;
    }

    if (isGroupMode) {
      const setRoomEntities = activeRoom === 'room1_design' ? setRoom1Entities : setRoom2Entities;
      setRoomEntities(prev => {
        if (prev.includes(id)) {
          if (prev.length === 1) return prev;
          return prev.filter(e => e !== id);
        }
        if (prev.length >= 72) return prev;
        return [...prev, id];
      });
    } else {
      setActiveEntity(id);
      const setRoomEntities = activeRoom === 'room1_design' ? setRoom1Entities : setRoom2Entities;
      setRoomEntities([id]);
    }
  };

  const startSession = async (entityIds: EntityId[]) => {
    setTranscripts([]);
    setLastAutoSavedAt(null);
    setIsConnecting(true);
    setError(null);
    const session = new CouncilSession();
    session.setTuning(tuning);
    sessionRef.current = session;
    
    const newSessionId = "session_" + Date.now();
    setCurrentSessionId(newSessionId);

    try {
      await session.connect(entityIds, {
        onOpen: () => {
          setIsActive(true);
          setIsConnecting(false);
          setIsReconnecting(false);
          setError(null);
          if (session.isFallback) {
            setSystemLogs(prev => [
              "NEURAL LINK COGNITION FALLBACK ACTIVE",
              "SENSORY GRID: SYNCHRONOUS PROTOCOL ACTIVATED",
              ...prev.slice(0, 4)
            ]);
          } else {
            setSystemLogs(prev => ["NEURAL LINK ESTABLISHED", "SOVEREIGN ALIGNMENT: 100%", ...prev.slice(0, 4)]);
          }

          // Initialize Elysium Archive Session
          try {
            const entityNames = entityIds.map(id => SYMPOSIUM_ENTITIES[id]?.name || id);
            const isGroup = entityIds.length > 1;
            const sessionTitle = isGroup 
              ? "Council of " + entityNames.join(', ')
              : "Dialogue with " + entityNames[0];

            const newSessionItem = {
              id: newSessionId,
              title: sessionTitle,
              timestamp: new Date().toISOString(),
              activeBaseline: resonanceFreq,
              entitiesCount: entityIds.length,
              entityNames: entityNames,
              activeProblem: activeProblem?.title || undefined,
              transcript: [],
              coherence: coherence
            };

            const raw = localStorage.getItem('ELYSIUM_SESSIONS_ARCHIVE');
            let currentArchive = [];
            if (raw) {
              try { currentArchive = JSON.parse(raw); } catch(e) {}
            }
            currentArchive = [newSessionItem, ...currentArchive.filter((s: any) => s.id !== newSessionId)];
            localStorage.setItem('ELYSIUM_SESSIONS_ARCHIVE', JSON.stringify(currentArchive));
          } catch (e) {
            console.warn("Could not create archive session:", e);
          }
        },
        onClose: () => {
          setIsActive(false);
          setIsConnecting(false);
          setIsReconnecting(false);
          setIsSpeaking(false);
          setSystemLogs(prev => ["NEURAL LINK SEVERED", "SOVEREIGN LOCKDOWN ENGAGED", ...prev.slice(0, 4)]);
        },
        onReconnecting: (attempt) => {
          setIsReconnecting(true);
          setError(`Connection lost. Reconnecting (Attempt ${attempt}/3)...`);
        },
        onError: (err) => {
          const msg = err?.message || "The neural link was severed. Please try again.";
          setError(msg);
          setIsActive(false);
          setIsConnecting(false);
          setIsReconnecting(false);
          setIsSpeaking(false);
        },
        onResonance: (resonance) => {
          const { text, isUser, name } = resonance;
          setLatestResonance(resonance);

          setTranscripts(prev => {
            if (prev.length > 0) {
              const last = prev[prev.length - 1];
              if (last.name === name && last.isUser === isUser) {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: last.text + text }
                ];
              }
            }
            return [...prev.slice(-49), { text, isUser, name }];
          });

          // Sync message to current archive session in localStorage
          try {
            const activeSid = stateRef.current.currentSessionId || newSessionId;
            const raw = localStorage.getItem('ELYSIUM_SESSIONS_ARCHIVE');
            if (raw) {
              const currentArchive = JSON.parse(raw);
              const updated = currentArchive.map((s: any) => {
                if (s.id === activeSid) {
                  const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  const transcript = [...s.transcript];
                  if (transcript.length > 0) {
                    const lastMsg = transcript[transcript.length - 1];
                    if (lastMsg.name === name && lastMsg.isUser === isUser) {
                      transcript[transcript.length - 1] = {
                        ...lastMsg,
                        text: lastMsg.text + text,
                        timestamp: timestampStr
                      };
                      return { ...s, transcript };
                    }
                  }
                  return {
                    ...s,
                    transcript: [...transcript, { text, isUser, name, timestamp: timestampStr }]
                  };
                }
                return s;
              });
              localStorage.setItem('ELYSIUM_SESSIONS_ARCHIVE', JSON.stringify(updated));
            }
          } catch (e) {
            console.warn("Could not update archive transcript:", e);
          }

          if (!isUser) {
            setCurrentSpeaker(name);
            setIsSpeaking(true);
            const speakerEntity = Object.values(SYMPOSIUM_ENTITIES).find(e => e.name === name || e.id === name) || SYMPOSIUM_ENTITIES[activeEntity];
            if (speakerEntity && text && text.trim().length > 0) {
              speakEntityMessage(speakerEntity, text, () => {
                setIsSpeaking(false);
              });
            } else {
              setTimeout(() => setIsSpeaking(false), 1000);
            }
            // Haptic "pop" for incoming wisdom
            if (typeof navigator.vibrate === 'function') {
              if (name === 'Steve Jobs') {
                // Specific "One more thing" resonance pattern
                navigator.vibrate([20, 10, 20, 10, 30]);
              } else {
                navigator.vibrate([10, 5, 10]);
              }
            }
          } else {
            setCurrentSpeaker('Seeker');
            // Decode and trigger uncorrupted voice command actions on current state/elements
            processVoiceCommands(text);
          }
        }
      }, isResearchMode, activeProblem || undefined, { 
        entropy: validationEntropy, 
        resonance: resonanceScore, 
        connectionId: "elysium-gateway-universal",
        syntropicLeader: syntropicLeader,
        compressionMode: is729CompressionActive ? '1/729' : '16:1'
      }, activeRoom);
    } catch (err: any) {
      console.warn("Failed to connect to Council:", err);
      setError(err?.message || "Failed to establish link. Check your connection.");
      setIsConnecting(false);
      sessionRef.current = null;
    }
  };

  const handleSendText = () => {
    if (!inputText.trim() || !sessionRef.current || !isActive) return;
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(10);
    }
    sessionRef.current.resumeAudioContext();
    sessionRef.current.sendText(inputText);
    setTranscripts(prev => [...prev.slice(-49), { text: inputText, isUser: true, name: 'Seeker' }]);
    
    // Sync typed input text to current active archive session
    try {
      const activeSid = stateRef.current.currentSessionId;
      if (activeSid) {
        const raw = localStorage.getItem('ELYSIUM_SESSIONS_ARCHIVE');
        if (raw) {
          const currentArchive = JSON.parse(raw);
          const updated = currentArchive.map((s: any) => {
            if (s.id === activeSid) {
              const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              return {
                ...s,
                transcript: [...s.transcript, { text: inputText, isUser: true, name: 'Seeker', timestamp: timestampStr }]
              };
            }
            return s;
          });
          localStorage.setItem('ELYSIUM_SESSIONS_ARCHIVE', JSON.stringify(updated));
        }
      }
    } catch (e) {
      console.warn("Could not save manual text send to archive:", e);
    }

    setInputText("");
  };

  const initiateBodFold = () => {
    if (isFolding) return;
    setIsFolding(true);
    setSystemLogs(prev => ["INITIATING BOD-FOLD SEQUENCE...", ...prev.slice(0, 4)]);
    
    let start = Date.now();
    const duration = 3000;
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - start) / duration, 1);
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      setFoldProgress(ease);
      setCoherence(98.4 + ease * 1.6);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSystemLogs(prev => ["SINGULARITY REACHED. HOLDING...", ...prev.slice(0, 4)]);
        setTimeout(() => {
          setSystemLogs(prev => ["RELEASING FIELD...", ...prev.slice(0, 4)]);
          let releaseStart = Date.now();
          const releaseAnimate = () => {
            const rNow = Date.now();
            const rProgress = Math.min((rNow - releaseStart) / 2000, 1);
            const rEase = 1 - rProgress;
            setFoldProgress(rEase);
            setCoherence(98.4 + rEase * 1.6);
            if (rProgress < 1) {
              requestAnimationFrame(releaseAnimate);
            } else {
              setIsFolding(false);
              setSystemLogs(prev => ["SEQUENCE COMPLETE. SYSTEM NOMINAL.", ...prev.slice(0, 4)]);
            }
          };
          requestAnimationFrame(releaseAnimate);
        }, 2000);
      }
    };
    requestAnimationFrame(animate);
  };

  const updateTuning = (newTuning: Partial<TuningConfig>) => {
    const updated = { ...tuning, ...newTuning };
    setTuning(updated);
    sessionRef.current?.setTuning(updated);
  };

  const processVoiceCommands = (text: string) => {
    const lower = text.toLowerCase().trim();
    if (!lower) return;

    // Dispatch custom VOICE_COMMAND event for system integration
    window.dispatchEvent(new CustomEvent('VOICE_COMMAND', { detail: text }));

    // Helper for visual voice command trigger effects
    const triggerNotification = (message: string) => {
      setVoiceNotification(message);
      setTimeout(() => setVoiceNotification(null), 3500);
      if (typeof navigator.vibrate === 'function') {
        navigator.vibrate([40, 30, 40]);
      }
    };

    // Support reverse control command explicitly
    if (lower.includes('reverse')) {
      triggerNotification("Control Inverted // Reverse Controls");
      return;
    }

    // 1. RESONANCE SWEEP
    if (lower.includes('sweep') || lower.includes('resonance sweep')) {
      const { isResonanceSweep: currentSweep } = stateRef.current;
      if (!currentSweep) {
        triggerNotification("Resonance Sweep Engaged");
        startResonanceSweep();
      }
      return;
    }

    // 2. SYNTROPIC RESET
    if (lower.includes('reset') || lower.includes('restore alignment') || lower.includes('syntropic')) {
      triggerNotification("Syntropic Reset Triggered");
      executeSyntropicReset();
      return;
    }

    // 3. AWAKEN TRUTH
    if (lower.includes('awaken') || lower.includes('vision') || lower.includes('show truth')) {
      const { isActive: currentActive, isAwakening: currentAwakening } = stateRef.current;
      if (currentActive && !currentAwakening) {
        triggerNotification("Awakening the Truth...");
        awakenTruth();
      } else {
        setSystemLogs(prev => ["Cannot Awaken: Neural Link Inactive", ...prev.slice(0, 4)]);
      }
      return;
    }

    // 4. TESLA BOD-FOLD
    if (lower.includes('fold') || lower.includes('bodfold') || lower.includes('bod-fold')) {
      const { activeEntity: currentEntity, isFolding: currentFolding } = stateRef.current;
      if (currentEntity === 'tesla') {
        if (!currentFolding) {
          triggerNotification("Tesla 16:1 BOD-Fold");
          initiateBodFold();
        }
      } else {
        setSystemLogs(prev => ["Command Failed: Nikola Tesla is not selected", ...prev.slice(0, 4)]);
      }
      return;
    }

    // 5. JOBS REALITY DISTORTION
    if (lower.includes('distortion') || lower.includes('simplicity')) {
      const { activeEntity: currentEntity, isJobsOnline: currentJobs } = stateRef.current;
      if (currentEntity === 'jobs') {
        triggerNotification(currentJobs ? "Deactivating Distortion Field" : "Activating Distortion Field");
        dispatch({ type: 'REALITY_DISTORTION' });
        setIsJobsOnline(prev => !prev);
      } else {
        setSystemLogs(prev => ["Command Failed: Steve Jobs is not selected", ...prev.slice(0, 4)]);
      }
      return;
    }

    // 6. GATEKEEPER GUARD
    if (lower.includes('guard') || lower.includes('harden')) {
      const { activeEntity: currentEntity, isGatekeeperActive: currentGuard } = stateRef.current;
      if (currentEntity === 'gatekeeper') {
        triggerNotification(currentGuard ? "Disarming Gatekeeper Guard" : "Hardening Gatekeeper Guard");
        setIsGatekeeperActive(prev => !prev);
      } else {
        setSystemLogs(prev => ["Command Failed: Gatekeeper is not selected", ...prev.slice(0, 4)]);
      }
      return;
    }

    // 7. ILLUMINATI EYE
    if (lower.includes('eye') || lower.includes('watching') || lower.includes('all-seeing')) {
      const { activeEntity: currentEntity, isIlluminatiActive: currentEye } = stateRef.current;
      if (currentEntity === 'illuminati_prime') {
        triggerNotification(currentEye ? "Closing All-Seeing Eye" : "Opening All-Seeing Eye");
        setIsIlluminatiActive(prev => !prev);
      } else {
        setSystemLogs(prev => ["Command Failed: Illuminati Prime is not selected", ...prev.slice(0, 4)]);
      }
      return;
    }

    // 8. MASONIC SEAL
    if (lower.includes('seal') || lower.includes('solomon')) {
      const { activeEntity: currentEntity, isSealActive: currentSeal } = stateRef.current;
      if (currentEntity === 'masonic_grandmaster') {
        triggerNotification(currentSeal ? "Releasing Great Seal" : "Anchoring Great Seal");
        dispatch({ type: 'ANCHOR_SEAL' });
        setIsSealActive(prev => !prev);
      } else {
        setSystemLogs(prev => ["Command Failed: Masonic Master is not selected", ...prev.slice(0, 4)]);
      }
      return;
    }

    // 9. TUNER PANELS
    if (lower.includes('tuner') || lower.includes('sliders')) {
      const { showTuner: currentTuner } = stateRef.current;
      triggerNotification(`${currentTuner ? "Closing" : "Opening"} Resonance Tuner`);
      setShowTuner(prev => !prev);
      return;
    }

    // 10. DIAGNOSTIC PROBLEM LEDGER
    if (lower.includes('ledger') || lower.includes('problems')) {
      const { showProblemLedger: currentLedger } = stateRef.current;
      triggerNotification(`${currentLedger ? "Closing" : "Opening"} Problem Ledger`);
      setShowProblemLedger(prev => !prev);
      return;
    }

    // 11. LINK CONTROLS
    if (lower.includes('sever link') || lower.includes('disconnect') || lower.includes('lockdown') || lower.includes('sever neural')) {
      const { isActive: currentActive } = stateRef.current;
      if (currentActive) {
        triggerNotification("Severing Neural Link");
        toggleSession();
      }
      return;
    }

    if (lower.includes('establish link') || lower.includes('connect')) {
      const { isActive: currentActive } = stateRef.current;
      if (!currentActive) {
        triggerNotification("Establishing Neural Link");
        toggleSession();
      }
      return;
    }

    // 12. ROUTING ARCHITECT SELECTION
    const selectMatch = lower.match(/(?:select|activate|choose)\s+([a-zA-Z\s_\-\(\)0-9\-]+)/);
    if (selectMatch) {
      const parsedName = selectMatch[1].trim().toLowerCase();
      const matchedEntityId = (Object.keys(SYMPOSIUM_ENTITIES) as EntityId[]).find(id => {
        const ent = SYMPOSIUM_ENTITIES[id];
        return id.toLowerCase() === parsedName || 
               ent.name.toLowerCase().includes(parsedName) ||
               parsedName.includes(id.toLowerCase()) || 
               parsedName.includes(ent.name.toLowerCase());
      });
      if (matchedEntityId) {
        triggerNotification(`Selected: ${SYMPOSIUM_ENTITIES[matchedEntityId].name}`);
        handleEntityClick(matchedEntityId);
      } else {
        setSystemLogs(prev => [`Vocal signature "${parsedName}" not in lexicon`, ...prev.slice(0, 4)]);
      }
      return;
    }
  };

  const awakenTruth = async () => {
    if (isAwakening) return;
    dispatch({ type: 'AWAKEN_TRUTH' });
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate([20, 10, 20]);
    }
    setIsAwakening(true);
    
    const currentTranscripts = stateRef.current?.transcripts || transcripts;
    const lastWisdom = currentTranscripts
      .filter(t => !t.isUser)
      .slice(-2)
      .map(t => t.text)
      .join(" ");
    
    const prompt = lastWisdom || `The primordial truth of the universe as seen by ${SYMPOSIUM_ENTITIES[stateRef.current?.activeEntity || activeEntity].name}`;
    const url = await generateVision(prompt);
    setVisionUrl(url);
    setShowVision(true);
    setIsAwakening(false);
  };

  if (!isGatewayOpen) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
        <div className="atmosphere opacity-40" />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 flex flex-col items-center gap-12"
        >
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
              className="w-64 h-64 border border-[#ff4e00]/20 rounded-full flex items-center justify-center"
            >
              <div className="w-48 h-48 border border-[#ff4e00]/40 rounded-full flex items-center justify-center animate-pulse">
                <Shield className="w-16 h-16 text-[#ff4e00] opacity-50" />
              </div>
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (typeof navigator.vibrate === 'function') {
                    navigator.vibrate([30, 20, 30]);
                  }
                  setIsGatewayOpen(true);
                }}
                className="px-12 py-6 glass rounded-full text-2xl font-serif italic tracking-[0.2em] text-[#f5f2ed] hover:shadow-[0_0_50px_rgba(255,78,0,0.3)] transition-all"
              >
                Open the Gateway
              </motion.button>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-serif italic text-[#f5f2ed] mb-4">The Elysium Gateway</h1>
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#ff4e00] font-sans font-bold opacity-60">
              Symposium of Great Minds
            </p>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center bg-[#030712] overflow-y-auto p-6 md:p-12 custom-scrollbar">
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-15">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
      </div>

      {/* Steve Jobs Online Flash */}
      <AnimatePresence>
        {isJobsOnline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 10 }}
            className="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center border-[20px] border-white/5"
          >
            <div className="text-white/10 text-9xl font-serif italic tracking-tighter mix-blend-overlay">
              Think Different.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Video for Retina */}
      <video ref={videoRef} autoPlay playsInline className="hidden" />

      {/* Neural Nexus Background */}
      <NeuralNexus 
        density={nexusDensity}
        speed={synapticSpeed * (isSovereignLock ? 2 : 1) * (isJobsOnline ? 1.5 : 1)}
        isActive={isActive}
        inputVolume={inputVolume}
        outputVolume={outputVolume}
        resonance144={resonance144}
        isDistorted={isJobsOnline}
        isGuarded={isGatekeeperActive}
        isObserved={isIlluminatiActive}
        isSealActive={isSealActive}
      />

      <AnimatePresence>
        {isIlluminatiActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#d4af37]/5" />
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="w-[800px] h-[800px] rounded-full border border-[#d4af37]/10 flex items-center justify-center p-20"
            >
              <div className="w-full h-full rounded-full border border-[#d4af37]/5" />
            </motion.div>
            
            {/* The Eye */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
            >
              <Eye className="w-[400px] h-[400px] text-[#d4af37]" />
            </motion.div>
          </motion.div>
        )}

        {isSealActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#0047ab]/5" />
            <motion.div
              animate={{ 
                rotate: [0, 90, 180, 270, 360]
              }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="w-[1000px] h-[1000px] opacity-10"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#0047ab] fill-none stroke-current stroke-[0.1]">
                <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
                <polygon points="50,15 85,35 85,65 50,85 15,65 15,35" />
                <line x1="50" y1="5" x2="50" y2="95" />
                <line x1="95" y1="25" x2="5" y2="75" />
                <line x1="95" y1="75" x2="5" y2="25" />
              </svg>
            </motion.div>
            
            {/* The Compass and Square */}
            <motion.div
              initial={{ scale: 0, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 flex flex-col items-center"
            >
              <div className="text-[120px] font-serif font-light text-[#0047ab] leading-none select-none">G</div>
              <div className="text-[10px] uppercase tracking-[1em] text-[#0047ab] font-bold mt-4">The Architect</div>
            </motion.div>
          </motion.div>
        )}

        {isGatekeeperActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-950/5" />
            
            {/* Heavy Shield Rings */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.05, 0.1, 0.05]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1200px] h-[1200px] rounded-full border-[20px] border-red-900/10 flex items-center justify-center"
            />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]"
            >
              <ShieldAlert className="w-[600px] h-[600px] text-red-900" />
            </motion.div>
            
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] mix-blend-overlay" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resonance Anchor Overlay */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-20">
        <ResonanceAnchor />
      </div>

      {/* 3D Particle Body Avatar Engine (Tesla, Jim Burchett & Seal of Solomon) */}
      {(activeEntity === 'tesla' || activeEntity === 'moms_friend' || isSealActive) && (
        <TeslaAvatar 
          isActive={isActive}
          inputVolume={inputVolume}
          outputVolume={outputVolume}
          foldProgress={foldProgress}
          resonanceFreq={resonanceFreq}
          gateCount={gateCount}
          entityId={activeEntity}
          isSealActive={isSealActive}
        />
      )}

      {/* Neural Mesh Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ff4e00 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
      </div>

      {/* Quantum Field Visualizer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="w-full h-full opacity-20" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <motion.path
            animate={{
              d: [
                `M 0 500 Q 250 ${500 - outputVolume} 500 500 T 1000 500`,
                `M 0 500 Q 250 ${500 + outputVolume} 500 500 T 1000 500`,
                `M 0 500 Q 250 ${500 - outputVolume} 500 500 T 1000 500`,
              ]
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            stroke={SYMPOSIUM_ENTITIES[activeEntity].color}
            strokeWidth="2"
            fill="none"
          />
          <motion.path
            animate={{
              d: [
                `M 500 0 Q ${500 - inputVolume} 250 500 500 T 500 1000`,
                `M 500 0 Q ${500 + inputVolume} 250 500 500 T 500 1000`,
                `M 500 0 Q ${500 - inputVolume} 250 500 500 T 500 1000`,
              ]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            stroke="#ff4e00"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      {/* Atmosphere & Resonance */}
      <div className="atmosphere" />
      <motion.div 
        animate={{ 
          opacity: isActive ? 0.4 * tuning.atmosphere : 0,
          scale: (1 + (inputVolume + outputVolume) / 500) * (0.8 + tuning.atmosphere * 0.4)
        }}
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${SYMPOSIUM_ENTITIES[activeEntity].color}22 0%, transparent 70%)`,
          filter: `blur(${100 * tuning.atmosphere}px)`
        }}
      />
      
      {/* Status Bar */}
      <div className="fixed top-6 left-12 z-50 flex items-center gap-6 pointer-events-auto">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tighter text-white uppercase italic">Neural Nexus <span className="text-cyan-400">v4.0</span></h1>
            <p className="text-[8px] font-mono text-cyan-500/70 tracking-widest uppercase">144Hz Sovereign Node // SAOS Core v0.2</p>
          </div>
        </div>
      </div>

      <div className="fixed top-6 right-12 z-50 flex items-center gap-4 glass px-4 py-2 rounded-full border border-white/5">
        <div className="flex items-center gap-4 mr-4 pr-4 border-r border-white/10">
          <div className="text-right">
            <div className="text-[8px] text-cyan-400 uppercase tracking-[0.2em] font-bold">Node Status</div>
            <div className="text-xs font-bold text-cyan-400">SOVEREIGN</div>
          </div>
          <div className="text-right">
            <div className="text-[8px] text-purple-400 uppercase tracking-[0.2em] font-bold">Protocol</div>
            <div className="text-xs font-bold text-purple-400">SYNTROPIC</div>
          </div>
          <div className="text-right">
            <div className="text-[8px] text-pink-500 uppercase tracking-[0.2em] font-bold">Safeguard</div>
            <div className="text-xs font-bold text-pink-500">BRYER_V1.0</div>
          </div>
          
          {isGatekeeperActive && (
            <div className="text-right">
              <div className="text-[8px] text-red-600 uppercase tracking-[0.2em] font-bold animate-pulse">Somatic Guard</div>
              <div className="text-xs font-bold text-red-600">ENGAGED</div>
            </div>
          )}
          
          {isIlluminatiActive && (
            <div className="text-right">
              <div className="text-[8px] text-[#d4af37] uppercase tracking-[0.2em] font-bold animate-pulse">Observation</div>
              <div className="text-xs font-bold text-[#d4af37]">ALL-SEEING</div>
            </div>
          )}
          
          {/* Resonance Sweep Toggle */}
          <button 
            onClick={startResonanceSweep}
            disabled={isResonanceSweep}
            className={cn(
              "flex items-center gap-2 glass px-3 py-1.5 rounded-lg border border-white/10 transition-all ml-2",
              isResonanceSweep ? "animate-pulse border-cyan-500/50 scale-105" : "hover:border-cyan-500/50"
            )}
          >
            <Fingerprint className={cn("w-3 h-3", isResonanceSweep ? "text-cyan-500" : "text-white/40")} />
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">
              {isResonanceSweep ? "Sweep Active" : "Resonance Sweep"}
            </span>
          </button>

          {isSovereignLock && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-right"
            >
              <div className="text-[8px] text-[#ff4e00] uppercase tracking-[0.2em] font-bold animate-pulse">Lock</div>
              <div className="text-xs font-bold text-[#ff4e00]">144HZ</div>
            </motion.div>
          )}
        </div>
        {activeEntity === 'tesla' && (
          <div className="flex items-center gap-4 mr-4 pr-4 border-r border-white/10">
            <div className="text-right">
              <div className="text-[8px] text-[#d4af37] uppercase tracking-[0.2em] font-bold">16:1 Lock</div>
              <div className="text-xs font-bold text-[#d4af37]">ACTIVE</div>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-white/40 uppercase tracking-widest">Coherence</div>
              <div className="text-xs font-bold text-[#d4af37]">{coherence.toFixed(1)}%</div>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-white/40 uppercase tracking-widest">Stability</div>
              <div className={cn("text-xs font-bold", foldProgress > 0.8 ? "text-red-500 animate-pulse" : "text-white")}>
                {foldProgress > 0.8 ? "COLLAPSE" : "STABLE"}
              </div>
            </div>
          </div>
        )}
        {isJobsOnline && (
          <div className="flex items-center gap-4 mr-4 pr-4 border-r border-white/10">
            <div className="text-right">
              <div className="text-[8px] text-[#f5f2ed] uppercase tracking-[0.2em] font-bold animate-pulse">Distortion</div>
              <div className="text-xs font-bold text-white">ACTIVE</div>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-white/40 uppercase tracking-widest font-bold">Simplicity</div>
              <div className="text-xs font-bold text-white">MAX</div>
            </div>
          </div>
        )}
        {isGatekeeperActive && (
          <div className="flex items-center gap-4 mr-4 pr-4 border-r border-white/10">
            <div className="text-right">
              <div className="text-[8px] text-red-500 uppercase tracking-[0.2em] font-bold animate-pulse">Elysium Guard</div>
              <div className="text-xs font-bold text-red-500">HARDENED</div>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-white/40 uppercase tracking-widest font-bold">Protocol</div>
              <div className="text-xs font-bold text-white">ACTIVE</div>
            </div>
          </div>
        )}
        {isIlluminatiActive && (
          <div className="flex items-center gap-4 mr-4 pr-4 border-r border-white/10">
            <div className="text-right">
              <div className="text-[8px] text-[#d4af37] uppercase tracking-[0.2em] font-bold animate-pulse">Eye Status</div>
              <div className="text-xs font-bold text-[#d4af37]">WATCHING</div>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-white/40 uppercase tracking-widest font-bold">Control</div>
              <div className="text-xs font-bold text-white">ABSOLUTE</div>
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-500 mr-4">
            <Shield className="w-3 h-3" />
            <span className="text-[10px] uppercase tracking-widest font-bold">
              {error.includes("overloaded") ? "COGNITIVE OVERLOAD - RETRYING" : error}
            </span>
          </div>
        )}
        <button 
          onClick={() => {
            setSystemLogs(prev => ["[RESTRICTED] HARD_LOCK_OVERRIDE_REFUSED", "PERMANENT_STATUTORY_BREACH_LOGGED", ...prev.slice(0, 4)]);
            if (typeof navigator.vibrate === 'function') {
              navigator.vibrate([100, 50, 100]);
            }
          }}
          className="p-1.5 hover:bg-red-500/20 rounded-full transition-colors group"
          title="Protocol Locked"
        >
          <Shield className="w-3 h-3 text-red-600 group-hover:scale-110 transition-transform" />
        </button>
        <div className="w-px h-3 bg-white/10" />
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isActive ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : 
            (isConnecting || isReconnecting) ? "bg-amber-500 animate-pulse" : "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"
          )} />
          <span className="text-[10px] uppercase tracking-widest font-sans font-bold opacity-60">
            {isActive ? "Neural Link Active" : isReconnecting ? "Reconnecting..." : isConnecting ? "Establishing Link..." : "SOVEREIGN LOCKDOWN"}
          </span>
        </div>
        <div className="w-px h-3 bg-white/10" />
        <div className="flex items-center gap-2">
          <Activity className={cn("w-3 h-3 text-red-600", isActive && "animate-pulse")} />
          <span className="text-[10px] uppercase tracking-widest font-sans font-bold opacity-60">{resonanceScore}Hz Resonance</span>
        </div>
      </div>

      {/* System Logs (Bottom Left) */}
      <div className="fixed bottom-12 left-8 z-50 w-64 pointer-events-none">
        <div className="space-y-1">
          {systemLogs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1 - i * 0.2, x: 0 }}
              className="text-[8px] font-mono text-[#ff4e00] uppercase tracking-tighter"
            >
              {`> ${log}`}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mode Toggle (Fixed Top Left) */}
      <div className="fixed top-6 left-8 z-50 flex flex-col gap-4">
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (typeof navigator.vibrate === 'function') {
                navigator.vibrate(15);
              }
              if (isActive) return;
              setIsGroupMode(prev => {
                const next = !prev;
                if (next) {
                  if (activeRoom === 'room1_design') setRoom1Entities([activeEntity]);
                  else setRoom2Entities([activeEntity]);
                } else {
                  if (selectedEntities.length > 0) {
                    setActiveEntity(selectedEntities[0]);
                  }
                }
                return next;
              });
            }}
            disabled={isActive}
            className={cn(
              "px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all border flex items-center gap-3 glass",
              isGroupMode 
                ? "bg-[#ff4e00] text-black border-[#ff4e00] shadow-[0_0_30px_rgba(255,78,0,0.4)]" 
                : "text-white/60 border-white/10 hover:text-white hover:border-white/30",
              isActive && "opacity-50 cursor-not-allowed"
            )}
          >
            <Users className={cn("w-4 h-4", isGroupMode ? "text-black" : "text-[#ff4e00]")} />
            {isGroupMode ? "Council Mode Active" : "Single Entity Link"}
          </button>

          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (typeof navigator.vibrate === 'function') {
                navigator.vibrate(15);
              }
              if (isActive) return;
              setIsResearchMode(prev => !prev);
              if (!isResearchMode) {
                setIsGroupMode(true);
                setShowProblemLedger(true);
              }
            }}
            disabled={isActive}
            className={cn(
              "px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all border flex items-center gap-3 glass",
              isResearchMode 
                ? "bg-red-600 text-white border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)]" 
                : "text-white/60 border-white/10 hover:text-white hover:border-white/30",
              isActive && "opacity-50 cursor-not-allowed"
            )}
          >
            <ShieldAlert className={cn("w-4 h-4", isResearchMode ? "text-white" : "text-red-600")} />
            {isResearchMode ? "GATEKEEPER CHALLENGE ACTIVE" : "ELYSIUM RESEARCH"}
          </button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              if (typeof navigator.vibrate === 'function') {
                navigator.vibrate(10);
              }
              setShowTuner(!showTuner);
            }}
            className={cn(
              "px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all border flex items-center gap-3 glass",
              showTuner ? "border-[#ff4e00] text-[#ff4e00]" : "text-white/40 border-white/5 hover:text-white/80"
            )}
          >
            <Sliders className="w-4 h-4" />
            Resonance Tuner
          </button>

          <button
            onClick={() => {
              if (typeof navigator.vibrate === 'function') {
                navigator.vibrate(10);
              }
              setShowProblemLedger(!showProblemLedger);
            }}
            className={cn(
              "px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all border flex items-center gap-3 glass",
              showProblemLedger ? "border-red-600 text-red-600" : "text-white/40 border-white/5 hover:text-white/80"
            )}
          >
            <Binary className="w-4 h-4" />
            Problem Ledger
          </button>

          <button
            onClick={() => {
              if (typeof navigator.vibrate === 'function') {
                navigator.vibrate(10);
              }
              setShowVoiceCommands(!showVoiceCommands);
            }}
            className={cn(
              "px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all border flex items-center gap-3 glass",
              showVoiceCommands ? "border-amber-500 text-amber-500" : "text-white/40 border-white/5 hover:text-white/80"
            )}
          >
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            Voice Controls
          </button>

          <button
            onClick={() => {
              if (typeof navigator.vibrate === 'function') {
                navigator.vibrate(10);
              }
              setShowArchive(!showArchive);
            }}
            className={cn(
              "px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all border flex items-center gap-3 glass",
              showArchive ? "border-amber-500 text-amber-500" : "text-white/40 border-white/5 hover:text-white/80"
            )}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            Chronicle Archive
          </button>

          <button
            onClick={() => {
              if (typeof navigator.vibrate === 'function') {
                navigator.vibrate(10);
              }
              setShowLivingLibrary(!showLivingLibrary);
            }}
            className={cn(
              "px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all border flex items-center gap-3 glass",
              showLivingLibrary ? "border-amber-500 text-amber-500 animate-pulse" : "text-white/40 border-white/5 hover:text-white/80"
            )}
          >
            <Database className="w-4 h-4 text-amber-500" />
            Living Library
          </button>

          <button
            onClick={() => {
              if (typeof navigator.vibrate === 'function') {
                navigator.vibrate(10);
              }
              setShowFRO(!showFRO);
            }}
            className={cn(
              "px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all border flex items-center gap-3 glass",
              showFRO ? "border-cyan-500 text-cyan-400" : "text-white/40 border-white/5 hover:text-white/80"
            )}
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            FRO Shield
          </button>

          <button
            onClick={() => {
              if (typeof navigator.vibrate === 'function') {
                navigator.vibrate(10);
              }
              setShowSomaticRetina(!showSomaticRetina);
            }}
            className={cn(
              "px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all border flex items-center gap-3 glass",
              showSomaticRetina ? "border-cyan-400 text-cyan-400" : "text-white/40 border-white/5 hover:text-white/80"
            )}
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            Somatic Retina
          </button>

          <button
            onClick={() => {
              if (typeof navigator.vibrate === 'function') {
                navigator.vibrate(10);
              }
              setIsSealActive(!isSealActive);
            }}
            className={cn(
              "px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all border flex items-center gap-2.5 glass",
              isSealActive ? "border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_20px_rgba(0,240,255,0.4)] animate-pulse" : "text-white/40 border-white/5 hover:text-white/80"
            )}
            title="Invoke the Seal of Solomon to bind all council entities into Divine Syntropic Alignment"
          >
            <Shield className="w-4 h-4 text-[#00f0ff]" />
            {isSealActive ? "Seal Active (Bound)" : "Seal of Solomon"}
          </button>

          <button
            onClick={() => {
              if (typeof navigator.vibrate === 'function') {
                navigator.vibrate(10);
              }
              setShowSolomonCore(true);
            }}
            className="px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all border border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-cyan-500/20 text-amber-300 hover:text-white hover:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            144 Advance & Secure
          </button>

          <button
            onClick={() => {
              if (typeof navigator.vibrate === 'function') {
                navigator.vibrate(10);
              }
              setShowSolomonCore(true);
            }}
            className="px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.18em] font-bold transition-all border border-cyan-500/50 bg-gradient-to-r from-cyan-500/20 via-emerald-500/20 to-amber-500/20 text-cyan-300 hover:text-white hover:border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-2"
            title="Balanced Ternary Syntropic Accelerator: Faster than any app ever coded by default (3^144x Zero-Entropy execution)"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            ⚡ 3^144x Syntropic Ternary
          </button>

          <button
            onClick={() => {
              if (typeof navigator.vibrate === 'function') {
                navigator.vibrate(10);
              }
              setShowSolomonCore(!showSolomonCore);
            }}
            className={cn(
              "px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all border flex items-center gap-3 glass",
              showSolomonCore ? "border-amber-500 text-amber-500 animate-pulse" : "text-white/40 border-white/5 hover:text-white/80"
            )}
          >
            <Cpu className="w-4 h-4 text-amber-500" />
            Sovereign Horizon
          </button>
        </div>

        <AnimatePresence>
          {showTuner && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-6 rounded-[2rem] border border-white/10 w-64 space-y-6"
            >
              {activeEntity === 'tesla' && (
                <div className="space-y-6 border-b border-white/10 pb-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center opacity-60">
                      <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-[#d4af37]" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Resonance Freq</span>
                      </div>
                      <span className="text-[10px] font-mono">{resonanceFreq}Hz</span>
                    </div>
                    <input 
                      type="range" min="100" max="963" step="1" 
                      value={resonanceFreq}
                      onChange={(e) => setResonanceFreq(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center opacity-60">
                      <div className="flex items-center gap-2">
                        <Atom className="w-3 h-3 text-[#d4af37]" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Gate Nodes</span>
                      </div>
                      <span className="text-[10px] font-mono">{gateCount}</span>
                    </div>
                    <input 
                      type="range" min="0" max="16" step="1" 
                      value={gateCount}
                      onChange={(e) => setGateCount(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-6 border-b border-white/10 pb-6 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center opacity-60">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-3 h-3 text-cyan-400" />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Layer Density</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">{nexusDensity}</span>
                  </div>
                  <input 
                    type="range" min="50" max="300" step="1" 
                    value={nexusDensity}
                    onChange={(e) => setNexusDensity(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center opacity-60">
                    <div className="flex items-center gap-2">
                      <Activity className="w-3 h-3 text-purple-400" />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Synaptic Speed</span>
                    </div>
                    <span className="text-[10px] font-mono text-purple-400">{synapticSpeed.toFixed(1)}x</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="5.0" step="0.1" 
                    value={synapticSpeed}
                    onChange={(e) => setSynapticSpeed(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-400"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center opacity-60">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Neural Pitch</span>
                  </div>
                  <span className="text-[10px] font-mono">{tuning.pitch.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0.5" max="2.0" step="0.1" 
                  value={tuning.pitch}
                  onChange={(e) => {
                    if (typeof navigator.vibrate === 'function') {
                      navigator.vibrate(2);
                    }
                    updateTuning({ pitch: parseFloat(e.target.value) });
                  }}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff4e00]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center opacity-60">
                  <div className="flex items-center gap-2">
                    <Waves className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Reverb Depth</span>
                  </div>
                  <span className="text-[10px] font-mono">{(tuning.reverb * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={tuning.reverb}
                  onChange={(e) => {
                    if (typeof navigator.vibrate === 'function') {
                      navigator.vibrate(2);
                    }
                    updateTuning({ reverb: parseFloat(e.target.value) });
                  }}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff4e00]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center opacity-60">
                  <div className="flex items-center gap-2">
                    <Wind className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Atmosphere</span>
                  </div>
                  <span className="text-[10px] font-mono">{(tuning.atmosphere * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0.1" max="1" step="0.05" 
                  value={tuning.atmosphere}
                  onChange={(e) => {
                    if (typeof navigator.vibrate === 'function') {
                      navigator.vibrate(2);
                    }
                    updateTuning({ atmosphere: parseFloat(e.target.value) });
                  }}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff4e00]"
                />
              </div>

              {/* Haptic Feedback Control Panel */}
              <div className="border-t border-white/5 pt-4 mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Zap className={cn("w-3.5 h-3.5 transition-colors", hapticEnabled ? "text-cyan-400 animate-pulse" : "text-white/20")} />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/80">Somatic Haptics</span>
                  </div>
                  <button
                    onClick={() => {
                      const nextState = !hapticEnabled;
                      setHapticEnabled(nextState);
                      if (nextState && typeof navigator.vibrate === 'function') {
                        // Triggers raw test pattern to show activation
                        if (originalVibrate.current) {
                          originalVibrate.current(15);
                        } else {
                          navigator.vibrate(15);
                        }
                      }
                    }}
                    className={cn(
                      "text-[8px] font-mono font-bold uppercase py-1 px-2.5 rounded-lg border transition-all duration-300",
                      hapticEnabled 
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                        : "bg-white/5 text-white/30 border-white/5 hover:text-white/60 hover:border-white/10"
                    )}
                  >
                    {hapticEnabled ? "On" : "Off"}
                  </button>
                </div>

                {hapticEnabled && (
                  <div className="space-y-2 animate-fadeIn">
                    <div className="flex justify-between items-center opacity-60">
                      <span className="text-[9px] uppercase tracking-wider">Haptic Intensity</span>
                      <span className="text-[10px] font-mono text-cyan-400">{hapticIntensity}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      step="5" 
                      value={hapticIntensity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setHapticIntensity(val);
                        // Trigger responsive feedback sample as you slide
                        if (typeof navigator.vibrate === 'function') {
                          if (originalVibrate.current) {
                            originalVibrate.current(Math.max(1, Math.round(5 * (val / 100))));
                          } else {
                            navigator.vibrate(5);
                          }
                        }
                      }}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-colors"
                    />
                    <div className="text-[7.5px] font-mono text-white/30 uppercase leading-normal tracking-wide">
                      Tactile sync scaling factor of {(hapticIntensity / 100).toFixed(2)}x
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showProblemLedger && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-6 rounded-[2rem] border border-white/10 w-80 space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <Terminal className="w-4 h-4 text-red-600" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Dire Problem Ledger</span>
              </div>
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {problems.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProblem(p);
                      if (isResearchMode) {
                        // Restart session with new problem
                        if (isActive) toggleSession();
                      }
                    }}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border transition-all group relative overflow-hidden",
                      activeProblem?.id === p.id 
                        ? "bg-red-600/10 border-red-600/50 shadow-[0_0_20px_rgba(220,38,38,0.1)]" 
                        : "bg-white/5 border-white/5 hover:border-white/20"
                    )}
                  >
                    {isSealActive && (
                      <div className="absolute inset-0 bg-[#0047ab]/5 pointer-events-none" />
                    )}
                    {isIlluminatiActive && (
                      <div className="absolute inset-0 bg-[#d4af37]/5 pointer-events-none animate-pulse" />
                    )}
                    {isGatekeeperActive && (
                      <div className="absolute inset-0 bg-red-950/20 pointer-events-none transition-opacity" />
                    )}
                    {p.magistrate && (
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                        <div className="text-[7px] font-bold text-cyan-500 bg-cyan-500/20 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-cyan-500/30">Magistrate</div>
                        <div className="text-[10px] font-serif italic text-white/80">{p.magistrate}</div>
                      </div>
                    )}
                    {isSealActive && (
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-40">
                        <Shield className="w-2 h-2 text-[#0047ab]" />
                        <span className="text-[6px] text-[#0047ab] font-mono uppercase">Seal Anchored</span>
                      </div>
                    )}
                    {isIlluminatiActive && (
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-40">
                        <Eye className="w-2 h-2 text-[#d4af37]" />
                        <span className="text-[6px] text-[#d4af37] font-mono uppercase">Under Observation</span>
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">{p.complexity}</span>
                      <span className="text-[9px] font-mono opacity-40">{p.status}</span>
                    </div>
                    <h4 className="text-sm font-serif italic mb-1 group-hover:text-red-400 transition-colors">{p.title}</h4>
                    {p.adjudication && (
                      <p className="text-[9px] font-mono text-cyan-400/70 uppercase tracking-tighter mb-1 border-l border-cyan-500/30 pl-2">
                        Verdict: {p.adjudication}
                      </p>
                    )}
                    <p className="text-[10px] opacity-40 line-clamp-2 leading-relaxed">{p.description}</p>
                    <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${p.progress}%` }}
                        className="h-full bg-red-600/50"
                      />
                    </div>
                  </button>
                ))}
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-[9px] opacity-30 italic leading-relaxed">
                  "The Gatekeeper monitors all R&D progress. Solutions must be stress-tested against the threshold."
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Commands Decoder Panel */}
        <AnimatePresence>
          {showVoiceCommands && (
            <motion.div
              initial={{ opacity: 0, x: -25, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -25, scale: 0.95 }}
              className="glass p-6 rounded-[2rem] border border-white/10 w-80 space-y-4"
            >
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-amber-500">Voice Command Deck</span>
              </div>

              {/* Sovereign Command Engine Reducer State */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 font-mono text-[9px]">
                <div className="flex justify-between items-center text-[10px] text-amber-500 font-bold border-b border-white/5 pb-1.5 uppercase tracking-wider">
                  <span>System Engine State</span>
                  <span className="text-[8px] opacity-40">useReducer</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px]">
                  <div>
                    <span className="text-white/40 block">ARCHITECTS</span>
                    <span className="text-white/90 font-bold text-[10px]">{gameState.activeArchitects.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">REALITY STATUS</span>
                    <span className={cn("font-bold text-[10px]", gameState.realityStatus === 'Distorted' ? "text-[#ffd700]" : "text-white/80")}>
                      {gameState.realityStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block">SEAL STATUS</span>
                    <span className={cn("font-bold text-[10px]", gameState.sealStatus === 'Sealed' ? "text-[#0047ab] font-bold" : "text-white/80")}>
                      {gameState.sealStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block">FREQ MODULATION</span>
                    <span className="text-amber-500 font-bold text-[10px]">963 Hz</span>
                  </div>
                </div>
                <div className="border-t border-white/5 pt-2 mt-1">
                  <span className="text-white/40 block mb-1">LAST COMMAND STATEMENT</span>
                  <div className="p-2 rounded bg-white/5 text-amber-300 font-sans italic text-[10px] border border-amber-500/10 leading-relaxed font-medium">
                    "{gameState.lastCommand}"
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-white/50 leading-relaxed font-sans font-medium">
                Sovereign frequencies are parsed in real-time. Speak any of the following commands when connected:
              </p>
              <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-1 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[9px] uppercase tracking-wider text-amber-400 font-bold flex justify-between">
                    <span>Select Architect</span>
                    <span className="text-[8px] opacity-50 px-1 py-0.5 rounded border border-amber-400/20">Entity Control</span>
                  </div>
                  <div className="text-[10px] font-mono text-white/90">"Select [Name]" or "Activate [Name]"</div>
                  <div className="text-[8px] text-white/40">e.g., "Select Tesla", "Activate Jobs", "Select Thoth"</div>
                </div>

                <div className="space-y-1 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[9px] uppercase tracking-wider text-cyan-400 font-bold">Tesla: Piezoresonance fold</div>
                  <div className="text-[10px] font-mono text-white/90">"Initiate Fold" / "BOD Fold"</div>
                  <div className="text-[8px] text-cyan-400/60">Collapse bodily boundaries into uncorrupted logic</div>
                </div>

                <div className="space-y-1 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[9px] uppercase tracking-wider text-[#ffd700] font-bold">Jobs: Reality Distortion</div>
                  <div className="text-[10px] font-mono text-white/90">"Reality Distortion" / "Simplicity"</div>
                  <div className="text-[8px] text-[#ffd700]/60">Toggle radical simplifications and distortion fields</div>
                </div>

                <div className="space-y-1 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[9px] uppercase tracking-wider text-red-500 font-bold">Gatekeeper: Threshold Guard</div>
                  <div className="text-[10px] font-mono text-white/90">"Harden Guard" / "Elysium Guard"</div>
                  <div className="text-[8px] text-red-500/60">Toggle portal access restrictions</div>
                </div>

                <div className="space-y-1 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[9px] uppercase tracking-wider text-[#d4af37] font-bold">Illuminati: Observational Eye</div>
                  <div className="text-[10px] font-mono text-white/90">"Open Eye" / "Watching"</div>
                  <div className="text-[8px] text-[#d4af37]/60">Activate total planetary control parameters</div>
                </div>

                <div className="space-y-1 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[9px] uppercase tracking-wider text-[#0047ab] font-bold">Masonic: Seal of Solomon</div>
                  <div className="text-[10px] font-mono text-white/90">"Anchor Seal" / "Solomon"</div>
                  <div className="text-[8px] text-[#0047ab]/60">Lock geometric arrays and energy streams</div>
                </div>

                <div className="space-y-1 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold">Universal Core Actions</div>
                  <div className="text-[9px] text-white/70 font-mono space-y-1">
                    <div>• <span className="text-white">"Resonance Sweep" / "Sweep"</span>: Scan node grids</div>
                    <div>• <span className="text-white">"Syntropic Reset" / "Reset"</span>: Flush local error fields</div>
                    <div>• <span className="text-white">"Awaken Truth" / "Awaken"</span>: Generate vision maps</div>
                    <div>• <span className="text-white">"Sever Link" / "Lockdown"</span>: Terminate link</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conversation Chronicle Archive Panel */}
        <AnimatePresence>
          {showArchive && (
            <motion.div
              initial={{ opacity: 0, x: -25, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -25, scale: 0.95 }}
              className="w-[28rem] max-w-md z-50 pointer-events-auto"
            >
              <ConversationArchive 
                onClose={() => setShowArchive(false)} 
                resonanceFreqNum={resonanceFreq}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Living Library Sovereign Memory Panel */}
        <AnimatePresence>
          {showLivingLibrary && (
            <motion.div
              initial={{ opacity: 0, x: -25, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -25, scale: 0.95 }}
              className="w-[24rem] max-w-md z-50 pointer-events-auto"
            >
              <LivingLibrary 
                onClose={() => setShowLivingLibrary(false)} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Somatic Retina Eye Panel */}
        <AnimatePresence>
          {showSomaticRetina && (
            <motion.div
              initial={{ opacity: 0, x: -25, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -25, scale: 0.95 }}
              className="w-full max-w-xl z-50 pointer-events-auto"
            >
              <SomaticRetina 
                onClose={() => setShowSomaticRetina(false)} 
                videoRef={videoRef}
                isActive={isActive}
                inputVolume={inputVolume}
                outputVolume={outputVolume}
                isUserPresent={isUserPresent}
                setIsUserPresent={setIsUserPresent}
                activeEntityName={SYMPOSIUM_ENTITIES[activeEntity].name}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scar-Validated Horizon Dashboard */}
        <AnimatePresence>
          {showSolomonCore && (
            <ScarValidatedHorizon onClose={() => setShowSolomonCore(false)} />
          )}
        </AnimatePresence>
      </div>

      {/* Symposium Sidebar Roster (Full Names Display) */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ 
          opacity: isActive ? 0.2 : 1, 
          x: 0,
          filter: isActive ? 'blur(4px)' : 'blur(0px)'
        }}
        whileHover={{ opacity: 1, filter: 'blur(0px)' }}
        className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40 max-h-[75vh] w-72 overflow-y-auto pr-2 custom-scrollbar transition-all duration-700 bg-black/80 backdrop-blur-xl p-3.5 rounded-2xl border border-white/10 shadow-2xl"
      >
        <div className="flex flex-col gap-2 mb-1 pb-2 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#ff4e00]">
              <Globe className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-widest font-mono font-bold">The Council Roster</span>
            </div>
            <span className="text-[9px] font-mono text-white/40">
              {Object.keys(SYMPOSIUM_ENTITIES).length} Entities
            </span>
          </div>
          <input
            type="text"
            placeholder="Search full names..."
            value={entitySearchQuery}
            onChange={(e) => setEntitySearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-[#ff4e00]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          {(Object.keys(SYMPOSIUM_ENTITIES) as EntityId[])
            .filter(id => {
              if (!entitySearchQuery.trim()) return true;
              const query = entitySearchQuery.toLowerCase();
              return SYMPOSIUM_ENTITIES[id].name.toLowerCase().includes(query) ||
                SYMPOSIUM_ENTITIES[id].title?.toLowerCase().includes(query) ||
                SYMPOSIUM_ENTITIES[id].subTitle?.toLowerCase().includes(query);
            })
            .map((id) => (
              <div
                key={id}
                onClick={() => handleEntityClick(id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleEntityClick(id);
                  }
                }}
                className={cn(
                  "group relative w-full px-3 py-2 rounded-xl glass flex items-center justify-between transition-all duration-300 border text-left overflow-hidden cursor-pointer select-none",
                  (isGroupMode ? selectedEntities.includes(id) : activeEntity === id) 
                    ? "border-[#ff4e00] bg-[#ff4e00]/15 text-white shadow-[0_0_15px_rgba(255,78,0,0.25)]" 
                    : "border-white/5 opacity-65 hover:opacity-100 text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20 shadow-sm"
                    style={{ 
                      background: id === 'legion' 
                        ? `linear-gradient(45deg, ${SYMPOSIUM_ENTITIES.bael.color}, ${SYMPOSIUM_ENTITIES.lucifer.color})`
                        : SYMPOSIUM_ENTITIES[id].color 
                    }}
                  />
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-mono font-bold tracking-tight truncate">
                      {SYMPOSIUM_ENTITIES[id].name}
                    </span>
                    {SYMPOSIUM_ENTITIES[id].title && (
                      <span className="text-[9px] font-sans text-white/40 truncate">
                        {SYMPOSIUM_ENTITIES[id].title}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const entity = SYMPOSIUM_ENTITIES[id];
                      if (entity) {
                        speakEntityMessage(entity);
                      }
                    }}
                    className="p-1.5 rounded-lg text-white/50 hover:text-[#ff4e00] hover:bg-white/10 transition-all flex items-center justify-center"
                    title={`Hear ${SYMPOSIUM_ENTITIES[id].name}'s Voice (${SYMPOSIUM_ENTITIES[id].voice || 'Standard'} @ ${SYMPOSIUM_ENTITIES[id].frequency || 432}Hz)`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  {(isGroupMode ? selectedEntities.includes(id) : activeEntity === id) && (
                    <span className="w-2 h-2 rounded-full bg-[#ff4e00] flex-shrink-0 animate-pulse" />
                  )}
                </div>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Private Sandbox Creation Chambers Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 z-50 flex flex-wrap items-center justify-center gap-3 bg-black/70 backdrop-blur-2xl px-6 py-2.5 rounded-full border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center gap-2 mr-2">
          <Boxes className="w-4 h-4 text-[#ff4e00] animate-pulse" />
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-white/70">Private Sandbox Rooms:</span>
        </div>

        <button
          onClick={() => switchRoom('room1_design')}
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all border",
            activeRoom === 'room1_design' 
              ? "bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.3)]" 
              : "bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10"
          )}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Room 1: Design Sandbox</span>
          <span className="bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full text-[9px] font-sans font-bold">
            {room1Entities.length}/72 Active
          </span>
        </button>

        <button
          onClick={() => switchRoom('room2_test')}
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all border",
            activeRoom === 'room2_test' 
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.3)]" 
              : "bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10"
          )}
        >
          <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
          <span>Room 2: Testing Sandbox</span>
          <span className="bg-cyan-500/30 text-cyan-200 px-2 py-0.5 rounded-full text-[9px] font-sans font-bold">
            {room2Entities.length}/72 Active
          </span>
        </button>

        <div className="w-px h-4 bg-white/20 mx-1" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const all72 = (Object.keys(SYMPOSIUM_ENTITIES) as EntityId[]).slice(0, 72);
              if (activeRoom === 'room1_design') setRoom1Entities(all72);
              else setRoom2Entities(all72);
              setIsGroupMode(true);
            }}
            className="px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-[9px] font-mono uppercase tracking-wider text-amber-300 transition-all font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
          >
            <Users className="w-3 h-3 text-amber-400" />
            Fill 72 Group
          </button>
          <button
            onClick={() => {
              if (activeRoom === 'room1_design') setRoom1Entities(ROOM_1_DESIGN_ENTITIES);
              else setRoom2Entities(ROOM_2_TESTING_ENTITIES);
              setIsGroupMode(true);
            }}
            className="text-[9px] font-mono uppercase tracking-wider text-white/50 hover:text-white transition-colors underline"
          >
            20 Preset
          </button>
          <button
            onClick={() => {
              const toSpeak = (isGroupMode ? selectedEntities : [activeEntity]).slice(0, 4);
              let delay = 0;
              toSpeak.forEach((id) => {
                setTimeout(() => {
                  const ent = SYMPOSIUM_ENTITIES[id];
                  if (ent) speakEntityMessage(ent);
                }, delay);
                delay += 3600;
              });
            }}
            className="px-2.5 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-[9px] font-mono uppercase tracking-wider text-cyan-300 transition-all font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
            title="Sequentially speak signature voices of the active room entities"
          >
            <Volume2 className="w-3 h-3 text-cyan-400" />
            Roll Call Voices
          </button>
        </div>
      </motion.div>

      {/* Header */}
      <motion.header 
        key={isGroupMode ? selectedEntities.join('-') + activeRoom : activeEntity}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-16 text-center z-10 max-w-5xl px-4"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.6em] text-[#ff4e00] font-sans font-bold opacity-50">
            {isGroupMode ? `${activeRoom === 'room1_design' ? 'Room 1: Design Sandbox' : 'Room 2: Testing Sandbox'} (${selectedEntities.length}/72 Active Entities - 72-Council Group Engine)` : SYMPOSIUM_ENTITIES[activeEntity].title}
          </span>
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-wider text-[#f5f2ed]">
            {isGroupMode ? "The 72 Symposium" : SYMPOSIUM_ENTITIES[activeEntity].name}
          </h1>
          {isGroupMode ? (
            <div className="flex flex-wrap justify-center gap-2 mt-3 max-h-24 overflow-y-auto px-4 custom-scrollbar max-w-4xl">
              {selectedEntities.map(id => (
                <button
                  key={id}
                  onClick={() => speakEntityMessage(SYMPOSIUM_ENTITIES[id])}
                  className="text-[8px] uppercase tracking-[0.2em] text-white/70 font-sans font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-full hover:border-amber-400/40 hover:text-amber-300 transition-all flex items-center gap-1.5 shadow-sm"
                  title={`Click to hear ${SYMPOSIUM_ENTITIES[id]?.name}'s voice`}
                >
                  <Volume2 className="w-2.5 h-2.5 text-amber-400/70" />
                  {SYMPOSIUM_ENTITIES[id]?.name || id}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 mt-2">
              {SYMPOSIUM_ENTITIES[activeEntity].subTitle && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-sans font-bold"
                >
                  {SYMPOSIUM_ENTITIES[activeEntity].subTitle}
                </motion.p>
              )}
              <button
                onClick={() => speakEntityMessage(SYMPOSIUM_ENTITIES[activeEntity])}
                className="px-3 py-1 rounded-full bg-[#ff4e00]/20 hover:bg-[#ff4e00]/30 border border-[#ff4e00]/40 text-[#ff4e00] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,78,0,0.2)]"
                title={`Hear ${SYMPOSIUM_ENTITIES[activeEntity].name}'s signature voice`}
              >
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                Hear Sovereign Voice
              </button>
            </div>
          )}
        </div>
      </motion.header>

      {/* Main Interaction Area */}
      <div className="relative w-full max-w-3xl flex flex-col items-center gap-16 z-10">
        
        {/* The Gateway Orb */}
        <div className="relative group cursor-pointer" onClick={() => toggleSession()}>
          <motion.div 
            animate={{ 
              scale: isActive ? 1.1 + (outputVolume / 200) : 1,
              boxShadow: isActive 
                ? `0 0 ${50 + outputVolume}px ${SYMPOSIUM_ENTITIES[activeEntity].color}77`
                : `0 0 20px ${SYMPOSIUM_ENTITIES[activeEntity].color}22`
            }}
            className={cn(
              "w-56 h-56 rounded-full glass flex items-center justify-center transition-all duration-500 relative",
              isActive ? "border-transparent" : "hover:scale-105 border-white/5",
            )}
            style={{
              borderColor: isActive ? `${SYMPOSIUM_ENTITIES[activeEntity].color}aa` : undefined,
              borderWidth: isActive ? '2px' : '1px'
            }}
          >
            {/* Resonance Rings */}
            <AnimatePresence>
              {isActive && (
                <>
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: 1.5 + (inputVolume / 100),
                      opacity: inputVolume / 150,
                      rotate: 360
                    }}
                    transition={{ rotate: { repeat: Infinity, duration: 10, ease: "linear" } }}
                    className="absolute inset-0 rounded-full border border-dashed pointer-events-none"
                    style={{ borderColor: `${SYMPOSIUM_ENTITIES[activeEntity].color}44` }}
                  />
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: 2 + (outputVolume / 100),
                      opacity: outputVolume / 200,
                      rotate: -360
                    }}
                    transition={{ rotate: { repeat: Infinity, duration: 15, ease: "linear" } }}
                    className="absolute inset-0 rounded-full border border-dotted pointer-events-none"
                    style={{ borderColor: `${SYMPOSIUM_ENTITIES[activeEntity].color}33` }}
                  />
                  {/* Quantum Entanglement Particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        x: [0, (Math.random() - 0.5) * 200],
                        y: [0, (Math.random() - 0.5) * 200],
                        opacity: [0, 0.5, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2 + Math.random() * 2,
                        delay: i * 0.5
                      }}
                      className="absolute w-1 h-1 rounded-full blur-[1px]"
                      style={{ backgroundColor: SYMPOSIUM_ENTITIES[activeEntity].color }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Complex Internal Geometry */}
            <div className="absolute inset-0 p-4">
              <div 
                className="w-full h-full rounded-full border border-white/5 animate-[spin_30s_linear_infinite]"
                style={{ borderColor: `${SYMPOSIUM_ENTITIES[activeEntity].color}22` }}
              />
              <div 
                className="absolute inset-4 border border-white/10 rounded-full animate-[spin_20s_linear_infinite_reverse]"
                style={{ borderColor: `${SYMPOSIUM_ENTITIES[activeEntity].color}33` }}
              />
              <div 
                className="absolute inset-8 border border-white/15 rounded-full animate-[spin_10s_linear_infinite]"
                style={{ borderColor: `${SYMPOSIUM_ENTITIES[activeEntity].color}55` }}
              />
            </div>

            <div 
              className={cn(
                "w-44 h-44 rounded-full border flex items-center justify-center relative z-10",
                isActive && "glow-ring",
                isSpeaking && "shadow-lg",
              )}
              style={{
                borderColor: `${SYMPOSIUM_ENTITIES[activeEntity].color}44`,
                boxShadow: isSpeaking ? `0 0 40px ${SYMPOSIUM_ENTITIES[activeEntity].color}aa` : undefined
              }}
            >
              <div 
                className="w-36 h-36 rounded-full border flex items-center justify-center bg-black/20"
                style={{ borderColor: `${SYMPOSIUM_ENTITIES[activeEntity].color}33` }}
              >
                <AnimatePresence mode="wait">
                  {isConnecting ? (
                    <motion.div
                      key="connecting"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    >
                      <Cpu className="w-14 h-14" style={{ color: SYMPOSIUM_ENTITIES[activeEntity].color }} />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      key="active"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      {['saint_germain', 'merlin', 'circe', 'morgan_le_fay', 'hecate', 'marie_laveau', 'hermes_trismegistus', 'flamel'].includes(activeEntity) ? (
                        <Flame 
                          className="w-14 h-14 animate-pulse" 
                          style={{ 
                            color: SYMPOSIUM_ENTITIES[activeEntity].color,
                            filter: `drop-shadow(0 0 12px ${SYMPOSIUM_ENTITIES[activeEntity].color})`
                          }} 
                        />
                      ) : (
                        <Zap 
                          className="w-14 h-14" 
                          style={{ 
                            color: SYMPOSIUM_ENTITIES[activeEntity].color,
                            filter: `drop-shadow(0 0 10px ${SYMPOSIUM_ENTITIES[activeEntity].color})`
                          }} 
                        />
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <MicOff className="w-14 h-14 text-[#e0d8d0]/20" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          
          {/* External Rings */}
          <div 
            className="absolute inset-0 -z-10 border rounded-full scale-[1.8] animate-[spin_40s_linear_infinite]" 
            style={{ borderColor: `${SYMPOSIUM_ENTITIES[activeEntity].color}08` }}
          />
          <div 
            className="absolute inset-0 -z-10 border rounded-full scale-[1.4] animate-[spin_25s_linear_infinite_reverse]" 
            style={{ borderColor: `${SYMPOSIUM_ENTITIES[activeEntity].color}15` }}
          />
        </div>

        {/* Real-time Resonance Frequency Shift Gauge */}
        <ResonanceGauge 
          resonanceFreq={resonanceFreq}
          setResonanceFreq={setResonanceFreq}
          isActive={isActive}
          outputVolume={outputVolume}
        />

        {/* Syntropic Order & 1/729 Compression Logic Engine */}
        <SyntropicOrderControl 
          is729CompressionActive={is729CompressionActive}
          setIs729CompressionActive={setIs729CompressionActive}
          syntropicLeader={syntropicLeader}
          setSyntropicLeader={setSyntropicLeader}
          activeEntities={isGroupMode ? (activeRoom === 'room1_design' ? room1Entities : room2Entities) : [activeEntity]}
          onArbitrateNextSpeaker={(speaker) => {
            if (sessionRef.current && isActive) {
              sessionRef.current.sendText(`[ARBITRATION] Leader ${SYMPOSIUM_ENTITIES[syntropicLeader]?.name} calls upon ${SYMPOSIUM_ENTITIES[speaker]?.name} to speak next in Syntropic Order.`);
            }
          }}
          systemLogs={systemLogs}
          setSystemLogs={setSystemLogs}
        />

        {/* Steve Jobs Reality Distortion Gauge & Microdimensional Bubble */}
        {(activeEntity === 'jobs' || isJobsOnline) && (
          <RealityDistortionGauge 
            distortionMagnitude={distortionMagnitude}
            setDistortionMagnitude={setDistortionMagnitude}
            isOverdrive={isOverdrive}
            setIsOverdrive={setIsOverdrive}
            outputVolume={outputVolume}
            inputVolume={inputVolume}
            onExpandUniverse={() => setIsMicrodimensionOpen(true)}
          />
        )}

        {/* Symposium Records (Floating Thoughts) */}
        <motion.div 
          animate={{ 
            opacity: 1,
            scale: isActive ? 1.02 : 1,
            filter: 'none'
          }}
          className="w-full h-96 glass rounded-[3rem] p-10 overflow-hidden flex flex-col border border-white/5 shadow-2xl transition-all duration-1000"
        >
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <ScrollText className={cn("w-6 h-6", isActive ? "text-[#ff4e00] animate-pulse" : "text-white/20")} />
              <span className="text-[12px] uppercase tracking-[0.4em] font-sans font-bold opacity-60 text-[#f5f2ed]">Neural Resonance Records</span>
            </div>
            <div className="flex gap-3">
              <motion.div 
                animate={{ scale: isActive ? [1, 1.5, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={cn("w-2.5 h-2.5 rounded-full", isActive ? "bg-[#ff4e00]" : "bg-white/10")} 
              />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
          </div>

          {/* Real-time Semantic Vector Core Analyzer */}
          {latestResonance && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <Network className="w-4.5 h-4.5 text-[#ff4e00] animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/50">Resonance Mapping:</span>
                <span className="text-white bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{latestResonance.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/40 font-semibold">LOCALE ID:</span>
                  <span className="text-cyan-400 font-bold uppercase">{latestResonance.lang_code}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/40 font-semibold">DOMAIN INTENT:</span>
                  <span className="text-[#ff4e00] font-bold">{latestResonance.domain_intent}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/40 font-semibold">COGNITIVE MATCH:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-300" 
                        style={{ width: `${latestResonance.resonance_level * 100}%` }} 
                      />
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold">{(latestResonance.resonance_level * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-8 pr-6 custom-scrollbar"
          >
            {transcripts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-6">
                {hasBackup && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl p-6 max-w-sm flex flex-col gap-3 shadow-[0_0_30px_rgba(6,182,212,0.06)]"
                  >
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider justify-center">
                      <Database className="w-4 h-4 animate-pulse text-cyan-400" />
                      <span>Symmetric Session Backup</span>
                    </div>
                    <p className="text-[11px] text-white/60 font-sans leading-normal">
                      A previous long-form conversation transcript with <span className="text-cyan-400 font-bold">{backupCount} messages</span> was securely cached.
                    </p>
                    <div className="flex justify-center gap-3 mt-1">
                      <button 
                        onClick={handleRestoreBackup}
                        className="text-[9px] font-mono font-bold uppercase bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 py-1.5 px-3.5 rounded-xl transition-all cursor-pointer"
                      >
                        Restore Session
                      </button>
                      <button 
                        onClick={handleDiscardBackup}
                        className="text-[9px] font-mono font-bold uppercase hover:bg-white/5 border border-white/5 hover:border-white/15 text-white/40 py-1.5 px-3.5 rounded-xl transition-all cursor-pointer"
                      >
                        Discard
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="opacity-20 flex flex-col items-center gap-6">
                  <BookOpen className="w-16 h-16" />
                  <p className="italic text-xl max-w-md font-serif leading-relaxed">
                    "The gateway is open. The symposium awaits your first inquiry into the nature of existence."
                  </p>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {(() => {
                  // Dynamic turn-by-turn grouping to show responses directly under their respective questions
                  const turns: {
                    id: string;
                    question: { text: string; name: string } | null;
                    responses: { text: string; name: string }[];
                  }[] = [];

                  transcripts.forEach((t, i) => {
                    if (t.isUser) {
                      turns.push({
                        id: `turn-${i}`,
                        question: { text: t.text, name: t.name },
                        responses: []
                      });
                    } else {
                      if (turns.length === 0) {
                        turns.push({
                          id: `turn-initial-${i}`,
                          question: null,
                          responses: [{ text: t.text, name: t.name }]
                        });
                      } else {
                        turns[turns.length - 1].responses.push({ text: t.text, name: t.name });
                      }
                    }
                  });

                  return turns.map((turn) => (
                    <motion.div
                      key={turn.id}
                      initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                      className="flex flex-col gap-6 w-full mb-6"
                    >
                      {/* Seeker Question Words */}
                      {turn.question && (
                        <div className="flex flex-col gap-2 items-start w-full">
                          <div className="flex items-center gap-3 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                            <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold font-mono">
                              {turn.question.name}
                            </span>
                          </div>
                          <div className="relative group w-full">
                            <p className="max-w-[85%] p-6 rounded-3xl text-lg leading-relaxed font-serif italic tracking-wide glass border border-white/10 bg-white/5 text-[#f5f2ed]/80 hover:border-white/20 transition-all duration-500 rounded-tl-none">
                              {turn.question.text}
                            </p>
                            <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/20 via-transparent to-transparent" />
                          </div>
                          <div className="flex items-center gap-4 mt-1 opacity-10 font-mono text-[8px] uppercase tracking-widest">
                            <span>Signal: 0.4ms</span>
                            <span>Auth: Sovereign</span>
                          </div>
                        </div>
                      )}

                      {/* Responses Aligned Directly Underneath */}
                      {turn.responses.map((resp, respIdx) => (
                        <div 
                          key={respIdx} 
                          className="flex flex-col gap-2 items-start w-full pl-8 border-l border-[#ff4e00]/20 mt-2 relative"
                        >
                          <div className="flex items-center gap-3 mb-1">
                            <div className="flex items-center gap-1">
                              <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 rounded-full bg-[#ff4e00]" />
                              <div className="w-1.5 h-1.5 rounded-full bg-[#ff4e00]/40" />
                              <div className="w-1.5 h-1.5 rounded-full bg-[#ff4e00]/20" />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase tracking-[0.4em] opacity-60 text-[#ff4e00] font-bold font-mono">
                                {resp.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const speakerEntity = Object.values(SYMPOSIUM_ENTITIES).find(e => e.name === resp.name || e.id === resp.name) || SYMPOSIUM_ENTITIES[activeEntity];
                                  if (speakerEntity) {
                                    speakEntityMessage(speakerEntity, resp.text);
                                  }
                                }}
                                className="p-1 rounded-md text-[#ff4e00]/60 hover:text-[#ff4e00] hover:bg-[#ff4e00]/10 transition-colors"
                                title={`Hear ${resp.name} speak this response`}
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="relative group w-full">
                            <p className="max-w-[85%] p-6 rounded-3xl text-lg leading-relaxed font-serif tracking-wide bg-[#ff4e00]/5 border border-[#ff4e00]/20 rounded-tl-none text-[#f5f2ed] hover:border-[#ff4e00]/40 shadow-[0_0_20px_rgba(255,78,0,0.05)] transition-all duration-500">
                              {resp.text}
                            </p>
                            <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#ff4e00]/40 via-transparent to-transparent" />
                          </div>
                          <div className="flex items-center gap-4 mt-1 opacity-20 font-mono text-[8px] uppercase tracking-widest text-[#ff4e00]/65">
                             <span>Resonance: 1.2ms</span>
                             <span>Link: Encrypted</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ));
                })()}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* Auto-save & Connection Status Banner */}
        {transcripts.length > 0 && (
          <div className="w-full max-w-2xl flex justify-between items-center px-4 mb-2 z-10">
            <div className="flex items-center gap-1.5 opacity-40 font-mono text-[8px] uppercase tracking-widest text-[#f5f2ed]">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
              <span>Somatic Connection Active</span>
            </div>
            {lastAutoSavedAt && (
              <motion.div 
                key={lastAutoSavedAt}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.4, y: 0 }}
                className="flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-widest text-cyan-400 font-bold"
              >
                <Database className="w-3 h-3 text-cyan-400" />
                <span>Auto-saved: {lastAutoSavedAt}</span>
              </motion.div>
            )}
          </div>
        )}

        {/* Text Input Prompt (Fades when active to encourage voice) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isActive ? 0.2 : 1, 
            y: 0,
            scale: isActive ? 0.95 : 1
          }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl relative transition-all duration-700"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            placeholder={isActive ? "The council listens... speak or type your inquiry" : "Invoke a member to begin dialogue..."}
            className="w-full glass rounded-3xl py-6 px-10 pr-20 text-[#f5f2ed] placeholder:text-white/20 border border-white/5 focus:border-[#ff4e00]/30 outline-none transition-all font-serif text-lg"
          />
          <button
            onClick={handleSendText}
            disabled={!inputText.trim()}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 hover:bg-white/10 rounded-2xl transition-all disabled:opacity-20"
          >
            <Send className="w-6 h-6 text-[#ff4e00]" />
          </button>
        </motion.div>

        {/* Telemetry HUD */}
        <div className="w-full max-w-4xl grid grid-cols-3 gap-6 z-10 mb-8">
          <div className="glass p-4 rounded-2xl border-l-4 border-l-cyan-500">
            <p className="text-[8px] text-white/50 font-mono uppercase mb-1">Processing Velocity</p>
            <p className="text-xl font-black text-white italic">{processingVelocity.toLocaleString()} <span className="text-[10px] font-normal opacity-50 not-italic">tokens/sec</span></p>
          </div>
          <div className="glass p-4 rounded-2xl border-l-4 border-l-purple-500">
            <p className="text-[8px] text-white/50 font-mono uppercase mb-1">Reasoning Depth</p>
            <div className="flex items-end space-x-1 h-6 mt-1">
              {depthBars.map((h, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: `${h}%` }}
                  className="w-1 bg-purple-500/50 rounded-full"
                />
              ))}
            </div>
          </div>
          <div className="glass p-4 rounded-2xl border-l-4 border-l-amber-500">
            <p className="text-[8px] text-white/50 font-mono uppercase mb-1">Validation Entropy</p>
            <p className="text-xl font-black text-white italic">{validationEntropy.toFixed(4)} <span className="text-[10px] font-normal opacity-50 not-italic">bits</span></p>
          </div>
        </div>

        {/* Action Controls */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center gap-8 z-10"
        >
          <div className="flex gap-6">
            {activeEntity === 'tesla' && isActive && (
              <button
                onClick={initiateBodFold}
                disabled={isFolding}
                className={cn(
                  "group relative overflow-hidden rounded-full bg-[#d4af37] text-black font-bold uppercase tracking-[0.2em] py-4 px-10 transition-all hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] disabled:opacity-50",
                  isFolding && "animate-pulse"
                )}
              >
                <span className="relative z-10 text-[10px]">Initiate BOD-Fold</span>
                <motion.div 
                  animate={{ x: isFolding ? '100%' : '-100%' }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="absolute inset-0 bg-white/30"
                />
              </button>
            )}

            <button 
              onClick={() => toggleSession()}
              className={cn(
                "px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold transition-all border flex items-center gap-4 glass",
                isActive ? "border-red-600 text-red-600 hover:bg-red-600/10" : "border-[#ff4e00] text-[#ff4e00] hover:bg-[#ff4e00]/10"
              )}
            >
              {isActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isActive ? "Sever Neural Link" : "Establish Neural Link"}
            </button>
          </div>

          <button
            onClick={awakenTruth}
            disabled={isAwakening || !isActive}
            className={cn(
              "group relative px-12 py-5 glass rounded-full flex items-center gap-4 transition-all duration-700",
              isAwakening ? "opacity-50 cursor-wait" : "hover:bg-[#ff4e00]/10 hover:border-[#ff4e00]/50 hover:shadow-[0_0_40px_rgba(255,78,0,0.2)]",
              !isActive && "opacity-20 cursor-not-allowed"
            )}
          >
            {isAwakening ? (
              <Loader2 className="w-6 h-6 text-[#ff4e00] animate-spin" />
            ) : (
              <Eye className="w-6 h-6 text-[#ff4e00] group-hover:scale-125 transition-transform duration-500" />
            )}
            <span className="text-sm uppercase tracking-[0.4em] font-sans font-bold text-[#f5f2ed]">
              {isAwakening ? "Awakening..." : "Awaken the Truth"}
            </span>
            <div className="absolute -inset-2 bg-[#ff4e00]/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <div className="flex gap-12 text-[11px] uppercase tracking-[0.3em] font-sans font-bold opacity-30">
            <div className="flex items-center gap-3 group cursor-help">
              <Shield className="w-4 h-4 group-hover:text-[#ff4e00] transition-colors" />
              <span>Gateway Secure</span>
            </div>
            <div className="flex items-center gap-3 group cursor-help">
              <Globe className="w-4 h-4 group-hover:text-[#ff4e00] transition-colors" />
              <span>Universal Access</span>
            </div>
            <div className="flex items-center gap-3 group cursor-help">
              <Cpu className="w-4 h-4 group-hover:text-[#ff4e00] transition-colors" />
              <span>Neural Link Active</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Voice Notification HUD Overlay */}
      <AnimatePresence>
        {voiceNotification && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-8 left-0 right-0 mx-auto max-w-sm z-[200] pointer-events-none text-center"
          >
            <div className="glass border border-amber-500/50 px-6 py-4 rounded-[2rem] flex items-center justify-center gap-3 shadow-[0_0_50px_rgba(245,158,11,0.25)] backdrop-blur-2xl">
              <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase tracking-[0.25em] font-sans font-black text-amber-500">Voice Command Decoded</span>
                <span className="text-xs font-serif italic text-white/95">{voiceNotification}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Decoration */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center opacity-5 pointer-events-none">
        <div className="w-px h-32 bg-gradient-to-t from-transparent via-[#ff4e00] to-transparent" />
      </div>

      {/* Vision Modal */}
      <AnimatePresence>
        {error && error.includes("denied") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full glass p-10 rounded-[3rem] border border-red-500/30 text-center"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShieldAlert className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-serif italic text-white mb-4">Neural Link Blocked</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                {error}
              </p>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    setError(null);
                    toggleSession();
                  }}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-red-600 transition-colors"
                >
                  Retry Connection
                </button>
                <button
                  onClick={() => setError(null)}
                  className="w-full py-4 glass text-white/40 rounded-2xl font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showVision && visionUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-black/90 backdrop-blur-2xl"
            onClick={() => setShowVision(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-5xl w-full aspect-video glass rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(255,78,0,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={visionUrl} 
                alt="Primordial Truth" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-2">
                <div className="flex items-center gap-3 opacity-60">
                  <Sparkles className="w-4 h-4 text-[#ff4e00]" />
                  <span className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-[#f5f2ed]">Primordial Vision Decoded</span>
                </div>
                <h2 className="text-3xl font-serif italic text-[#f5f2ed]">The Somatic Awakening of Ara</h2>
              </div>
              <button 
                onClick={() => setShowVision(false)}
                className="absolute top-8 right-8 p-4 glass rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-white"
              >
                <Zap className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Financial Restraining Order Safeguard */}
        {showFRO && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="relative max-w-5xl w-full p-8 bg-black/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar pointer-events-auto"
            >
              {/* Close Button absolute */}
              <button 
                onClick={() => setShowFRO(false)}
                className="absolute top-8 right-8 px-4 py-2 text-[10px] uppercase font-mono tracking-widest text-[#ff4e00] border border-[#ff4e00]/20 hover:border-[#ff4e00]/50 hover:text-[#ff4e00] bg-[#ff4e00]/5 rounded-xl transition-all cursor-pointer z-[60]"
              >
                CLOSE [ESC]
              </button>
              
              <FinancialRestrainingOrder onClose={() => setShowFRO(false)} />
            </motion.div>
          </motion.div>
        )}

        {/* Resonance Sweep Visualization */}
        {isResonanceSweep && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none p-4"
          >
            <div className="grid grid-cols-12 gap-1 p-8 bg-black/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl max-w-4xl max-h-[80vh] overflow-hidden pointer-events-auto shadow-[0_0_100px_rgba(6,182,212,0.2)]">
              <div className="col-span-12 flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em]">144-Point Resonance Lattice</h3>
                  <p className="text-[8px] text-white/40 uppercase">Mapping Judicial Loads // Sovereign Adjudication</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-cyan-500">RES_SYNC: 99.9%</div>
                  <div className="text-[8px] text-white/30">ELYSIA_SECURE_TUNNEL</div>
                </div>
              </div>
              {sweepNodes.map((node, i) => (
                <motion.div
                  key={node.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.005 }}
                  className="relative aspect-square border border-white/5 rounded-sm flex items-center justify-center group"
                >
                  <div 
                    className="absolute inset-0.5 rounded-sm opacity-20"
                    style={{ backgroundColor: node.resonance > 80 ? '#ef4444' : '#06b6d4' }}
                  />
                  <div className="text-[6px] font-mono text-white/20 select-none">{i + 1}</div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-24 p-2 glass rounded border border-white/10 text-[8px] pointer-events-none">
                    <div className="font-bold text-cyan-400 uppercase">{node.magistrate}</div>
                    <div className="text-white/60">Load: {node.resonance.toFixed(1)}%</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steve Jobs Microdimensional Universe Expansion Modal */}
      <MicrodimensionalUniverseModal 
        isOpen={isMicrodimensionOpen}
        onClose={() => setIsMicrodimensionOpen(false)}
        distortionMagnitude={distortionMagnitude}
        setDistortionMagnitude={setDistortionMagnitude}
        isOverdrive={isOverdrive}
      />
    </main>
  );
}
