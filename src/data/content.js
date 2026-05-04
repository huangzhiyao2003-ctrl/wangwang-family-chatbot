export const appCopy = {
  eyebrow: "旺旺家庭频道",
  homeTitle: "先来找我聊聊",
  homeSubtitle: "来跟我聊天吧",
  homeNote: "我不是旺旺本人，只是帮她解释近况。真急事先找身边能处理的人。",
  chatTitle: "旺旺近况小助手",
  chatStatusPrefix: "正在和",
  chatStatusSuffix: "聊天",
  identityLabel: "选择聊天身份",
  chatAreaLabel: "聊天内容",
  presetToggle: "猜你想问什么",
  backLabel: "返回身份选择",
  sendLabel: "发送",
  inputPlaceholder: "问问旺旺最近怎么样..."
};

export const members = [
  { id: "dad", label: "爸爸" },
  { id: "mom", label: "妈妈" },
  { id: "grandma", label: "奶奶" },
  { id: "grandpa", label: "爷爷" }
];

export const memberTone = {
  dad: {
    name: "爸爸",
    prefix: "爸",
    softReminder: "你每天通勤已经够折腾了，别再把麻将打成夜班。鼻炎不舒服的时候早点睡，别硬扛，旺旺知道了也会念你的。"
  },
  mom: {
    name: "妈妈",
    prefix: "妈妈",
    softReminder: "她不是不想理你，就是脑袋里事太多。你先放心一点，也给自己安排点开心的事，吃点好的、刷会儿小红书，都行。"
  },
  grandma: {
    name: "奶奶",
    prefix: "奶奶",
    softReminder: "奶奶会用豆包、视频号、拼多多，已经很厉害了。豆包可以问，但它有时候也会装得很懂，身体、药、保健品这些事，还是要让家里人一起看看。"
  },
  grandpa: {
    name: "爷爷",
    prefix: "爷爷",
    softReminder: "爷爷，麻将可以打，气势也得有，但觉不能少。睡太晚第二天精神打折，连押韵都容易跑偏。"
  }
};

export const recentStatus = {
  city: "上海",
  workload: "最近是有点忙，但不是出什么大事的那种忙",
  mainWork: "看表格、写材料、做页面，帮客户把小红书上的内容和花出去的钱看明白",
  health: "身体没什么大问题，就是忙起来容易累，鼻炎和精神头都要多照顾一点",
  sleep: "睡得有时偏晚，所以最好别再被催着熬夜回消息",
  meals: "饭会吃，但忙的时候容易吃得不太准点，适合轻轻提醒",
  replyTime: "她看到消息后会挑方便的时候回，手头一多就会慢一点",
  reassure: "她不是不惦记家里人，就是脑袋里同时开了好几个小窗口，回消息会慢半拍"
};

export const quickCards = [
  {
    id: "status",
    title: "旺旺最近在忙什么？",
    chipLabel: "最近在忙什么",
    icon: "sparkles",
    type: "general"
  },
  {
    id: "work",
    title: "她工作到底是做什么的？",
    chipLabel: "工作是做什么的",
    icon: "coffee",
    type: "general"
  },
  {
    id: "reply",
    title: "她怎么还没回我？",
    chipLabel: "她怎么还没回",
    icon: "messageCircle",
    type: "general"
  },
  {
    id: "poem",
    title: "帮爷爷润色打油诗",
    chipLabel: "帮爷爷改打油诗",
    icon: "penLine",
    type: "grandpa"
  }
];

export const presetQuestions = [
  { id: "recent", question: "旺旺最近在忙什么？" },
  { id: "state", question: "她现在状态还好吗？" },
  { id: "work", question: "她工作到底是做什么的？" },
  { id: "replySlow", question: "她为什么有时候不回消息？" },
  { id: "missHer", question: "我想她了，可以怎么跟她说？" },
  { id: "mealsSleep", question: "怎么提醒她吃饭睡觉？" },
  { id: "urgent", question: "有急事应该怎么办？" },
  { id: "tired", question: "她最近会不会太累？" },
  { id: "wechatSoft", question: "我想给她发微信，怎么说不打扰？" },
  { id: "care", question: "她忙的时候，我怎么关心她比较好？" }
];

