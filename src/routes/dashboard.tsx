import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FileText,
  Flag,
  FolderKanban,
  Map,
  Mic,
  Target,
} from "lucide-react";

import { MobileShell } from "@/components/MobileShell";
import { WorkflowStepper } from "@/components/WorkflowStepper";
import { derivePortfolioMetrics } from "@/lib/dashboard";
import { loadState, type AgentState } from "@/lib/agent-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "成长工作台｜Pathwise Career" },
      {
        name: "description",
        content: "查看今天最值得完成的行动、当前目标岗位与个人职业成长路线。",
      },
    ],
  }),
  component: DashboardPage,
});

const quickActions = [
  { to: "/analysis" as const, label: "读懂岗位要求", meta: "岗位分析", icon: Target },
  { to: "/assessment" as const, label: "盘点能力优势", meta: "能力评估", icon: Brain },
  { to: "/roadmap" as const, label: "规划学习路线", meta: "成长路线", icon: Map },
  { to: "/projects" as const, label: "积累项目证据", meta: "项目推荐", icon: FolderKanban },
  { to: "/resume" as const, label: "优化经历表达", meta: "简历优化", icon: FileText },
  { to: "/interview" as const, label: "练习面试表达", meta: "模拟面试", icon: Mic },
  { to: "/tasks" as const, label: "推进今日行动", meta: "任务中心", icon: ClipboardList },
];

function DashboardPage() {
  const [state, setState] = useState<AgentState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  if (!state) {
    return (
      <MobileShell title="成长工作台" showTabs>
        <div className="skeleton-shimmer h-64 rounded-lg" />
      </MobileShell>
    );
  }

  const metrics = derivePortfolioMetrics(state);
  const hasRouteData = Boolean(state.targetJob.trim() || state.jdText.trim());

  return (
    <MobileShell title="成长工作台" showTabs>
      <div className="space-y-10">
        <header className="grid gap-5 border-b border-border pb-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="eyebrow">Pathwise Career</span>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              今天，继续向目标岗位推进一步
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              {state.targetJob
                ? `当前目标是 ${state.targetJob}。先完成最关键的一件事，再决定下一步。`
                : "先建立目标岗位，Pathwise Career 会把后续准备整理成一条连续路线。"}
            </p>
          </div>
          <Link
            to="/upload"
            className="pathwise-button group inline-flex h-11 w-fit items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold hover:border-primary/45 hover:text-primary"
          >
            {state.jdText ? "更新目标岗位" : "添加目标岗位"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </header>

        <section className="dashboard-action-layout">
          <div className="dashboard-today">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-[var(--action)]">
              <Flag className="h-4 w-4" />
              今日行动
            </div>
            <p className="mt-5 text-sm font-semibold text-muted-foreground">今天先完成这一件事</p>
            <h3 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              {metrics.nextAction.label}
            </h3>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              {metrics.nextAction.description}
            </p>
            <Link
              to={metrics.nextAction.to}
              className="pathwise-button group mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
            >
              完成今天的关键行动
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="dashboard-context">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <BriefcaseBusiness className="h-4 w-4" />
              当前目标
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">
              {state.targetJob || "尚未设置目标岗位"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {state.dreamCompany
                ? `目标公司 · ${state.dreamCompany}`
                : "从真实岗位 JD 出发，后续建议会更具体。"}
            </p>
            <div className="mt-8 border-t border-border pt-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">路线状态</span>
                  <strong className="mt-2 block text-xl">
                    {hasRouteData
                      ? `你已经走完 ${metrics.workflow.completed}/${metrics.workflow.total} 个阶段`
                      : "路线尚未开始"}
                  </strong>
                </div>
                <span className="text-3xl font-semibold tabular-nums text-primary">
                  {hasRouteData ? `${metrics.workflow.percentage}%` : "--"}
                </span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden bg-border">
                <div
                  className="progress-fill h-full bg-primary"
                  style={{ width: hasRouteData ? `${metrics.workflow.percentage}%` : "0%" }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-evidence">
          <div className="dashboard-route-panel">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="eyebrow">完整成长路线</span>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                  从目标岗位到可验证的职业证据
                </h3>
              </div>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                状态变化会连续推进当前节点，不会重置你已经完成的步骤。
              </p>
            </div>
            <WorkflowStepper
              completedSteps={[
                Boolean(state.jdText.trim()),
                state.jobProfile !== null,
                state.abilityProfile !== null,
                state.gapReport !== null,
                state.roadmap !== null,
                state.projects.length > 0,
                state.resumeReport !== null,
                state.interviewReport !== null,
                state.tasks.length > 0,
              ]}
            />
          </div>

          <div className="dashboard-metrics">
            <MetricLine
              label="目标匹配"
              value={formatScore(metrics.abilityMatchScore)}
              detail={
                metrics.biggestGap ? `优先补齐：${metrics.biggestGap}` : "完成诊断后查看匹配度"
              }
              icon={<Target />}
            />
            <MetricLine
              label="本周行动"
              value={metrics.tasks.total ? `${metrics.tasks.completionRate}%` : "--"}
              detail={`${metrics.tasks.completed}/${metrics.tasks.total} 个任务已完成`}
              icon={<CheckCircle2 />}
            />
            <MetricLine
              label="简历证据"
              value={formatScore(metrics.resumeMatchScore)}
              detail={state.resumeReport ? "已生成岗位定制建议" : "尚未生成优化建议"}
              icon={<FileText />}
            />
            <MetricLine
              label="面试训练"
              value={formatScore(metrics.interviewScore)}
              detail={state.interviewReport ? "已建立针对性练习题" : "尚未开始练习"}
              icon={<Mic />}
            />
          </div>
        </section>

        <section>
          <div className="mb-5">
            <span className="eyebrow">继续推进</span>
            <h2 className="mt-3 text-xl font-semibold tracking-tight">选择要补充的职业证据</h2>
          </div>
          <div className="grid gap-x-8 gap-y-3 border-y border-border py-3 sm:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className="group flex items-center gap-4 border-b border-border/70 py-4 last:border-b-0"
                >
                  <Icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.8} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground">
                      {action.meta}
                    </div>
                    <div className="mt-1 text-sm font-semibold">{action.label}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}

function MetricLine({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactElement;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3 border-b border-border py-5 first:pt-0 last:border-b-0 last:pb-0">
      <span className="mt-0.5 text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
      </div>
      <strong className="text-2xl font-semibold tabular-nums">{value}</strong>
    </div>
  );
}

function formatScore(value: number | null) {
  return value === null ? "--" : `${value}%`;
}
