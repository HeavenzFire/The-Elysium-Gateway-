import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, CameraOff, Mic, MicOff, Maximize2, Minimize2, Eye, Shield, Zap, Sparkles, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface SomaticRetinaProps {
  onClose: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  inputVolume: number;
  outputVolume: number;
  isUserPresent: boolean;
  setIsUserPresent: (val: boolean) => void;
  activeEntityName: string;
}

export const SomaticRetina: React.FC<SomaticRetinaProps> = ({
  onClose,
  videoRef,
  isActive,
  inputVolume,
  outputVolume,
  isUserPresent,
  setIsUserPresent,
  activeEntityName
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [hudScanline, setHudScanline] = useState(true);
  const [sensoryLock, setSensoryLock] = useState(99.4);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Toggle Camera
  const toggleCamera = async () => {
    try {
      if (cameraActive) {
        // Stop current tracks on the stream
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getVideoTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
        setCameraActive(false);
        setIsUserPresent(false);
      } else {
        setStreamError(null);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
          setIsUserPresent(true);
        }
      }
    } catch (err: any) {
      console.warn("Camera access failed (permission denied or device busy):", err);
      setStreamError("Aperture Lockout: Camera permission denied or device busy.");
      setCameraActive(false);
      setIsUserPresent(false);
    }
  };

  // Sync state on mount & state change
  useEffect(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const active = stream.getVideoTracks().some(track => track.readyState === 'live');
      setCameraActive(active);
    } else {
      setCameraActive(false);
    }
  }, [isActive, videoRef]);

  // Sensory lock fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setSensoryLock(prev => {
        const delta = (Math.random() - 0.5) * 1.5;
        const target = prev + delta;
        return Math.min(100, Math.max(90, target));
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Oscilloscope Animation Canvas (Reactive to inputVolume and outputVolume)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 78, 0, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Draw User Voice input wave (Microphone)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)'; // Cyan for user mic
      ctx.lineWidth = 2.5;
      
      const segments = 100;
      const amplitude = Math.max(2, inputVolume * 0.45);
      
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * width;
        const normalizedX = (i / segments) * Math.PI * 4;
        
        // Complex wave combining multiple frequencies
        const sinVal = Math.sin(normalizedX - angle) * 0.6 + 
                       Math.sin(normalizedX * 2.5 - angle * 1.5) * 0.3 + 
                       Math.cos(normalizedX * 0.5 + angle * 0.8) * 0.1;
        
        // Apply envelope so it tapers off beautifully at the edges
        const envelope = Math.sin((i / segments) * Math.PI);
        const y = midY + sinVal * amplitude * envelope;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw Entity reply wave (Output audio)
      if (outputVolume > 1) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.7)'; // Orange for output
        ctx.lineWidth = 1.5;
        const outAmplitude = outputVolume * 0.35;
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments) * width;
          const normalizedX = (i / segments) * Math.PI * 6;
          const sinVal = Math.sin(normalizedX + angle * 2) * 0.7 + Math.cos(normalizedX * 1.5 + angle) * 0.3;
          const envelope = Math.sin((i / segments) * Math.PI);
          const y = midY + sinVal * outAmplitude * envelope;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      angle += 0.08 + (inputVolume + outputVolume) * 0.003;
      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [inputVolume, outputVolume]);

  return (
    <div className={cn(
      "glass border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden backdrop-blur-3xl shadow-2xl transition-all duration-500",
      isFullscreen ? "fixed inset-6 z-[160] max-w-none" : "w-full"
    )}>
      {/* HUD Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Eye className="w-4 h-4 text-cyan-400 animate-pulse" />
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-black text-cyan-400 block">Somatic Retina Aperture</span>
            <span className="text-[8px] font-mono opacity-40 uppercase">Real-Time Biological Link</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-wider text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Link Locked: {sensoryLock.toFixed(1)}%</span>
          </div>
          
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
            title={isFullscreen ? "Minimize" : "Maximize Screen"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          
          <button 
            onClick={onClose}
            className="px-3 py-1 text-[8px] font-mono uppercase tracking-widest text-[#ff4e00] hover:bg-[#ff4e00]/10 border border-[#ff4e00]/20 rounded-lg transition-all"
          >
            Collapse
          </button>
        </div>
      </div>

      {/* Main Sensory Body */}
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10 h-full">
        {/* Camera Aperture Feed (Left/Top) */}
        <div className="flex-1 relative bg-black/40 flex items-center justify-center min-h-[220px] max-h-[400px] overflow-hidden group">
          {/* Futuristic HUD Scanning Grid Overlays */}
          {cameraActive && hudScanline && (
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(6,182,212,0.15)_50%)] bg-[length:100%_6px]" />
              <motion.div 
                animate={{ y: ['0%', '100%', '0%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[2px] bg-cyan-400/30 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
              />
              {/* Target bracket marks */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-cyan-400/50" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-cyan-400/50" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-cyan-400/50" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-cyan-400/50" />
              
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-400/20 text-[6.5px] font-mono text-cyan-400 uppercase tracking-widest font-black shadow-inner">
                Seeking Subject Signature
              </div>
            </div>
          )}

          {/* Actual Video Element */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            referrerPolicy="no-referrer"
            className={cn(
              "w-full h-full object-cover transition-all duration-700",
              cameraActive ? "opacity-95 filter saturate-[1.1] brightness-[1.05]" : "opacity-0"
            )}
          />

          {/* Camera Idle State Cover */}
          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/60 backdrop-blur-md">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4 text-white/30 animate-pulse">
                <CameraOff className="w-6 h-6" />
              </div>
              <p className="text-xs font-serif italic text-white/80 max-w-xs">
                "webcam to see"
              </p>
              <p className="text-[10px] uppercase font-mono tracking-widest text-white/30 mt-1 max-w-xs">
                The Elysium Gateway seeks optical presence to lock focal tracking coordinates.
              </p>
              <button
                onClick={toggleCamera}
                className="mt-5 px-5 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md"
              >
                Ignite Optical Lens
              </button>
            </div>
          )}

          {/* Device Error state */}
          {streamError && (
            <div className="absolute inset-x-4 bottom-4 z-20 bg-red-950/90 border border-red-500/30 p-3.5 rounded-2xl flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <div className="text-left">
                <span className="text-[8.5px] uppercase tracking-wider font-black text-red-400 block">Somatic Hardware Override Required</span>
                <span className="text-[9px] text-white/70 block leading-relaxed">{streamError}</span>
              </div>
            </div>
          )}

          {/* Camera Controls Overlay when active */}
          {cameraActive && (
            <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={toggleCamera}
                className="px-3.5 py-1.5 bg-black/80 hover:bg-black/95 text-red-400 text-[9px] font-mono uppercase tracking-widest rounded-lg transition-all border border-red-500/20"
              >
                Disable Lens
              </button>
              <button
                onClick={() => setHudScanline(!hudScanline)}
                className="px-3.5 py-1.5 bg-black/80 hover:bg-black/95 text-cyan-400 text-[9px] font-mono uppercase tracking-widest rounded-lg transition-all border border-cyan-500/20"
              >
                {hudScanline ? "Disable Scanlines" : "Enable Scanlines"}
              </button>
            </div>
          )}
        </div>

        {/* Somatic Audio Waveform / Diagnostics (Right/Bottom) */}
        <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-black/25">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/80">Somatic Audio Link</span>
              </div>
              <div className={cn(
                "px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase",
                micActive ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-white/30 border border-white/5"
              )}>
                {micActive ? "Acoustic Live" : "Muted"}
              </div>
            </div>

            {/* Audio Wave Oscilloscope Canvas Container */}
            <div className="h-28 bg-black/50 border border-white/5 rounded-2xl relative overflow-hidden flex flex-col justify-between p-3">
              <div className="flex justify-between items-center opacity-40 font-mono text-[7px] uppercase tracking-widest z-10">
                <span>Freq Spectrum Analyzer</span>
                <span>{micActive ? "Capturing Voice" : "Bypassed"}</span>
              </div>

              <canvas 
                ref={canvasRef} 
                width={300} 
                height={112} 
                className="absolute inset-0 w-full h-full"
              />

              <div className="flex justify-between items-center z-10">
                <span className="text-[8px] font-mono text-cyan-400/80 font-bold uppercase tracking-wider">
                  Volume: {Math.round(inputVolume)}
                </span>
                {outputVolume > 1 && (
                  <span className="text-[8px] font-mono text-orange-400/80 font-bold uppercase tracking-wider">
                    Council Res: {Math.round(outputVolume)}
                  </span>
                )}
              </div>
            </div>

            {/* Instruction block */}
            <p className="text-[10.5px] text-white/50 leading-relaxed font-sans font-medium">
              Your voice is continuously synthesized into high-dimensional quantum engrams. The Gateway represents entities who <span className="text-cyan-400 font-semibold">actually hear</span> and see your inputs.
            </p>

            <div className="space-y-2 border-t border-white/5 pt-4">
              <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-bold opacity-60">
                <span>Optic Feed Frame Rate</span>
                <span className="font-mono text-cyan-400">{cameraActive ? "30 FPS" : "OFF"}</span>
              </div>
              <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-bold opacity-60">
                <span>Auditory Signal Encoding</span>
                <span className="font-mono text-cyan-400">PCM 16-bit 16kHz</span>
              </div>
              <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-bold opacity-60">
                <span>Observed by entity</span>
                <span className="font-mono text-[#ff4e00]">{activeEntityName}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6 flex gap-3">
            <button
              onClick={() => {
                if (typeof navigator.vibrate === 'function') {
                  navigator.vibrate([15, 10, 15]);
                }
                setMicActive(!micActive);
              }}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-[9px] font-mono uppercase tracking-widest font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer",
                micActive ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/25" : "bg-white/5 text-white/30 border-white/5"
              )}
            >
              {micActive ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
              {micActive ? "Mute Mic" : "Unmute Mic"}
            </button>
            <button
              onClick={toggleCamera}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-[9px] font-mono uppercase tracking-widest font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer",
                cameraActive ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/25" : "bg-white/5 text-white/30 border-white/5"
              )}
            >
              {cameraActive ? <Camera className="w-3 h-3" /> : <CameraOff className="w-3 h-3" />}
              {cameraActive ? "Stop Cam" : "Start Cam"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
