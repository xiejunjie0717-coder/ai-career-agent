import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Brain,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  FileText,
  FolderKanban,
  Map,
  Mic,
  Sparkles,
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
      { title: "Dashboard｜AI Career Agent" },
      {
        name: "description",
        content: "查看目标岗位、能力匹配度、求职准备进度和下一步行动建议。",
      },
    ],
  }),
  component: DashboardPage,
});

const quickActions = [
  { to: "/analysis" as const, label: "岗位分析", icon: Target },
  { to: "/assessment" as const, label: "能力评估", icon: Brain },
  { to: "/roadmap" as const, label: "学习路线", icon: Map },
  { to: "/projects" as const, label: "项目推荐", icon: FolderKanban },
  { to: "/resume" as const, label: "简历优化", icon: FileText },
  { to: "/interview" as const, label: "模拟面试", icon: Mic },
  { to: "/tasks" as const, label: "任务中心", icon: ClipboardList },
];

function DashboardPage() {
  const [state, setState] = useState<AgentState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  if (!state) {
    return (
      <MobileShell title="Dashboard" showTabs>
        <div className="skeleton-shimmer h-64 rounded-3xl" />
      </MobileShell>
    );
  }

  const metrics = derivePortfolioMetrics(state);

  return (
    <MobileShell title="Dashboard" showTabs>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">求职准备总览</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {state.targetJob
                ? `向 ${state.targetJob} 目标继续推进`
                : "建立你的目标岗位与成长路径"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              所有指标均来自当前浏览器保存的岗位分析、能力画像、报告和任务状态。
            </p>
          </div>
          <Link
            to="/upload"
            className="pressable inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold shadow-sm hover:border-primary/25 hover:bg-muted/50"
          >
            {state.jdText ? "更新岗位 JD" : "上传岗位 JD"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl shadow-slate-900/10 sm:p-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-blue-200">
                  <Briefcase className="h-4 w-4" />
                  当前目标岗位
                </div>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                  {state.targetJob || "尚未设置目标岗位"}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {state.dreamCompany
                    ? `目标公司 · ${state.dreamCompany}`
                    : "可以从真实 JD 开始建立岗位上下文"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
                <div className="text-xs text-slate-400">整体流程</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">
                  {metrics.workflow.percentage}%
                </div>
              </div>
            </div>
            <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="progress-fill h-full rounded-full bg-gradient-to-r from-blue-400 to-violet-400 transition-all"
                style={{ width: `${metrics.workflow.percentage}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs text-slate-400">
              <span>
                已完成 {metrics.workflow.completed}/{metrics.workflow.total} 个核心环节
              </span>
              <span>{metrics.workflow.percentage}%</span>
            </div>
          </div>

          <div className="rounded-3xl border border-primary/15 bg-primary-soft/55 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background text-primary shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="mt-5 text-xs font-semibold text-primary">下一步建议</div>
            <h3 className="mt-1 text-lg font-semibold">{metrics.nextAction.label}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {metrics.nextAction.description}
            </p>
            <Link
              to={metrics.nextAction.to}
              className="pressable mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              继续推进
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="能力匹配度"
            value={formatScore(metrics.abilityMatchScore)}
            detail={metrics.biggestGap ? `优先补齐：${metrics.biggestGap}` : "等待能力诊断"}
            icon={<Target />}
          />
          <MetricCard
            label="任务完成率"
            value={metrics.tasks.total ? `${metrics.tasks.completionRate}%` : "--"}
            detail={`${metrics.tasks.completed}/${metrics.tasks.total} 个任务已完成`}
            icon={<CheckCircle2 />}
          />
          <MetricCard
            label="简历优化"
            value={formatScore(metrics.resumeMatchScore)}
            detail={state.resumeReport ? "已生成岗位定制报告" : "尚未生成报告"}
            icon={<FileText />}
          />
          <MetricCard
            label="面试练习"
            value={formatScore(metrics.interviewScore)}
            detail={state.interviewReport ? "已建立模拟面试题库" : "尚未开始练习"}
            icon={<Mic />}
          />
        </section>

        <Card title="求职准备 Workflow" subtitle="按顺序完成可以获得更连续、准确的上下文">
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
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">快捷入口</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                继续当前模块，或回到需要补充的步骤。
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className="group pressable surface-card flex items-center gap-3 p-4"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1 text-sm font-semibold">{action.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
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
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactElement;
}) {
  return (
    <div className="metric-card surface-card p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </span>
      </div>
      <div className="mt-5 text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
      <p className="mt-2 truncate text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function formatScore(value: number | null) {
  return value === null ? "--" : `${value}%`;
}
