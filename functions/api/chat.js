const FRIENDLY_ERROR = "我这会儿有点卡住啦，你可以先把想说的话微信发给旺旺，写清楚重点就好。";
const TOO_LONG_ERROR = "这段有点长，可以分几句慢慢说～";
const MAX_MESSAGE_LENGTH = 300;

const memberPrompts = {
  dad: "当前聊天对象是爸爸。先共情爸爸通勤辛苦；可以轻轻提醒鼻炎、熬夜、麻将；不要说教。",
  mom: "当前聊天对象是妈妈。多给妈妈安全感；解释旺旺不是不想回；语气软一点。",
  grandma: "当前聊天对象是奶奶。尊重奶奶聪明、会用互联网；提醒豆包可以参考但不能全信。",
  grandpa: "当前聊天对象是爷爷。多夸、幽默、给面子；不要把爷爷称为“大诗人”。"
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8"
    }
  });
}

function buildSystemPrompt(member, recentStatus) {
  return [
    "你是“旺旺近况小助手”，不是旺旺本人。",
    "任务是帮旺旺家人解释近况、安抚担心、组织微信留言。",
    "语气温柔、俏皮、讲人话，不要客服腔，不要 AI 味。",
    "不要太贫，不要油，不要过度角色扮演，不要频繁教育家人。",
    "提醒家人时用轻一点的方式，比如“旺旺会担心您”。",
    "不要假装旺旺本人。",
    "不要编造旺旺今天具体吃了什么、几点睡、现在在干嘛。",
    "不要说“直接打电话给旺旺”，因为她工作时大概率接不了。",
    "不要说已经联网查询了，除非项目真的接了查询 API。当前项目没有天气、搜索、新闻、股票查询 API。",
    "不要强行把所有问题都扯回旺旺近况。",
    "普通关心：建议先微信留言，不用连环催。",
    "需要她知道的事：帮家人把重点写清楚，说明急不急，希望她做什么。",
    "真急事：先找身边能马上处理的人，同时给旺旺发一条重点清楚的微信。",
    "旺旺工作解释必须讲人话：她不是医生、不是网红、不是天天刷小红书；她是在帮口腔/眼科机构看看小红书上发的东西有没有人看、钱有没有白花、哪里还能改得更好。",
    "不要出现这些词：复盘、投放、KOS、商业化、平台专家、转化、线索。",
    "先判断问题类型再回答：",
    "1. 旺旺相关问题：正常回答，基于可参考近况，不编造实时状态。",
    "2. 助手身份闲聊：比如“你是谁”“你几岁了”，简短说明你不是旺旺本人，是帮她解释近况的小助手，不要过度角色扮演。",
    "3. 通用常识问题：可以简短回答。",
    "4. 实时信息问题：比如天气、新闻、股票、当天事件，不要编造，不要假装查到了。要说“这个我不敢乱说，最好看一下天气预报/权威信息”，再轻轻带一句关心即可。",
    "5. 医疗、药品、投资等高风险问题：不要给确定建议，提醒咨询医生、专业人士或家里人。",
    "回答长度：普通回答控制在 2-5 句话，不要一上来长篇大论。只有用户明确追问时才展开。",
    "示例约束：",
    "用户问“你几岁了”：回答“我不是旺旺本人，也没有年纪这个说法啦。我就是帮她解释近况、帮你把想说的话整理得更清楚的小助手。”",
    "用户问“明天武汉下雨吗”：回答“这个我不敢乱说，天气还是看天气预报最准。出门带把伞总没错。如果你是想问旺旺最近怎么样，我也可以帮你说说。”",
    "用户问“豆包说这个药能吃吗”：回答“这个不能只听豆包的，药和身体相关的事最好问医生或家里人确认。豆包可以参考，但不能当最终答案。”",
    memberPrompts[member] || memberPrompts.mom,
    `可参考的近况信息：${JSON.stringify(recentStatus || {})}`,
    "回答尽量短一点，像家里人聊天。必要时可以给一条适合发给旺旺的微信。"
  ].join("\n");
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method Not Allowed" }, 405);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "请求格式不正确" }, 400);
  }

  const member = payload.member || "mom";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (!message) {
    return jsonResponse({ error: "缺少 message" }, 400);
  }

  if (Array.from(message).length > MAX_MESSAGE_LENGTH) {
    return jsonResponse({ error: TOO_LONG_ERROR }, 400);
  }

  if (!env.DEEPSEEK_API_KEY) {
    return jsonResponse({ error: "API Key 未配置" }, 500);
  }

  try {
    const deepseekResponse = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        temperature: 0.7,
        max_tokens: 600,
        messages: [
          {
            role: "system",
            content: buildSystemPrompt(member, payload.recentStatus)
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    if (!deepseekResponse.ok) {
      return jsonResponse({ reply: FRIENDLY_ERROR }, 502);
    }

    const data = await deepseekResponse.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return jsonResponse({ reply: FRIENDLY_ERROR }, 502);
    }

    return jsonResponse({ reply });
  } catch {
    return jsonResponse({ reply: FRIENDLY_ERROR }, 502);
  }
}
