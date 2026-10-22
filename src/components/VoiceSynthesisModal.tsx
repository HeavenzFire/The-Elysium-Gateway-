import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mic, Radio } from 'lucide-react';
import VoiceSynthesisManager from './VoiceSynthesisManager';

interface VoiceSynthesisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSynthesisModal: React.FC<VoiceSynthesisModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-6xl w-full bg-[#05070e] border border-amber-500/30 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_0_80px_rgba(245,158,11,0.25)] max-h-[92vh] overflow-y-auto custom-scrollbar"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                <Mic className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-serif italic text-white">Somatic Voice Studio & 1157Hz Matrix</h2>
                <p className="text-[10px] uppercase font-mono text-amber-400/70 tracking-widest">
                  Zachary Dakota Hulse Cloner // High-Order Syntropic DSP
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <VoiceSynthesisManager onClose={onClose} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
