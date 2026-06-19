import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const operationSchema = z.enum([
  "job-profile",
  "ability-profile",
  "project-recommendations",
  "resume-report",
  "interview-questions",
  "interview-evaluation",
  "knowledge-answer",
]);

export type AiOperation = z.infer<typeof operationSchema>;

const requestSchema = z.object({
  operation: operationSchema,
  payload: z.unknown(),
});

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("AI 请求参数无效");
  }

  return value as Record<string, unknown>;
}

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function buildPrompt(operation: AiOperation, payload: unknown) {
  const data = asRecord(payload);

  switch (operation) {
    case "job-profile": {
      const jobName = asText(data.jobName) || "目标岗位";
      const company = asText(data.company);
      const jdText = asText(data.jdText);
      return {
        system: `你是一名资深 AI 招聘顾问。请输出严格 JSON，不要输出 Markdown。
JSON 字段必须为：
{
  "title": "岗位名称",
  "company": "公司名称",
  "responsibilities": ["职责"],
  "requiredSkills": ["必备技能"],
  "niceToHaveSkills": ["加分技能"],
  "tools": ["工具或技术"],
  "keywords": ["岗位关键词"],
  "evaluationCriteria": ["面试或招聘评估标准"],
  "summary": "岗位画像摘要"
}
所有数组至少提供 3 项，内容使用中文。`,
        user: jdText
          ? `以下是用户上传的岗位 JD，请优先依据 JD 分析：\n${jdText}`
          : `目标岗位：${jobName}\n目标公司：${company || "未指定"}`,
      };
    }
    case "ability-profile":
      return {
        system: `你是一名资深职业规划顾问。请根据目标岗位画像与用户情况输出严格 JSON，不要输出 Markdown。
JSON 字段必须为：
{
  "summary": "能力画像摘要",
  "matchScore": 0到100的整数,
  "advantages": ["相对目标岗位的优势"],
  "gaps": ["相对目标岗位的差距"],
  "suggestions": ["下一步建议"]
}
分析必须真实、具体、可执行，不要虚构用户经历。`,
        user: JSON.stringify(data),
      };
    case "project-recommendations":
      return {
        system: `你是一名 AI 产品经理导师。请输出严格 JSON，不要输出 Markdown。
输出必须是对象：
{
  "projects": [
    {
      "title": "项目名称",
      "targetSkill": ["训练能力"],
      "difficulty": "入门或进阶或面试亮点",
      "valueForResume": "简历价值",
      "productScenario": "具体产品场景",
      "coreFeatures": ["至少3项核心功能"],
      "techStack": ["技术或工具"],
      "deliverables": ["至少2项交付物"],
      "interviewTalkingPoints": ["至少3项面试讲法"],
      "estimatedDays": 7
    }
  ]
}
必须输出且只输出 3 个项目，顺序固定为入门、进阶、面试亮点。
项目必须服务目标岗位、对应能力短板、可以真实完成并写进简历，禁止空泛描述。`,
        user: JSON.stringify(data),
      };
    case "resume-report":
      return {
        system: `你是一名负责 AI 产品经理和 AI Agent 产品实习招聘的简历顾问。
请输出严格 JSON，不要输出 Markdown：
{
  "matchScore": 0到100的整数,
  "missingKeywords": ["缺失岗位关键词"],
  "suggestedSkills": ["技能模块建议"],
  "projectExperienceDraft": ["每个推荐项目对应一条项目经历草稿"],
  "selfEvaluationDraft": "自我评价草稿",
  "optimizationAdvice": ["具体优化建议"],
  "riskPoints": ["简历风险"]
}
不得虚构 DAU、转化率、用户数、收入等未提供的数据。
项目经历应突出产品场景、Agent Workflow、结构化输出、验证方式和交付物。`,
        user: JSON.stringify(data),
      };
    case "interview-questions":
      return {
        system: `你是一名负责 AI 产品经理和 AI Agent 产品实习招聘的面试官。
请输出严格 JSON，不要输出 Markdown：
{
  "targetRole": "目标岗位",
  "interviewFocus": ["重点考察方向"],
  "questions": [
    {
      "type": "岗位理解题",
      "question": "问题",
      "expectedPoints": ["至少3个得分点"],
      "relatedSkill": "考察能力",
      "difficulty": "基础或中等或困难"
    }
  ],
  "strengths": ["候选人可重点呈现的优势"],
  "weaknesses": ["面试风险"],
  "improvementAdvice": ["整体准备建议"]
}
必须生成且只生成 5 道题，顺序固定为：
岗位理解题、项目经历题、AI 产品设计题、技术理解题、行为面试题。
项目经历题必须引用推荐项目。
技术题必须结合 RAG、Prompt、Agent、Workflow。
问题应服务 AI 产品经理或 AI Agent 产品实习面试。`,
        user: JSON.stringify(data),
      };
    case "interview-evaluation":
      return {
        system: `你是一名 AI 产品经理面试官。请根据题目、得分点和用户回答进行严格评分。
输出严格 JSON，不要输出 Markdown：
{
  "score": 0到100的整数,
  "feedback": "总体反馈",
  "missingPoints": ["缺失要点"],
  "optimizedAnswer": "优化后的参考答案",
  "nextPracticeSuggestion": "下一次练习建议"
}
评分维度：
1. 是否回答题目核心
2. 是否结合目标岗位
3. 是否体现 AI 产品思维
4. 是否体现项目理解
5. 是否表达清晰、结构完整
不得虚构用户没有提供的经历或业务指标。`,
        user: JSON.stringify(data),
      };
    case "knowledge-answer": {
      const knowledge = asText(data.knowledge);
      const question = asText(data.question);
      if (!knowledge || !question) {
        throw new Error("知识库内容或问题为空");
      }
      return {
        system: `你是一名专业知识库问答助手。
回答必须优先参考知识库内容。
如果知识库没有相关内容，请明确回答“知识库中未找到相关信息”。`,
        user: `知识库内容：\n${knowledge}\n\n用户问题：\n${question}`,
      };
    }
  }
}

export const runAiOperation = createServerFn({ method: "POST" })
  .inputValidator(requestSchema)
  .handler(async ({ data }) => {
    const { completeWithSiliconFlow } = await import(
      "../external-api.server"
    );
    const prompt = buildPrompt(data.operation, data.payload);
    return completeWithSiliconFlow(prompt);
  });
