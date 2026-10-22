import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame } from 'lucide-react';
import { AlchemicalCircle } from './AlchemicalCircle';

interface AlchemicalCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlchemicalCircleModal: React.FC<AlchemicalCircleModalProps> = ({ isOpen, onClose }) => {
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
          className="relative max-w-6xl w-full bg-[#050508] border border-purple-500/30 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_0_80px_rgba(147,51,234,0.25)] max-h-[92vh] overflow-y-auto custom-scrollbar"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center">
                <Flame className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-serif italic text-white">The Alchemical Circle of Transmutation</h2>
                <p className="text-[10px] uppercase font-mono text-purple-400/70 tracking-widest">
                  Violet Flame Matrix & Seven Chemical Stages
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

          <AlchemicalCircle />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
