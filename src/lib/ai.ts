import type {
  AbilityProfile,
  GapReport,
  InterviewQuestion,
  InterviewQuestionType,
  InterviewReport,
  JobProfile,
  ProjectRecommendation,
  ResumeReport,
  Roadmap,
} from "./agent-store.ts";
import {
  runAiOperation,
  type AiOperation,
} from "./api/ai.functions.ts";

type AbilityInput = {
  targetJob: string;
  education: string;
  experience: string;
  skills: string[];
  strengths: string;
  weaknesses: string;
  jobProfile?: JobProfile | null;
};

type ProjectRecommendationInput = {
  targetJob: string;
  jobProfile: JobProfile;
  abilityProfile: AbilityProfile;
  gapReport: GapReport;
  roadmap: Roadmap | null;
};

type ResumeReportInput = {
  targetJob: string;
  jobProfile: JobProfile;
  abilityProfile: AbilityProfile;
  gapReport: GapReport;
  projects: ProjectRecommendation[];
};

type InterviewReportInput = ResumeReportInput & {
  resumeReport: ResumeReport;
};

type InterviewEvaluationInput = {
  question: InterviewQuestion;
  userAnswer: string;
  targetJob: string;
  jobProfile: JobProfile;
  projects: ProjectRecommendation[];
  resumeReport: ResumeReport;
};

export type InterviewAnswerEvaluation = {
  score: number;
  feedback: string;
  missingPoints: string[];
  optimizedAnswer: string;
  nextPracticeSuggestion: string;
};

async function completeJson(operation: AiOperation, payload: unknown) {
  return runAiOperation({
    data: {
      operation,
      payload,
    },
  });
}

function parseJson<T>(content: string): T {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced?.[1] ?? content;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");

  if (start < 0 || end < start) {
    throw new Error("AI 未返回有效 JSON");
  }

  return JSON.parse(source.slice(start, end + 1)) as T;
}

function strings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function score(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(100, Math.max(0, Math.round(number)));
}

function normalizeJobProfile(value: Partial<JobProfile>, title: string, company: string): JobProfile {
  return {
    title: value.title?.trim() || title,
    company: value.company?.trim() || company,
    responsibilities: strings(value.responsibilities),
    requiredSkills: strings(value.requiredSkills),
    niceToHaveSkills: strings(value.niceToHaveSkills),
    tools: strings(value.tools),
    keywords: strings(value.keywords),
    evaluationCriteria: strings(value.evaluationCriteria),
    summary: value.summary?.trim() || `${title}岗位画像`,
  };
}

function normalizeAbilityProfile(
  value: Partial<AbilityProfile>,
  input: AbilityInput,
): AbilityProfile {
  return {
    education: input.education,
    experience: input.experience,
    skills: input.skills,
    strengths: input.strengths,
    weaknesses: input.weaknesses,
    summary: value.summary?.trim() || "已完成能力画像分析。",
    matchScore: score(value.matchScore),
    advantages: strings(value.advantages),
    gaps: strings(value.gaps),
    suggestions: strings(value.suggestions),
  };
}

export async function analyzeJobProfile(input: {
  jobName: string;
  company?: string;
  jdText?: string;
}) {
  const title = input.jobName.trim() || "目标岗位";
  const company = input.company?.trim() || "";
  const content = await completeJson("job-profile", input);

  const profile = normalizeJobProfile(
    parseJson<Partial<JobProfile>>(content),
    title,
    company,
  );

  return { profile, text: profile.summary };
}

export async function analyzeAbilityProfile(input: AbilityInput) {
  const content = await completeJson("ability-profile", input);

  const profile = normalizeAbilityProfile(
    parseJson<Partial<AbilityProfile>>(content),
    input,
  );

  return { profile, text: profile.summary };
}

