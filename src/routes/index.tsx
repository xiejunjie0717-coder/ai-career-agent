import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Brain,
  Briefcase,
  Building2,
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
import {
  loadState,
  saveState,
  type AgentState,
} from "@/lib/agent-store";
import { derivePortfolioMetrics } from "@/lib/dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "职途 Agent · AI 职业成长助手" },
      {
        name: "description",
        content: "围绕目标岗位完成分析、能力评估、项目实践与求职准备。",
      },
    ],
  }),
  component: Index,
});

const SUGGESTED_JOBS = [
  "AI 产品经理",
  "产品经理",
  "数据分析师",
  "前端工程师",
];
const SUGGESTED_COMPANIES = ["字节跳动", "阿里巴巴", "腾讯", "美团"];

const QUICK_ACTIONS = [
  {
    to: "/analysis",
    label: "岗位分析",
    icon: Target,
    color: "bg-blue-50 text-blue-600",
  },
  {
    to: "/assessment",
    label: "能力评估",
    icon: Brain,
    color: "bg-violet-50 text-violet-600",
  },
  {
    to: "/roadmap",
    label: "学习路线",
    icon: Map,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    to: "/projects",
    label: "项目实战",
    icon: FolderKanban,
    color: "bg-fuchsia-50 text-fuchsia-600",
  },
  {
    to: "/resume",
    label: "简历优化",
    icon: FileText,
    color: "bg-amber-50 text-amber-600",
  },
  {
    to: "/interview",
    label: "模拟面试",
    icon: Mic,
    color: "bg-rose-50 text-rose-600",
  },
  {
    to: "/tasks",
    label: "执行任务",
    icon: ClipboardList,
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    to: "/rag",
    label: "知识库",
    icon: Sparkles,
    color: "bg-green-50 text-green-600",
  },
] as const;

function Index() {
  const navigate = useNavigate();
  const [state, setState] = useState<AgentState | null>(null);
  const [targetJob, setTargetJob] = useState("");
  const [dreamCompany, setDreamCompany] = useState("");

  useEffect(() => {
    const current = loadState();
    setState(current);
    setTargetJob(current.targetJob);
    setDreamCompany(current.dreamCompany);
  }, []);

  if (!state) return null;

  const metrics = derivePortfolioMetrics(state);
  const canStart = targetJob.trim().length > 1;

  const onStart = () => {
    if (!canStart) return;

    const nextState = {
      ...state,
      targetJob: targetJob.trim(),
      dreamCompany: dreamCompany.trim(),
    };
    saveState({
      targetJob: nextState.targetJob,
      dreamCompany: nextState.dreamCompany,
    });
    setState(nextState);
    navigate({ to: state.jobProfile ? "/analysis" : "/upload" });
  };

  return (
    <MobileShell showTabs>
      <div className="space-y-6">
        <div className="space-y-2 pt-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="h-3 w-3" />
            AI 职业成长 Agent
          </div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight">
            你的求职进展，<span className="text-primary">一页掌握</span>
          </h1>
          <p className="text-[14px] leading-relaxed text-muted-foreground">
            数据来自当前岗位分析、能力画像、求职报告和执行任务。
          </p>
        </div>

        <Card>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground">当前目标</div>
              <div className="mt-0.5 truncate font-semibold">
                {state.targetJob || "尚未设置目标岗位"}
              </div>
              <div className="mt-1 truncate text-xs text-muted-foreground">
                {state.dreamCompany
                  ? `目标公司 · ${state.dreamCompany}`
                  : "设置目标公司后可让求职方向更明确"}
              </div>
            </div>
          </div>
        </Card>

        <Card
          title="主链路进度"
          subtitle={`${metrics.workflow.completed}/${metrics.workflow.total} 个核心环节已有结果`}
          action={
            <span className="text-sm font-semibold tabular-nums text-primary">
              {metrics.workflow.percentage}%
            </span>
          }
        >
          <ProgressBar value={metrics.workflow.percentage} />
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Metric
              label="能力匹配度"
              value={formatScore(metrics.abilityMatchScore)}
            />
            <Metric
              label="简历匹配度"
              value={formatScore(metrics.resumeMatchScore)}
            />
            <Metric
              label="面试平均分"
              value={formatScore(metrics.interviewScore)}
            />
            <Metric
              label="任务进度"
              value={
                metrics.tasks.total
                  ? `${metrics.tasks.completed}/${metrics.tasks.total}`
                  : "--"
              }
            />
          </div>
        </Card>

        <Card title="执行概览">
          <div className="grid grid-cols-3 gap-2 text-center">
            <SummaryStat value={metrics.tasks.total} label="任务总数" />
            <SummaryStat value={metrics.tasks.completed} label="已完成" />
            <SummaryStat value={metrics.tasks.pending} label="待完成" />
          </div>
          {metrics.tasks.total === 0 ? (
            <p className="text-sm leading-6 text-muted-foreground">
              完成学习路线、项目推荐或模拟面试后，系统会在 Tasks
              中生成可执行任务。
            </p>
          ) : (
            <ProgressBar
              value={metrics.tasks.completed}
              max={metrics.tasks.total}
            />
          )}
        </Card>

        <div className="rounded-2xl border border-primary/20 bg-primary-soft/50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-primary">下一步推荐</div>
              <div className="mt-0.5 text-sm font-semibold">
                {metrics.nextAction.label}
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {metrics.nextAction.description}
              </p>
            </div>
          </div>
          <Link
            to={metrics.nextAction.to}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground"
          >
            {metrics.nextAction.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-3">
          <h2 className="px-1 text-sm font-semibold tracking-tight">
            快捷入口
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/60 bg-card p-2 transition active:scale-95"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-medium text-foreground">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft/60 via-background to-background p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="font-semibold tracking-tight">调整求职目标</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              修改后继续进入 JD 上传或查看已有岗位分析。
            </p>
          </div>
          <div className="space-y-4">
            <Field
              icon={<Briefcase className="h-4 w-4" />}
              label="目标岗位"
              value={targetJob}
              onChange={setTargetJob}
              placeholder="例如：AI 产品经理"
              suggestions={SUGGESTED_JOBS}
            />
            <Field
              icon={<Building2 className="h-4 w-4" />}
              label="目标公司"
              value={dreamCompany}
              onChange={setDreamCompany}
              placeholder="例如：字节跳动"
              suggestions={SUGGESTED_COMPANIES}
            />
            <button
              type="button"
              onClick={onStart}
              disabled={!canStart}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-medium text-primary-foreground shadow-sm shadow-primary/30 transition-opacity disabled:opacity-40"
            >
              保存并继续
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-3">
      <div className="text-lg font-semibold tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function SummaryStat({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div>
      <div className="text-xl font-semibold tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function formatScore(value: number | null) {
  return value === null ? "--" : `${value}%`;
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  suggestions,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions: string[];
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <span className="text-muted-foreground">{icon}</span>
        {label}
      </label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-input bg-background px-4 text-[15px] transition focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
      />
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onChange(suggestion)}
            className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-accent-foreground"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
