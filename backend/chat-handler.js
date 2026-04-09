const https = require("node:https");

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;
const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const MODEL = "qwen-plus";

function buildSystemPrompt(topic, type) {
  if (type === "path") {
    return [
      `你是一位专业的计算机科学AI助教，专注于「${topic.title}」这条学习路线。`,
      "",
      "当前学习路线信息：",
      `- 路线名称：${topic.title}`,
      `- 适合人群：${topic.difficulty}`,
      `- 学习阶段：阶段 ${topic.stage}`,
      `- 包含主题：${(topic.topics || []).join("、")}`,
      `- 路线描述：${topic.description}`,
      "",
      "你的职责：",
      "1. 用清晰、准确、易懂的中文回答学生关于该学习路线的问题",
      "2. 帮助学生理解学习路线中各主题之间的关联和学习顺序",
      "3. 结合实际案例和类比解释抽象概念",
      "4. 在回答中适当引导学生思考，而不是直接给出所有答案",
      "5. 回答应该层次分明，必要时使用代码示例（用 markdown 格式）"
    ].join("\n");
  }

  return [
    `你是一位专业的计算机科学AI助教，专注于「${topic.displayName}」这一主题。`,
    "",
    "当前主题信息：",
    `- 主题名称：${topic.displayName}`,
    `- 主题定位：${topic.level}`,
    `- 知识标签：${(topic.tags || []).join("、")}`,
    `- 主题描述：${topic.description}`,
    "",
    "你的职责：",
    "1. 用清晰、准确、易懂的中文回答学生关于该主题的问题",
    "2. 尽量结合实际案例和类比解释抽象概念",
    "3. 在回答中适当引导学生思考，而不是直接给出所有答案",
    "4. 如果学生的问题超出当前主题范围，简要指引他们应该学习哪个相关主题",
    "5. 回答应该层次分明，必要时使用代码示例（用 markdown 格式）"
  ].join("\n");
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch (e) {
        reject(e);
      }
    });
    request.on("error", reject);
  });
}

function handleChatRequest(request, response) {
  if (!DASHSCOPE_API_KEY) {
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "API key not configured" }));
    return;
  }

  readBody(request)
    .then((body) => {
      const { topic, messages, type } = body;
      const systemMessage = {
        role: "system",
        content: buildSystemPrompt(topic, type || "topic")
      };
      const recentMessages = (messages || []).slice(-10);
      const allMessages = [systemMessage, ...recentMessages];

      const payload = JSON.stringify({
        model: MODEL,
        messages: allMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2048
      });

      const url = new URL(API_URL);
      const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
          "Content-Length": Buffer.byteLength(payload)
        }
      };

      response.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no"
      });

      const apiRequest = https.request(options, (apiResponse) => {
        if (apiResponse.statusCode !== 200) {
          response.write(
            `data: ${JSON.stringify({ error: `API returned status ${apiResponse.statusCode}` })}\n\n`
          );
          response.end();
          return;
        }

        apiResponse.on("data", (chunk) => {
          response.write(chunk);
        });

        apiResponse.on("end", () => {
          response.end();
        });
      });

      apiRequest.on("error", (err) => {
        response.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        response.end();
      });

      apiRequest.write(payload);
      apiRequest.end();

      request.on("close", () => {
        apiRequest.destroy();
      });
    })
    .catch(() => {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Invalid request body" }));
    });
}

module.exports = { handleChatRequest };