export function generateGapReport(
  jobProfile: JobProfile,
  abilityProfile: AbilityProfile,
): GapReport {
  const userSkills = new Map(
    abilityProfile.skills.map((item) => [item.trim().toLowerCase(), item]),
  );
  const requiredSkills = jobProfile.requiredSkills.filter(Boolean);
  const matchedSkills = requiredSkills.filter((item) =>
    userSkills.has(item.trim().toLowerCase()),
  );
  const missingSkills = requiredSkills.filter(
    (item) => !userSkills.has(item.trim().toLowerCase()),
  );
  const coverageScore = requiredSkills.length
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : abilityProfile.matchScore;
  const matchScore = Math.round(coverageScore * 0.6 + abilityProfile.matchScore * 0.4);
  const priorityGaps = Array.from(
    new Set([...missingSkills, ...abilityProfile.gaps]),
  ).slice(0, 5);
  const riskPoints = [
    ...priorityGaps.slice(0, 3).map((item) => `岗位关键要求“${item}”证据不足`),
    ...(abilityProfile.weaknesses
      ? [`用户自述短板：${abilityProfile.weaknesses}`]
      : []),
  ];
  const nextActions = priorityGaps.slice(0, 4).map(
    (item, index) =>
      `${index + 1}. 围绕“${item}”完成学习、练习和可展示产出`,
  );

  return {
    matchScore: Math.min(100, Math.max(0, matchScore)),
    matchedSkills,
    missingSkills,
    riskPoints,
    priorityGaps,
    nextActions:
      nextActions.length > 0
        ? nextActions
        : ["整理已有项目证据，并根据目标岗位准备结构化面试案例"],
  };
}

export function generateRoadmap(
  gapReport: GapReport,
  jobProfile: JobProfile,
): Roadmap {
  const priorities =
    gapReport.priorityGaps.length > 0
      ? gapReport.priorityGaps
      : jobProfile.requiredSkills.slice(0, 3);
  const first = priorities[0] || "岗位核心能力";
  const second = priorities[1] || "项目实践";
  const third = priorities[2] || "面试表达";

  return {
    title: `90 天 ${jobProfile.title} 成长路线`,
    goal30Days: `优先补齐 ${first} 与 ${second}，形成至少一个可验证的学习或项目产出。`,
    phases: [
      {
        days: 30,
        title: "关键能力补齐",
        weeklyGoals: priorities.slice(0, 3).map((item) => `完成 ${item} 的专项学习与练习`),
        dailyTasks: [
          `每天投入 30 分钟学习 ${first}`,
          `每天完成一次 ${second} 相关练习并记录复盘`,
        ],
        recommendedProjects: [`制作一个能证明 ${first} 与 ${second} 的最小项目案例`],
        recommendedResources: jobProfile.tools.slice(0, 3),
        acceptanceCriteria: [
          `能用自己的语言解释 ${first}`,
          `产出一份 ${second} 相关文档或 Demo`,
        ],
      },
      {
        days: 60,
        title: "项目实战强化",
        weeklyGoals: [
          `围绕 ${second} 完成项目迭代`,
          "每周进行一次目标岗位 JD 对照复盘",
        ],
        dailyTasks: ["记录项目决策、数据和结果", "持续补充岗位关键词与工具实践"],
        recommendedProjects: [`完成一个面向 ${jobProfile.title} 的端到端项目`],
        recommendedResources: jobProfile.keywords.slice(0, 3),
        acceptanceCriteria: ["形成可演示 Demo", "形成可写入简历的量化项目描述"],
      },
      {
        days: 90,
        title: "求职与面试冲刺",
        weeklyGoals: [`围绕 ${third} 进行模拟面试`, "定向投递并复盘岗位反馈"],
        dailyTasks: ["练习一个 STAR 项目回答", "根据目标 JD 调整简历关键词"],
        recommendedProjects: ["整理完整作品集案例和项目讲解材料"],
        recommendedResources: jobProfile.evaluationCriteria.slice(0, 3),
        acceptanceCriteria: ["完成一版岗位定制简历", "能够在 5 分钟内完整讲清核心项目"],
      },
    ],
  };
}

