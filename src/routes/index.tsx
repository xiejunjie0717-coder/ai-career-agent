import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Briefcase, Building2, Target, Brain, Map, FileText, Mic, Trophy, Compass } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { loadState, saveState } from "@/lib/agent-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "职途 Agent — 你的专属AI职业教练" },
      { name: "description", content: "从职业迷茫到拿到 Offer 的一站式 AI 职业成长平台。" },
    ],
  }),
  component: Index,
});

const SUGGESTED_JOBS = ["AI产品经理", "产品经理", "数据分析师", "前端工程师"];
const SUGGESTED_COMPANIES = ["字节跳动", "阿里巴巴", "腾讯", "美团"];

const QUICK_ACTIONS = [
  { to: "/analysis", label: "岗位分析", icon: Target, color: "bg-blue-50 text-blue-600" },
  { to: "/assessment", label: "能力评估", icon: Brain, color: "bg-violet-50 text-violet-600" },
  { to: "/roadmap", label: "学习路线", icon: Map, color: "bg-emerald-50 text-emerald-600" },
  { to: "/upload", label: "上传JD", icon: FileText, color: "bg-amber-50 text-amber-600" },
  { to: "/interview", label: "模拟面试", icon: Mic, color: "bg-rose-50 text-rose-600" },
  { to: "/offers", label: "Offer管理", icon: Trophy, color: "bg-cyan-50 text-cyan-600" },
  { to: "/jobs", label: "岗位推荐", icon: Compass, color: "bg-indigo-50 text-indigo-600" },
  { to: "/projects", label: "项目实战", icon: Sparkles, color: "bg-fuchsia-50 text-fuchsia-600" },
  {to: "/rag",label: "RAG知识库",icon: Brain,color: "bg-green-50 text-green-600"},
] as const;

function Index() {
  const navigate = useNavigate();
  const [targetJob, setTargetJob] = useState("");
  const [dreamCompany, setDreamCompany] = useState("");

  useEffect(() => {
    const s = loadState();
    setTargetJob(s.targetJob);
    setDreamCompany(s.dreamCompany);
  }, []);

  const canStart = targetJob.trim().length > 1;

  const onStart = () => {
    if (!canStart) return;
    saveState({ targetJob: targetJob.trim(), dreamCompany: dreamCompany.trim() });
    navigate({ to: "/analysis" });
  };

  return (
    <MobileShell
      showTabs
    >
      <div className="space-y-7">
        <div className="space-y-2 pt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-soft text-accent-foreground text-xs font-medium">
            <Sparkles className="h-3 w-3" /> AI 职业成长 Agent
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight leading-tight">
            你的专属<span className="text-primary">AI 职业教练</span>
          </h1>
          <p className="text-muted-foreground text-[14px] leading-relaxed">
            从迷茫到 Offer，一站式陪你走完职业成长每一步。
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft/60 via-background to-background p-5 space-y-4 shadow-sm">
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
            onClick={onStart}
            disabled={!canStart}
            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity shadow-sm shadow-primary/30"
          >
            开始职业规划 <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold tracking-tight px-1">快捷功能</h2>
          <div className="grid grid-cols-4 gap-2">
            {QUICK_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.to}
                  to={a.to}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-card border border-border/60 hover:border-primary/40 active:scale-95 transition"
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${a.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] text-foreground font-medium">{a.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary-soft flex items-center justify-center">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">连续学习 12 天</div>
            <div className="text-xs text-muted-foreground">今日还有 3 个任务待完成</div>
          </div>
          <Link to="/tasks" className="text-xs font-medium text-primary px-3 py-1.5 rounded-full bg-primary-soft">
            去打卡
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}

function Field({
  icon, label, value, onChange, placeholder, suggestions,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
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
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 px-4 rounded-xl border border-input bg-background text-[15px] focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition"
      />
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className="px-2.5 py-1 text-xs rounded-full bg-background border border-border hover:bg-primary-soft hover:border-primary/40 text-muted-foreground hover:text-accent-foreground transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
