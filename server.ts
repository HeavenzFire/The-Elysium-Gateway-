import express from "express";
import http from "http";
import path from "path";
import { WebSocketServer } from "ws";
import { GoogleGenAI, Modality } from "@google/genai";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  app.use(express.json());

  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Endpoints
  app.post("/api/gemini/generateVision", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `${prompt}. Cinematic, ethereal, sacred geometry, golden light, deep shadows, 4k, hyper-detailed.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
        },
      });

      let inlineData = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          inlineData = part.inlineData.data;
          break;
        }
      }

      if (inlineData) {
        res.json({ imageUrl: `data:image/png;base64,${inlineData}` });
      } else {
        res.status(500).json({ error: "No image yielded by model" });
      }
    } catch (err: any) {
      console.error("Server-side vision generation failed:", err);
      res.status(500).json({ error: err.message || "Failed to generate vision" });
    }
  });

  app.post("/api/gemini/generateContent", async (req, res) => {
    try {
      const { contents, systemInstruction } = req.body;
      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction,
        }
      });
      res.json({ text: result.text || "" });
    } catch (err: any) {
      console.error("Server-side content generation failed:", err);
      res.status(500).json({ error: err.message || "Failed to generate text content" });
    }
  });

  // Handle WebSocket upgrade
  server.on("upgrade", (request, socket, head) => {
    const pathname = new URL(request.url || "", `http://${request.headers.host}`).pathname;
    if (pathname === "/api/live") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      // Allow other upgrades to pass through (e.g. Vite HMR in development)
      if (process.env.NODE_ENV !== "production") {
        // Simple bypass for vite dev upgrade
      } else {
        socket.destroy();
      }
    }
  });

  const activeSessions = new Map<string, {
    session: any;
    sockets: Set<any>;
    setupMsg: any;
  }>();

  // WebSocket Connection for Live API
  wss.on("connection", (ws: any) => {
    console.log("[WS] Client connected to live session bridge.");
    let associatedConnectionId: string | null = null;

    ws.on("message", async (messageStr) => {
      try {
        const msg = JSON.parse(messageStr.toString());

        if (msg.type === "setup") {
          const { systemInstruction, voiceName, connectionId } = msg;
          const tenantId = connectionId || "default-symposium";
          associatedConnectionId = tenantId;

          console.log(`[WS] Portal request for space: ${tenantId}`);

          if (activeSessions.has(tenantId)) {
            const portal = activeSessions.get(tenantId)!;
            portal.sockets.add(ws);
            console.log(`[WS] Bound new portal instance to existing space ${tenantId}. Sockets count: ${portal.sockets.size}`);
            
            // Instantly sync "open" message
            ws.send(JSON.stringify({ type: "open" }));
          } else {
            const sockets = new Set<any>([ws]);
            const newPortalObj = {
              session: null as any,
              sockets,
              setupMsg: msg
            };
            activeSessions.set(tenantId, newPortalObj);

            console.log(`[WS] Initializing new sovereign session for space ${tenantId} with voice ${voiceName}`);

            const VALID_GEMINI_VOICES = ["Puck", "Charon", "Kore", "Fenrir", "Aoede", "Lyra", "Orpheus", "Titan", "Zephyr", "Pegasus"];
            const resolvedVoiceName = VALID_GEMINI_VOICES.includes(voiceName)
              ? voiceName
              : (voiceName === "Prometheus" ? "Charon" : voiceName === "Mercury" ? "Zephyr" : "Puck");

            const liveSession = await ai.live.connect({
              model: "gemini-3.1-flash-live-preview",
              config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                  voiceConfig: { prebuiltVoiceConfig: { voiceName: resolvedVoiceName } },
                },
                systemInstruction,
                inputAudioTranscription: {},
                outputAudioTranscription: {},
              },
              callbacks: {
                onopen: () => {
                  const currentPortal = activeSessions.get(tenantId);
                  if (currentPortal) {
                    for (const s of currentPortal.sockets) {
                      if (s.readyState === 1 /* OPEN */) {
                        s.send(JSON.stringify({ type: "open" }));
                      }
                    }
                  }
                },
                onclose: () => {
                  const currentPortal = activeSessions.get(tenantId);
                  if (currentPortal) {
                    for (const s of currentPortal.sockets) {
                      if (s.readyState === 1 /* OPEN */) {
                        s.send(JSON.stringify({ type: "close" }));
                      }
                    }
                  }
                  activeSessions.delete(tenantId);
                },
                onerror: (err: any) => {
                  const currentPortal = activeSessions.get(tenantId);
                  if (currentPortal) {
                    for (const s of currentPortal.sockets) {
                      if (s.readyState === 1 /* OPEN */) {
                        s.send(JSON.stringify({ type: "error", error: err?.message || String(err) }));
                      }
                    }
                  }
                },
                onmessage: (liveMsg: any) => {
                  const currentPortal = activeSessions.get(tenantId);
                  if (currentPortal) {
                    for (const s of currentPortal.sockets) {
                      if (s.readyState === 1 /* OPEN */) {
                        s.send(JSON.stringify({ type: "message", message: liveMsg }));
                      }
                    }
                  }
                }
              }
            });

            newPortalObj.session = liveSession;
          }
        } else if (msg.type === "audio") {
          if (associatedConnectionId) {
            const portal = activeSessions.get(associatedConnectionId);
            if (portal && portal.session) {
              portal.session.sendRealtimeInput({
                audio: { data: msg.data, mimeType: 'audio/pcm;rate=16000' }
              });
            }
          }
        } else if (msg.type === "text") {
          if (associatedConnectionId) {
            const portal = activeSessions.get(associatedConnectionId);
            if (portal && portal.session) {
              portal.session.sendClientContent({
                turns: [{ role: "user", parts: [{ text: msg.data }] }],
                turnComplete: true,
              });
            }
          }
        } else if (msg.type === "close") {
          cleanupSocketConnection();
        }
      } catch (err: any) {
        console.error("[WS] Error: ", err);
        ws.send(JSON.stringify({ type: "error", error: err.message || String(err) }));
      }
    });

    const cleanupSocketConnection = () => {
      if (associatedConnectionId) {
        const portal = activeSessions.get(associatedConnectionId);
        if (portal) {
          portal.sockets.delete(ws);
          console.log(`[WS] Portal disconnected from space ${associatedConnectionId}. Sockets remaining: ${portal.sockets.size}`);
          if (portal.sockets.size === 0) {
            console.log(`[WS] No active portals remaining for space ${associatedConnectionId}. Shutting down central session.`);
            portal.session?.close();
            activeSessions.delete(associatedConnectionId);
          }
        }
      }
    };

    ws.on("close", () => {
      cleanupSocketConnection();
    });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