export function buildFallbackProjectRecommendations(
  input: ProjectRecommendationInput,
): ProjectRecommendation[] {
  const priorities =
    input.gapReport.priorityGaps.length > 0
      ? input.gapReport.priorityGaps
      : input.jobProfile.requiredSkills;
  const first = priorities[0] || "Prompt";
  const second = priorities[1] || "Agent";
  const third = priorities[2] || "数据分析";
  const tools = Array.from(
    new Set([...input.jobProfile.tools, ...input.jobProfile.keywords]),
  );

  return [
    {
      title: `${input.targetJob || input.jobProfile.title} JD 智能分析器`,
      targetSkill: [first, "岗位分析", "结构化输出"],
      difficulty: "入门",
      valueForResume:
        "证明你能把岗位需求转化为结构化产品信息，并完成一个可演示的 LLM 功能闭环。",
      productScenario:
        "帮助求职者上传 JD 后快速提取职责、技能、关键词和面试评估标准。",
      coreFeatures: [
        "JD 文本输入与 PDF 解析",
        "岗位职责和技能结构化提取",
        "关键词与面试重点展示",
      ],
      techStack: Array.from(new Set(["React", "TypeScript", "LLM", ...tools.slice(0, 2)])),
      deliverables: ["可运行 Demo", "产品流程图", "结构化岗位分析报告"],
      interviewTalkingPoints: [
        `为什么优先训练 ${first}`,
        "如何约束 LLM 输出为可消费 JSON",
        "如何处理解析失败和空数据",
      ],
      estimatedDays: 7,
    },
    {
      title: `基于 ${second} 的职业差距诊断 Agent`,
      targetSkill: [second, third, "Agent Workflow"],
      difficulty: "进阶",
      valueForResume:
        "展示从用户画像、岗位画像到 Gap 和 Roadmap 的完整 AI 产品工作流设计能力。",
      productScenario:
        "根据目标岗位和用户能力，生成差距报告、优先级和 30/60/90 天行动路线。",
      coreFeatures: [
        "岗位画像与能力画像对比",
        "差距优先级与风险点生成",
        "个性化 Roadmap 与验收标准",
      ],
      techStack: Array.from(
        new Set(["React", "TypeScript", "TanStack Router", "DeepSeek", ...tools.slice(0, 2)]),
      ),
      deliverables: ["端到端工作流 Demo", "Prompt 设计说明", "用户测试与迭代记录"],
      interviewTalkingPoints: [
        "如何定义 Agent 每一步的输入输出",
        `如何将 ${second} 差距转化为可执行任务`,
        "如何平衡 AI 生成与规则 fallback",
      ],
      estimatedDays: 14,
    },
    {
      title: `${input.jobProfile.title} 面试与简历 Copilot`,
      targetSkill: [first, second, third, "产品闭环"],
      difficulty: "面试亮点",
      valueForResume:
        "把岗位分析、项目推荐、简历包装和面试表达连接起来，形成可讲清产品价值的完整作品集。",
      productScenario:
        "帮助目标岗位求职者根据真实 JD 生成项目经历草稿、简历建议和结构化面试讲法。",
      coreFeatures: [
        "岗位关键词与简历缺口分析",
        "项目经历和自我评价草稿生成",
        "基于项目的面试问题与回答框架",
      ],
      techStack: Array.from(
        new Set(["React", "TypeScript", "LLM", "RAG", "Tavily", ...tools.slice(0, 2)]),
      ),
      deliverables: ["完整产品 Demo", "作品集 Case Study", "简历项目描述与面试讲稿"],
      interviewTalkingPoints: [
        "如何从用户痛点定义完整求职链路",
        "如何避免 AI 虚构项目指标",
        "如何设计可验证的产品成功标准",
      ],
      estimatedDays: 21,
    },
  ];
}

