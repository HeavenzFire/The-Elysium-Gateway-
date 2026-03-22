import { GoogleGenAI } from "@google/genai";

export async function generateVision(prompt: string): Promise<string | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `An ancient Egyptian mystical vision of the absolute truth: ${prompt}. Cinematic, ethereal, sacred geometry, golden light, deep shadows, 4k, hyper-detailed.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (err) {
    console.error("Vision generation failed:", err);
    return null;
  }
}
