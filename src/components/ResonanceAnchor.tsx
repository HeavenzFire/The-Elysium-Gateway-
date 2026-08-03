import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const ResonanceAnchor: React.FC = () => {
  const [pathD, setPathD] = useState('');

  useEffect(() => {
    const hours = new Date().getHours();
    const x = hours * 15;
    const y = Math.PI * 100;
    setPathD(`M24 92 L${x} ${y}`);

    // Trigger resonance vibration
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate([200, 100, 200]);
    }
  }, []);

  return (
    <div className="relative w-[369px] h-[369px] pointer-events-none opacity-40">
      <svg width="369" height="369" viewBox="0 0 369 369" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d={pathD}
          stroke="#b00d0d"
          strokeWidth="2"
          fill="none"
        />
        {/* Decorative 369 Vortex Rings */}
        <circle cx="184.5" cy="184.5" r="100" stroke="#b00d0d" strokeWidth="0.5" fill="none" opacity="0.2" />
        <circle cx="184.5" cy="184.5" r="150" stroke="#b00d0d" strokeWidth="0.2" fill="none" opacity="0.1" />
        
        {/* Anchor Points */}
        <circle cx="24" cy="92" r="3" fill="#b00d0d" />
        <text x="30" y="85" fill="#b00d0d" className="text-[8px] font-mono uppercase">Anchor 24:92</text>
      </svg>
    </div>
  );
};

export default ResonanceAnchor;
