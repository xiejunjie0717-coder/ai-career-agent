import type {
  GapReport,
  InterviewReport,
  ProjectRecommendation,
  ResumeReport,
  Roadmap,
} from "./agent-store.ts";

export const workflowPageMeta = {
  analysis: {
    step: 1,
    title: "岗位分析",
    description: "将目标岗位或真实 JD 转换为职责、技能和评估标准。",
    nextHint: "完成岗位画像后，继续填写个人能力信息。",
  },
  assessment: {
    step: 2,
    title: "能力评估",
    description: "结合目标岗位，建立真实的个人能力画像。",
    nextHint: "提交后查看岗位匹配度和关键能力差距。",
  },
  gap: {
    step: 3,
    title: "差距诊断",
    description: "对比岗位画像与个人能力画像，确定补齐优先级。",
    nextHint: "将关键差距转换为阶段化学习路线。",
  },
  roadmap: {
    step: 4,
    title: "学习路线",
    description: "把能力差距拆解为阶段目标、任务、资源和验收标准。",
    nextHint: "选择能证明核心能力的作品集项目。",
  },
  projects: {
    step: 5,
    title: "项目推荐",
    description: "围绕目标岗位和能力短板生成可完成、可展示的项目。",
    nextHint: "将项目成果转换为岗位相关的简历表达。",
  },
  resume: {
    step: 6,
    title: "简历优化",
    description: "根据岗位关键词、能力差距和项目成果生成简历建议。",
    nextHint: "使用简历与项目上下文进入模拟面试。",
  },
  interview: {
    step: 7,
    title: "模拟面试",
    description: "围绕目标岗位和项目经历完成结构化回答练习。",
    nextHint: "将练习建议汇总到任务中心持续执行。",
  },
  tasks: {
    step: 8,
    title: "任务中心",
    description: "跟踪学习、项目和面试建议形成的执行任务。",
    nextHint: "完成任务后回到 Dashboard 查看整体进度。",
  },
} as const;

function list(title: string, items: string[]) {
  return [`## ${title}`, ...(items.length ? items.map((item) => `- ${item}`) : ["- 暂无"])].join(
    "\n",
  );
}

export function formatGapReportMarkdown(report: GapReport) {
  return [
    "# 能力差距报告",
    `岗位匹配度：${report.matchScore}%`,
    list("已匹配能力", report.matchedSkills),
    list("缺失能力", report.missingSkills),
    list("优先补齐项", report.priorityGaps),
    list("风险点", report.riskPoints),
    list("下一步行动", report.nextActions),
  ].join("\n\n");
}

export function formatRoadmapMarkdown(roadmap: Roadmap) {
  return [
    `# ${roadmap.title}`,
    `30 天目标：${roadmap.goal30Days}`,
    ...roadmap.phases.map((phase) =>
      [
        `## ${phase.days} 天 · ${phase.title}`,
        list("每周目标", phase.weeklyGoals).replace("##", "###"),
        list("每日任务", phase.dailyTasks).replace("##", "###"),
        list("推荐项目", phase.recommendedProjects).replace("##", "###"),
        list("推荐资源", phase.recommendedResources).replace("##", "###"),
        list("验收标准", phase.acceptanceCriteria).replace("##", "###"),
      ].join("\n\n"),
    ),
  ].join("\n\n");
}

export function formatProjectsMarkdown(projects: ProjectRecommendation[]) {
  return projects
    .map((project) =>
      [
        `# ${project.title}`,
        `阶段：${project.difficulty}`,
        `预计时间：${project.estimatedDays} 天`,
        `简历价值：${project.valueForResume}`,
        `产品场景：${project.productScenario}`,
        list("训练能力", project.targetSkill),
        list("核心功能", project.coreFeatures),
        list("交付物", project.deliverables),
        list("面试讲法", project.interviewTalkingPoints),
      ].join("\n\n"),
    )
    .join("\n\n---\n\n");
}

export function formatResumeMarkdown(report: ResumeReport) {
  return [
    "# 简历优化报告",
    `岗位匹配度：${report.matchScore}%`,
    list("缺失关键词", report.missingKeywords),
    list("建议补充技能", report.suggestedSkills),
    list("项目经历草稿", report.projectExperienceDraft),
    "## 自我评价草稿",
    report.selfEvaluationDraft,
    list("优化建议", report.optimizationAdvice),
    list("风险点", report.riskPoints),
  ].join("\n\n");
}

export function formatInterviewMarkdown(report: InterviewReport) {
  return [
    "# 模拟面试报告",
    `目标岗位：${report.targetRole}`,
    `当前平均分：${report.overallScore}/100`,
    list("面试重点", report.interviewFocus),
    ...report.questions.map((question, index) =>
      [
        `## ${index + 1}. ${question.question}`,
        `类型：${question.type} · 难度：${question.difficulty}`,
        question.userAnswer ? `用户回答：${question.userAnswer}` : "用户回答：尚未作答",
        question.score === null ? "评分：尚未评分" : `评分：${question.score}/100`,
        question.feedback ? `反馈：${question.feedback}` : "",
        question.optimizedAnswer ? `优化答案：${question.optimizedAnswer}` : "",
        question.nextPracticeSuggestion ? `下一步练习：${question.nextPracticeSuggestion}` : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    ),
  ].join("\n\n");
}
