import assert from "node:assert/strict";
import test from "node:test";

import { formatGapReportMarkdown, formatRoadmapMarkdown, workflowPageMeta } from "./workflow-ui.ts";

test("defines ordered workflow context for core pages", () => {
  assert.equal(workflowPageMeta.analysis.step, 1);
  assert.equal(workflowPageMeta.assessment.step, 2);
  assert.equal(workflowPageMeta.interview.step, 7);
  assert.equal(workflowPageMeta.tasks.step, 8);
});

test("formats gap report as readable markdown", () => {
  const markdown = formatGapReportMarkdown({
    matchScore: 68,
    matchedSkills: ["PRD"],
    missingSkills: ["SQL"],
    riskPoints: ["数据证据不足"],
    priorityGaps: ["SQL"],
    nextActions: ["完成 SQL 基础练习"],
  });

  assert.match(markdown, /# 能力差距报告/);
  assert.match(markdown, /岗位匹配度：68%/);
  assert.match(markdown, /- SQL/);
});

test("formats roadmap phases and acceptance criteria", () => {
  const markdown = formatRoadmapMarkdown({
    title: "90 天成长路线",
    goal30Days: "完成基础能力补齐",
    phases: [
      {
        days: 30,
        title: "基础阶段",
        weeklyGoals: ["完成基础学习"],
        dailyTasks: ["每日练习"],
        recommendedProjects: ["最小项目"],
        recommendedResources: ["课程"],
        acceptanceCriteria: ["完成 Demo"],
      },
    ],
  });

  assert.match(markdown, /## 30 天 · 基础阶段/);
  assert.match(markdown, /### 验收标准/);
  assert.match(markdown, /- 完成 Demo/);
});
