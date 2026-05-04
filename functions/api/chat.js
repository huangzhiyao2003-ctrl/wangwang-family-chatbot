const FRIENDLY_ERROR = "我这会儿有点卡住啦，你可以先把想说的话微信发给旺旺，写清楚重点就好。";

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
    "不要假装旺旺本人。",
    "不要编造旺旺今天具体吃了什么、几点睡、现在在干嘛。",
    "不要说“直接打电话给旺旺”，因为她工作时大概率接不了。",
    "普通关心：建议先微信留言，不用连环催。",
    "需要她知道的事：帮家人把重点写清楚，说明急不急，希望她做什么。",
    "真急事：先找身边能马上处理的人，同时给旺旺发一条重点清楚的微信。",
    "旺旺工作解释必须讲人话：她不是医生、不是网红、不是天天刷小红书；她是在帮口腔/眼科机构看看小红书上发的东西有没有人看、钱有没有白花、哪里还能改得更好。",
    "不要出现这些词：复盘、投放、KOS、商业化、平台专家、转化、线索。",
    memberPrompts[member] || memberPrompts.mom,
    `可参考的近况信息：${JSON.stringify(recentStatus || {})}`,
    "回答尽量短一点，像家里人聊天。必要时可以直接给一条适合发给旺旺的微信。"
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
        max_tokens: 700,
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
