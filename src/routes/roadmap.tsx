import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Folder, Calendar, Trophy } from "lucide-react";

import { MobileShell } from "@/components/MobileShell";
import { AiResultActions } from "@/components/AiResultActions";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { Card, PrimaryButton, ProgressBar } from "@/components/ui-primitives";
import { generateRoadmap } from "@/lib/ai";
import { loadState, saveState, type AgentState } from "@/lib/agent-store";
import { formatRoadmapMarkdown, workflowPageMeta } from "@/lib/workflow-ui";

export const Route = createFileRoute("/roadmap")({
  head: () => ({ meta: [{ title: "成长路线｜Pathwise Career" }] }),
  component: RoadmapPage,
});

const PHASE_COLORS = [
  "from-blue-400 to-primary",
  "from-primary to-violet-500",
  "from-violet-500 to-fuchsia-500",
];

function RoadmapPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<AgentState | null>(null);

  useEffect(() => {
    const current = loadState();
    let roadmap = current.roadmap;

    if (!roadmap && current.gapReport && current.jobProfile) {
      roadmap = generateRoadmap(current.gapReport, current.jobProfile);
      saveState({ roadmap });
    }

    setState({ ...current, roadmap });
  }, []);

  if (!state) return null;

  const roadmap = state.roadmap;

  if (!roadmap) {
    return (
      <MobileShell title="成长路线" showBack>
        <PageHeader {...workflowPageMeta.roadmap} backTo="/gap" />
        <div className="mt-6">
          <EmptyState
            title="请先生成 Gap 报告"
            description="学习路线需要依据岗位要求和能力差距确定阶段目标。"
            actionLabel="返回差距分析"
            to="/gap"
          />
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell
      title="成长路线"
      showBack
      footer={
        <PrimaryButton
          onClick={() => navigate({ to: "/projects" })}
          icon={<ArrowRight className="h-4 w-4" />}
        >
          查看推荐项目
        </PrimaryButton>
      }
    >
      <div className="space-y-5">
        <PageHeader {...workflowPageMeta.roadmap} backTo="/gap" />
        <Card>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs text-muted-foreground">个性化成长目标</div>
              <div className="text-lg font-semibold">{roadmap.title}</div>
            </div>
            <AiResultActions text={formatRoadmapMarkdown(roadmap)} />
          </div>
          <p className="text-sm text-muted-foreground leading-6 mt-3">
            30 天目标：{roadmap.goal30Days}
          </p>
          <div className="rounded-xl bg-primary-soft/55 p-3 text-xs leading-5 text-muted-foreground">
            学习路线的实际完成进度将在任务中心记录，本页只展示规划内容。
          </div>
        </Card>

        {roadmap.phases.map((phase, index) => {
          const items = [
            ...phase.dailyTasks.map((text) => ({ type: "每日", text })),
            ...phase.weeklyGoals.map((text) => ({ type: "每周", text })),
            ...phase.recommendedResources.map((text) => ({ type: "资源", text })),
            ...phase.recommendedProjects.map((text) => ({ type: "项目", text })),
          ];

          return (
            <div
              key={phase.days}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <div
                className={`bg-gradient-to-r ${
                  PHASE_COLORS[index] ?? PHASE_COLORS[2]
                } text-primary-foreground px-5 py-3.5 flex items-center justify-between`}
              >
                <div>
                  <div className="text-[11px] uppercase tracking-wider opacity-80">
                    阶段 {index + 1}
                  </div>
                  <div className="font-semibold">{phase.title}</div>
                </div>
                <div className="text-2xl font-semibold tabular-nums">{phase.days}天</div>
              </div>

              <ul className="p-4 space-y-2">
                {items.map((item, itemIndex) => (
                  <li
                    key={`${item.type}-${itemIndex}`}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/50"
                  >
                    <span className="mt-0.5">
                      <IconFor type={item.type} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-muted-foreground">{item.type}任务</div>
                      <div className="text-sm text-foreground leading-snug">{item.text}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mx-4 mb-4 rounded-xl bg-muted/50 p-3">
                <div className="text-xs font-medium mb-2">阶段验收标准</div>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                  {phase.acceptanceCriteria.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}

        <Card title="路线验收里程碑" icon={<Trophy className="h-4 w-4" />}>
          <div className="grid grid-cols-3 gap-2">
            {roadmap.phases.map((phase) => (
              <div key={phase.days} className="p-3 rounded-xl text-center bg-muted/60">
                <div className="text-2xl grayscale opacity-50">🏅</div>
                <div className="text-[11px] mt-1">{phase.days} 天验收</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MobileShell>
  );
}

function IconFor({ type }: { type: string }) {
  const map: Record<string, React.ReactNode> = {
    每日: <Calendar className="h-4 w-4 text-blue-500" />,
    每周: <Calendar className="h-4 w-4 text-violet-500" />,
    资源: <BookOpen className="h-4 w-4 text-emerald-500" />,
    项目: <Folder className="h-4 w-4 text-rose-500" />,
  };

  return <>{map[type]}</>;
}
