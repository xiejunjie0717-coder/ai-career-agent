import type {
  AgentState,
  AgentTask,
  TaskPriority,
} from "./agent-store.ts";

export type TaskStats = {
  total: number;
  completed: number;
  completionRate: number;
  estimatedMinutes: number;
};

function stableHash(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

function taskId(parts: string[]) {
  return `task-${stableHash(parts.join("|"))}`;
}

function createTask(
  input: Omit<AgentTask, "id" | "status" | "createdAt" | "completedAt"> & {
    identity: string[];
  },
): AgentTask {
  const { identity, ...task } = input;

  return {
    ...task,
    id: taskId(identity),
    status: "todo",
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
}

function roadmapPriority(phaseIndex: number): TaskPriority {
  if (phaseIndex === 0) return "high";
  if (phaseIndex === 1) return "medium";
  return "low";
}

export function generateTasksFromAgentState(state: AgentState): AgentTask[] {
  const tasks: AgentTask[] = [];

  state.roadmap?.phases.forEach((phase, phaseIndex) => {
    phase.dailyTasks.forEach((title, taskIndex) => {
      tasks.push(
        createTask({
          identity: [
            "roadmap",
            "daily",
            phase.title,
            String(taskIndex),
            title,
          ],
          source: "roadmap",
          title,
          description: `${phase.days} 天阶段 · ${phase.title} · 每日任务`,
          category: "学习",
          estimatedMinutes: 30,
          priority: roadmapPriority(phaseIndex),
          relatedSkill: phase.title,
        }),
      );
    });

    phase.weeklyGoals.forEach((title, goalIndex) => {
      tasks.push(
        createTask({
          identity: [
            "roadmap",
            "weekly",
            phase.title,
            String(goalIndex),
            title,
          ],
          source: "roadmap",
          title,
          description: `${phase.days} 天阶段 · ${phase.title} · 周目标`,
          category: "学习",
          estimatedMinutes: 120,
          priority: roadmapPriority(phaseIndex),
          relatedSkill: phase.title,
        }),
      );
    });
  });

  state.projects.forEach((project, projectIndex) => {
    const minutesPerDeliverable = Math.max(
      60,
      Math.round(
        (Math.max(1, project.estimatedDays) * 60) /
          Math.max(1, project.deliverables.length),
      ),
    );

    project.deliverables.forEach((title, deliverableIndex) => {
      tasks.push(
        createTask({
          identity: [
            "project",
            project.title,
            String(projectIndex),
            String(deliverableIndex),
            title,
          ],
          source: "project",
          title,
          description: `${project.title} · 项目交付物`,
          category: "项目",
          estimatedMinutes: minutesPerDeliverable,
          priority: projectIndex === 0 ? "high" : "medium",
          relatedSkill: project.targetSkill.join("、"),
        }),
      );
    });
  });

  state.interviewReport?.questions.forEach((question) => {
    const title = question.nextPracticeSuggestion.trim();
    if (!title) return;

    tasks.push(
      createTask({
        identity: ["interview", question.id, title],
        source: "interview",
        title,
        description: `${question.type} · ${question.question}`,
        category: "面试",
        estimatedMinutes: 30,
        priority:
          question.score !== null && question.score < 60 ? "high" : "medium",
        relatedSkill: question.relatedSkill,
      }),
    );
  });

  return tasks;
}

export function mergeTasksPreservingStatus(
  existing: AgentTask[],
  generated: AgentTask[],
): AgentTask[] {
  const existingById = new Map(existing.map((task) => [task.id, task]));

  return generated.map((task) => {
    const previous = existingById.get(task.id);
    if (!previous) return task;

    return {
      ...task,
      status: previous.status,
      createdAt: previous.createdAt,
      completedAt: previous.completedAt,
    };
  });
}

export function calculateTaskStats(tasks: AgentTask[]): TaskStats {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "done").length;

  return {
    total,
    completed,
    completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
    estimatedMinutes: tasks.reduce(
      (sum, task) => sum + task.estimatedMinutes,
      0,
    ),
  };
}
