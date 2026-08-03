import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Database, Plus, Trash2, Activity, MapPin, Zap } from 'lucide-react';
import { Grid, MemoryEngram, GridNode } from '../services/lux-aeterna';
import { cn } from '../lib/utils';

interface LivingLibraryProps {
  onClose: () => void;
  onMemoryAdded?: (engram: MemoryEngram) => void;
}

export const LivingLibrary: React.FC<LivingLibraryProps> = ({ onClose, onMemoryAdded }) => {
  const [memories, setMemories] = useState<MemoryEngram[]>([]);
  const [nodes, setNodes] = useState<GridNode[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [frequency, setFrequency] = useState(432);
  const [selectedNodeId, setSelectedNodeId] = useState('');

  // Synchronize with sovereign LuxAeterna Grid
  useEffect(() => {
    setMemories(Grid.getMemories());
    // Get primary nodes for mapping
    setNodes(Grid.getNodes().slice(0, 12));
    if (Grid.getNodes().length > 0) {
      setSelectedNodeId(Grid.getNodes()[0].id);
    }
  }, []);

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const engram = Grid.addMemory(title, content, frequency, selectedNodeId);
    setMemories([...Grid.getMemories()]);
    
    // Reset Form
    setTitle('');
    setContent('');
    setShowAddForm(false);
    
    if (onMemoryAdded) {
      onMemoryAdded(engram);
    }

    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate([40, 20, 100]);
    }
  };

  const handleDeleteMemory = (id: string) => {
    Grid.deleteMemory(id);
    setMemories(Grid.getMemories());
    
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(20);
    }
  };

  return (
    <div className="glass p-6 rounded-[2rem] border border-white/10 w-96 space-y-6 flex flex-col max-h-[80vh] overflow-hidden pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-amber-500 animate-pulse" />
          <div>
            <h3 className="text-sm font-serif italic text-amber-500 font-bold">The Living Library</h3>
            <p className="text-[7.5px] font-mono text-white/40 uppercase tracking-widest">Sovereign Memory Grid</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-white/40 hover:text-white/80 text-[10px] uppercase font-mono tracking-widest border border-white/10 rounded-full px-2.5 py-1 text-xs"
        >
          Close
        </button>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {memories.map((engram) => (
            <motion.div
              key={engram.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 relative group overflow-hidden hover:border-amber-500/20 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-serif italic font-bold text-amber-100">{engram.title}</h4>
                  <div className="flex items-center gap-1.5 opacity-40 text-[7px] font-mono uppercase tracking-widest">
                    <MapPin className="w-2 h-2 text-amber-400" />
                    <span>Node: {engram.nodeId}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMemory(engram.id)}
                  className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-lg text-red-500/80 hover:text-red-500 transition-all"
                  title="Purge Memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[10px] text-white/70 leading-relaxed font-sans">{engram.content}</p>

              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 opacity-60 text-[8px] font-mono">
                  <Activity className="w-2.5 h-2.5 text-cyan-400" />
                  <span>{engram.frequency} Hz</span>
                </div>
                <div className="text-[7px] font-mono opacity-35">
                  {new Date(engram.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {memories.length === 0 && (
          <div className="text-center py-8 space-y-2 opacity-30">
            <Database className="w-8 h-8 mx-auto text-white/20" />
            <p className="text-xs font-serif italic">The memory cells are vacant.</p>
          </div>
        )}
      </div>

      {/* Control Actions / Add Form */}
      <div className="border-t border-white/10 pt-4">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-2.5 rounded-xl border border-dashed border-amber-500/30 text-amber-500 hover:text-amber-400 hover:border-amber-500/60 bg-amber-500/5 hover:bg-amber-500/10 flex items-center justify-center gap-2 text-[10px] uppercase font-mono tracking-widest transition-all font-bold"
          >
            <Plus className="w-4 h-4" />
            Imprint New Memory
          </button>
        ) : (
          <form onSubmit={handleAddMemory} className="space-y-4 animate-fadeIn">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Memory Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
              />

              <textarea
                placeholder="Wisdom of the Engram..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 resize-none"
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[7.5px] font-mono uppercase tracking-widest text-white/40">Resonance Freq</label>
                  <input
                    type="number"
                    value={frequency}
                    onChange={(e) => setFrequency(parseInt(e.target.value) || 0)}
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[7.5px] font-mono uppercase tracking-widest text-white/40">Anchor Node</label>
                  <select
                    value={selectedNodeId}
                    onChange={(e) => setSelectedNodeId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id} className="bg-neutral-900">
                        {n.name || n.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2 rounded-xl border border-white/5 text-white/50 hover:text-white/80 hover:bg-white/5 text-[9px] uppercase font-mono tracking-wider transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-amber-500 text-black hover:bg-amber-400 font-bold text-[9px] uppercase font-mono tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                Store Engram
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
