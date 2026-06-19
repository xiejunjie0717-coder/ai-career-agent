import assert from "node:assert/strict";
import test from "node:test";

import {
  buildFallbackInterviewEvaluation,
  buildFallbackInterviewReport,
  buildFallbackProjectRecommendations,
  buildFallbackResumeReport,
} from "./ai.ts";
import type {
  AbilityProfile,
  GapReport,
  JobProfile,
} from "./agent-store.ts";

const jobProfile: JobProfile = {
  title: "AI 产品经理",
  company: "目标公司",
  responsibilities: ["设计 AI 产品", "推动项目落地"],
  requiredSkills: ["Prompt", "Agent", "数据分析"],
  niceToHaveSkills: ["SQL"],
  tools: ["Figma", "Python"],
  keywords: ["大模型", "RAG", "用户研究"],
  evaluationCriteria: ["产品思维", "项目落地"],
  summary: "负责 AI 产品设计与落地。",
};

const abilityProfile: AbilityProfile = {
  education: "本科",
  experience: "1 个项目",
  skills: ["PRD", "Figma"],
  strengths: "产品分析",
  weaknesses: "缺少 Agent 项目",
  summary: "产品基础较好，AI 实践不足。",
  matchScore: 45,
  advantages: ["产品分析能力"],
  gaps: ["Agent", "数据分析"],
  suggestions: ["完成 Agent 项目"],
};

const gapReport: GapReport = {
  matchScore: 42,
  matchedSkills: [],
  missingSkills: ["Prompt", "Agent", "数据分析"],
  riskPoints: ["缺少 AI 项目证据"],
  priorityGaps: ["Agent", "Prompt", "数据分析"],
  nextActions: ["完成 Agent 项目"],
};

test("fallback project recommendations return three staged, resume-ready projects", () => {
  const projects = buildFallbackProjectRecommendations({
    targetJob: "AI 产品经理",
    jobProfile,
    abilityProfile,
    gapReport,
    roadmap: null,
  });

  assert.equal(projects.length, 3);
  assert.deepEqual(
    projects.map((project) => project.difficulty),
    ["入门", "进阶", "面试亮点"],
  );
  assert.ok(projects.every((project) => project.coreFeatures.length >= 3));
  assert.ok(projects.every((project) => project.deliverables.length >= 2));
  assert.ok(projects.some((project) => project.targetSkill.includes("Agent")));
});

test("fallback resume report uses job keywords and recommended projects", () => {
  const projects = buildFallbackProjectRecommendations({
    targetJob: "AI 产品经理",
    jobProfile,
    abilityProfile,
    gapReport,
    roadmap: null,
  });
  const report = buildFallbackResumeReport({
    targetJob: "AI 产品经理",
    jobProfile,
    abilityProfile,
    gapReport,
    projects,
  });

  assert.equal(report.projectExperienceDraft.length, 3);
  assert.ok(report.missingKeywords.includes("Agent"));
  assert.ok(report.suggestedSkills.length > 0);
  assert.match(report.selfEvaluationDraft, /AI 产品经理/);
  assert.ok(report.projectExperienceDraft[0].includes(projects[0].title));
});

test("fallback interview report generates five required question types", () => {
  const projects = buildFallbackProjectRecommendations({
    targetJob: "AI 产品经理",
    jobProfile,
    abilityProfile,
    gapReport,
    roadmap: null,
  });
  const resumeReport = buildFallbackResumeReport({
    targetJob: "AI 产品经理",
    jobProfile,
    abilityProfile,
    gapReport,
    projects,
  });
  const report = buildFallbackInterviewReport({
    targetJob: "AI 产品经理",
    jobProfile,
    abilityProfile,
    gapReport,
    projects,
    resumeReport,
  });

  assert.equal(report.questions.length, 5);
  assert.deepEqual(
    report.questions.map((question) => question.type),
    ["岗位理解题", "项目经历题", "AI 产品设计题", "技术理解题", "行为面试题"],
  );
  assert.ok(report.questions.every((question) => question.expectedPoints.length >= 3));
  assert.equal(report.targetRole, "AI 产品经理");
});

test("fallback interview evaluation scores complete answers above empty answers", () => {
  const projects = buildFallbackProjectRecommendations({
    targetJob: "AI 产品经理",
    jobProfile,
    abilityProfile,
    gapReport,
    roadmap: null,
  });
  const resumeReport = buildFallbackResumeReport({
    targetJob: "AI 产品经理",
    jobProfile,
    abilityProfile,
    gapReport,
    projects,
  });
  const report = buildFallbackInterviewReport({
    targetJob: "AI 产品经理",
    jobProfile,
    abilityProfile,
    gapReport,
    projects,
    resumeReport,
  });
  const question = report.questions[1];
  const empty = buildFallbackInterviewEvaluation({
    question,
    userAnswer: "",
    targetJob: "AI 产品经理",
    jobProfile,
    projects,
    resumeReport,
  });
  const complete = buildFallbackInterviewEvaluation({
    question,
    userAnswer: `这个项目的场景是帮助求职者完成岗位分析。我负责用户痛点分析、Agent Workflow 设计和结构化输出，并通过 Demo 和用户反馈验证方案。`,
    targetJob: "AI 产品经理",
    jobProfile,
    projects,
    resumeReport,
  });

  assert.ok(empty.score < 40);
  assert.ok(complete.score > empty.score);
  assert.ok(complete.optimizedAnswer.length > 20);
  assert.ok(complete.nextPracticeSuggestion.length > 0);
});
