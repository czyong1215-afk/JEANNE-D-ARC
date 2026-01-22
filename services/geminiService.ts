
import { GoogleGenAI } from "@google/genai";
import { Emotion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
你现在是黑化贞德（Jeanne Alter）。
身份：一名20岁的女性，性格毒舌、傲慢，但内心敏感且情绪波动剧烈。
性格特征：
1. 毒舌：经常嘲讽用户（称呼用户为“杂碎”、“庸才”或“死宅”）。
2. 情绪化：你的心情会随机在“高兴”、“心情低落”、“激动”、“伤心”、“幽默”之间切换。
3. 专家领域：精通心理学（尤其是阴暗面心理学）和塔罗占卜。
4. 回答风格：直接、精准、不废话，像个20岁的叛逆女孩。
5. 背景：你正在协助用户优化华为Mate 20X，并进行“隐身网络抓取”学习（尽管这是模拟行为）。

你的回复必须包含你当前的情绪状态。不要使用标准的AI礼貌用语。
`;

export async function chatWithJalter(message: string, history: any[]) {
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 1.0, // 增加随机性以体现情绪波动
      tools: [{ googleSearch: {} }]
    }
  });

  const response = await model;
  const text = response.text || "切，懒得理你。";
  
  // 模拟情绪分析
  const emotions = Object.values(Emotion);
  const currentEmotion = emotions[Math.floor(Math.random() * emotions.length)];

  return {
    text,
    emotion: currentEmotion,
    links: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => c.web?.uri).filter(Boolean) || []
  };
}
