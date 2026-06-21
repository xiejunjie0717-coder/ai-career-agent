import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { AsyncState } from "@/components/AsyncState";
import { EmptyState } from "@/components/EmptyState";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { PrimaryButton, Tag } from "@/components/ui-primitives";
import { analyzeJobProfile } from "@/lib/ai";
import { loadState, saveState, type AgentState } from "@/lib/agent-store";
import { workflowPageMeta } from "@/lib/workflow-ui";

export const Route = createFileRoute("/analysis")({
  head: () => ({ meta: [{ title: "岗位分析｜Pathwise Career" }] }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<AgentState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = async (current: AgentState) => {
    if (!current.targetJob.trim()) return;

    setLoading(true);
    setError("");
    try {
      const { profile } = await analyzeJobProfile({
        jobName: current.targetJob,
        company: current.dreamCompany,
        jdText: current.jdText,
      });
      saveState({
        jobProfile: profile,
        gapReport: null,
        roadmap: null,
        projects: [],
        resumeReport: null,
        interviewReport: null,
      });
      setState(loadState());
      toast.success("岗位画像已生成");
    } catch (cause) {
      console.error("岗位分析失败:", cause);
      setError("岗位分析暂时失败，请检查网络、服务端配置或稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const current = loadState();
    setState(current);
    if (!current.jobProfile && current.targetJob) {
      void runAnalysis(current);
    }
  }, []);

  if (!state) return null;

  if (!state.targetJob.trim()) {
    return (
      <MobileShell title="岗位分析" showBack>
        <PageHeader {...workflowPageMeta.analysis} />
        <div className="mt-6">
          <EmptyState
            title="请先设置目标岗位"
            description="岗位名称是生成岗位画像的必要输入，也可以先上传真实 JD 获得更准确的分析。"
            actionLabel="返回产品首页"
            to="/"
          />
        </div>
      </MobileShell>
    );
  }

  const profile = state.jobProfile;

  return (
    <MobileShell
      title="岗位分析"
      showBack
      footer={
        <PrimaryButton
          onClick={() => navigate({ to: "/assessment" })}
          disabled={!profile || loading}
          icon={<ArrowRight className="h-4 w-4" />}
        >
          开始能力评估
        </PrimaryButton>
      }
    >
      <div className="space-y-6">
        <PageHeader {...workflowPageMeta.analysis} />

        <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-5">
            <SectionCard
              title="分析输入"
              description="当前岗位信息会作为后续能力评估、简历和面试的共同上下文。"
            >
              <div className="space-y-3">
                <InputSummary icon={<Briefcase />} label="目标岗位" value={state.targetJob} />
                <InputSummary
                  icon={<Building2 />}
                  label="目标公司"
                  value={state.dreamCompany || "未指定公司"}
                />
                <InputSummary
                  icon={<FileText />}
                  label="JD 内容"
                  value={
                    state.jdText
                      ? `已载入 ${state.jdFileName || "PDF JD"} · ${state.jdText.length} 字`
                      : "未上传 JD，将基于岗位名称生成通用画像"
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => void runAnalysis(state)}
                disabled={loading}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-primary transition hover:border-primary/25 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {profile ? "重新分析岗位" : "开始分析"}
              </button>
            </SectionCard>

            {loading ? (
              <AsyncState
                status="loading"
                title="正在分析岗位要求"
                description="AI 正在提取岗位职责、核心技能、工具和招聘评估标准。"
              />
            ) : null}
            {error ? (
              <AsyncState
                status="error"
                title="岗位分析失败"
                description={error}
                onRetry={() => void runAnalysis(state)}
              />
            ) : null}
          </div>

          <div className="space-y-5">
            {profile ? (
              <>
                <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-blue-950 p-6 text-white shadow-xl shadow-slate-900/10">
                  <div className="text-xs text-blue-200">{profile.company || "目标公司待定"}</div>
                  <h2 className="mt-2 text-2xl font-semibold">{profile.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{profile.summary}</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <ResultList title="岗位职责" icon={<Target />} items={profile.responsibilities} />
                  <ResultList
                    title="评估标准"
                    icon={<CheckCircle2 />}
                    items={profile.evaluationCriteria}
                  />
                </div>
                <SectionCard title="核心能力与工具">
                  <div className="space-y-4">
                    <TagGroup label="必备技能" items={profile.requiredSkills} tone="primary" />
                    <TagGroup label="加分技能" items={profile.niceToHaveSkills} tone="success" />
                    <TagGroup
                      label="工具与关键词"
                      items={[...profile.tools, ...profile.keywords]}
                      tone="muted"
                    />
                  </div>
                </SectionCard>
              </>
            ) : !loading && !error ? (
              <AsyncState
                status="empty"
                title="等待生成岗位画像"
                description="确认左侧输入后开始分析，结果会显示在这里。"
              />
            ) : null}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

function InputSummary({
  icon,
  label,
  value,
}: {
  icon: React.ReactElement;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-muted/55 p-3">
      <span className="mt-0.5 text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

function ResultList({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactElement;
  items: string[];
}) {
  return (
    <SectionCard title={title}>
      <div className="mb-3 text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
      <ul className="space-y-2 text-sm leading-6 text-foreground/85">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

function TagGroup({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "primary" | "success" | "muted";
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Wrench className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Tag key={`${label}-${item}`} tone={tone}>
            {item}
          </Tag>
        ))}
      </div>
    </div>
  );
}
