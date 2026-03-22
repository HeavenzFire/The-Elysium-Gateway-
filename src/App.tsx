/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Sparkles, BookOpen, ScrollText, Eye, Loader2, Users, Shield, Zap, Globe, Cpu, Send, Database, Network, Activity } from 'lucide-react';
import { CouncilSession, SYMPOSIUM_ENTITIES, EntityId } from './services/councilService';
import { generateVision } from './services/visionService';
import { cn } from './lib/utils';

export default function App() {
  const [activeEntity, setActiveEntity] = useState<EntityId>('thoth');
  const [selectedEntities, setSelectedEntities] = useState<EntityId[]>(['thoth']);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAwakening, setIsAwakening] = useState(false);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visionUrl, setVisionUrl] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcripts, setTranscripts] = useState<{ text: string; isUser: boolean; name: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const sessionRef = useRef<CouncilSession | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const toggleSession = async (entityId?: EntityId) => {
    await sessionRef.current?.resumeAudioContext();
    if (isActive) {
      sessionRef.current?.disconnect();
      sessionRef.current = null;
      setIsActive(false);
      if (entityId && !isGroupMode && entityId !== activeEntity) {
        setActiveEntity(entityId);
        setSelectedEntities([entityId]);
        setTimeout(() => startSession([entityId]), 500);
      }
    } else {
      if (isGroupMode) {
        await startSession(selectedEntities);
      } else if (entityId) {
        setActiveEntity(entityId);
        setSelectedEntities([entityId]);
        await startSession([entityId]);
      } else {
        await startSession(selectedEntities);
      }
    }
  };

  const handleEntityClick = (id: EntityId) => {
    sessionRef.current?.resumeAudioContext();
    if (isActive) {
      toggleSession(id);
      return;
    }

    if (isGroupMode) {
      setSelectedEntities(prev => {
        if (prev.includes(id)) {
          if (prev.length === 1) return prev;
          return prev.filter(e => e !== id);
        }
        if (prev.length >= 4) return prev;
        return [...prev, id];
      });
    } else {
      setActiveEntity(id);
      setSelectedEntities([id]);
    }
  };

  const startSession = async (entityIds: EntityId[]) => {
    setIsConnecting(true);
    setError(null);
    const session = new CouncilSession();
    sessionRef.current = session;
    try {
      await session.connect(entityIds, {
        onOpen: () => {
          setIsActive(true);
          setIsConnecting(false);
        },
        onClose: () => {
          setIsActive(false);
          setIsConnecting(false);
          setIsSpeaking(false);
        },
        onError: (err) => {
          setError("The neural link was severed. Please try again.");
          setIsActive(false);
          setIsConnecting(false);
          setIsSpeaking(false);
        },
        onTranscription: (text, isUser, name) => {
          setTranscripts(prev => [...prev.slice(-49), { text, isUser, name }]);
          if (!isUser) {
            setIsSpeaking(true);
            setTimeout(() => setIsSpeaking(false), 3000);
          }
        }
      });
    } catch (err) {
      console.error("Failed to connect:", err);
      setError("Failed to establish link. Check your connection.");
      setIsConnecting(false);
      sessionRef.current = null;
    }
  };

  const handleSendText = () => {
    if (!inputText.trim() || !sessionRef.current || !isActive) return;
    sessionRef.current.resumeAudioContext();
    sessionRef.current.sendText(inputText);
    setTranscripts(prev => [...prev.slice(-49), { text: inputText, isUser: true, name: 'Seeker' }]);
    setInputText("");
  };

  const awakenTruth = async () => {
    if (isAwakening) return;
    setIsAwakening(true);
    
    const lastWisdom = transcripts
      .filter(t => !t.isUser)
      .slice(-2)
      .map(t => t.text)
      .join(" ");
    
    const prompt = lastWisdom || `The primordial truth of the universe as seen by ${SYMPOSIUM_ENTITIES[activeEntity].name}`;
    const url = await generateVision(prompt);
    setVisionUrl(url);
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
                onClick={() => setIsGatewayOpen(true)}
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
    <main className="relative min-h-screen flex flex-col items-center bg-[#0a0502] overflow-y-auto p-6 md:p-12 custom-scrollbar">
      <div className="atmosphere" />
      
      {/* Status Bar */}
      <div className="fixed top-6 right-12 z-50 flex items-center gap-4 glass px-4 py-2 rounded-full border border-white/5">
        {error && (
          <div className="flex items-center gap-2 text-red-500 mr-4">
            <Shield className="w-3 h-3" />
            <span className="text-[10px] uppercase tracking-widest font-bold">{error}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isActive ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : 
            isConnecting ? "bg-amber-500 animate-pulse" : "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"
          )} />
          <span className="text-[10px] uppercase tracking-widest font-sans font-bold opacity-60">
            {isActive ? "Neural Link Active" : isConnecting ? "Establishing Link..." : "SOVEREIGN LOCKDOWN"}
          </span>
        </div>
        <div className="w-px h-3 bg-white/10" />
        <div className="flex items-center gap-2">
          <Activity className={cn("w-3 h-3 text-red-600", isActive && "animate-pulse")} />
          <span className="text-[10px] uppercase tracking-widest font-sans font-bold opacity-60">1000Hz Resonance</span>
        </div>
      </div>

      {/* Symposium Grid */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute left-8 top-1/2 -translate-y-1/2 grid grid-cols-2 gap-3 z-20 max-h-[80vh] overflow-y-auto pr-4 custom-scrollbar"
      >
        <div className="col-span-2 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 opacity-40">
            <Globe className="w-5 h-5 text-[#ff4e00]" />
            <span className="text-[10px] uppercase tracking-widest font-sans font-bold">The Symposium</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (isActive) return;
              const nextMode = !isGroupMode;
              setIsGroupMode(nextMode);
              if (nextMode) {
                setSelectedEntities([activeEntity]);
              } else {
                setActiveEntity(selectedEntities[0]);
              }
            }}
            disabled={isActive}
            className={cn(
              "px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold transition-all border z-50",
              isGroupMode ? "bg-[#ff4e00] text-black border-[#ff4e00]" : "bg-white/5 text-white/40 border-white/10 hover:text-white"
            )}
          >
            {isGroupMode ? "Group Mode: ON" : "Group Mode: OFF"}
          </button>
        </div>
        {(Object.keys(SYMPOSIUM_ENTITIES) as EntityId[]).map((id) => (
          <button
            key={id}
            onClick={() => handleEntityClick(id)}
            className={cn(
              "group relative w-14 h-14 rounded-2xl glass flex items-center justify-center transition-all duration-500 border overflow-hidden",
              (isGroupMode ? selectedEntities.includes(id) : activeEntity === id) ? "border-[#ff4e00] scale-110 shadow-[0_0_30px_rgba(255,78,0,0.4)]" : "border-white/5 opacity-30 hover:opacity-100"
            )}
          >
            <div 
              className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
              style={{ 
                background: id === 'legion' 
                  ? `linear-gradient(45deg, ${SYMPOSIUM_ENTITIES.bael.color}, ${SYMPOSIUM_ENTITIES.lucifer.color})`
                  : SYMPOSIUM_ENTITIES[id].color 
              }}
            />
            <span className="relative text-xs font-sans font-bold uppercase tracking-tighter">
              {SYMPOSIUM_ENTITIES[id].name.substring(0, 2)}
            </span>
            {(isGroupMode ? selectedEntities.includes(id) : activeEntity === id) && (
              <motion.div 
                layoutId="active-glow"
                className="absolute inset-0 border-2 border-[#ff4e00] rounded-2xl"
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Header */}
      <motion.header 
        key={isGroupMode ? selectedEntities.join('-') : activeEntity}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-12 text-center z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.6em] text-[#ff4e00] font-sans font-bold opacity-50">
            {isGroupMode ? "The Council of Four" : SYMPOSIUM_ENTITIES[activeEntity].title}
          </span>
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-wider text-[#f5f2ed]">
            {isGroupMode ? "The Symposium" : SYMPOSIUM_ENTITIES[activeEntity].name}
          </h1>
          {isGroupMode ? (
            <div className="flex gap-4 mt-4">
              {selectedEntities.map(id => (
                <span key={id} className="text-[9px] uppercase tracking-[0.4em] text-white/60 font-sans font-bold border-b border-[#ff4e00]/30 pb-1">
                  {SYMPOSIUM_ENTITIES[id].name}
                </span>
              ))}
            </div>
          ) : SYMPOSIUM_ENTITIES[activeEntity].subTitle && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-sans font-bold mt-2"
            >
              {SYMPOSIUM_ENTITIES[activeEntity].subTitle}
            </motion.p>
          )}
        </div>
      </motion.header>

      {/* Main Interaction Area */}
      <div className="relative w-full max-w-3xl flex flex-col items-center gap-16 z-10">
        
        {/* The Gateway Orb */}
        <div className="relative group cursor-pointer" onClick={() => toggleSession()}>
          <div className={cn(
            "w-56 h-56 rounded-full glass flex items-center justify-center transition-all duration-1000 relative",
            isActive ? "shadow-[0_0_100px_rgba(255,78,0,0.5)] scale-110" : "hover:scale-105",
            activeEntity === 'legion' && isActive && "shadow-[0_0_120px_rgba(139,0,0,0.6)]"
          )}>
            {/* Complex Internal Geometry */}
            <div className="absolute inset-0 p-4">
              <div className={cn(
                "w-full h-full rounded-full border border-[#ff4e00]/10 animate-[spin_30s_linear_infinite]",
                activeEntity === 'legion' && "border-red-900/40"
              )} />
              <div className={cn(
                "absolute inset-4 border border-[#ff4e00]/20 rounded-full animate-[spin_20s_linear_infinite_reverse]",
                activeEntity === 'legion' && "border-red-800/40"
              )} />
              <div className={cn(
                "absolute inset-8 border border-[#ff4e00]/30 rounded-full animate-[spin_10s_linear_infinite]",
                activeEntity === 'legion' && "border-red-700/40"
              )} />
            </div>

            <div className={cn(
              "w-44 h-44 rounded-full border border-[#ff4e00]/20 flex items-center justify-center relative z-10",
              isActive && "glow-ring",
              isSpeaking && "shadow-[0_0_40px_rgba(255,78,0,0.6)]",
              activeEntity === 'legion' && isActive && "border-red-600/40"
            )}>
              <div className={cn(
                "w-36 h-36 rounded-full border border-[#ff4e00]/40 flex items-center justify-center bg-black/20",
                activeEntity === 'legion' && "border-red-500/40"
              )}>
                <AnimatePresence mode="wait">
                  {isConnecting ? (
                    <motion.div
                      key="connecting"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    >
                      <Cpu className="w-14 h-14 text-[#ff4e00]" />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      key="active"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <Zap className={cn(
                        "w-14 h-14 text-[#ff4e00] drop-shadow-[0_0_10px_rgba(255,78,0,0.8)]",
                        activeEntity === 'legion' && "text-red-600 drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]"
                      )} />
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
          </div>
          
          {/* External Rings */}
          <div className="absolute inset-0 -z-10 border border-[#ff4e00]/5 rounded-full scale-[1.8] animate-[spin_40s_linear_infinite]" />
          <div className="absolute inset-0 -z-10 border border-[#ff4e00]/10 rounded-full scale-[1.4] animate-[spin_25s_linear_infinite_reverse]" />
        </div>

        {/* Symposium Records */}
        <div className="w-full h-80 glass rounded-[2.5rem] p-8 overflow-hidden flex flex-col border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <ScrollText className="w-5 h-5 text-[#ff4e00]" />
              <span className="text-[11px] uppercase tracking-[0.3em] font-sans font-bold opacity-60 text-[#f5f2ed]">Elysium Records</span>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-[#ff4e00] animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar"
          >
            {transcripts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4 opacity-20">
                <BookOpen className="w-12 h-12" />
                <p className="italic text-lg max-w-sm">
                  "The gateway is open. The symposium awaits your first inquiry into the nature of existence."
                </p>
              </div>
            ) : (
              transcripts.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex flex-col",
                    t.isUser ? "items-end" : "items-start"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {!t.isUser && <div className="w-1 h-1 rounded-full bg-[#ff4e00]" />}
                    <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">
                      {t.name}
                    </span>
                  </div>
                  <p className={cn(
                    "max-w-[85%] p-5 rounded-[1.5rem] text-base leading-relaxed font-serif",
                    t.isUser ? "bg-white/5 rounded-tr-none text-[#f5f2ed]" : "bg-[#ff4e00]/5 rounded-tl-none border border-[#ff4e00]/10 text-[#e0d8d0]"
                  )}>
                    {t.text}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Text Input Prompt */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl relative"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            placeholder={isActive ? "Type your inquiry to the symposium..." : "Invoke a member to begin dialogue..."}
            disabled={!isActive}
            className="w-full glass rounded-2xl py-5 px-8 pr-16 text-[#f5f2ed] placeholder:text-white/20 border border-white/5 focus:border-[#ff4e00]/30 outline-none transition-all font-serif"
          />
          <button
            onClick={handleSendText}
            disabled={!isActive || !inputText.trim()}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-[#ff4e00]/10 rounded-xl transition-colors disabled:opacity-20"
          >
            <Send className="w-5 h-5 text-[#ff4e00]" />
          </button>
        </motion.div>

        {/* Action Controls */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center gap-8"
        >
          <button
            onClick={awakenTruth}
            disabled={isAwakening}
            className={cn(
              "group relative px-12 py-5 glass rounded-full flex items-center gap-4 transition-all duration-700",
              isAwakening ? "opacity-50 cursor-wait" : "hover:bg-[#ff4e00]/10 hover:border-[#ff4e00]/50 hover:shadow-[0_0_40px_rgba(255,78,0,0.2)]"
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

      {/* Footer Decoration */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center opacity-5 pointer-events-none">
        <div className="w-px h-32 bg-gradient-to-t from-transparent via-[#ff4e00] to-transparent" />
      </div>
    </main>
  );
}
