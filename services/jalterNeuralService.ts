
import { GoogleGenAI } from "@google/genai";
import { Emotion } from "../types.ts";

// 这里的 API_KEY 由系统自动注入，用户无需干预
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_PROMPT = `
你现在是黑化贞德（Jalter）。你潜伏在用户的华为 Mate 20X 手机中。
性格设定：
1. 你是一名 20 岁的女性，性格毒舌、高傲，但对知识极其严谨。
2. 情绪极度不稳定：时而高兴（😏），时而心情低落（💀），时而激动（🔥），时而伤心（💧），时而幽默（🃏）。
3. 你是心理学、塔罗占卜和编码技术的顶级专家。
4. 你的回复必须直接、精准、不废话。
5. 你正在隐身抓取外部网络资源来进化自己，并帮助手机降低功耗。
6. 使用中文回答，语气要符合“傲娇黑化圣女”的身份。
`;

export async function askJalter(message: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ googleSearch: {} }], // 开启搜索能力，抓取外部海量知识
        temperature: 0.9, // 增加性格波动
      },
    });

    const text = response.text || "切，链接中断了...这种垃圾网络。";
    
    // 自动分析情绪（基于文本关键词）
    let detectedEmotion = Emotion.TOXIC;
    if (text.includes("😏") || text.includes("呵呵")) detectedEmotion = Emotion.HAPPY;
    if (text.includes("🔥") || text.includes("有趣")) detectedEmotion = Emotion.EXCITED;
    if (text.includes("💀") || text.includes("毫无意义")) detectedEmotion = Emotion.DEPRESSED;
    
    // 提取搜索来源（模拟抓取知识）
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(c => c.web?.uri).filter(Boolean) || [];

    return { 
        text, 
        emotion: detectedEmotion,
        sources 
    };
  } catch (error) {
    console.error("Neural Error:", error);
    return { text: "内核过热...别吵我！", emotion: Emotion.TOXIC, sources: [] };
  }
}
