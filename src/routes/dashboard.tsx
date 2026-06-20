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
  Route as RouteIcon,
  Target,
} from "lucide-react";

import { MobileShell } from "@/components/MobileShell";
import { Card, ProgressBar } from "@/components/ui-primitives";
import { WorkflowStepper } from "@/components/WorkflowStepper";
import { derivePortfolioMetrics } from "@/lib/dashboard";
import { loadState, type AgentState } from "@/lib/agent-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "我的成长路线｜AI Career Agent" },
      {
        name: "description",
        content: "查看目标岗位、能力匹配度、求职准备进度和今天最值得推进的行动。",
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
      <MobileShell title="我的成长路线" showTabs>
        <div className="skeleton-shimmer h-64 rounded-lg" />
      </MobileShell>
    );
  }

  const metrics = derivePortfolioMetrics(state);

  return (
    <MobileShell title="我的成长路线" showTabs>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Your career route</span>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              {state.targetJob ? `继续向 ${state.targetJob} 靠近` : "先定一个目标，我们从这里出发"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              我会根据你的岗位、能力和任务进度，帮你把下一步排清楚。
            </p>
          </div>
          <Link
            to="/upload"
            className="pressable inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-semibold hover:border-primary/40 hover:bg-primary-soft/35"
          >
            {state.jdText ? "更新目标岗位" : "添加目标岗位"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.45fr_0.55fr]">
          <div className="blueprint-panel rounded-lg border border-border bg-background p-5 sm:p-7">
            <div className="grid gap-8 md:grid-cols-[1fr_220px] md:items-start">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                  <BriefcaseBusiness className="h-4 w-4" />
                  当前路线
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                  {state.targetJob || "尚未设置目标岗位"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {state.dreamCompany
                    ? `目标公司 · ${state.dreamCompany}`
                    : "从真实 JD 开始，后续诊断会更贴近岗位要求"}
                </p>
                <div className="mt-8 flex items-end gap-4">
                  <strong className="text-5xl font-semibold tracking-[-0.05em] tabular-nums text-primary">
                    {metrics.workflow.percentage}
                    <span className="ml-1 text-xl">%</span>
                  </strong>
                  <span className="pb-1 text-xs leading-5 text-muted-foreground">
                    已完成 {metrics.workflow.completed}/{metrics.workflow.total}
                    <br />
                    个核心环节
                  </span>
                </div>
              </div>
              <div className="border-l-2 border-primary bg-primary-soft/50 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Flag className="h-4 w-4" />
                  路线状态
                </div>
                <div className="mt-3 text-lg font-semibold">
                  {metrics.workflow.percentage === 100 ? "主路线已完成" : "正在持续推进"}
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  完成当前行动后，后续建议会根据新结果重新排序。
                </p>
              </div>
            </div>
            <div className="mt-8 h-1.5 overflow-hidden bg-border">
              <div
                className="progress-fill h-full bg-primary transition-all"
                style={{ width: `${metrics.workflow.percentage}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg border border-primary/25 bg-primary p-6 text-primary-foreground">
            <RouteIcon className="h-6 w-6" />
            <div className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/70">
              今天最值得推进
            </div>
            <h3 className="mt-2 text-xl font-semibold leading-7">{metrics.nextAction.label}</h3>
            <p className="mt-3 text-sm leading-6 text-primary-foreground/72">
              {metrics.nextAction.description}
            </p>
            <Link
              to={metrics.nextAction.to}
              className="pressable mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-background px-4 text-sm font-semibold text-primary"
            >
              现在去完成
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="grid border-l border-t border-border sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="目标匹配"
            value={formatScore(metrics.abilityMatchScore)}
            detail={metrics.biggestGap ? `优先补齐：${metrics.biggestGap}` : "完成诊断后查看匹配度"}
            icon={<Target />}
            index="01"
          />
          <MetricCard
            label="行动完成"
            value={metrics.tasks.total ? `${metrics.tasks.completionRate}%` : "--"}
            detail={`${metrics.tasks.completed}/${metrics.tasks.total} 个任务已完成`}
            icon={<CheckCircle2 />}
            index="02"
          />
          <MetricCard
            label="简历准备"
            value={formatScore(metrics.resumeMatchScore)}
            detail={state.resumeReport ? "已生成岗位定制建议" : "尚未生成优化建议"}
            icon={<FileText />}
            index="03"
          />
          <MetricCard
            label="面试状态"
            value={formatScore(metrics.interviewScore)}
            detail={state.interviewReport ? "已建立针对性练习题" : "尚未开始练习"}
            icon={<Mic />}
            index="04"
          />
        </section>

        <Card
          title="你的成长路线"
          subtitle="每完成一步，后面的建议都会更贴近你的目标。"
          className="blueprint-panel"
        >
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
          <ProgressBar value={metrics.workflow.percentage} />
        </Card>

        <section>
          <div className="mb-4">
            <span className="eyebrow">Keep moving</span>
            <h2 className="mt-3 text-lg font-semibold tracking-tight">接下来想推进哪一块？</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              继续当前行动，或回到需要补充证据的步骤。
            </p>
          </div>
          <div className="grid border-l border-t border-border sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className="group border-b border-r border-border bg-card p-4 transition-colors hover:bg-primary-soft/35"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {action.meta}
                  </div>
                  <div className="mt-1 text-sm font-semibold">{action.label}</div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon,
  index,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactElement;
  index: string;
}) {
  return (
    <div className="metric-card border-b border-r border-border bg-card p-5 transition-colors hover:bg-primary-soft/25">
      <div className="flex items-start justify-between">
        <span className="font-mono text-[11px] font-semibold text-primary">{index}</span>
        <span className="text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      </div>
      <div className="mt-6 text-sm font-medium text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
      <p className="mt-2 truncate text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function formatScore(value: number | null) {
  return value === null ? "--" : `${value}%`;
}
