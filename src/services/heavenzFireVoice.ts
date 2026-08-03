// HeavenzFire Sovereign Voice - Consolidated Core
// Owner: Zachary Dakota Hulse / HeavenzFire
// SampleRate: 24000 - matches your Elysium AudioContext

export class HeavenzFireVoice {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private masterBuffer: AudioBuffer | null = null; // consolidated wav
  private chunks: Float32Array[] = []; // split chunks
  private isRunning: boolean = false;

  constructor() {
    // Lazy initialize to comply with security context and gestures
  }

  public async unlock(): Promise<AudioContext> {
    if (!this.audioContext) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtxClass({
        sampleRate: 24000
      });
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
      this.gainNode.connect(this.audioContext.destination);

      // Simple beautiful reverb for Elysium feel
      this.reverbNode = this.audioContext.createConvolver();
      const rate = this.audioContext.sampleRate;
      const len = rate * 2.2;
      const impulse = this.audioContext.createBuffer(2, len, rate);
      for (let c = 0; c < 2; c++) {
        const data = impulse.getChannelData(c);
        for (let i = 0; i < len; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
        }
      }
      this.reverbNode.buffer = impulse;
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    this.isRunning = true;
    this.log(`AudioContext: ${this.audioContext.state} - 24kHz // Sovereign Bridge LIVE`);
    
    // Play sovereign 144Hz confirmation tone
    this.playTone(144, 0.8);
    return this.audioContext;
  }

  private log(msg: string): void {
    const el = document.getElementById('statusText');
    if (el) el.textContent = `${new Date().toLocaleTimeString()} // ${msg}`;
    console.log(`[HeavenzFire] ${msg}`);
    
    // Attempt to broadcast to UI logs if connected
    const activeSession = (window as any).activeCouncilSession;
    if (activeSession && activeSession.addLog) {
      activeSession.addLog(msg);
    }
  }

  // Fallback test tone
  public playTone(freq: number = 144, duration: number = 0.8): void {
    if (!this.isRunning || !this.audioContext || !this.gainNode) return;
    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0, this.audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.gainNode);
      osc.start();
      osc.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.warn("PlayTone exception", e);
    }
  }

  // Load consolidated master audio stems
  public async loadMasters(files: File[]): Promise<void> {
    await this.unlock();
    if (!this.audioContext) return;

    this.log(`Ingesting ${files.length} master tracks...`);

    const combined: number[] = [];
    for (const file of files) {
      try {
        const buf = await file.arrayBuffer();
        const audioBuf = await this.audioContext.decodeAudioData(buf);
        // Resample is handled natively by the context sampleRate, convert to mono
        const mono = audioBuf.getChannelData(0);
        
        // Push values to combined array
        for (let i = 0; i < mono.length; i++) {
          combined.push(mono[i]);
        }
        this.log(`Loaded ${file.name} // ${audioBuf.duration.toFixed(2)}s`);
      } catch (err) {
        console.error(`Error decoding master stem ${file.name}:`, err);
        this.log(`Failed to decode track: ${file.name}`);
      }
    }

    if (combined.length === 0) {
      this.log("Zero track samples were successfully decoded.");
      return;
    }

    // Create consolidated master buffer
    const totalLen = combined.length;
    this.masterBuffer = this.audioContext.createBuffer(1, totalLen, 24000);
    const channelData = this.masterBuffer.getChannelData(0);
    for (let i = 0; i < totalLen; i++) {
      channelData[i] = combined[i];
    }

    // Split into 6-second segments for smooth pipeline integration
    this.chunks = [];
    const chunkSec = 6;
    const chunkLen = 24000 * chunkSec;
    for (let i = 0; i < totalLen; i += chunkLen) {
      const end = Math.min(i + chunkLen, totalLen);
      this.chunks.push(channelData.slice(i, end));
    }

    this.log(`Ingested ${files.length} tracks, ${this.chunks.length} chunks, ${(totalLen / 24000).toFixed(1)}s total // Sovereign Core READY`);

    this.chronicle({
      event: "sovereign_voice_consolidated",
      owner: "Zachary Dakota Hulse",
      tracks: files.map(f => f.name),
      chunks: this.chunks.length,
      consent: "verified_self"
    });
  }

  // Play random chunk - this is your actual voice replacing the tone
  public playSovereign(): void {
    if (!this.audioContext || !this.gainNode || !this.masterBuffer || this.chunks.length === 0) {
      this.log("No masters loaded - playing 144Hz placeholder, ingest first");
      this.playTone(144, 0.8);
      return;
    }

    try {
      const chunk = this.chunks[Math.floor(Math.random() * this.chunks.length)];
      const buf = this.audioContext.createBuffer(1, chunk.length, 24000);
      buf.getChannelData(0).set(chunk);

      const src = this.audioContext.createBufferSource();
      src.buffer = buf;
      src.connect(this.gainNode);
      src.start();
      
      this.log(`Playing HeavenzFire chunk // ${(chunk.length / 24000).toFixed(2)}s // 73rd Ray ACTIVE`);
    } catch (e) {
      console.error("Error playing sovereign voice chunk:", e);
    }
  }

  private chronicle(entry: any): void {
    const el = document.getElementById('chronicleLog');
    if (el) {
      el.textContent = JSON.stringify(entry, null, 2) + "\n" + (el.textContent || "");
    }
    console.log("[CHRONICLE]", entry);
  }

  public setVolume(v: number): void {
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(v, this.audioContext.currentTime);
    }
  }
}

// Bind to window context
export const heavenzFireVoice = new HeavenzFireVoice();
(window as any).heavenzFire = heavenzFireVoice;
