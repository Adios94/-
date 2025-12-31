
import { GoogleGenAI, Type, Schema, GenerateContentParameters } from "@google/genai";
import { GameConfig, GameState, StaffMember } from "../types";
import { generateLocalComments } from "./gameLogic";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const PRO_MODEL = "gemini-3-pro-preview";
const FLASH_MODEL = "gemini-3-flash-preview";

async function callAI(params: GenerateContentParameters, model = FLASH_MODEL): Promise<any> {
  try {
    const response = await ai.models.generateContent({ ...params, model });
    const text = response.text || "{}";
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    try {
      return JSON.parse(cleanJson);
    } catch {
      return { text };
    }
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
}

export const generateGameTitle = async (themes: string, genre: string): Promise<string> => {
  const schema: Schema = { type: Type.OBJECT, properties: { title: { type: Type.STRING } }, required: ["title"] };
  const prompt = `根据题材(${themes})和类型(${genre})生成一个幽默且具有爆款潜质的中文游戏标题。`;
  const data = await callAI({ contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema } });
  return data?.title || "未命名大作";
};

export const analyzeCandidate = async (candidate: StaffMember): Promise<string> => {
  const prompt = `你是一个毒舌猎头。请用30字评价这个候选人：${candidate.name}(${candidate.role}), 特长是${candidate.specialSkill}。
  简介是：${candidate.description}。语气要专业、辛辣且幽默。`;
  const data = await callAI({ contents: prompt });
  return data?.text || "看起来很普通，但其实真的很普通。";
};

export const generateGameSummary = async (state: GameState): Promise<string> => {
  const prompt = `为游戏《${state.config.title}》写一段Steam商店风格的中文简介(50字内)。题材：${state.config.theme}，类型：${state.config.genre}。`;
  const data = await callAI({ contents: prompt });
  return data?.text || "这是一款足以改变你人生的终极神作。";
};

export const generatePlayerComments = async (state: GameState, score: number): Promise<{ user: string, text: string, sentiment: 'pos' | 'neg' | 'neu' }[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        user: { type: Type.STRING },
        text: { type: Type.STRING },
        sentiment: { type: Type.STRING, enum: ["pos", "neg", "neu"] }
      },
      required: ["user", "text", "sentiment"]
    }
  };
  
  const prompt = `针对游戏《${state.config.title}》(评分:${score}/100, BUG数:${state.stats.bugs})。
  生成 15 条有趣的、带梗的、幽默的中文玩家评论。评论应该包含好评、中评和差评，体现社区多样性。`;
  
  const data = await callAI({ contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema } });
  
  if (Array.isArray(data) && data.length > 0) {
    return data;
  }

  // Fallback to local selection if AI fails
  return generateLocalComments(state, score);
};

export const generateGameCover = async (state: GameState): Promise<string | null> => {
  const prompt = `Game cover art for "${state.config.title}". Theme: ${state.config.theme}. Style: High quality professional game box art.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "3:4" } }
    });
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    return part ? `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` : null;
  } catch {
    return null;
  }
};
