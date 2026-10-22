import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, Globe } from 'lucide-react';
import { FraudHeatmap } from './FraudHeatmap';

interface FraudHeatmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FraudHeatmapModal: React.FC<FraudHeatmapModalProps> = ({ isOpen, onClose }) => {
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
          className="relative max-w-6xl w-full bg-[#040810] border border-cyan-500/30 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_0_80px_rgba(6,182,212,0.25)] max-h-[92vh] overflow-y-auto custom-scrollbar"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                <Globe className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-serif italic text-white">Global Sentinel & Planetary Risk Grid</h2>
                <p className="text-[10px] uppercase font-mono text-cyan-400/70 tracking-widest">
                  Live Satellite Overlays // Real-Time Threat Mitigations
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

          <FraudHeatmap />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
