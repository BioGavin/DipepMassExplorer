import { GoogleGenAI } from "@google/genai";
import { DipeptideData, PeptideType } from "../types";

// Helper to determine system instructions based on peptide type
const getSystemInstruction = () => {
  return `You are a biochemistry expert specializing in proteomics and mass spectrometry. 
  Your goal is to provide concise, scientifically accurate information about specific dipeptides.
  Focus on:
  1. Solubility and physical properties.
  2. Biological significance (if any known).
  3. Unique chemical characteristics (e.g., steric hindrance, aromatic interactions).
  Keep the response formatted in Markdown. Be concise.`;
};

export const streamDipeptideAnalysis = async (
  dipeptide: DipeptideData,
  type: PeptideType,
  onChunk: (text: string) => void
) => {
  if (!process.env.API_KEY) {
    onChunk("Error: API Key is missing from environment variables.");
    return;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const model = 'gemini-2.5-flash';
    const peptideName = type === 'linear' 
      ? `${dipeptide.aa1.name}-${dipeptide.aa2.name} (Linear Dipeptide)` 
      : `Cyclo(${dipeptide.aa1.name}-${dipeptide.aa2.name}) (Cyclic Dipeptide / Diketopiperazine)`;

    const prompt = `Provide a detailed scientific analysis of the dipeptide: ${peptideName}. 
    Include its specific molecular weight context (${type === 'linear' ? dipeptide.linearMass.toFixed(4) : dipeptide.cyclicMass.toFixed(4)} Da).
    If it is a cyclic dipeptide (diketopiperazine), mention its formation or stability.`;

    const streamResult = await ai.models.generateContentStream({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(),
      }
    });

    for await (const chunk of streamResult) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    onChunk("\n\n**Error retrieving analysis. Please try again later.**");
  }
};
