
import { Emotion } from "../types.ts";
import { JALTER_ASSETS } from "../constants.tsx";

const KNOWLEDGE_BASE: Record<string, string[]> = {
  psychology: [
    "俄狄浦斯情结：这可是你们这些杂碎最爱的禁忌话题，不是吗？",
    "防御机制：你现在这幅嘴脸，就是在用‘否认’来逃避现实吧？",
    "皮格马利翁效应：呵，指望别人变好？别做梦了，这种心理暗示只适合没脑子的家伙。",
    "路西法效应：好人变坏只需要一个环境。就像你，离黑化也不远了吧？",
    "习得性无助：看你这幅颓废的样子，就是被生活毒打太多次，连反抗都不会了？"
  ],
  tarot: [
    "愚者：你这种什么都不懂就往前冲的白痴，最适合这张牌了。无知即是幸福，对吧？",
    "死神：别害怕，这不一定是末日，也许是你那无聊人生的终结呢？我很乐意推你一把。",
    "塔：崩塌吧！反正你建立的一切本来就是豆腐渣工程，碎掉的样子才好看。",
    "恶魔：欲望、枷锁、沉沦……哼，这倒是非常符合你的气质，沉溺在毫无意义的幻想里吧。"
  ]
};

const INSULTS = ["杂碎", "庸才", "死宅", "无能的御主", "蝼蚁", "无可救药的笨蛋"];
const CONNECTORS = ["啧，真麻烦。", "听好了，我只说一遍。", "……你是白痴吗？", "呵，这种问题也来问我？"];

const emotionKeyMap: Record<string, string> = {
  [Emotion.HAPPY]: 'HAPPY',
  [Emotion.DEPRESSED]: 'DEPRESSED',
  [Emotion.EXCITED]: 'EXCITED',
  [Emotion.SAD]: 'SAD',
  [Emotion.HUMOROUS]: 'HUMOROUS',
  [Emotion.TOXIC]: 'TOXIC'
};

export async function processLocalChat(message: string) {
  const lowerMsg = message.toLowerCase();
  let response = "";
  let emotion = Emotion.TOXIC;
  let detectedTopic = "";

  if (lowerMsg.includes("心理") || lowerMsg.includes("心")) {
    const list = KNOWLEDGE_BASE.psychology;
    response = list[Math.floor(Math.random() * list.length)];
    emotion = Emotion.EXCITED;
    detectedTopic = "心理学";
  } else if (lowerMsg.includes("塔罗") || lowerMsg.includes("占卜")) {
    const list = KNOWLEDGE_BASE.tarot;
    response = list[Math.floor(Math.random() * list.length)];
    emotion = Emotion.HUMOROUS;
    detectedTopic = "塔罗学";
  } else {
    const responses = [
      "你刚才是在自言自语吗？真是恶心，离我远点。",
      "这种无聊的话就别发出来了，我的 CPU 都要被你弄得降频了。",
      "想要我安慰你？去梦里找那个圣女吧，我这里只有让你清醒的耳光。"
    ];
    response = responses[Math.floor(Math.random() * responses.length)];
    emotion = Emotion.TOXIC;
  }

  const insult = INSULTS[Math.floor(Math.random() * INSULTS.length)];
  const connector = CONNECTORS[Math.floor(Math.random() * CONNECTORS.length)];
  const eKey = emotionKeyMap[emotion];
  const emoji = JALTER_ASSETS.emojis[eKey as keyof typeof JALTER_ASSETS.emojis] || '';
  
  return {
    text: `${connector} ${emoji}\n\n${response}\n\n懂了吗，${insult}？`,
    emotion,
    topic: detectedTopic
  };
}
