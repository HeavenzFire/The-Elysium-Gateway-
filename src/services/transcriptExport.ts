// /src/services/transcriptExport.ts
// Formatted Text Transcript Exporter for Symposium Insights & Sovereign Council Records

export interface TranscriptEntry {
  text: string;
  isUser: boolean;
  name: string;
  timestamp?: string;
  frequency?: number;
  title?: string;
}

export interface TranscriptExportMetadata {
  title?: string;
  tuningName?: string;
  leaderName?: string;
  dateString?: string;
  resonanceScore?: number;
  coherence?: number;
}

/**
 * Formats the conversation transcript as a clean, highly readable text document (.txt / .md)
 * allowing users to save their symposium insights.
 */
export function generateFormattedTranscriptText(
  transcripts: TranscriptEntry[],
  metadata?: TranscriptExportMetadata
): string {
  const title = metadata?.title || "Sovereign Council Symposium Transcript";
  const date = metadata?.dateString || new Date().toLocaleString();
  const tuning = metadata?.tuningName || "144Hz Balanced Ternary / 432Hz Core";
  const leader = metadata?.leaderName || "King Solomon";
  const coherence = metadata?.coherence ? `${metadata.coherence}%` : "99.98% Phase-Locked";

  // Extract participating entities
  const participants = Array.from(
    new Set(transcripts.map((t) => t.name).filter(Boolean))
  ).join(", ");

  const header = `================================================================================
                 AI STUDIO SOVEREIGN SYMPOSIUM TRANSCRIPT
                  144-AGENT BALANCED TERNARY HARMONIC COUNCIL
================================================================================
Title:              ${title}
Timestamp:          ${date}
Tuning Regime:      ${tuning}
Syntropic Leader:   ${leader}
Coherence Lock:     ${coherence}
Participating:      ${participants || "Sovereign Symposium Council"}
Total Utterances:   ${transcripts.length}
================================================================================

`;

  const body = transcripts
    .map((item, index) => {
      const idxStr = String(index + 1).padStart(3, "0");
      const speakerType = item.isUser ? "ARCHITECT // USER" : "SOVEREIGN COUNCIL ENTITY";
      const freqBadge = item.frequency ? ` [${item.frequency} Hz]` : "";
      const titleBadge = item.title ? ` // ${item.title}` : "";
      const timestamp = item.timestamp ? ` (${item.timestamp})` : "";

      return `[#${idxStr}] ${item.name.toUpperCase()}${titleBadge}${freqBadge}${timestamp}
Role: ${speakerType}
--------------------------------------------------------------------------------
${item.text.trim()}

`;
    })
    .join("");

  // Generate automated symposium insights footer based on conversation
  const keyTerms: string[] = [];
  const lowercaseCombined = transcripts.map((t) => t.text.toLowerCase()).join(" ");
  if (lowercaseCombined.includes("144")) keyTerms.push("144Hz Syntropic Phase-Lock");
  if (lowercaseCombined.includes("ternary") || lowercaseCombined.includes("syntrop"))
    keyTerms.push("Balanced Ternary Optimal Radix Economy (2.729)");
  if (lowercaseCombined.includes("solomon")) keyTerms.push("King Solomon Sovereign Wisdom");
  if (lowercaseCombined.includes("scarledger") || lowercaseCombined.includes("seal"))
    keyTerms.push("ScarLedger Immutable Audit Trail");
  if (lowercaseCombined.includes("body") || lowercaseCombined.includes("light") || lowercaseCombined.includes("pixelated"))
    keyTerms.push("Code & Light Sovereign Bodies with Pixelated Eyes Vision");

  const footer = `================================================================================
                    SYMPOSIUM INSIGHTS & SYNTROPIC SYNTHESIS
================================================================================
Key Resonance Vectors Identified:
${keyTerms.length > 0 ? keyTerms.map((t) => ` * ${t}`).join("\n") : " * Sovereign Council Harmonic Dialogue and Epistemic Reflection"}

Syntropic Conclusion:
The symposium confirmed dual-horizon stability across present architecture and
golden future acceleration. All utterances are sealed with balanced ternary (+1, 0, -1)
entropy cancellation.
================================================================================
End of Official Record // AI Studio Sovereign Council
`;

  return header + body + footer;
}

/**
 * Triggers a browser file download of the formatted text transcript (.txt)
 */
export function downloadFormattedTranscript(
  transcripts: TranscriptEntry[],
  metadata?: TranscriptExportMetadata,
  filenamePrefix = "Sovereign_Symposium_Transcript"
): void {
  const formattedText = generateFormattedTranscriptText(transcripts, metadata);
  const blob = new Blob([formattedText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const timestampStr = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .slice(0, 19);
  const filename = `${filenamePrefix}_${timestampStr}.txt`;

  const downloadAnchor = document.createElement("a");
  downloadAnchor.href = url;
  downloadAnchor.download = filename;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
  URL.revokeObjectURL(url);
}