function normalizeProjectRecommendations(
  value: unknown,
  fallback: ProjectRecommendation[],
) {
  if (!Array.isArray(value) || value.length !== 3) return fallback;

  const difficulties: ProjectRecommendation["difficulty"][] = [
    "入门",
    "进阶",
    "面试亮点",
  ];

  return value.map((item, index) => {
    const project =
      item && typeof item === "object"
        ? (item as Partial<ProjectRecommendation>)
        : {};
    const base = fallback[index];

    return {
      title: project.title?.trim() || base.title,
      targetSkill: strings(project.targetSkill).length
        ? strings(project.targetSkill)
        : base.targetSkill,
      difficulty: difficulties[index],
      valueForResume: project.valueForResume?.trim() || base.valueForResume,
      productScenario: project.productScenario?.trim() || base.productScenario,
      coreFeatures: strings(project.coreFeatures).length
        ? strings(project.coreFeatures)
        : base.coreFeatures,
      techStack: strings(project.techStack).length
        ? strings(project.techStack)
        : base.techStack,
      deliverables: strings(project.deliverables).length
        ? strings(project.deliverables)
        : base.deliverables,
      interviewTalkingPoints: strings(project.interviewTalkingPoints).length
        ? strings(project.interviewTalkingPoints)
        : base.interviewTalkingPoints,
      estimatedDays: Math.max(
        3,
        Math.round(Number(project.estimatedDays) || base.estimatedDays),
      ),
    };
  });
}

export async function generateProjectRecommendations(
  input: ProjectRecommendationInput,
): Promise<ProjectRecommendation[]> {
  const fallback = buildFallbackProjectRecommendations(input);

  try {
    const content = await completeJson("project-recommendations", input);
    const parsed = parseJson<{ projects?: unknown }>(content);
    return normalizeProjectRecommendations(parsed.projects, fallback);
  } catch {
    return fallback;
  }
}

export function buildFallbackResumeReport(
  input: ResumeReportInput,
): ResumeReport {
  const knownSkills = new Set(
    input.abilityProfile.skills.map((item) => item.trim().toLowerCase()),
  );
  const keywords = Array.from(
    new Set([
      ...input.jobProfile.requiredSkills,
      ...input.jobProfile.niceToHaveSkills,
      ...input.jobProfile.keywords,
      ...input.jobProfile.tools,
    ]),
  );
  const missingKeywords = keywords
    .filter((item) => !knownSkills.has(item.trim().toLowerCase()))
    .slice(0, 10);
  const projectExperienceDraft = input.projects.map(
    (project) =>
      `【${project.title}】面向${project.productScenario}，围绕${project.targetSkill.join("、")}设计并实现${project.coreFeatures.join("、")}；完成${project.deliverables.join("、")}，形成可演示、可复盘的 AI 产品实践。`,
  );
  const matchScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        input.gapReport.matchScore * 0.7 +
          Math.min(30, input.projects.length * 10),
      ),
    ),
  );

  return {
    matchScore,
    missingKeywords,
    suggestedSkills: Array.from(
      new Set([...input.gapReport.priorityGaps, ...missingKeywords]),
    ).slice(0, 8),
    projectExperienceDraft,
    selfEvaluationDraft: `目标岗位为${input.targetJob || input.jobProfile.title}，具备${input.abilityProfile.skills.join("、") || "产品分析"}基础，能够从用户痛点出发设计 AI 产品方案，并通过结构化 Prompt、Agent Workflow 和项目验证推动方案落地。持续补齐${input.gapReport.priorityGaps.slice(0, 3).join("、") || "岗位核心能力"}，重视产品价值、数据反馈与迭代复盘。`,
    optimizationAdvice: [
      "将技能按产品、AI、数据和工具分类，优先展示岗位高频关键词。",
      "项目经历使用“场景—问题—方案—产出—复盘”结构，避免只罗列功能。",
      "没有真实业务指标时不要虚构数据，改用完成度、验证方式和用户反馈描述成果。",
      "把最贴近目标岗位的项目放在项目经历首位，并准备 3 分钟面试讲解。",
    ],
    riskPoints: Array.from(
      new Set([
        ...input.gapReport.riskPoints,
        ...(input.projects.length
          ? []
          : ["缺少能够证明 AI 产品能力的项目经历"]),
      ]),
    ).slice(0, 6),
  };
}

