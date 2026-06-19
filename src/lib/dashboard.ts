import type { AgentState } from "./agent-store.ts";
import { calculateTaskStats } from "./tasks.ts";

export type PortfolioAction = {
  label: string;
  description: string;
  to:
    | "/"
    | "/upload"
    | "/analysis"
    | "/assessment"
    | "/gap"
    | "/roadmap"
    | "/projects"
    | "/resume"
    | "/interview"
    | "/tasks"
    | "/profile";
};

export type PortfolioMetrics = {
  workflow: {
    completed: number;
    total: number;
    percentage: number;
  };
  abilityMatchScore: number | null;
  resumeMatchScore: number | null;
  interviewScore: number | null;
  tasks: {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  };
  skillCount: number;
  bestProject: AgentState["projects"][number] | null;
  biggestGap: string | null;
  nextAction: PortfolioAction;
};

const WORKFLOW_TOTAL = 8;

export function derivePortfolioMetrics(
  state: AgentState,
): PortfolioMetrics {
  const taskStats = calculateTaskStats(state.tasks);
  const completedWorkflowSteps = [
    state.jobProfile !== null,
    state.abilityProfile !== null,
    state.gapReport !== null,
    state.roadmap !== null,
    state.projects.length > 0,
    state.resumeReport !== null,
    state.interviewReport !== null,
    state.tasks.length > 0,
  ].filter(Boolean).length;
  const profileSkills = state.abilityProfile?.skills.length
    ? state.abilityProfile.skills
    : state.skills;

  return {
    workflow: {
      completed: completedWorkflowSteps,
      total: WORKFLOW_TOTAL,
      percentage: Math.round(
        (completedWorkflowSteps / WORKFLOW_TOTAL) * 100,
      ),
    },
    abilityMatchScore:
      state.gapReport?.matchScore ??
      state.abilityProfile?.matchScore ??
      null,
    resumeMatchScore: state.resumeReport?.matchScore ?? null,
    interviewScore: state.interviewReport?.overallScore ?? null,
    tasks: {
      total: taskStats.total,
      completed: taskStats.completed,
      pending: taskStats.total - taskStats.completed,
      completionRate: taskStats.completionRate,
    },
    skillCount: new Set(
      profileSkills.map((skill) => skill.trim()).filter(Boolean),
    ).size,
    bestProject: state.projects[0] ?? null,
    biggestGap:
      state.gapReport?.priorityGaps[0] ??
      state.abilityProfile?.gaps[0] ??
      null,
    nextAction: getNextAction(state, taskStats.completed),
  };
}

function getNextAction(
  state: AgentState,
  completedTasks: number,
): PortfolioAction {
  if (!state.targetJob.trim()) {
    return {
      label: "输入目标岗位",
      description: "先明确求职方向，系统才能生成后续职业分析。",
      to: "/",
    };
  }
  if (!state.jdText.trim()) {
    return {
      label: "上传目标岗位 JD",
      description: "补充真实岗位要求，让岗位画像和差距分析更准确。",
      to: "/upload",
    };
  }
  if (!state.jobProfile) {
    return {
      label: "开始岗位分析",
      description: "将 JD 转换为职责、技能和评估标准。",
      to: "/analysis",
    };
  }
  if (!state.abilityProfile) {
    return {
      label: "开始能力评估",
      description: "补充个人经历和技能，生成当前能力画像。",
      to: "/assessment",
    };
  }
  if (!state.gapReport) {
    return {
      label: "查看能力差距",
      description: "对比岗位要求与当前能力，确定优先补齐项。",
      to: "/gap",
    };
  }
  if (!state.roadmap) {
    return {
      label: "生成学习路线",
      description: "把关键能力差距拆解为阶段目标和学习任务。",
      to: "/roadmap",
    };
  }
  if (state.projects.length === 0) {
    return {
      label: "获取项目推荐",
      description: "选择能够证明核心能力的作品集项目。",
      to: "/projects",
    };
  }
  if (!state.resumeReport) {
    return {
      label: "优化岗位简历",
      description: "将能力与项目成果转化为岗位相关的简历表达。",
      to: "/resume",
    };
  }
  if (!state.interviewReport) {
    return {
      label: "开始模拟面试",
      description: "围绕目标岗位和项目经历进行针对性练习。",
      to: "/interview",
    };
  }
  if (state.tasks.length === 0) {
    return {
      label: "生成执行任务",
      description: "汇总学习、项目和面试建议，进入执行阶段。",
      to: "/tasks",
    };
  }
  if (completedTasks < state.tasks.length) {
    return {
      label: "继续完成执行任务",
      description: `还有 ${state.tasks.length - completedTasks} 个任务待完成。`,
      to: "/tasks",
    };
  }
  return {
    label: "查看成长档案",
    description: "主链路任务已完成，可以回顾当前成果与能力数据。",
    to: "/profile",
  };
}
