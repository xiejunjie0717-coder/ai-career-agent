import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  BriefcaseBusiness,
  FileText,
  RefreshCw,
  Sparkles,
  UserRound,
} from "lucide-react";

import { MobileShell } from "@/components/MobileShell";
import { Card, PrimaryButton, Tag, ProgressBar } from "@/components/ui-primitives";
import { generateResumeReport } from "@/lib/ai";
import { loadState, saveState, type AgentState } from "@/lib/agent-store";

export const Route = createFileRoute("/resume")({
  head: () => ({ meta: [{ title: "简历优化" }] }),
  component: ResumePage,
});

function ResumePage() {
  const navigate = useNavigate();
  const [state, setState] = useState<AgentState | null>(null);
  const [loading, setLoading] = useState(false);

  const createReport = async (current: AgentState) => {
    if (
      !current.jobProfile ||
      !current.abilityProfile ||
      !current.gapReport ||
      current.projects.length === 0
    ) {
      return;
    }

    setLoading(true);
    const resumeReport = await generateResumeReport({
      targetJob: current.targetJob,
      jobProfile: current.jobProfile,
      abilityProfile: current.abilityProfile,
      gapReport: current.gapReport,
      projects: current.projects,
    });
    saveState({ resumeReport, interviewReport: null });
    setState(loadState());
    setLoading(false);
  };

  useEffect(() => {
    const current = loadState();
    setState(current);

    if (!current.resumeReport) {
      void createReport(current);
    }
  }, []);

  if (!state) return null;

  if (
    !state.jobProfile ||
    !state.abilityProfile ||
    !state.gapReport ||
    state.projects.length === 0
  ) {
    return (
      <MobileShell title="简历优化" showBack>
        <Card title="请先生成项目推荐">
          <p className="text-sm text-muted-foreground leading-6">
            简历项目经历需要基于目标岗位、能力差距和推荐项目生成。请先完成项目推荐。
          </p>
          <PrimaryButton onClick={() => navigate({ to: "/projects" })}>
            前往项目推荐
          </PrimaryButton>
        </Card>
      </MobileShell>
    );
  }

  const report = state.resumeReport;

  return (
    <MobileShell
      title="简历优化"
      showBack
      footer={
        <PrimaryButton
          onClick={() => void createReport(state)}
          disabled={loading}
          icon={<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />}
        >
          {loading ? "正在生成简历建议..." : "重新生成简历建议"}
        </PrimaryButton>
      }
    >
      <div className="space-y-5">
        <Card
          title="岗位定制简历报告"
          subtitle={`目标岗位：${state.targetJob || state.jobProfile.title}`}
          icon={<FileText className="h-4 w-4" />}
        >
          <p className="text-sm text-muted-foreground leading-6">
            当前报告基于岗位画像、个人能力、Gap 和推荐项目生成，不会虚构未提供的业务指标。
          </p>
        </Card>

        {loading && !report && (
          <Card>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              正在生成简历报告，AI 失败时将自动使用本地方案……
            </div>
          </Card>
        )}

        {report && (
          <>
            <Card title="简历匹配度">
              <div className="flex items-center gap-4">
                <ScoreRing value={report.matchScore} />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {report.matchScore >= 75 ? "岗位匹配度较好" : "仍有明确优化空间"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {report.missingKeywords.length} 个关键词待补充，
                    {report.riskPoints.length} 个风险点待处理
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={report.matchScore} />
                  </div>
                </div>
              </div>
            </Card>

            <Card title="缺失关键词" subtitle="对比目标岗位要求">
              <div className="flex flex-wrap gap-2">
                {report.missingKeywords.map((keyword) => (
                  <Tag key={keyword} tone="warning">
                    缺失 {keyword}
                  </Tag>
                ))}
              </div>
            </Card>

            <Card title="技能模块建议" icon={<Sparkles className="h-4 w-4" />}>
              <div className="flex flex-wrap gap-2">
                {report.suggestedSkills.map((skill) => (
                  <Tag key={skill} tone="primary">
                    {skill}
                  </Tag>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-6">
                建议在简历中按“产品能力 / AI 能力 / 数据能力 / 工具”分类展示，并优先放置岗位高频关键词。
              </p>
            </Card>

            <Card
              title="项目经历草稿"
              subtitle="可继续按真实经历补充验证方式和结果"
              icon={<BriefcaseBusiness className="h-4 w-4" />}
            >
              <div className="space-y-3">
                {report.projectExperienceDraft.map((draft, index) => (
                  <div
                    key={`${index}-${draft}`}
                    className="p-4 rounded-xl border border-border bg-background text-sm leading-7"
                  >
                    <div className="text-xs text-primary font-medium mb-1">
                      项目经历 {index + 1}
                    </div>
                    {draft}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="自我评价草稿" icon={<UserRound className="h-4 w-4" />}>
              <div className="p-4 rounded-xl bg-primary-soft/60 text-sm leading-7">
                {report.selfEvaluationDraft}
              </div>
            </Card>

            <Card title="优化建议" icon={<Sparkles className="h-4 w-4" />}>
              <div className="space-y-2">
                {report.optimizationAdvice.map((advice) => (
                  <div
                    key={advice}
                    className="p-3 rounded-xl bg-muted/60 text-sm text-foreground/85 leading-6"
                  >
                    {advice}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="风险点" icon={<AlertCircle className="h-4 w-4" />}>
              <ul className="space-y-2 text-sm text-foreground/85 list-disc pl-4">
                {report.riskPoints.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </Card>
          </>
        )}
      </div>
    </MobileShell>
  );
}

function ScoreRing({ value }: { value: number }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="var(--muted)"
          strokeWidth="7"
          fill="none"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="var(--primary)"
          strokeWidth="7"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold tabular-nums">
        {value}
      </div>
    </div>
  );
}