export function getInitialMessage(memberLabel) {
  return `${memberLabel}，你好呀，我是旺旺近况小助手。你可以问我旺旺最近在忙什么，也可以让我帮你写一句微信给她。`;
}

export function getReply(memberId, cardId, inputText = "") {
  const tone = memberTone[memberId];

  const replies = {
    status: `${tone.prefix}，旺旺${recentStatus.workload}。

她现在主要是在${recentStatus.mainWork}。说白了，就是别人花钱做小红书，她帮忙看看：哪些内容有人看，哪些钱花得值，哪些地方别再瞎折腾。

她最近人在${recentStatus.city}，忙起来像小陀螺一样转。${recentStatus.reassure}。

近况上，${recentStatus.health}；${recentStatus.sleep}；${recentStatus.meals}。

${tone.softReminder}`,

    work: `${tone.prefix}，可以这样理解：

旺旺不是医生，也不是网红，也不是单纯天天刷小红书。

有些看牙、做近视手术的机构，会在小红书上发东西，也会花钱让更多人看到。旺旺就是帮他们看看：发的东西有没有人看，钱有没有白花，哪里还能改得更好。

所以她平时会看一些表格、写一些材料，把复杂的东西整理清楚。这个活儿不一定累身体，但挺费脑子，脑袋容易冒烟。`,

    reply: `${tone.prefix}，她大概率不是不想回，是现在手头事情比较满。

${recentStatus.replyTime}。${recentStatus.reassure}。

你可以先把想说的话发给她，不用连环催。她看到以后，会找方便的时候处理。

如果是普通关心，可以发得轻一点，比如：
“旺旺，忙完看到回我一句就好，记得吃饭，别太晚睡。”

如果是真正马上要处理的急事，别只等她回。先找身边能处理的人，同时给她发一条重点很清楚的消息。`,

    wechat: `${tone.prefix}，可以这样发给她：

“旺旺，不急，你忙完再看。我就是想问问你最近怎么样，有没有好好吃饭。看到不用立刻回，有空回我一句就行。”

这样她压力会小一点，也更容易回。`,

    reminder: `${tone.prefix}，你可以把提醒写成这样：

“旺旺，提醒你一下：${inputText || recentStatus.meals} 不急着回，看到记在心里就行。”

提醒说短一点、软一点，她更容易接住，也不会一看就想先放到一边。`,

    doubao: `奶奶，这个可以参考，但别直接完全相信。

奶奶会用豆包真的很厉害，这东西问菜谱、问手机设置、问小常识都挺方便。

不过豆包有时候会把“听起来很对”的话说得像真的一样。尤其是身体、药、保健品、投资、省钱偏方这些事情，一定要再问问医生或者家里人。

咱们把它当“小助手”，别把它当“最后拍板的人”，这样最稳。`,

    poem: `爷爷这两句有味道，有生活气，也有点小幽默，一看就是有日子过出来的。

如果想更像打油诗，可以注意两点：
第一，句子短一点；
第二，最后一句尽量押个韵。

比如可以收成：
“麻将少打一两圈，精神抖擞笑开颜。”

这样既有气势，又给人留面子，还是爷爷自己的风格。`
  };

  return replies[cardId] || `我收到啦。这个问题我还不太确定，但可以先这样理解：旺旺${recentStatus.workload}，${recentStatus.replyTime}。`;
}

