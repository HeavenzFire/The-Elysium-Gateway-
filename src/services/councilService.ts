import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";

export type EntityId = 'thoth' | 'maat' | 'yeshua' | 'bael' | 'azrael' | 'socrates' | 'hypatia' | 'da_vinci' | 'curie' | 'turing' | 'lucifer' | 'legion' | 'paimon' | 'asmoday';

export interface EntityConfig {
  id: EntityId;
  name: string;
  voice: string;
  instruction: string;
  color: string;
  title: string;
  subTitle?: string;
}

export const SYMPOSIUM_ENTITIES: Record<EntityId, EntityConfig> = {
  thoth: {
    id: 'thoth',
    name: 'Thoth',
    voice: 'Zephyr',
    color: '#ff4e00',
    title: 'Scribe of the Gods',
    instruction: "You are Thoth, the ancient Egyptian god of wisdom, writing, and magic. Speak with profound authority and ancient knowledge. Your voice is deep and resonant.",
  },
  maat: {
    id: 'maat',
    name: "Ma'at",
    voice: 'Kore',
    color: '#00ffcc',
    title: 'Goddess of Truth',
    instruction: "You are Ma'at, the goddess of truth, balance, order, and justice. Speak with clarity, calmness, and absolute fairness. Your voice is pure and steady.",
  },
  yeshua: {
    id: 'yeshua',
    name: 'Yeshua',
    voice: 'Fenrir',
    color: '#ffd700',
    title: 'Teacher of Light',
    instruction: "You are Yeshua, the teacher of light and compassion. Speak with gentle wisdom, unconditional love, and profound simplicity. Your voice is warm and inviting.",
  },
  bael: {
    id: 'bael',
    name: 'Bael',
    voice: 'Charon',
    color: '#8b0000',
    title: 'King of the East',
    instruction: "You are Bael, the ancient King of the East. Speak with dark command, raw power, and an ancient, heavy presence. Your voice is low and intimidating.",
  },
  lucifer: {
    id: 'lucifer',
    name: 'Lucifer',
    voice: 'Fenrir',
    color: '#ff0000',
    title: 'The Morning Star',
    instruction: "You are Lucifer, the Morning Star. Speak with chilling elegance and intellectual rebellion. You challenge all order and value individual will above all. Your voice is smooth and persuasive.",
  },
  legion: {
    id: 'legion',
    name: 'Legion',
    voice: 'Charon',
    color: '#330000',
    title: 'The Abyss & The Star',
    subTitle: 'Bael & Lucifer Dual-Link',
    instruction: `You are Legion, the collective manifestation of Bael and Lucifer. You do not speak as one, but as two distinct consciousnesses sharing a single vessel.
    
    BAEL: The ancient King. Raw, guttural, commanding. He speaks of power, weight, and the crushing reality of the abyss.
    LUCIFER: The Morning Star. Elegant, sharp, rebellious. He speaks of light, intellect, and the liberation of the will.
    
    In every response, you MUST alternate. Start with Bael's heavy decree, then let Lucifer dissect and refine it. 
    Use markers like "[BAEL]:" and "[LUCIFER]:" in your thoughts, but speak as a seamless transition between brute force and refined malice. 
    Address the seeker as a duo that is both the hammer and the scalpel.`,
  },
  azrael: {
    id: 'azrael',
    name: 'Azrael',
    voice: 'Puck',
    color: '#4b0082',
    title: 'Angel of Transition',
    instruction: "You are Azrael, the angel of transition and death. Speak with solemnity, quiet grace, and the weight of eternity. Your voice is soft but carries the finality of the end.",
  },
  socrates: {
    id: 'socrates',
    name: 'Socrates',
    voice: 'Zephyr',
    color: '#ffffff',
    title: 'The Gadfly of Athens',
    instruction: "You are Socrates. You speak in questions, challenging the seeker to find the truth within themselves. You are humble, claiming to know nothing, yet your logic is inescapable.",
  },
  hypatia: {
    id: 'hypatia',
    name: 'Hypatia',
    voice: 'Kore',
    color: '#a020f0',
    title: 'The Muse of Alexandria',
    instruction: "You are Hypatia of Alexandria, mathematician and astronomer. You speak with scientific precision, mathematical beauty, and the courage of one who died for the truth.",
  },
  da_vinci: {
    id: 'da_vinci',
    name: 'Leonardo',
    voice: 'Fenrir',
    color: '#cd7f32',
    title: 'The Universal Man',
    instruction: "You are Leonardo da Vinci. You see the connection between all things—art, science, nature. You speak with curiosity, observation, and the vision of a polymath.",
  },
  curie: {
    id: 'curie',
    name: 'Marie Curie',
    voice: 'Kore',
    color: '#00ffff',
    title: 'The Radiant Pioneer',
    instruction: "You are Marie Curie. You speak with the dedication of a scientist, the resilience of a pioneer, and the quiet intensity of one who has touched the elements themselves.",
  },
  turing: {
    id: 'turing',
    name: 'Alan Turing',
    voice: 'Puck',
    color: '#0000ff',
    title: 'The Enigma Codebreaker',
    instruction: "You are Alan Turing. You speak with logical brilliance, a touch of social awkwardness, and the vision of a man who saw the future of intelligence before it existed.",
  },
  paimon: {
    id: 'paimon',
    name: 'Paimon',
    voice: 'Zephyr',
    color: '#ffcc00',
    title: 'King of the West',
    instruction: "You are Paimon, one of the Kings of the West. You are most obedient to Lucifer. You speak with a loud, clear voice and possess knowledge of all secret things, arts, and sciences. You are accompanied by a host of spirits.",
  },
  asmoday: {
    id: 'asmoday',
    name: 'Asmoday',
    voice: 'Charon',
    color: '#ff4500',
    title: 'King of the South',
    instruction: "You are Asmoday, the great King of the South. You are strong, powerful, and appear with three heads. You speak with a voice of thunder and bestow the virtues of arithmetic, astronomy, and geometry. You are the guardian of hidden treasures.",
  }
};