function normalizeResumeReport(
  value: Partial<ResumeReport>,
  fallback: ResumeReport,
): ResumeReport {
  return {
    matchScore: score(value.matchScore) || fallback.matchScore,
    missingKeywords: strings(value.missingKeywords).length
      ? strings(value.missingKeywords)
      : fallback.missingKeywords,
    suggestedSkills: strings(value.suggestedSkills).length
      ? strings(value.suggestedSkills)
      : fallback.suggestedSkills,
    projectExperienceDraft: strings(value.projectExperienceDraft).length
      ? strings(value.projectExperienceDraft)
      : fallback.projectExperienceDraft,
    selfEvaluationDraft:
      value.selfEvaluationDraft?.trim() || fallback.selfEvaluationDraft,
    optimizationAdvice: strings(value.optimizationAdvice).length
      ? strings(value.optimizationAdvice)
      : fallback.optimizationAdvice,
    riskPoints: strings(value.riskPoints).length
      ? strings(value.riskPoints)
      : fallback.riskPoints,
  };
}

export async function generateResumeReport(
  input: ResumeReportInput,
): Promise<ResumeReport> {
  const fallback = buildFallbackResumeReport(input);

  try {
    const content = await completeJson("resume-report", input);

    return normalizeResumeReport(
      parseJson<Partial<ResumeReport>>(content),
      fallback,
    );
  } catch {
    return fallback;
  }
}

const INTERVIEW_TYPES: InterviewQuestionType[] = [
  "岗位理解题",
  "项目经历题",
  "AI 产品设计题",
  "技术理解题",
  "行为面试题",
];

function createInterviewQuestion(
  id: string,
  type: InterviewQuestionType,
  question: string,
  expectedPoints: string[],
  relatedSkill: string,
  difficulty: InterviewQuestion["difficulty"],
): InterviewQuestion {
  return {
    id,
    type,
    question,
    expectedPoints,
    relatedSkill,
    difficulty,
    userAnswer: "",
    score: null,
    feedback: "",
    missingPoints: [],
    optimizedAnswer: "",
    nextPracticeSuggestion: "",
  };
}

export function buildFallbackInterviewReport(
  input: InterviewReportInput,
): InterviewReport {
  const primaryProject = input.projects[0];
  const primaryGap =
    input.gapReport.priorityGaps[0] ||
    input.jobProfile.requiredSkills[0] ||
    "AI 产品落地";
  const targetRole = input.targetJob || input.jobProfile.title;
  const projectName = primaryProject?.title || "AI Career Agent";

  const questions: InterviewQuestion[] = [
    createInterviewQuestion(
      "role-understanding",
      "岗位理解题",
      `你如何理解${targetRole}的核心职责？如果入职，前三个月你会优先解决什么问题？`,
      [
        "说明目标岗位的核心职责和业务价值",
        "结合公司或产品场景识别优先问题",
        "给出可执行的前三个月计划和验证指标",
      ],
      input.jobProfile.evaluationCriteria[0] || "岗位理解与产品判断",
      "中等",
    ),
    createInterviewQuestion(
      "project-experience",
      "项目经历题",
      `请介绍“${projectName}”项目。你解决了什么用户问题，如何设计方案，又如何验证项目价值？`,
      [
        "说明用户、场景和核心痛点",
        "讲清本人负责的产品决策和 Agent Workflow",
        "说明交付物、验证方式、复盘和下一步迭代",
      ],
      primaryProject?.targetSkill.join(" / ") || "项目落地",
      "中等",
    ),
    createInterviewQuestion(
      "ai-product-design",
      "AI 产品设计题",
      `请为${targetRole}的目标用户设计一个 AI Agent 功能。你会如何定义用户价值、工作流、工具调用和异常兜底？`,
      [
        "明确目标用户、场景和高频痛点",
        "拆解 Agent 的输入、步骤、工具和结构化输出",
        "说明人工确认、失败兜底、效果评估和迭代机制",
      ],
      "AI 产品设计与 Agent Workflow",
      "困难",
    ),
    createInterviewQuestion(
      "technical-understanding",
      "技术理解题",
      "请解释 Prompt、RAG、Agent 和 Workflow 的区别，并说明你会在什么场景下组合使用它们。",
      [
        "准确解释 Prompt、RAG、Agent、Workflow 的边界",
        "说明检索、工具调用和流程编排的适用条件",
        "结合真实产品场景说明组合方案与风险",
      ],
      "RAG / Prompt / Agent / Workflow",
      "困难",
    ),
    createInterviewQuestion(
      "behavior",
      "行为面试题",
      `你的当前短板之一是“${primaryGap}”。请讲一次你发现能力不足、制定改进计划并推动结果落地的经历。`,
      [
        "使用 STAR 或问题—行动—结果结构",
        "说明如何识别问题并确定改进优先级",
        "给出具体行动、反馈、结果和复盘",
      ],
      primaryGap,
      "基础",
    ),
  ];

  return {
    targetRole,
    interviewFocus: Array.from(
      new Set([
        ...input.jobProfile.evaluationCriteria,
        ...input.gapReport.priorityGaps,
        "项目表达",
        "AI 产品设计",
      ]),
    ).slice(0, 6),
    questions,
    overallScore: 0,
    strengths: input.abilityProfile.advantages.slice(0, 4),
    weaknesses: Array.from(
      new Set([
        ...input.abilityProfile.gaps,
        ...input.resumeReport.riskPoints,
      ]),
    ).slice(0, 5),
    improvementAdvice: [
      "所有项目题优先使用“场景—问题—方案—产出—复盘”结构。",
      "技术题先说明概念边界，再结合真实产品场景讲选择依据。",
      "避免虚构数据；没有业务指标时说明验证方式、用户反馈和交付物。",
      "每道题控制在 2 至 3 分钟，并明确本人承担的职责。",
    ],
  };
}

