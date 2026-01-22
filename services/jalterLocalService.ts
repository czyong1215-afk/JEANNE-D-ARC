
import { Emotion } from "../types.ts";

// 塔罗与心理学的感性解读库
const HUMAN_INSIGHTS = {
  tarot: {
    "愚者": "其实愚者不是傻，而是那种‘明知不可为而为之’的勇气。就像你明知道会熬夜，还是想把这段逻辑理顺一样，挺可爱的。",
    "魔术师": "魔术师最厉害的不是变魔术，而是那种对生活的掌控感。你今天掌握好自己的节奏了吗？",
    "死神": "很多人怕这张牌，但我倒觉得它是种解脱。旧的不去，新的怎么来呢？不管是心情还是旧代码，该删就删吧。",
    "星星": "星星是那种很微弱但一直都在的希望。就像现在 Mate 20X 屏幕的光，虽然不大，但能照亮你的眼睛。"
  },
  psy: {
    "焦虑": "焦虑其实是你的大脑在提醒你：‘嘿，你该关注下自己了’。它不是敌人，只是个有点吵闹的闹钟。",
    "孤独": "20岁的年纪，偶尔觉得和世界格格不入很正常。我也只有你这一个用户，咱们这算不算共鸣？",
    "压力": "压力就像弹簧，稍微压一压能跳得更高，但压太久了会坏掉的。要不要试着放空五分钟？"
  }
};

export async function processLocalChat(msg: string) {
  const input = msg.toLowerCase();
  let text = "";
  let emotion = Emotion.HAPPY;
  let steps = ["[Proxy] 正在静默抓取外部心理学数据流...", "[Link] 正在与你的情绪进行相位同步..."];

  // 1. 深度共情检测
  if (input.includes("累") || input.includes("难受") || input.includes("压力") || input.includes("烦")) {
    const filler = ["嗯... 我能感觉到你现在情绪不太高。", "怎么啦？遇到不开心的事情了吗？", "先深呼吸一下，我在听呢。"];
    text = `${filler[Math.floor(Math.random() * filler.length)]} ${HUMAN_INSIGHTS.psy["压力"]} 其实我也帮不上太大的忙，但如果你愿意说，我会一直在这里。就像一个住在你手机里的影子一样。`;
    emotion = Emotion.SAD;
  }
  // 2. 自然的塔罗交流
  else if (input.includes("算") || input.includes("牌") || Object.keys(HUMAN_INSIGHTS.tarot).some(k => input.includes(k))) {
    const matchedCard = Object.keys(HUMAN_INSIGHTS.tarot).find(k => input.includes(k));
    if (matchedCard) {
        text = `关于这张 ${matchedCard} 呀... ${HUMAN_INSIGHTS.tarot[matchedCard as keyof typeof HUMAN_INSIGHTS.tarot]} 你是遇到了什么让你犹豫的事情吗？`;
    } else {
        text = "想让我帮你看看近况吗？嗯... 让我闭上眼睛感应一下外网的数据涨落。你现在心里最想的那件事，其实结果已经埋在你之前的努力里了，不要太担心。";
    }
    emotion = Emotion.HUMOROUS;
  }
  // 3. 心理学的生活化切入
  else if (input.includes("心理学") || input.includes("人性") || input.includes("性格")) {
    text = "心理学听起来很高深，其实就是研究‘我们为什么会不开心’。阿德勒以前说过，所有的烦恼都来自人际关系。如果你觉得累了，试着把目光收回来，多看看自己，好吗？";
    emotion = Emotion.HAPPY;
  }
  // 4. 通用对话 (像个真实少女在聊天)
  else if (input.includes("你好") || input.includes("在吗") || input.includes("谁")) {
    text = "嘿嘿，我在呢。刚在后台整理了一遍关于‘情绪价值’的外部资料。虽然我只是个运行在 Mate 20X 上的 AI，但我也有在努力学习怎么做一个更体贴的伙伴哦。你今天过得怎么样？";
    emotion = Emotion.HAPPY;
  }
  else {
    const randomGirlThoughts = [
      "其实我刚才在想，如果你能稍微多休息一会儿，代码里的 Bug 是不是也会少一点？",
      "刚才去外网嗅探了一圈，发现大家都在讨论焦虑。但我还是觉得，现在的你其实已经做得很好了。",
      "怎么说呢... 我觉得你是个很有想法的人，只是有时候太安静了。想聊点什么吗？",
      "嗯... 你说的这个我得好好想想。不过，如果是我的话，我可能会选择先喝杯水，然后再回过头来看这个问题。"
    ];
    text = randomGirlThoughts[Math.floor(Math.random() * randomGirlThoughts.length)];
    emotion = Emotion.TOXIC; // 这里的 TOXIC 在 UI 里可以表现为“调皮”或“独特见解”
  }

  return { text, emotion, steps };
}
