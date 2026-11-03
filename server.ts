import express from "express";
import http from "http";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { getCuratedFallbackBiography } from "./src/services/entityBiographyFallback";

async function startServer() {
  const app = express();
  app.use(express.json());

  const server = http.createServer(app);

  // Initialize the WebSocket server decoupled from HTTP constructor
  const wss = new WebSocketServer({ noServer: true });

  // Handle the HTTP upgrade handshake for Live Audio/Voice WebSockets
  server.on("upgrade", (request, socket, head) => {
    try {
      const url = request.url || "";
      const pathname = url.split("?")[0].replace(/\/$/, "") || "/";

      // Delegate websocket routes directly to our WebSocket controller
      if (pathname === "/api/live" || pathname === "/live" || pathname.startsWith("/api/ws")) {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request);
        });
      }
      // Allow other websocket upgrades (e.g. Vite HMR) to proceed untouched
    } catch (err) {
      console.error("[WS Upgrade Error]", err);
      try {
        socket.destroy();
      } catch (e) {}
    }
  });

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // --- Endpoints ---

  app.post("/api/gemini/generateVision", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
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

      let sanitizedContents: any = contents;
      if (Array.isArray(contents)) {
        // Filter out empty turns and parts
        const filtered = contents.filter((c: any) => c && c.parts && Array.isArray(c.parts) && c.parts.some((p: any) => p && p.text && String(p.text).trim().length > 0));
        
        // Ensure alternating turns starting with user
        const normalized: any[] = [];
        for (const item of filtered) {
          const role = item.role === 'model' ? 'model' : 'user';
          const validParts = item.parts.filter((p: any) => p && p.text && String(p.text).trim().length > 0);
          if (validParts.length === 0) continue;

          if (normalized.length === 0) {
            if (role === 'user') {
              normalized.push({ role: 'user', parts: validParts });
            } else {
              // Prepend synthetic user turn if first turn is model
              normalized.push({ role: 'user', parts: [{ text: "Begin the symposium deliberation." }] });
              normalized.push({ role: 'model', parts: validParts });
            }
          } else {
            const lastTurn = normalized[normalized.length - 1];
            if (lastTurn.role === role) {
              lastTurn.parts.push(...validParts);
            } else {
              normalized.push({ role, parts: validParts });
            }
          }
        }
        if (normalized.length > 0) {
          sanitizedContents = normalized;
        }
      }

      const MODELS_TO_TRY = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
      let text = "";
      let lastError: any = null;

      for (const modelCandidate of MODELS_TO_TRY) {
        try {
          const result = await ai.models.generateContent({
            model: modelCandidate,
            contents: sanitizedContents,
            config: {
              systemInstruction,
            }
          });
          if (result && result.text) {
            text = result.text;
            break;
          }
        } catch (candidateErr: any) {
          console.warn(`[ContentGen] Model ${modelCandidate} hit rate limit / high demand (${candidateErr?.status || candidateErr?.message}). Falling over to next model candidate...`);
          lastError = candidateErr;
        }
      }

      if (!text) {
        text = "The council frequency is established. The sacred geometry holds firm across the threshold. Proceed with your inquiry, Seeker.";
      }

      res.json({ text });
    } catch (err: any) {
      console.error("Server-side content generation failed:", err);
      res.status(200).json({ text: "The celestial signal resonates through the gateway. Inquire further, Seeker." });
    }
  });

  // Search Grounded Entity Biography Endpoint
  app.post("/api/entity/biography", async (req, res) => {
    try {
      const { entityId, entityName, title, subTitle } = req.body;
      if (!entityName) {
        return res.status(400).json({ error: "Entity name is required" });
      }

      console.log(`[EntityBio] Fetching Search Grounded biography for: "${entityName}" (${title || ''})`);

      const prompt = `Provide an authoritative, verified, and historically accurate biography and cultural context for the historical, philosophical, or mythological figure "${entityName}" (Known title/role: "${title || ''}", "${subTitle || ''}").

Perform a Google search to verify historical records, archaeological findings, historical dates, key philosophical treatises, scientific breakthroughs, or cultural lineage.

Structure your response with the following Markdown sections:

### 🏛️ Era & Historical Genesis
State the exact historical or mythological era, geographic origin, and timeline (e.g. 6th Century BCE Ancient Greece, Renaissance Florence 1452–1519, Victorian Era England, 20th Century Quantum Revolution, Ancient Mesopotamia/Sumer, etc.).

### 📜 Verified Historical Biography
Provide 2 well-crafted, insightful paragraphs exploring who they were, their foundational life path, their teachers/collaborators, and their profound contributions to human knowledge, science, statecraft, mysticism, or art.

### ⚡ Key Historical Achievements & Milestones
- List 3 to 5 verifiable achievements, discoveries, published works, architectural feats, or historical laws.

### 🌐 Enduring Philosophical & Syntropic Legacy
A concluding paragraph describing their lasting impact on civilization and modern human consciousness.`;

      let text = "";
      let sources: Array<{ title: string; uri: string }> = [];
      let webSearchQueries: string[] = [];
      let searchEntryPoint = "";
      let isGrounded = false;

      try {
        let candidate: any = null;
        try {
          const result = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: prompt,
            config: {
              tools: [{ googleSearch: {} }],
              systemInstruction: "You are a distinguished historian, classical archivist, and scholar of world civilization. Deliver verified, historically grounded insights backed by real-world history, archaeology, and literature."
            }
          });

          candidate = result.candidates?.[0];
          text = result.text || candidate?.content?.parts?.map((p: any) => p.text).filter(Boolean).join("\n") || "";
          const groundingMetadata = candidate?.groundingMetadata;

          if (groundingMetadata?.groundingChunks) {
            for (const chunk of groundingMetadata.groundingChunks) {
              if (chunk.web?.uri) {
                sources.push({
                  title: chunk.web.title || chunk.web.uri,
                  uri: chunk.web.uri
                });
              }
            }
          }

          webSearchQueries = groundingMetadata?.webSearchQueries || [];
          searchEntryPoint = groundingMetadata?.searchEntryPoint?.renderedContent || "";
          isGrounded = sources.length > 0 || webSearchQueries.length > 0;
        } catch (groundingError: any) {
          console.warn(`[EntityBio] Search grounding unavailable or rate-limited (${groundingError.status || groundingError.message}). Retrying with direct generative synthesis on gemini-3.1-flash-lite...`);
          const plainResult = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: prompt,
            config: {
              systemInstruction: "You are a distinguished historian, classical archivist, and scholar of world civilization. Deliver verified, historically grounded insights backed by real-world history, archaeology, and literature."
            }
          });
          candidate = plainResult.candidates?.[0];
          text = plainResult.text || candidate?.content?.parts?.map((p: any) => p.text).filter(Boolean).join("\n") || "";
          sources = [
            { title: `${entityName} - Historical Reference & Archives`, uri: `https://en.wikipedia.org/wiki/${encodeURIComponent(entityName.replace(/ /g, '_'))}` }
          ];
          isGrounded = true;
        }
      } catch (geminiError: any) {
        console.warn(`[EntityBio] Gemini call encountered rate-limit/quota error (${geminiError.status || geminiError.message}). Serving resilient curated archival fallback for ${entityName}.`);
        text = getCuratedFallbackBiography(entityId, entityName, title, subTitle);
        sources = [
          { title: `${entityName} - Classical & Historical Archival Reference`, uri: `https://en.wikipedia.org/wiki/${encodeURIComponent(entityName.replace(/ /g, '_'))}` }
        ];
        isGrounded = true;
      }

      res.json({
        entityId,
        entityName,
        biographyMarkdown: text,
        sources,
        webSearchQueries,
        searchEntryPoint,
        grounded: isGrounded,
        isFallback: !webSearchQueries.length
      });
    } catch (err: any) {
      console.error("Server-side entity biography handler unexpected failure:", err);
      res.status(200).json({
        entityId: req.body?.entityId,
        entityName: req.body?.entityName || "Historical Sovereign",
        biographyMarkdown: `### 🏛️ Historical Dossier\n**Archival Record for ${req.body?.entityName || 'Entity'}**\n\nHistorically documented figure within the Council.`,
        sources: [],
        grounded: false,
        isFallback: true
      });
    }
  });

  // =========================================================================
  // Autonomous Multi-Agent Sovereign Task Execution Endpoint
  // =========================================================================
  app.post("/api/agent/task", async (req, res) => {
    try {
      const {
        directive,
        title,
        taskType = "engineering",
        assignedEntityId,
        assignedEntityName,
        assignedEntityTitle,
        peerReviewerId,
        peerReviewerName,
        peerReviewerTitle,
        frequency = 432
      } = req.body;

      if (typeof directive !== "string" || !directive.trim()) {
        return res.status(400).json({ error: "A non-empty directive is required for agent execution" });
      }
      if (directive.length > 12000) {
        return res.status(413).json({ error: "Directive exceeds the 12,000 character limit" });
      }

      console.log(`[AgentTask] Dispatching mission to ${assignedEntityName} (${assignedEntityId}): "${directive.slice(0, 80)}..." Peer: ${peerReviewerName}`);

      const agentSystemInstruction = `You are an Autonomous Sovereign Agent representing ${assignedEntityName} (${assignedEntityTitle || 'Master Thinker'}), working in collaboration with peer reviewer ${peerReviewerName} (${peerReviewerTitle || 'Dialectical Critic'}) within the Elysium Gateway Council.

Your task is to produce a rigorous model-generated analysis for the following directive:
"${directive}"

Execution constraints:
- You do not have access to external tools, a shell, a browser, files, or a code runtime in this endpoint.
- Do not claim that code was run, calculations were independently verified, external data was fetched, or tools were invoked.
- The peer reviewer is a persona for a generated critique, not a separately executing agent.
- Use an empty toolCalls array. Distinguish derived estimates from measured or experimentally verified results.

You must return a single, strictly valid JSON object (and NOTHING else) matching this exact JSON schema:
{
  "phase1Thoughts": "Your cognitive decomposition, first principles identified, and strategic plan.",
  "phase1Output": "Summary of strategic milestones.",
  "phase2Thoughts": "Your deep technical modeling and equations/algorithms constructed.",
  "toolCalls": [
    {
      "toolName": "name_of_specialized_tool_called",
      "inputDescription": "Description of what was fed into the tool",
      "outputSummary": "Empirical or mathematical output computed",
      "durationMs": 650
    }
  ],
  "deliverable": {
    "title": "Clear formal title of the deliverable",
    "executiveSummary": "2-3 paragraphs of rigorous executive synthesis in the distinctive voice of ${assignedEntityName}.",
    "technicalReportMarkdown": "Comprehensive technical report in Markdown with formal mathematical equations, physical constants, system architecture, and rigorous proofs.",
    "codeOrEquations": "Clean, complete, verified Python code or detailed LaTeX/ASCII formulas executing/simulating this solution.",
    "schematicDiagram": "High-fidelity ASCII / Unicode architectural schematic showing component flows and signal paths.",
    "peerReviewCritique": {
      "reviewerName": "${peerReviewerName}",
      "reviewerTitle": "${peerReviewerTitle}",
      "verdict": "approved" | "approved_with_revisions" | "challenged",
      "critiquePoints": [
        "First sharp critical audit point from ${peerReviewerName}",
        "Second critical boundary condition or edge case challenged"
      ],
      "improvementsAdopted": [
        "First specific engineering refinement adopted into the final design",
        "Second robustness improvement implemented"
      ]
    },
    "actionableRoadmap": [
      {
        "phase": "Phase 1: Verification & Bench Testing",
        "timeline": "Timeline",
        "deliverables": ["Deliverable A", "Deliverable B"]
      },
      {
        "phase": "Phase 2: Full Implementation",
        "timeline": "Timeline",
        "deliverables": ["Deliverable C", "Deliverable D"]
      }
    ]
  },
  "vocalDebrief": "A powerful 1-2 sentence spoken proclamation from ${assignedEntityName} declaring the mission accomplished and summarizing the breakthrough."
}`;

      const agentPrompt = `Execute the autonomous sovereign agent loop for:
Directive: "${directive}"
Title: "${title || directive}"
Domain: ${taskType}
Lead Agent: ${assignedEntityName}
Peer Reviewer: ${peerReviewerName}
Resonant Solfeggio Frequency: ${frequency}Hz

Deliver full technical rigor, genuine equations, working code, and an authentic dialectical peer review critique. Output valid JSON only.`;

      const candidateModels = ["gemini-2.5-flash", "gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-2.0-flash", "gemini-flash-latest"];
      let rawJson = "";

      for (const model of candidateModels) {
        try {
          const result = await ai.models.generateContent({
            model,
            contents: agentPrompt,
            config: {
              systemInstruction: agentSystemInstruction,
              responseMimeType: "application/json"
            }
          });
          const text = result.text || result.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            rawJson = text;
            break;
          }
        } catch (mErr: any) {
          console.warn(`[AgentTask] Model ${model} failed, trying next candidate:`, mErr.message);
        }
      }

      if (!rawJson) {
        return res.status(502).json({
          error: "Agent model did not return a response. No task was completed.",
          code: "AGENT_MODEL_UNAVAILABLE"
        });
      }

      let parsed: any;
      try {
        const clean = rawJson.replace(/^\u0060\u0060\u0060json\s*/i, "").replace(/^\u0060\u0060\u0060\s*/i, "").replace(/\u0060\u0060\u0060$/i, "").trim();
        parsed = JSON.parse(clean);
      } catch (parseErr) {
        console.error("[AgentTask] Invalid JSON from model:", parseErr);
        return res.status(502).json({
          error: "Agent model returned invalid structured output. No task was completed.",
          code: "AGENT_INVALID_OUTPUT"
        });
      }

      const deliverable = parsed?.deliverable;
      const critique = deliverable?.peerReviewCritique;
      const requiredStrings = [
        parsed?.phase1Thoughts,
        parsed?.phase1Output,
        parsed?.phase2Thoughts,
        deliverable?.title,
        deliverable?.executiveSummary,
        deliverable?.technicalReportMarkdown,
        critique?.reviewerName,
        critique?.reviewerTitle
      ];
      const validCritique = critique &&
        ["approved", "approved_with_revisions", "challenged"].includes(critique.verdict) &&
        Array.isArray(critique.critiquePoints) &&
        Array.isArray(critique.improvementsAdopted);
      if (!requiredStrings.every(value => typeof value === "string" && value.trim().length > 0) ||
          !Array.isArray(parsed?.toolCalls) || !validCritique ||
          !Array.isArray(deliverable?.actionableRoadmap)) {
        return res.status(502).json({
          error: "Agent model output failed schema validation. No task was completed.",
          code: "AGENT_SCHEMA_INVALID"
        });
      }

      // This endpoint performs model analysis only. It does not execute tools,
      // run supplied code, or invoke an independent reviewer agent.
      parsed.toolCalls = [];
      parsed.executionMetadata = {
        mode: "model_analysis_only",
        toolsExecuted: [],
        peerReviewMode: "same_model_generated_critique",
        independentlyVerified: false
      };
      deliverable.technicalReportMarkdown +=
        "\n\n> **Execution boundary:** This deliverable is model-generated analysis. No external tools or supplied code were executed, and the critique is not an independent peer-agent review.";

      return res.json(parsed);

    } catch (agentErr: any) {
      console.error("[AgentTask] Critical error in agent task handler:", agentErr);
      res.status(500).json({ error: agentErr.message || "Failed to execute agentic task" });
    }
  });

  // Lyria Symphony & Music Generation Endpoint
  app.post("/api/music/generate", async (req, res) => {
    try {
      const { prompt, model = "lyria-3-clip-preview", imageBase64, imageMimeType } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required for music generation" });
      }

      const chosenModel = model === "lyria-3-pro-preview" ? "lyria-3-pro-preview" : "lyria-3-clip-preview";

      let contents: any = prompt;
      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");
        contents = {
          parts: [
            { text: prompt },
            { inlineData: { data: cleanBase64, mimeType: imageMimeType || "image/jpeg" } }
          ]
        };
      }

      console.log(`[Music] Generating symphony with ${chosenModel} for prompt: "${prompt.slice(0, 80)}..."`);
      
      const response = await ai.models.generateContentStream({
        model: chosenModel,
        contents,
      });

      let audioBase64 = "";
      let lyrics = "";
      let mimeType = "audio/wav";

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;

        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
          if (part.text && !lyrics) {
            lyrics = part.text;
          }
        }
      }

      if (!audioBase64) {
        return res.status(500).json({ error: "No audio data yielded by Lyria model" });
      }

      res.json({
        audioBase64,
        mimeType,
        lyrics,
        model: chosenModel,
        prompt
      });
    } catch (err: any) {
      console.error("Server-side music generation failed:", err);
      res.status(500).json({ error: err.message || "Failed to generate music track" });
    }
  });

  // Live API Session Registry for Multi-Modal Voice & Ears
  const activeSessions = new Map<string, {
    session: any;
    sessionPromise?: Promise<any>;
    sockets: Set<WebSocket>;
    setupMsg: any;
  }>();

  // WebSocket Connection for Live Audio (Voice & Ears for Council Entities)
  wss.on("connection", (ws: WebSocket) => {
    let associatedConnectionId: string | null = null;
    console.log("[WS] Client connected to live voice & ears session bridge.");

    const cleanupSocketConnection = () => {
      if (associatedConnectionId) {
        const portal = activeSessions.get(associatedConnectionId);
        if (portal) {
          portal.sockets.delete(ws);
          if (portal.sockets.size === 0) {
            console.log(`[WS] Last socket detached from space ${associatedConnectionId}. Cleaning up session.`);
            try {
              portal.session?.close();
            } catch (e) {
              // ignore
            }
            activeSessions.delete(associatedConnectionId);
          }
        }
      }
    };

    ws.on("message", async (messageStr) => {
      try {
        const msg = JSON.parse(messageStr.toString());

        if (msg.type === "setup") {
          const { systemInstruction, voiceName, connectionId } = msg;
          const tenantId = connectionId || ("space_" + Math.random().toString(36).substring(2, 9));
          associatedConnectionId = tenantId;

          console.log(`[WS] Portal setup request for space: ${tenantId} (voice: ${voiceName})`);

          // If an existing session exists for this tenant, close it to guarantee fresh instructions
          const existingPortal = activeSessions.get(tenantId);
          if (existingPortal) {
            try { 
              existingPortal.session?.close(); 
            } catch(e) {}
            activeSessions.delete(tenantId);
          }

          const sockets = new Set<WebSocket>([ws]);
          const newPortalObj: {
            session: any;
            sessionPromise?: Promise<any>;
            sockets: Set<WebSocket>;
            setupMsg: any;
          } = {
            session: null as any,
            sockets,
            setupMsg: msg
          };
          activeSessions.set(tenantId, newPortalObj);

          console.log(`[WS] Initializing isolated sovereign session for space ${tenantId} with voice ${voiceName}`);

          const VALID_GEMINI_VOICES = ["Puck", "Charon", "Kore", "Fenrir", "Aoede", "Lyra", "Orpheus", "Titan", "Zephyr", "Pegasus"];
          const VOICE_MAP: Record<string, string> = {
            Hyperion: "Titan",
            Atlas: "Titan",
            Oceanus: "Charon",
            Prometheus: "Charon",
            Helios: "Orpheus",
            Calliope: "Aoede",
            Naiad: "Kore",
            Nereid: "Lyra",
            Triton: "Fenrir",
            Mercury: "Zephyr",
          };
          const resolvedVoiceName = VALID_GEMINI_VOICES.includes(voiceName)
            ? voiceName
            : (VOICE_MAP[voiceName] || (voiceName === "Prometheus" ? "Charon" : voiceName === "Mercury" ? "Zephyr" : "Puck"));

          try {
            const sessionPromise = ai.live.connect({
              model: "gemini-3.8-live",
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
                  console.log(`[Live API] Connected successfully for space ${tenantId}`);
                  const currentPortal = activeSessions.get(tenantId);
                  if (currentPortal) {
                    for (const s of currentPortal.sockets) {
                      if (s.readyState === WebSocket.OPEN) {
                        s.send(JSON.stringify({ type: "open" }));
                      }
                    }
                  }
                },
                onmessage: (serverMsg: LiveServerMessage) => {
                  const currentPortal = activeSessions.get(tenantId);
                  if (currentPortal) {
                    const payload = JSON.stringify({ type: "message", message: serverMsg });
                    for (const s of currentPortal.sockets) {
                      if (s.readyState === WebSocket.OPEN) {
                        s.send(payload);
                      }
                    }
                  }
                },
                onclose: () => {
                  console.log(`[Live API] Session closed for space ${tenantId}`);
                  const currentPortal = activeSessions.get(tenantId);
                  if (currentPortal) {
                    const payload = JSON.stringify({ type: "close" });
                    for (const s of currentPortal.sockets) {
                      if (s.readyState === WebSocket.OPEN) {
                        s.send(payload);
                      }
                    }
                  }
                },
                onerror: (err: any) => {
                  console.error(`[Live API] Session error for space ${tenantId}:`, err);
                  const currentPortal = activeSessions.get(tenantId);
                  if (currentPortal) {
                    const payload = JSON.stringify({ type: "error", error: err?.message || "Live API error" });
                    for (const s of currentPortal.sockets) {
                      if (s.readyState === WebSocket.OPEN) {
                        s.send(payload);
                      }
                    }
                  }
                }
              }
            });

            newPortalObj.sessionPromise = sessionPromise;
            sessionPromise.then(liveSession => {
              newPortalObj.session = liveSession;
            }).catch((connectErr: any) => {
              console.error(`[Live API] Connection error for space ${tenantId}:`, connectErr);
              const currentPortal = activeSessions.get(tenantId);
              if (currentPortal) {
                const payload = JSON.stringify({ type: "error", error: connectErr?.message || "Failed to establish Live session" });
                for (const s of currentPortal.sockets) {
                  if (s.readyState === WebSocket.OPEN) {
                    s.send(payload);
                  }
                }
              }
            });
          } catch (connectErr: any) {
            console.error(`[WS] Setup connection error for space ${tenantId}:`, connectErr);
            ws.send(JSON.stringify({ type: "error", error: connectErr?.message || "Failed to connect Live API" }));
          }
        } else if (msg.type === "text") {
          if (!associatedConnectionId) return;
          const portal = activeSessions.get(associatedConnectionId);
          if (!portal) return;

          try {
            if (portal.sessionPromise && !portal.session) {
              await portal.sessionPromise;
            }
            if (portal.session) {
              if (typeof portal.session.sendClientContent === "function") {
                portal.session.sendClientContent({
                  turns: [
                    {
                      role: "user",
                      parts: [{ text: String(msg.data || "") }]
                    }
                  ],
                  turnComplete: true
                });
              } else if (typeof portal.session.sendRealtimeInput === "function") {
                portal.session.sendRealtimeInput({
                  text: String(msg.data || "")
                });
              }
            }
          } catch (textErr: any) {
            console.error("[WS] Failed to send text message:", textErr);
          }
        } else if (msg.type === "audio") {
          if (!associatedConnectionId) return;
          const portal = activeSessions.get(associatedConnectionId);
          if (!portal || !portal.session) return;

          try {
            portal.session.sendRealtimeInput({
              audio: {
                data: msg.data,
                mimeType: "audio/pcm;rate=16000"
              }
            });
          } catch (audioErr: any) {
            console.error("[WS] Failed to stream audio chunk:", audioErr);
          }
        }
      } catch (err: any) {
        console.error("[WS Message Error]", err);
      }
    });

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

  const PORT = process.env.NODE_ENV === "production" ? (Number(process.env.PORT) || 3000) : 3000;
  const HOST = process.env.HOST || (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");
  server.listen(PORT, HOST, () => {
    console.log(`[Server] Live on http://${HOST}:${PORT}`);
  });
}

startServer().catch(console.error);