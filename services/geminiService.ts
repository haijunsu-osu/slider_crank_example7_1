import { GoogleGenAI } from "@google/genai";
import { KinematicState, MechanismParams } from '../types';

export const analyzeMechanismWithAI = async (
  params: MechanismParams,
  state: KinematicState
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are an expert mechanical engineer and physics professor.
    Analyze the current state of a slider-crank mechanism.
    
    Configuration:
    - Crank Length (r2): ${params.r2} inches
    - Connecting Rod Length (r3): ${params.r3} inches
    - Current Crank Angle: ${params.theta2} degrees

    Calculated State:
    - Slider Position: ${state.sliderPos.toFixed(3)} in
    - Rod Angle (theta3): ${state.theta3.toFixed(3)} degrees

    Please provide a concise but insightful analysis (max 3-4 sentences). 
    Explain the geometric configuration at this specific angle (e.g., is it near a limit position? top dead center? bottom dead center?).
    Use plain text, no markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch AI analysis.");
  }
};