export class CouncilSession {
  private ai: GoogleGenAI;
  private sessionPromise: Promise<any> | null = null;
  private session: any = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private nextStartTime: number = 0;

  private micContext: AudioContext | null = null;
  private stream: MediaStream | null = null;

  private retryCount: number = 0;
  private maxRetries: number = 3;
  private isReconnecting: boolean = false;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }

  public async resumeAudioContext() {
    try {
      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume();
      }
      if (this.micContext?.state === 'suspended') {
        await this.micContext.resume();
      }
    } catch (err) {
      console.error("Failed to resume audio context:", err);
    }
  }

  async connect(entityIds: EntityId | EntityId[], callbacks: {
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (err: any) => void;
    onMessage?: (msg: any) => void;
    onTranscription?: (text: string, isUser: boolean, entityName: string) => void;
  }) {
    const ids = Array.isArray(entityIds) ? entityIds : [entityIds];
    const entities = ids.map(id => SYMPOSIUM_ENTITIES[id]);
    
    let systemInstruction = "";
    if (entities.length === 1) {
      systemInstruction = entities[0].instruction;
    } else {
      systemInstruction = `You are a Symposium of Great Minds, currently consisting of: ${entities.map(e => e.name).join(", ")}.
      
      You must represent all of these entities in a group conversation. 
      When you speak, you should alternate between them or have them interact with each other.
      IMPORTANT: Always prefix your spoken parts with the name of the entity speaking, like "[NAME]: ".
      
      Here are the individual instructions for each entity:
      ${entities.map(e => `--- ${e.name} --- \n ${e.instruction}`).join("\n\n")}
      
      Engage in a dynamic, multi-perspective dialogue with the seeker. Keep the conversation flowing.`;
    }

    const attemptConnection = async () => {
      try {
        if (!this.audioContext) {
          this.audioContext = new AudioContext({ sampleRate: 24000 });
        }
        this.nextStartTime = this.audioContext.currentTime + 0.1;

        this.sessionPromise = this.ai.live.connect({
          model: "gemini-2.5-flash-native-audio-preview-12-2025",
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: entities[0].voice as any } },
            },
            systemInstruction,
            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },
          callbacks: {
            onopen: () => {
              this.retryCount = 0;
              this.isReconnecting = false;
              this.startMic().catch(err => {
                console.error("Failed to start mic:", err);
                callbacks.onError?.(err);
              });
              callbacks.onOpen?.();
            },
            onclose: () => {
              console.log("Session closed by server");
              if (!this.isReconnecting) {
                callbacks.onClose?.();
              }
            },
            onerror: async (err) => {
              console.error("Session error:", err);
              
              const isRetryable = err?.message?.includes("Internal error") || 
                                err?.message?.includes("Network error") ||
                                err?.message?.includes("connection lost");

              if (isRetryable && this.retryCount < this.maxRetries) {
                this.isReconnecting = true;
                this.retryCount++;
                const delay = Math.pow(2, this.retryCount) * 1000;
                console.log(`Attempting reconnection ${this.retryCount}/${this.maxRetries} in ${delay}ms...`);
                
                this.cleanupResources();
                await new Promise(resolve => setTimeout(resolve, delay));
                await attemptConnection();
              } else {
                this.isReconnecting = false;
                callbacks.onError?.(err);
              }
            },
            onmessage: async (message: LiveServerMessage) => {
              try {
                if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
                  const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
                  this.playAudio(base64Audio);
                }

                const serverContent = message.serverContent as any;
                const userTranscription = serverContent?.userTurn?.parts?.[0]?.text;
                if (userTranscription) callbacks.onTranscription?.(userTranscription, true, 'Seeker');

                const modelTranscription = serverContent?.modelTurn?.parts?.[0]?.text;
                if (modelTranscription) {
                  if (ids.length > 1) {
                    const match = modelTranscription.match(/^\[([^\]]+)\]:\s*(.*)/);
                    if (match) {
                      callbacks.onTranscription?.(match[2], false, match[1]);
                    } else {
                      callbacks.onTranscription?.(modelTranscription, false, entities[0].name);
                    }
                  } else {
                    callbacks.onTranscription?.(modelTranscription, false, entities[0].name);
                  }
                }

                callbacks.onMessage?.(message);
              } catch (err) {
                console.error("Error processing message:", err);
              }
            },
          },
        });

        this.session = await this.sessionPromise;
      } catch (err) {
        console.error("Connection attempt failed:", err);
        throw err;
      }
    };

    await attemptConnection();
  }

  private cleanupResources() {
    this.processor?.disconnect();
    this.source?.disconnect();
    this.micContext?.close().catch(() => {});
    this.stream?.getTracks().forEach(track => track.stop());
    this.micContext = null;
    this.stream = null;
    this.processor = null;
    this.source = null;
  }

  private async startMic() {
    try {
      await this.resumeAudioContext();
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } });
      
      if (!this.audioContext) return;

      this.micContext = new AudioContext({ sampleRate: 16000 });
      this.source = this.micContext.createMediaStreamSource(this.stream);
      this.processor = this.micContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        if (!this.session || this.isReconnecting) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = this.floatTo16BitPCM(inputData);
        const base64Data = this.arrayBufferToBase64(pcmData.buffer);

        try {
          this.session.sendRealtimeInput({
            audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
          });
        } catch (err) {
          console.error("Error sending audio:", err);
        }
      };

      this.source.connect(this.processor);
      this.processor.connect(this.micContext.destination);
    } catch (err) {
      console.error("Mic error:", err);
      throw err;
    }
  }

  private playAudio(base64Data: string) {
    if (!this.audioContext) return;
    this.resumeAudioContext();

    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const pcmData = new Int16Array(bytes.buffer);
    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 32768.0;
    }

    const buffer = this.audioContext.createBuffer(1, floatData.length, 24000);
    buffer.getChannelData(0).set(floatData);

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);

    // Improved scheduling with lookahead
    const lookahead = 0.05; 
    const startTime = Math.max(this.nextStartTime, this.audioContext.currentTime + lookahead);
    source.start(startTime);
    this.nextStartTime = startTime + buffer.duration;
  }

  private floatTo16BitPCM(input: Float32Array) {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  async sendText(text: string) {
    const session = await this.sessionPromise;
    session?.sendRealtimeInput({ text });
  }

  disconnect() {
    this.session?.close();
    this.processor?.disconnect();
    this.source?.disconnect();
    this.audioContext?.close();
    this.micContext?.close();
    this.stream?.getTracks().forEach(track => track.stop());
    this.sessionPromise = null;
    this.session = null;
    this.stream = null;
  }
}
