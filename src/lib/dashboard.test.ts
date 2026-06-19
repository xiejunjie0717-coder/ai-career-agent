import assert from "node:assert/strict";
import test from "node:test";

import type { AgentState } from "./agent-store.ts";
import { derivePortfolioMetrics } from "./dashboard.ts";

function createState(overrides: Partial<AgentState> = {}): AgentState {
  return {
    targetJob: "",
    dreamCompany: "",
    education: "",
    experience: "",
    skills: [],
    strengths: "",
    weaknesses: "",
    jdText: "",
    jdFileName: "",
    jobProfile: null,
    abilityProfile: null,
    gapReport: null,
    roadmap: null,
    projects: [],
    resumeReport: null,
    interviewReport: null,
    tasks: [],
    ...overrides,
  };
}

test("guides an empty state to set a target job", () => {
  const metrics = derivePortfolioMetrics(createState());

  assert.deepEqual(metrics.nextAction, {
    label: "输入目标岗位",
    description: "先明确求职方向，系统才能生成后续职业分析。",
    to: "/",
  });
  assert.equal(metrics.workflow.completed, 0);
  assert.equal(metrics.workflow.total, 8);
});

test("guides a user with a target job but no JD to upload a JD", () => {
  const metrics = derivePortfolioMetrics(
    createState({ targetJob: "AI 产品经理" }),
  );

  assert.equal(metrics.nextAction.label, "上传目标岗位 JD");
  assert.equal(metrics.nextAction.to, "/upload");
});

test("calculates workflow, scores, task progress and profile highlights", () => {
  const state = createState({
    targetJob: "AI 产品经理",
    dreamCompany: "示例科技",
    jdText: "岗位职责与任职要求",
    jobProfile: {
      title: "AI 产品经理",
      company: "示例科技",
      responsibilities: [],
      requiredSkills: ["Agent", "Prompt"],
      niceToHaveSkills: [],
      tools: [],
      keywords: [],
      evaluationCriteria: [],
      summary: "",
    },
    abilityProfile: {
      education: "",
      experience: "",
      skills: ["Agent", "Prompt", "Agent"],
      strengths: "",
      weaknesses: "",
      summary: "",
      matchScore: 62,
      advantages: [],
      gaps: ["数据分析"],
      suggestions: [],
    },
    gapReport: {
      matchScore: 68,
      matchedSkills: ["Agent"],
      missingSkills: ["数据分析"],
      riskPoints: [],
      priorityGaps: ["数据分析", "商业化"],
      nextActions: [],
    },
    roadmap: {
      title: "成长路线",
      goal30Days: "完成作品集",
      phases: [],
    },
    projects: [
      {
        title: "职业规划 Agent",
        targetSkill: ["Agent"],
        difficulty: "进阶",
        valueForResume: "",
        productScenario: "",
        coreFeatures: [],
        techStack: [],
        deliverables: [],
        interviewTalkingPoints: [],
        estimatedDays: 10,
      },
    ],
    resumeReport: {
      matchScore: 76,
      missingKeywords: [],
      suggestedSkills: [],
      projectExperienceDraft: [],
      selfEvaluationDraft: "",
      optimizationAdvice: [],
      riskPoints: [],
    },
    interviewReport: {
      targetRole: "AI 产品经理",
      interviewFocus: [],
      questions: [],
      overallScore: 82,
      strengths: [],
      weaknesses: [],
      improvementAdvice: [],
    },
    tasks: [
      {
        id: "one",
        source: "roadmap",
        title: "任务一",
        description: "",
        category: "学习",
        estimatedMinutes: 30,
        status: "done",
        priority: "high",
        relatedSkill: "Agent",
        createdAt: "2026-06-18T08:00:00.000Z",
        completedAt: "2026-06-18T09:00:00.000Z",
      },
      {
        id: "two",
        source: "project",
        title: "任务二",
        description: "",
        category: "项目",
        estimatedMinutes: 60,
        status: "doing",
        priority: "medium",
        relatedSkill: "数据分析",
        createdAt: "2026-06-18T08:00:00.000Z",
        completedAt: null,
      },
    ],
  });

  const metrics = derivePortfolioMetrics(state);

  assert.deepEqual(metrics.workflow, {
    completed: 8,
    total: 8,
    percentage: 100,
  });
  assert.equal(metrics.abilityMatchScore, 68);
  assert.equal(metrics.resumeMatchScore, 76);
  assert.equal(metrics.interviewScore, 82);
  assert.deepEqual(metrics.tasks, {
    total: 2,
    completed: 1,
    pending: 1,
    completionRate: 50,
  });
  assert.equal(metrics.skillCount, 2);
  assert.equal(metrics.bestProject?.title, "职业规划 Agent");
  assert.equal(metrics.biggestGap, "数据分析");
  assert.equal(metrics.nextAction.label, "继续完成执行任务");
  assert.equal(metrics.nextAction.to, "/tasks");
});

test("falls back to the ability score and entered skills when later reports are missing", () => {
  const metrics = derivePortfolioMetrics(
    createState({
      skills: ["React", "TypeScript", "React"],
      abilityProfile: {
        education: "",
        experience: "",
        skills: [],
        strengths: "",
        weaknesses: "",
        summary: "",
        matchScore: 55,
        advantages: [],
        gaps: ["系统设计"],
        suggestions: [],
      },
    }),
  );

  assert.equal(metrics.abilityMatchScore, 55);
  assert.equal(metrics.skillCount, 2);
  assert.equal(metrics.biggestGap, "系统设计");
  assert.equal(metrics.resumeMatchScore, null);
  assert.equal(metrics.interviewScore, null);
});
