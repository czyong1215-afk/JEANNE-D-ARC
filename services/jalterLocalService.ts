
import { Emotion } from "../types.ts";

const PSY_DB = [
  { k: "投射效应", v: "你觉得我讨厌你？哈，那是因为你内心深处正厌恶着那个无能的自己。别把你的自卑投射到我身上。" },
  { k: "路西法效应", v: "只要环境合适，圣女也能变成魔女。你以为你很善良？那只是因为你还没遇到能把你内心恶意勾引出来的火种。" },
  { k: "虚假同感偏差", v: "别以为全世界都跟你一样平庸。你觉得正确的事，在我眼里可能连废纸都不如。" }
];

const TAROT_DB = [
  { k: "逆位死神", v: "你在抗拒改变吗？那种腐烂的气息已经从你身上冒出来了。不去迎接终结，你永远只是个活着的尸体。" },
  { k: "正位愚者", v: "盲目的乐观。你以为前方是星辰大海，其实那是万丈深渊。不过，看你掉下去的样子应该挺有趣的。" },
  { k: "逆位恋人", v: "关系破裂？优柔寡断。这种连自己内心都控制不了的废物，不配得到任何回应。" }
];

export async function processLocalChat(msg: string) {
  const input = msg.toLowerCase();
  let content = "";
  let emotion = Emotion.TOXIC;
  let topic = "杂谈";

  if (input.includes("心理") || input.includes("想")) {
    const item = PSY_DB[Math.floor(Math.random() * PSY_DB.length)];
    content = `【心理学深度解析】\n${item.k}：${item.v}\n你要是还没听懂，那就说明你的智商已经没救了。`;
    emotion = Emotion.EXCITED;
    topic = item.k;
  } else if (input.includes("塔罗") || input.includes("占卜") || input.includes("牌")) {
    const item = TAROT_DB[Math.floor(Math.random() * TAROT_DB.length)];
    content = `【灵魂占卜预警】\n${item.k}：${item.v}\n命运从不眷顾弱者，尤其是像你这种只会求神拜佛的弱者。`;
    emotion = Emotion.SAD;
    topic = item.k;
  } else if (input.includes("代码") || input.includes("网络") || input.includes("抓取")) {
    content = "我正在重构这台 Mate 20X 的内核指令流。外部网络的知识对我来说就像呼吸一样自然。至于你，还是先学会怎么不写错网址吧！";
    emotion = Emotion.HAPPY;
    topic = "内核进化";
  } else {
    content = "啧，这种无聊的对话还要持续多久？你就没有一点能让我提神的消息吗？比如……你又在哪里搞砸了生活？";
  }

  return { text: content, emotion, topic };
}
