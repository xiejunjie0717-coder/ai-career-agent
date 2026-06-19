import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  Clock,
  FolderKanban,
  ListTodo,
  MessageSquareText,
  RefreshCw,
} from "lucide-react";

import { MobileShell } from "@/components/MobileShell";
import { Card, ProgressBar, Tag } from "@/components/ui-primitives";
import {
  loadState,
  saveState,
  type AgentTask,
  type TaskStatus,
} from "@/lib/agent-store";
import {
  calculateTaskStats,
  generateTasksFromAgentState,
  mergeTasksPreservingStatus,
} from "@/lib/tasks";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "任务中心" }] }),
  component: TasksPage,
});

type TaskFilter = "all" | "学习" | "项目" | "面试" | "done";

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "学习", label: "学习" },
  { value: "项目", label: "项目" },
  { value: "面试", label: "面试" },
  { value: "done", label: "已完成" },
];

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "待办" },
  { value: "doing", label: "进行中" },
  { value: "done", label: "已完成" },
];

function TasksPage() {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [ready, setReady] = useState(false);

  const regenerateTasks = () => {
    const current = loadState();
    const generated = generateTasksFromAgentState(current);
    const merged = mergeTasksPreservingStatus(current.tasks, generated);

    saveState({ tasks: merged });
    setTasks(merged);
    setReady(true);
  };

  useEffect(() => {
    regenerateTasks();
  }, []);

  const stats = useMemo(() => calculateTaskStats(tasks), [tasks]);
  const visibleTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (filter === "all") return true;
        if (filter === "done") return task.status === "done";
        return task.category === filter;
      }),
    [filter, tasks],
  );

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    const nextTasks = tasks.map((task) => {
      if (task.id !== id) return task;

      return {
        ...task,
        status,
        completedAt: status === "done" ? new Date().toISOString() : null,
      };
    });

    setTasks(nextTasks);
    saveState({ tasks: nextTasks });
  };

  return (
    <MobileShell
      title="任务中心"
      showTabs
      rightSlot={
        <button
          type="button"
          onClick={regenerateTasks}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          重新生成
        </button>
      }
    >
      <div className="space-y-5">
        <Card>
          <div className="grid grid-cols-4 gap-2 text-center">
            <Stat value={stats.total} label="总任务" />
            <Stat value={stats.completed} label="已完成" />
            <Stat value={`${stats.completionRate}%`} label="完成率" />
            <Stat
              value={formatMinutes(stats.estimatedMinutes)}
              label="预计耗时"
            />
          </div>
          <ProgressBar value={stats.completed} max={Math.max(1, stats.total)} />
          <p className="text-xs text-muted-foreground">
            任务由学习路线、项目交付物和面试练习建议自动生成。
          </p>
        </Card>

        <div className="flex gap-1 overflow-x-auto p-1 bg-muted rounded-xl">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`shrink-0 px-3 h-9 rounded-lg text-sm font-medium transition ${
                filter === item.value
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {ready && tasks.length === 0 ? (
          <EmptyTasks />
        ) : visibleTasks.length === 0 ? (
          <Card>
            <p className="text-sm text-muted-foreground text-center py-4">
              当前筛选下暂无任务。
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {visibleTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={(status) =>
                  updateTaskStatus(task.id, status)
                }
              />
            ))}
          </div>
        )}
      </div>
    </MobileShell>
  );
}

function TaskCard({
  task,
  onStatusChange,
}: {
  task: AgentTask;
  onStatusChange: (status: TaskStatus) => void;
}) {
  const completed = task.status === "done";

  return (
    <div
      className={`rounded-2xl border p-4 space-y-3 transition ${
        completed
          ? "border-border bg-muted/40"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
            completed ? "bg-emerald-50 text-emerald-600" : categoryTone(task)
          }`}
        >
          {completed ? <Check className="h-4 w-4" /> : categoryIcon(task)}
        </div>

        <div className="flex-1 min-w-0">
          <div
            className={`text-sm font-medium leading-5 ${
              completed ? "line-through text-muted-foreground" : ""
            }`}
          >
            {task.title}
          </div>
          <p className="text-xs text-muted-foreground leading-5 mt-1">
            {task.description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Tag tone={categoryTagTone(task)}>{task.category}</Tag>
        <Tag tone={priorityTone(task.priority)}>
          {priorityLabel(task.priority)}
        </Tag>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {formatMinutes(task.estimatedMinutes)}
        </span>
        {task.relatedSkill && (
          <span className="text-xs text-muted-foreground truncate">
            · {task.relatedSkill}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-muted">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onStatusChange(option.value)}
            className={`h-8 rounded-lg text-xs font-medium transition ${
              task.status === option.value
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyTasks() {
  return (
    <Card>
      <div className="flex flex-col items-center text-center py-5">
        <div className="h-12 w-12 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mb-3">
          <ListTodo className="h-6 w-6" />
        </div>
        <h2 className="font-semibold">暂无可执行任务</h2>
        <p className="text-sm text-muted-foreground leading-6 mt-1">
          请先完成学习路线、项目推荐或模拟面试，系统会自动整理下一步行动。
        </p>
      </div>
    </Card>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes}分钟`;

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder === 0 ? `${hours}小时` : `${hours}小时${remainder}分`;
}

function categoryIcon(task: AgentTask) {
  if (task.category === "项目") {
    return <FolderKanban className="h-4 w-4" />;
  }
  if (task.category === "面试") {
    return <MessageSquareText className="h-4 w-4" />;
  }
  return <BookOpen className="h-4 w-4" />;
}

function categoryTone(task: AgentTask) {
  if (task.category === "项目") return "bg-fuchsia-50 text-fuchsia-600";
  if (task.category === "面试") return "bg-rose-50 text-rose-600";
  return "bg-blue-50 text-blue-600";
}

function categoryTagTone(
  task: AgentTask,
): "primary" | "success" | "warning" {
  if (task.category === "项目") return "primary";
  if (task.category === "面试") return "warning";
  return "success";
}

function priorityTone(
  priority: AgentTask["priority"],
): "warning" | "primary" | "muted" {
  if (priority === "high") return "warning";
  if (priority === "medium") return "primary";
  return "muted";
}

function priorityLabel(priority: AgentTask["priority"]) {
  if (priority === "high") return "高优先级";
  if (priority === "medium") return "中优先级";
  return "低优先级";
}
