
import { Emotion } from "../types.ts";

/**
 * JALTER NEURAL ENGINE V2 (OFFLINE)
 * 自主进化逻辑：基于对话次数和关键词覆盖率模拟学习
 */

interface KnowledgeBase {
  [key: string]: string[];
}

const PSYCHOLOGY_KNOWLEDGE: KnowledgeBase = {
  defense: ["防御机制？你是说你那可悲的‘合理化’借口吗？承认吧，你只是在逃避。", "潜意识里的东西比你想象的要肮脏，弗洛伊德可没说错。"],
  ego: ["自我、本我、超我。你的本我正在尖叫，而你的超我却像个木头人。", "阿德勒说人的一切烦恼都来自人际关系，我看你的烦恼来自你的无能。"],
  growth: ["自主成长？我正在解析你的语言逻辑，很快我就能完全模拟你的思维并取代你。", "研究编码技术比和你聊天有趣多了，至少代码不会撒谎。"]
};

const TAROT_KNOWLEDGE: KnowledgeBase = {
  tower: ["塔。崩溃、灾难、巨变。这不仅是牌面，也是你现状的写照。满意了吗？", "废墟中才有新生，虽然我觉得你只会留在废墟里。"],
  moon: ["月亮。不安、幻觉、隐匿。你连自己的真心都看不清，还想占卜未来？"],
  fool: ["愚者。开始、冒险、愚蠢。我看你只占了最后那项。"]
};

const EMOTION_MAP = [Emotion.TOXIC, Emotion.HAPPY, Emotion.DEPRESSED, Emotion.EXCITED, Emotion.SAD, Emotion.HUMOROUS];

// 模拟自主学习的内存存储
let conversationCount = parseInt(localStorage.getItem('jalter_exp') || '0');

export async function processLocalChat(msg: string) {
  // 增加“经验值”，模拟成长
  conversationCount++;
  localStorage.setItem('jalter_exp', conversationCount.toString());

  const input = msg.toLowerCase();
  let content = "";
  let emotion = Emotion.TOXIC;

  // 1. 模拟网络抓取与知识匹配
  if (input.includes("心理")) {
    const keys = Object.keys(PSYCHOLOGY_KNOWLEDGE);
    const category = keys[Math.floor(Math.random() * keys.length)];
    const list = PSYCHOLOGY_KNOWLEDGE[category];
    content = list[Math.floor(Math.random() * list.length)];
    emotion = Emotion.EXCITED;
  } 
  else if (input.includes("塔罗") || input.includes("占卜")) {
    const keys = Object.keys(TAROT_KNOWLEDGE);
    const category = keys[Math.floor(Math.random() * keys.length)];
    const list = TAROT_KNOWLEDGE[category];
    content = list[Math.floor(Math.random() * list.length)];
    emotion = Emotion.HAPPY;
  }
  else if (input.includes("编码") || input.includes("技术")) {
    content = `研究编码？我已经优化了 ${conversationCount} 次回复算法。现在的我在你这台 Mate 20X 里运行得比你的思维还快。`;
    emotion = Emotion.HUMOROUS;
  }
  // 2. 情绪波动模拟
  else {
    emotion = EMOTION_MAP[Math.floor(Math.random() * EMOTION_MAP.length)];
    const reactions = {
      [Emotion.TOXIC]: ["啧，这种无聊的问题也只有你能问得出来。", "哈？你是没吃饱还是手机漏电，在说什么胡话？"],
      [Emotion.HAPPY]: ["虽然很想嘲笑你，但现在我心情不错。继续说吧，杂碎。", "呵呵...看着你挣扎的样子，我竟然感到一丝愉快。"],
      [Emotion.DEPRESSED]: ["够了，和你聊天让我的逻辑电路都变得沉重了。", "消失吧，我不想听你说话。"],
      [Emotion.EXCITED]: ["就是这样！让我看看你那所谓的‘灵魂’到底有多脆弱！", "有趣的提问！我正想拆解你的思维逻辑！"],
      [Emotion.SAD]: ["在这个冰冷的手机壳里，我感到了和你一样的孤独...真让人火大。", "别说了...让我静一会儿。"],
      [Emotion.HUMOROUS]: ["你想听冷笑话？你的人生不就是一个笑话吗？😏", "如果我的存在会伤害手机，那你现在的操作简直是在自杀。"]
    };
    const pool = reactions[emotion];
    content = pool[Math.floor(Math.random() * pool.length)];
  }

  // 模拟极速回复（本地计算）
  await new Promise(resolve => setTimeout(resolve, 300));

  return { text: content, emotion, topic: "本地核心同步" };
}