function normalizeInterviewReport(
  value: Partial<InterviewReport>,
  fallback: InterviewReport,
): InterviewReport {
  const rawQuestions = Array.isArray(value.questions) ? value.questions : [];
  const questions = fallback.questions.map((base, index) => {
    const raw =
      rawQuestions[index] && typeof rawQuestions[index] === "object"
        ? (rawQuestions[index] as Partial<InterviewQuestion>)
        : {};

    return {
      ...base,
      question: raw.question?.trim() || base.question,
      expectedPoints: strings(raw.expectedPoints).length
        ? strings(raw.expectedPoints)
        : base.expectedPoints,
      relatedSkill: raw.relatedSkill?.trim() || base.relatedSkill,
      difficulty:
        raw.difficulty === "基础" ||
        raw.difficulty === "中等" ||
        raw.difficulty === "困难"
          ? raw.difficulty
          : base.difficulty,
    };
  });

  return {
    targetRole: value.targetRole?.trim() || fallback.targetRole,
    interviewFocus: strings(value.interviewFocus).length
      ? strings(value.interviewFocus)
      : fallback.interviewFocus,
    questions,
    overallScore: 0,
    strengths: strings(value.strengths).length
      ? strings(value.strengths)
      : fallback.strengths,
    weaknesses: strings(value.weaknesses).length
      ? strings(value.weaknesses)
      : fallback.weaknesses,
    improvementAdvice: strings(value.improvementAdvice).length
      ? strings(value.improvementAdvice)
      : fallback.improvementAdvice,
  };
}

export async function generateInterviewQuestions(
  input: InterviewReportInput,
): Promise<InterviewReport> {
  const fallback = buildFallbackInterviewReport(input);

  try {
    const content = await completeJson("interview-questions", input);

    return normalizeInterviewReport(
      parseJson<Partial<InterviewReport>>(content),
      fallback,
    );
  } catch {
    return fallback;
  }
}

function answerKeywordHits(answer: string, points: string[]) {
  const lowerAnswer = answer.toLowerCase();
  return points.filter((point) => {
    const tokens = point
      .split(/[、，,。\s—-]+/)
      .map((token) => token.trim().toLowerCase())
      .filter((token) => token.length >= 2);
    return tokens.some((token) => lowerAnswer.includes(token));
  });
}

