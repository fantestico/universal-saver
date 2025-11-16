import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getChatResponse = async (prompt: string): Promise<string> => {
  try {
     // FIX: Use ai.models.generateContent for stateless, single-turn chat per Gemini API guidelines.
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
     });
     return response.text;
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};