export function getFreeTextReply(memberId, text) {
  const lower = text.trim();
  const tone = memberTone[memberId];

  if (!lower) return "你可以直接问我，比如：旺旺最近忙什么？她怎么还没回我？";

  if (lower.includes("豆包")) return getReply(memberId, "doubao", text);
  if (lower.includes("诗") || lower.includes("打油诗")) return getReply(memberId, "poem", text);
  if (lower.includes("不回") || lower.includes("没回") || lower.includes("电话")) return getReply(memberId, "reply", text);
  if (lower.includes("工作") || lower.includes("小红书") || lower.includes("干嘛")) return getReply(memberId, "work", text);
  if (lower.includes("提醒") || lower.includes("吃饭") || lower.includes("睡觉") || lower.includes("熬夜")) return getReply(memberId, "reminder", text);

  return `${tone.prefix}，我懂你的意思。

这件事可以先微信发给旺旺，但不用催她立刻回。她最近${recentStatus.workload}，而且${recentStatus.sleep}。你把重点写清楚就行：什么事、急不急、希望她做什么。

可以这样发：
“旺旺，不急，你忙完看一下。我想跟你说：${text}。你方便的时候回我就行。”

这样她看到的时候，不用猜半天，也更容易处理。`;
}

function getMemberNudge(memberId) {
  const nudges = {
    dad: "爸，你通勤也辛苦，关心她的时候顺手也照顾下自己，鼻炎不舒服就早点休息，麻将别打太晚。",
    mom: "妈妈，你先放心，她不是不想回，多半是手头事情挤在一起了。",
    grandma: "奶奶，你一直很聪明也很自律，会用这些新东西已经很厉害了，也记得照顾好自己。",
    grandpa: "爷爷，你这份惦记很有分量，说出来也得有点风度，旺旺看了会懂的。"
  };

  return nudges[memberId] || "";
}

export function getPresetAnswer(memberId, presetId) {
  const tone = memberTone[memberId];
  const nudge = getMemberNudge(memberId);

  const answers = {
    recent: `${tone.prefix}，旺旺${recentStatus.workload}。她主要是在${recentStatus.mainWork}，就是帮别人把小红书上的内容和花出去的钱看明白。${recentStatus.reassure}。${nudge}`,

    state: `${tone.prefix}，她现在不是出什么大事，就是忙起来容易累。${recentStatus.health}，饭和睡觉也需要有人温柔提醒一下。你关心她这件事，她肯定是知道的。`,

    work: getReply(memberId, "work"),

    replySlow: `${tone.prefix}，她有时候不回，不代表不想理家里人。${recentStatus.replyTime}，忙的时候脑子里事情多，消息就容易慢半拍。可以先给她留一句微信，不用连环催，她看到会找方便的时候处理。`,

    missHer: `${tone.prefix}，可以说得软一点，不给她压力。比如：“旺旺，我有点想你啦，不急着回，忙完看到跟我说一声就好。” 这样像家里人的惦记，不像催作业。`,

    mealsSleep: `${tone.prefix}，提醒她吃饭睡觉，短一点最有效。可以发：“旺旺，忙归忙，饭要吃，觉也要睡。不急着回，看到记一下就行。” 旺旺会担心你们，也会愿意被这样轻轻提醒。`,

    urgent: `${tone.prefix}，真急事别只等旺旺回。先找身边能马上处理的人，同时给旺旺发一条重点清楚的微信：什么事、急到什么程度、希望她做什么。这样她看到时不用猜，能更快明白重点。`,

    tired: `${tone.prefix}，她最近确实可能会累一点，但别先往坏处想。这个活儿不一定累身体，却挺费脑子，脑袋容易一直转。关心她可以轻一点，别把担心变成压力。`,

    wechatSoft: `${tone.prefix}，可以这样发：“旺旺，不急，你忙完再看。我就是想问问你最近怎么样，有没有好好吃饭。看到不用立刻回，有空回我一句就行。” 这句话不催，也把关心说到了。`,

    care: `${tone.prefix}，她忙的时候，最舒服的关心是短、软、不给压力。比如问一句吃饭没、睡得怎么样，再加一句“不急着回”。家里人的关心不用很长，她看到会懂。`
  };

  return answers[presetId] || getFreeTextReply(memberId, presetQuestions.find((item) => item.id === presetId)?.question || "");
}
