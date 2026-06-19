import assert from "node:assert/strict";
import test from "node:test";

import type {
  AgentState,
  AgentTask,
  InterviewReport,
  ProjectRecommendation,
  Roadmap,
} from "./agent-store.ts";
import {
  calculateTaskStats,
  generateTasksFromAgentState,
  mergeTasksPreservingStatus,
} from "./tasks.ts";

const roadmap: Roadmap = {
  title: "90 天 AI 产品经理成长路线",
  goal30Days: "完成 Agent 基础学习",
  phases: [
    {
      days: 30,
      title: "关键能力补齐",
      weeklyGoals: ["完成 Agent 工作流专项学习"],
      dailyTasks: ["每天练习一次 Prompt"],
      recommendedProjects: [],
      recommendedResources: [],
      acceptanceCriteria: [],
    },
  ],
};

const projects: ProjectRecommendation[] = [
  {
    title: "职业差距诊断 Agent",
    targetSkill: ["Agent", "Prompt"],
    difficulty: "进阶",
    valueForResume: "形成可展示项目",
    productScenario: "帮助求职者分析能力差距",
    coreFeatures: ["岗位分析", "能力分析", "差距报告"],
    techStack: ["React", "TypeScript"],
    deliverables: ["完成可运行 Demo", "整理项目说明文档"],
    interviewTalkingPoints: ["工作流设计"],
    estimatedDays: 10,
  },
];

const interviewReport: InterviewReport = {
  targetRole: "AI 产品经理",
  interviewFocus: ["项目表达"],
  questions: [
    {
      id: "project-experience",
      type: "项目经历题",
      question: "请介绍你的 Agent 项目",
      expectedPoints: ["用户问题", "产品方案", "验证方式"],
      relatedSkill: "项目表达",
      difficulty: "中等",
      userAnswer: "回答内容",
      score: 65,
      feedback: "需要补充验证方式",
      missingPoints: ["验证方式"],
      optimizedAnswer: "优化后的答案",
      nextPracticeSuggestion: "使用 STAR 结构重新练习项目回答",
    },
  ],
  overallScore: 65,
  strengths: [],
  weaknesses: ["项目表达"],
  improvementAdvice: [],
};

function createState(overrides: Partial<AgentState> = {}): AgentState {
  return {
    targetJob: "AI 产品经理",
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

test("generates learning tasks from roadmap daily tasks and weekly goals", () => {
  const tasks = generateTasksFromAgentState(createState({ roadmap }));
  const learningTasks = tasks.filter((task) => task.source === "roadmap");

  assert.equal(learningTasks.length, 2);
  assert.ok(learningTasks.every((task) => task.category === "学习"));
  assert.ok(learningTasks.some((task) => task.title === "每天练习一次 Prompt"));
  assert.ok(learningTasks.some((task) => task.title === "完成 Agent 工作流专项学习"));
});

test("generates project tasks from project deliverables", () => {
  const tasks = generateTasksFromAgentState(createState({ projects }));
  const projectTasks = tasks.filter((task) => task.source === "project");

  assert.equal(projectTasks.length, 2);
  assert.ok(projectTasks.every((task) => task.category === "项目"));
  assert.ok(projectTasks.every((task) => task.relatedSkill.includes("Agent")));
  assert.ok(projectTasks.some((task) => task.title === "完成可运行 Demo"));
});

test("generates interview tasks from next practice suggestions", () => {
  const tasks = generateTasksFromAgentState(
    createState({ interviewReport }),
  );
  const interviewTasks = tasks.filter((task) => task.source === "interview");

  assert.equal(interviewTasks.length, 1);
  assert.equal(interviewTasks[0].category, "面试");
  assert.equal(
    interviewTasks[0].title,
    "使用 STAR 结构重新练习项目回答",
  );
});

test("preserves existing task status when generated tasks have the same id", () => {
  const generated = generateTasksFromAgentState(createState({ roadmap }));
  const completedAt = "2026-06-18T08:00:00.000Z";
  const existing: AgentTask[] = [
    {
      ...generated[0],
      status: "done",
      createdAt: "2026-06-17T08:00:00.000Z",
      completedAt,
    },
  ];

  const merged = mergeTasksPreservingStatus(existing, generated);
  const preserved = merged.find((task) => task.id === generated[0].id);

  assert.equal(preserved?.status, "done");
  assert.equal(preserved?.completedAt, completedAt);
  assert.equal(preserved?.createdAt, "2026-06-17T08:00:00.000Z");
});

test("calculates total, completed, completion rate and estimated minutes", () => {
  const tasks: AgentTask[] = [
    {
      id: "one",
      source: "roadmap",
      title: "任务一",
      description: "",
      category: "学习",
      estimatedMinutes: 30,
      status: "done",
      priority: "high",
      relatedSkill: "Prompt",
      createdAt: "2026-06-18T08:00:00.000Z",
      completedAt: "2026-06-18T09:00:00.000Z",
    },
    {
      id: "two",
      source: "project",
      title: "任务二",
      description: "",
      category: "项目",
      estimatedMinutes: 90,
      status: "doing",
      priority: "medium",
      relatedSkill: "Agent",
      createdAt: "2026-06-18T08:00:00.000Z",
      completedAt: null,
    },
  ];

  assert.deepEqual(calculateTaskStats(tasks), {
    total: 2,
    completed: 1,
    completionRate: 50,
    estimatedMinutes: 120,
  });
});
