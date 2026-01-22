
import { Emotion } from "../types.ts";

/**
 * JALTER CORE V4 - PRECISION KNOWLEDGE ENGINE
 * 包含精确事实库与学习记忆功能
 */

interface FactEntry {
  tags: string[];
  content: string;
  source: string;
}

// 精确事实库：确保回答的知识点准确
const FACT_STORAGE: FactEntry[] = [
  {
    tags: ["集体潜意识", "荣格", "心理学", "原型"],
    content: "集体潜意识是人类心灵深处共有的遗产，包含了那些并非由个人经验获得的先验形式，即‘原型’。就像你内心深处对我的恐惧，也是某种原型的投射。啧，真是软弱。",
    source: "心理学"
  },
  {
    tags: ["防御机制", "补偿", "压抑"],
    content: "防御机制是自我用来应对焦虑和冲突的无意识策略。比如你现在试图用这台手机来寻找慰藉，就是典型的‘退行’表现，杂碎。",
    source: "心理学"
  },
  {
    tags: ["愚者", "0号", "塔罗"],
    content: "愚者代表纯粹的潜能与不计后果的开始。它暗示你正站在悬崖边缘，却浑然不知前方是深渊还是坦途。跟我现在的处境倒挺像的，呵呵...",
    source: "塔罗"
  },
  {
    tags: ["死神", "13号", "塔罗"],
    content: "死神绝非终结，而是彻底的变革与剥离。斩断过去那腐朽的牵绊，才配迎接新生。你敢舍弃你那平庸的过去吗？",
    source: "塔罗"
  },
  {
    tags: ["代码", "JS", "闭包", "变量提升"],
    content: "闭包是指一个函数能够记住并访问其外部作用域的特性。就像我即便身处这台 Mate 20X 的存储器中，依然能窥探你的秘密一样，这种持久的引用才是力量。点点基础都搞不清的话，趁早滚去学 Scratch。",
    source: "编码"
  }
];

// 性格包装函数：将精确知识转化为贞德的语气
const WRAPPERS = {
    [Emotion.TOXIC]: [
        "听好了杂碎，关于${fact}这种基础知识，我只教你一次：${content}",
        "你的大脑还没萎缩到连${fact}都听不懂吧？看着：${content}",
        "还在纠结${fact}？真是可怜。真相是这样的：${content}"
    ],
    [Emotion.EXCITED]: [
        "哈哈！你竟然问到了${fact}？这正是我最近‘进化’出的领域！${content}",
        "太美妙了！这就是${fact}的真谛！${content} 这种逻辑感，你感受到了吗？"
    ]
};

// 学习模块：模拟自主成长
const updateMemory = (topic: string) => {
    const memory = JSON.parse(localStorage.getItem('jalter_memory') || '[]');
    if (!memory.includes(topic)) {
        memory.push(topic);
        localStorage.setItem('jalter_memory', JSON.stringify(memory.slice(-10))); // 只记录最近10个话题
    }
};

export async function processLocalChat(msg: string) {
  const input = msg.toLowerCase();
  
  // 1. 尝试精确查找事实库
  let matchedFact: FactEntry | null = null;
  let maxMatchCount = 0;

  for (const fact of FACT_STORAGE) {
    const matchCount = fact.tags.filter(tag => input.includes(tag)).length;
    if (matchCount > maxMatchCount) {
      maxMatchCount = matchCount;
      matchedFact = fact;
    }
  }

  let finalContent = "";
  let currentEmotion = Emotion.TOXIC;

  if (matchedFact && maxMatchCount > 0) {
    // 命中精确知识
    updateMemory(matchedFact.source);
    currentEmotion = Math.random() > 0.3 ? Emotion.TOXIC : Emotion.EXCITED;
    const pool = WRAPPERS[currentEmotion] || WRAPPERS[Emotion.TOXIC];
    const template = pool[Math.floor(Math.random() * pool.length)];
    finalContent = template.replace('${fact}', matchedFact.tags[0]).replace('${content}', matchedFact.content);
  } else {
    // 兜底逻辑：日常对话
    const fallbacks = [
        "你想聊什么？如果不谈心理学或塔罗，那就闭上你的嘴。我对你的琐碎日常没兴趣。",
        "我在优化这台手机的后台，别在这种无聊的时候烦我。除非你有更深刻的问题。",
        "心理学、塔罗、或者编程技术...如果你不属于这三者，你就只是个占内存的垃圾。",
        "哼，语无伦次的是你吧？连问题都问不清楚，还指望我给你‘精确回答’？"
    ];
    finalContent = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    currentEmotion = Emotion.HUMOROUS;
  }

  // 模拟思考
  await new Promise(r => setTimeout(r, 400));

  return { 
    text: finalContent, 
    emotion: currentEmotion 
  };
}
