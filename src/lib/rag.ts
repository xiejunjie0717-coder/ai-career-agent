import OpenAI from "openai";

const client = new OpenAI({
apiKey: import.meta.env.VITE_SILICONFLOW_API_KEY,
baseURL: "https://api.siliconflow.cn/v1",
dangerouslyAllowBrowser: true,
});

export async function askKnowledge(
  question: string
) {
  const knowledge =
    localStorage.getItem(
      "knowledge_base"
    ) || "";

  if (!knowledge) {
    return "知识库为空，请先上传PDF文件。";
  }

  const response =
    await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3",

      messages: [
        {
          role: "system",
          content: `
你是一名专业知识库问答助手。

你的回答必须优先参考知识库内容。

如果知识库没有相关内容，
请明确告诉用户：
"知识库中未找到相关信息"。
`,
        },

        {
          role: "user",
          content: `
知识库内容：

${knowledge}

用户问题：

${question}
`,
        },
      ],

      temperature: 0.3,
    });

  return (
    response.choices[0].message.content ||
    "暂无回答"
  );
}