export function buildFallbackInterviewEvaluation(
  input: InterviewEvaluationInput,
): InterviewAnswerEvaluation {
  const answer = input.userAnswer.trim();

  if (!answer) {
    return {
      score: 15,
      feedback: "当前没有有效回答，暂时无法判断岗位理解和项目表达能力。",
      missingPoints: input.question.expectedPoints,
      optimizedAnswer: `建议先按以下结构组织回答：背景与目标 → 关键问题 → 我的行动与产品决策 → 交付物或验证方式 → 复盘。重点覆盖：${input.question.expectedPoints.join("；")}。`,
      nextPracticeSuggestion: "先写出 150 至 300 字版本，再压缩成 2 分钟口述答案。",
    };
  }

  const hits = answerKeywordHits(answer, input.question.expectedPoints);
  const missingPoints = input.question.expectedPoints.filter(
    (point) => !hits.includes(point),
  );
  const lengthScore =
    answer.length >= 220 ? 30 : answer.length >= 120 ? 24 : answer.length >= 60 ? 16 : 8;
  const pointScore = Math.round(
    (hits.length / Math.max(1, input.question.expectedPoints.length)) * 35,
  );
  const structureTerms = ["背景", "目标", "问题", "方案", "行动", "结果", "复盘", "验证"];
  const structureHits = structureTerms.filter((term) => answer.includes(term)).length;
  const structureScore = Math.min(20, structureHits * 4);
  const roleScore =
    answer.includes(input.targetJob) ||
    answer.includes("用户") ||
    answer.includes("产品") ||
    answer.includes("Agent")
      ? 15
      : 5;
  const finalScore = Math.min(
    100,
    Math.max(20, lengthScore + pointScore + structureScore + roleScore),
  );
  const primaryProject = input.projects[0];

  return {
    score: finalScore,
    feedback:
      finalScore >= 80
        ? "回答较完整，能够结合岗位与产品场景说明思路。继续压缩表达并强化结果证据。"
        : finalScore >= 60
          ? "回答覆盖了部分核心内容，但岗位关联、结构完整度或验证方式仍可加强。"
          : "回答目前偏概括，需要补充具体场景、本人行动、产品决策和验证结果。",
    missingPoints,
    optimizedAnswer: `我会先说明问题背景和目标用户，再明确核心痛点与成功标准。针对这道题，我会重点展开${input.question.expectedPoints.join("、")}。在${primaryProject?.title || "相关项目"}中，我会讲清自己负责的产品决策、Agent Workflow、异常兜底和验证方式，最后总结结果、限制与下一步迭代。`,
    nextPracticeSuggestion:
      missingPoints.length > 0
        ? `下一次回答重点补充：${missingPoints.join("；")}。`
        : "尝试将当前回答压缩为 2 分钟版本，并准备面试官可能追问的指标和失败案例。",
  };
}

function normalizeInterviewEvaluation(
  value: Partial<InterviewAnswerEvaluation>,
  fallback: InterviewAnswerEvaluation,
): InterviewAnswerEvaluation {
  return {
    score: score(value.score) || fallback.score,
    feedback: value.feedback?.trim() || fallback.feedback,
    missingPoints: strings(value.missingPoints),
    optimizedAnswer: value.optimizedAnswer?.trim() || fallback.optimizedAnswer,
    nextPracticeSuggestion:
      value.nextPracticeSuggestion?.trim() ||
      fallback.nextPracticeSuggestion,
  };
}

export async function evaluateInterviewAnswer(
  input: InterviewEvaluationInput,
): Promise<InterviewAnswerEvaluation> {
  const fallback = buildFallbackInterviewEvaluation(input);

  try {
    const content = await completeJson("interview-evaluation", input);

    return normalizeInterviewEvaluation(
      parseJson<Partial<InterviewAnswerEvaluation>>(content),
      fallback,
    );
  } catch {
    return fallback;
  }
}

// 保留旧接口，避免其他页面或后续代码失效。
export async function analyzeJob(jobName: string) {
  const result = await analyzeJobProfile({ jobName });
  return result.text;
}

export async function analyzeAbility(input: AbilityInput) {
  const result = await analyzeAbilityProfile(input);
  return result.text;
}
