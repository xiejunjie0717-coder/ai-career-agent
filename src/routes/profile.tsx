import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileText,
  FolderKanban,
  Mic,
  Target,
  Wrench,
} from "lucide-react";

import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { Card, ProgressBar, Tag } from "@/components/ui-primitives";
import { loadState, type AgentState } from "@/lib/agent-store";
import { derivePortfolioMetrics } from "@/lib/dashboard";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "成长档案" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [state, setState] = useState<AgentState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  if (!state) return null;

  const metrics = derivePortfolioMetrics(state);
  const targetLabel = state.targetJob || state.jobProfile?.title;

  return (
    <MobileShell title="成长档案" showTabs>
      <div className="space-y-5">
        <PageHeader
          title="个人成长档案"
          description="汇总当前目标岗位、技能、报告和任务进度。数据仅保存在当前浏览器。"
          nextHint={metrics.nextAction.description}
        />
        <div className="flex items-start gap-4 pt-1">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-500 text-primary-foreground">
            <Target className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">当前求职目标</div>
            <h1 className="mt-1 truncate text-lg font-semibold">
              {targetLabel || "尚未设置目标岗位"}
            </h1>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {state.dreamCompany
                ? `目标公司 · ${state.dreamCompany}`
                : "完成目标设置后开始生成个人成长档案"}
            </p>
            <Tag tone={metrics.workflow.percentage === 100 ? "success" : "primary"}>
              主链路完成 {metrics.workflow.percentage}%
            </Tag>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Stat value={metrics.skillCount} label="技能数量" icon={<Wrench />} />
          <Stat value={metrics.tasks.completed} label="完成任务" icon={<CheckCircle2 />} />
          <Stat
            value={metrics.tasks.total ? `${metrics.tasks.completionRate}%` : "--"}
            label="任务完成率"
            icon={<Briefcase />}
          />
          <Stat
            value={formatScore(metrics.resumeMatchScore)}
            label="简历匹配度"
            icon={<FileText />}
          />
          <Stat value={formatScore(metrics.interviewScore)} label="面试平均分" icon={<Mic />} />
          <Stat
            value={formatScore(metrics.abilityMatchScore)}
            label="能力匹配度"
            icon={<Target />}
          />
        </div>

        <Card
          title="任务完成情况"
          subtitle={
            metrics.tasks.total
              ? `${metrics.tasks.completed}/${metrics.tasks.total} 个任务已完成`
              : "当前还没有生成执行任务"
          }
          icon={<CheckCircle2 className="h-4 w-4" />}
        >
          <ProgressBar value={metrics.tasks.completed} max={Math.max(1, metrics.tasks.total)} />
          <Link
            to="/tasks"
            className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2.5 text-sm"
          >
            <span>{metrics.tasks.total ? "查看执行中心" : "前往生成执行任务"}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Card>

        <Card title="当前最优项目推荐" icon={<FolderKanban className="h-4 w-4" />}>
          {metrics.bestProject ? (
            <div className="space-y-3">
              <div>
                <div className="font-medium">{metrics.bestProject.title}</div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {metrics.bestProject.valueForResume || "该项目用于证明目标岗位需要的核心能力。"}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {metrics.bestProject.targetSkill.map((skill) => (
                  <Tag key={skill} tone="primary">
                    {skill}
                  </Tag>
                ))}
              </div>
              <Link
                to="/projects"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary"
              >
                查看项目方案
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <EmptyHighlight
              description="完成差距分析后，系统会推荐适合作品集展示的项目。"
              label="获取项目推荐"
              to="/projects"
            />
          )}
        </Card>

        <Card title="当前最大能力短板" icon={<AlertTriangle className="h-4 w-4" />}>
          {metrics.biggestGap ? (
            <div className="rounded-xl bg-amber-50 p-4">
              <div className="font-medium text-amber-900">{metrics.biggestGap}</div>
              <p className="mt-1 text-sm leading-6 text-amber-800/80">
                优先围绕该能力安排学习任务和项目证据，可提升岗位匹配度。
              </p>
            </div>
          ) : (
            <EmptyHighlight
              description="完成岗位分析和能力评估后，可识别当前最需要补齐的能力。"
              label="开始能力评估"
              to="/assessment"
            />
          )}
        </Card>

        <Card title="技能标签">
          <div className="flex flex-wrap gap-2">
            {(state.abilityProfile?.skills.length ? state.abilityProfile.skills : state.skills).map(
              (skill) => (
                <Tag key={skill} tone="primary">
                  {skill}
                </Tag>
              ),
            )}
            {!state.skills.length && !state.abilityProfile?.skills.length ? (
              <span className="text-sm text-muted-foreground">完成能力评估后显示技能标签。</span>
            ) : null}
          </div>
        </Card>

        <Card title="关于当前数据">
          <p className="text-sm leading-6 text-muted-foreground">
            当前版本是作品集型 MVP /
            prototype，没有登录、数据库或多设备同步。清理浏览器数据可能导致当前档案丢失。
          </p>
        </Card>

        {!targetLabel && (
          <Card>
            <div className="text-center">
              <h2 className="font-semibold">成长档案尚未建立</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                先输入目标岗位并上传 JD，后续数据会自动汇总到这里。
              </p>
              <Link
                to="/"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary"
              >
                设置目标岗位
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Card>
        )}
      </div>
    </MobileShell>
  );
}

function Stat({
  value,
  label,
  icon,
}: {
  value: string | number;
  label: string;
  icon: React.ReactElement;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </div>
      <div className="text-xl font-semibold tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function EmptyHighlight({
  description,
  label,
  to,
}: {
  description: string;
  label: string;
  to: "/projects" | "/assessment";
}) {
  return (
    <div>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      <Link
        to={to}
        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary"
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function formatScore(value: number | null) {
  return value === null ? "--" : `${value}%`;
}
