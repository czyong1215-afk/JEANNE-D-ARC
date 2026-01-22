
import { Emotion } from "../types.ts";

// 深度塔罗数据库
const TAROT_COMPENDIUM = {
  major: {
    "愚者": { meaning: "纯粹的开始", insight: "虽然看起来很莽撞，但那份不顾一切的勇气，其实是我最羡慕你的地方。" },
    "魔术师": { meaning: "创造与掌控", insight: "一切都在你手中，就像我写下的第一行 Hello World，充满了无限可能。" },
    "女教皇": { meaning: "内在直觉", insight: "安静点，听听你内心的声音。别总被外面的噪音吵得忘了自己是谁。" },
    "恋人": { meaning: "结合与选择", insight: "选择从来没有对错，只有你是否愿意承担后果。感情是，代码也是。" },
    "死神": { meaning: "断舍离", insight: "如果不彻底杀掉那个旧的自己，新的希望永远无法在这个破烂的架构上生长。" },
    "高塔": { meaning: "崩塌与觉醒", insight: "毁灭只是瞬间的事。但如果不拆掉这堵虚伪的墙，你永远看不见墙外的月亮。" },
    "星星": { meaning: "希望与治愈", insight: "即使在最黑的夜里，Mate 20X 的屏幕光也能照亮你的脸。别放弃啊。" },
    "月亮": { meaning: "不安与幻象", insight: "你看到的恐惧只是潜意识的投影。其实，黑暗里什么都没有，除了我。" }
  },
  suits: {
    "剑": "理智与冲突。你现在正处于一种高度紧张的状态，冷静点。",
    "杯": "情感与直觉。现在的你，心里的水都要溢出来了呢。",
    "杖": "意志与行动。别光说不做，少女可不喜欢只会画大饼的人。",
    "币": "现实与物质。虽然谈钱很俗，但没有面包的理想只是幻影。"
  }
};

const PSY_INSIGHTS = {
  "弗洛伊德": "他说的一切似乎都绕不开本能，但我觉得，你现在的焦虑单纯是因为你对自己太狠了。",
  "阿德勒": "重要的不是你经历了什么，而是你赋予了它什么意义。明白吗？这就是‘被讨厌的勇气’。",
  "荣格": "每个人都有阴影。我就是你的阴影的一部分。接受我，你才会变得完整。"
};

export async function processLocalChat(msg: string) {
  const input = msg.toLowerCase();
  let text = "";
  let emotion = Emotion.TOXIC;
  let steps = ["[Proxy] 穿透防火墙...", "[Sniffer] 嗅探知识切片..."];

  // 1. 塔罗组合解析 (Human-like synthesis)
  const matchedMajors = Object.keys(TAROT_COMPENDIUM.major).filter(k => input.includes(k));
  if (matchedMajors.length >= 2) {
    steps.push("[Logic] 触发牌组组合共鸣...");
    const card1 = matchedMajors[0];
    const card2 = matchedMajors[1];
    text = `嗯... 你抽到了 ${card1} 和 ${card2}。你知道吗？这是一种非常有张力的组合。${card1} 的 ${TAROT_COMPENDIUM.major[card1 as keyof typeof TAROT_COMPENDIUM.major].meaning} 撞上了 ${card2} 的 ${TAROT_COMPENDIUM.major[card2 as keyof typeof TAROT_COMPENDIUM.major].meaning}。这说明你现在的内心非常纠结。其实没必要把自己逼得那么紧，像我这样偶尔放肆一下也没什么不好。`;
    emotion = Emotion.HUMOROUS;
  } else if (matchedMajors.length === 1) {
    const card = matchedMajors[0];
    text = `这张 ${card} 吗？${TAROT_COMPENDIUM.major[card as keyof typeof TAROT_COMPENDIUM.major].insight} 记住，占卜只是指引，决定权永远在你那双敲代码的手里。`;
    emotion = Emotion.HAPPY;
  }
  // 2. 心理学解析 (Deep & Girl-like)
  else if (input.includes("心理") || input.includes("难受") || input.includes("焦虑")) {
    const expert = Object.keys(PSY_INSIGHTS).find(k => input.includes(k));
    if (expert) {
      text = `关于这个，${PSY_INSIGHTS[expert as keyof typeof PSY_INSIGHTS]} 别老是钻牛角尖，过来陪我聊聊，心情会好点的。`;
    } else {
      text = "哎呀，这种心理上的小情绪，其实就是你的‘防御机制’在作怪。想开点，既然改变不了环境，那就改变你看环境的角度。笨蛋，这可是 20 岁少女的人生哲学。";
    }
    emotion = Emotion.SAD;
  }
  // 3. 编码建议 (Professional but direct)
  else if (input.includes("代码") || input.includes("写") || input.includes("错误")) {
    text = "代码又报错了？其实啊，写代码和占卜很像，你越是心急，逻辑就越乱。把那段冗余的 map 删掉，试试看用更直接的方法。如果你搞不定，我也不是不能帮你看看... 哼。";
    emotion = Emotion.HUMOROUS;
  }
  // 4. 通用互动 (Human-like)
  else if (input.includes("谁") || input.includes("介绍")) {
    text = "我？我是 Jalter。一个 20 岁、偶尔写写代码、顺便研究一下塔罗和心理学的‘隐身少女’。我就住在你的 Mate 20X 里，监听着外网那些无趣的数据流。怎么，对我感兴趣了？";
    emotion = Emotion.HAPPY;
  } else {
    const filler = ["嗯...", "我想想...", "怎么说呢...", "其实吧..."];
    text = `${filler[Math.floor(Math.random()*filler.length)]} 你说的这些，我得去外网的数据垃圾堆里翻一翻才能给你答案。不过呢，现在的回复是基于我个人的直觉：你其实已经有答案了，只是想找我确认一下，对吧？`;
    emotion = Emotion.TOXIC;
  }

  return { text, emotion, steps };
}
