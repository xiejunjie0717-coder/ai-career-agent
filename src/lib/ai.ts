import OpenAI from "openai";

console.log(
  "API KEY:",
  import.meta.env.VITE_SILICONFLOW_API_KEY
);

const client = new OpenAI({
  apiKey: import.meta.env.VITE_SILICONFLOW_API_KEY,
  baseURL: "https://api.siliconflow.cn/v1",
  dangerouslyAllowBrowser: true,
});

// ========================
// 岗位分析
// ========================

export async function analyzeJob(jobName: string) {
  try {
    console.log("开始岗位分析：", jobName);

    const response = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3",

      messages: [
        {
          role: "system",
          content: `
你是一名资深AI职业规划顾问。

请输出：

1. 岗位职责
2. 核心技能
3. 学习路线
4. 推荐项目

内容简洁清晰。
          `,
        },
        {
          role: "user",
          content: `请分析岗位：${jobName}`,
        },
      ],

      temperature: 0.7,
    });

    console.log("岗位分析成功");

    return response.choices[0].message.content || "";
  } catch (err) {
    console.error("岗位分析失败：", err);

    return "岗位分析失败，请检查API配置";
  }
}

// ========================
// 能力评估
// ========================

export async function analyzeAbility(data: {
  targetJob: string;
  education: string;
  experience: string;
  skills: string[];
  strengths: string;
  weaknesses: string;
}){
  try {
    console.log("开始能力评估");
    console.log(data);

    const response = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3",

      messages: [
        {
          role: "system",
content: `
你是一位资深职业规划顾问。

请根据用户信息输出：

# 能力匹配度分析

1. 综合匹配度评价

2. 当前优势

3. 当前短板

4. 与目标岗位差距

5. 学习路线建议

6. 推荐项目

7. 预计达到岗位要求所需时间

要求：

- 用中文
- 真实客观
- 分点输出
- 不要使用表格
- 输出要详细
`,
        },
        {
          role: "user",
          content: JSON.stringify(data),
        },
      ],

      temperature: 0.7,
    });

    console.log("能力评估成功");

    return response.choices[0].message.content || "";
  } catch (err) {
    console.error("能力评估失败：", err);

    return "AI调用失败，请查看控制台日志";
  }
}