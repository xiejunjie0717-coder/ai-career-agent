import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/ui-primitives";
import { loadState, saveState } from "@/lib/agent-store";
import { analyzeAbilityProfile, generateGapReport } from "@/lib/ai";

export const Route = createFileRoute("/assessment")({
  head: () => ({ meta: [{ title: "能力评估 — 职途 Agent" }] }),
  component: AssessmentPage,
});

const EDUCATION = ["专科", "本科", "硕士", "博士"];
const EXPERIENCE = ["无经验", "1 个项目", "2 个项目以上"];
const SKILLS = ["PRD","Figma","Prompt","Agent","Python","SQL","数据分析","用户研究","项目管理","Axure","Tableau","机器学习"];

function AssessmentPage() {
  const navigate = useNavigate();

  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    const s = loadState();

    setEducation(s.education || "本科");
    setExperience(s.experience || "1 个项目");
    setSkills(
      s.skills.length
        ? s.skills
        : ["PRD", "Figma"]
    );
    setStrengths(s.strengths);
    setWeaknesses(s.weaknesses);
  }, []);

  const toggle = (s: string) =>
    setSkills((p) =>
      p.includes(s)
        ? p.filter((x) => x !== s)
        : [...p, s]
    );

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

      const gapReport = state.jobProfile
        ? generateGapReport(state.jobProfile, profile)
        : null;

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

      navigate({ to: "/gap" });

    } catch (err) {
      console.error("AI分析失败:", err);

      setResult(
        "AI分析失败，请检查API Key、网络连接或SiliconFlow余额。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileShell
      title="能力评估"
      showBack
      footer={<PrimaryButton onClick={onNext} icon={<ArrowRight className="h-4 w-4" />}>{loading ? "AI分析中..." : "开始AI评估"}</PrimaryButton>}
    >
      <div className="space-y-7">
        <div className="space-y-1.5">
          <div className="text-xs text-muted-foreground">Step 2 / 3</div>
          <h1 className="text-[22px] font-semibold tracking-tight">告诉我们你的真实情况</h1>
          <p className="text-sm text-muted-foreground">越真实,分析越精准。</p>
        </div>

        <Section title="学历"><Pills options={EDUCATION} value={education} onChange={setEducation} /></Section>
        <Section title="项目经验"><Pills options={EXPERIENCE} value={experience} onChange={setExperience} /></Section>

        <Section title="掌握技能" hint={`已选 ${skills.length} 项`}>
          <div className="grid grid-cols-3 gap-2">
            {SKILLS.map(s => {
              const active = skills.includes(s);
              return (
                <button key={s} onClick={() => toggle(s)}
                  className={`h-10 px-2 rounded-xl border text-sm font-medium flex items-center justify-center gap-1 transition ${
                    active ? "border-primary bg-primary-soft text-accent-foreground" : "border-border bg-card text-foreground"
                  }`}>
                  {active && <Check className="h-3.5 w-3.5" />}
                  <span className="truncate">{s}</span>
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="个人优势">
          <textarea value={strengths} onChange={e => setStrengths(e.target.value)} rows={3}
            placeholder="例如:逻辑清晰、有 B 端实习经验……"
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 resize-none" />
        </Section>

        <Section title="个人短板">
          <textarea value={weaknesses} onChange={e => setWeaknesses(e.target.value)} rows={3}
            placeholder="例如:数据分析较弱,缺少完整项目交付……"
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 resize-none" />
        </Section>
        {result && (
  <div className="rounded-2xl border border-border bg-card p-4">
    <h3 className="font-semibold mb-3">
      AI能力评估结果
    </h3>

    <div className="whitespace-pre-wrap text-sm">
      {result}
    </div>
  </div>
)}
      </div>
    </MobileShell>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
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

function Pills({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const active = value === o;
        return (
          <button key={o} onClick={() => onChange(o)}
            className={`px-4 h-9 rounded-full text-sm font-medium border transition ${
              active ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"
            }`}>{o}</button>
        );
      })}
    </div>
  );
}
