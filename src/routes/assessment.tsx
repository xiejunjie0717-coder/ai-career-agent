import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/EmptyState";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { PrimaryButton } from "@/components/ui-primitives";
import { loadState, saveState } from "@/lib/agent-store";
import { analyzeAbilityProfile, generateGapReport } from "@/lib/ai";
import { workflowPageMeta } from "@/lib/workflow-ui";

export const Route = createFileRoute("/assessment")({
  head: () => ({ meta: [{ title: "能力评估 — 职途 Agent" }] }),
  component: AssessmentPage,
});

const EDUCATION = ["专科", "本科", "硕士", "博士"];
const EXPERIENCE = ["无经验", "1 个项目", "2 个项目以上"];
const SKILLS = [
  "PRD",
  "Figma",
  "Prompt",
  "Agent",
  "Python",
  "SQL",
  "数据分析",
  "用户研究",
  "项目管理",
  "Axure",
  "Tableau",
  "机器学习",
];

function AssessmentPage() {
  const navigate = useNavigate();

  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [hasJobProfile, setHasJobProfile] = useState(true);

  useEffect(() => {
    const s = loadState();
    setHasJobProfile(Boolean(s.jobProfile));

    setEducation(s.education || "本科");
    setExperience(s.experience || "1 个项目");
    setSkills(s.skills.length ? s.skills : ["PRD", "Figma"]);
    setStrengths(s.strengths);
    setWeaknesses(s.weaknesses);
  }, []);

  const toggle = (s: string) =>
    setSkills((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const onNext = async () => {
    try {
      setLoading(true);

      const state = loadState();

      const { profile, text } = await analyzeAbilityProfile({
        targetJob: state.targetJob,
        education,
        experience,
        skills,
        strengths,
        weaknesses,
        jobProfile: state.jobProfile,
      });

      const gapReport = state.jobProfile ? generateGapReport(state.jobProfile, profile) : null;

      setResult(text);

      saveState({
        education,
        experience,
        skills,
        strengths,
        weaknesses,
        abilityProfile: profile,
        gapReport,
        roadmap: null,
        projects: [],
        resumeReport: null,
        interviewReport: null,
      });

      toast.success("能力画像已生成");
      navigate({ to: "/gap" });
    } catch (err) {
      console.error("AI分析失败:", err);

      setResult("AI分析失败，请检查API Key、网络连接或SiliconFlow余额。");
      toast.error("能力评估失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  if (!hasJobProfile) {
    return (
      <MobileShell title="能力评估" showBack>
        <PageHeader {...workflowPageMeta.assessment} backTo="/analysis" />
        <div className="mt-6">
          <EmptyState
            title="请先完成岗位分析"
            description="能力评估需要岗位画像作为对照基准，完成岗位分析后再填写个人信息。"
            actionLabel="前往岗位分析"
            to="/analysis"
          />
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell
      title="能力评估"
      showBack
      footer={
        <PrimaryButton onClick={onNext} icon={<ArrowRight className="h-4 w-4" />}>
          {loading ? "AI分析中..." : "开始AI评估"}
        </PrimaryButton>
      }
    >
      <div className="space-y-6">
        <PageHeader {...workflowPageMeta.assessment} backTo="/analysis" />

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <SectionCard
            title="个人能力输入"
            description="请按真实情况填写，系统不会自动补充不存在的经历。"
          >
            <div className="space-y-7">
              <Section title="学历">
                <Pills options={EDUCATION} value={education} onChange={setEducation} />
              </Section>
              <Section title="项目经验">
                <Pills options={EXPERIENCE} value={experience} onChange={setExperience} />
              </Section>

              <Section title="掌握技能" hint={`已选 ${skills.length} 项`}>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {SKILLS.map((s) => {
                    const active = skills.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggle(s)}
                        className={`h-10 px-2 rounded-xl border text-sm font-medium flex items-center justify-center gap-1 transition ${
                          active
                            ? "border-primary bg-primary-soft text-accent-foreground"
                            : "border-border bg-card text-foreground"
                        }`}
                      >
                        {active && <Check className="h-3.5 w-3.5" />}
                        <span className="truncate">{s}</span>
                      </button>
                    );
                  })}
                </div>
              </Section>

              <Section title="个人优势">
                <textarea
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  rows={4}
                  placeholder="例如：逻辑清晰、有 B 端实习经验、能独立完成产品方案……"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-ring/40 resize-none"
                />
              </Section>

              <Section title="个人短板">
                <textarea
                  value={weaknesses}
                  onChange={(e) => setWeaknesses(e.target.value)}
                  rows={4}
                  placeholder="例如：数据分析较弱、缺少完整项目交付、面试表达不够结构化……"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-ring/40 resize-none"
                />
              </Section>
            </div>
          </SectionCard>

          <SectionCard
            title="评估说明"
            description="提交后会生成 AbilityProfile，并自动计算 Gap 报告。"
          >
            <div className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>评估会结合岗位画像，而不是使用固定评分模板。</p>
              <p>重点输出匹配度、可证明优势、能力差距和下一步建议。</p>
              <p>生成成功后将自动进入差距诊断页面。</p>
            </div>
            {loading ? (
              <div className="mt-5 rounded-2xl bg-primary-soft/60 p-4 text-sm text-primary">
                正在结合岗位要求分析个人能力，请稍候……
              </div>
            ) : null}
            {result ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {result}
              </div>
            ) : null}
          </SectionCard>
        </div>
      </div>
    </MobileShell>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Pills({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`px-4 h-9 rounded-full text-sm font-medium border transition ${
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
