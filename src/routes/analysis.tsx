
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, TrendingUp, DollarSign, Briefcase, BookOpen, Lightbulb, Building2 } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { Card, Tag, PrimaryButton } from "@/components/ui-primitives";
import { loadState, type AgentState } from "@/lib/agent-store";
import { analyzeJob } from "@/lib/ai";

export const Route = createFileRoute("/analysis")({
  head: () => ({ meta: [{ title: "岗位分析 — 职途 Agent" }] }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<AgentState | null>(null);
  const [analysis, setAnalysis] = useState("");
  useEffect(() => {
  const s = loadState();
  setState(s);

  if (s?.targetJob) {
    analyzeJob(s.targetJob).then(setAnalysis);
  }
}, []);
  if (!state) return null;
  const job = state.targetJob || "AI 产品经理";
  const company = state.dreamCompany || "字节跳动";

  return (
    <MobileShell
      title="岗位分析"
      showBack
      footer={<PrimaryButton onClick={() => navigate({ to: "/assessment" })} icon={<ArrowRight className="h-4 w-4" />}>开始能力评估</PrimaryButton>}
    >
      <div className="space-y-5">
        <Card title="AI分析结果">
  <div className="whitespace-pre-wrap text-sm">
    {analysis || "AI分析中..."}
  </div>
</Card>
        <div className="rounded-2xl bg-gradient-to-br from-primary to-blue-500 text-primary-foreground p-5 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs opacity-80">
            <Building2 className="h-3.5 w-3.5" /> {company}
          </div>
          <div className="text-xl font-semibold mt-1 tracking-tight">{job}</div>
          <div className="flex gap-2 mt-3">
            <span className="px-2 py-0.5 rounded-md bg-white/15 text-[11px]">应届 / 1-3年</span>
            <span className="px-2 py-0.5 rounded-md bg-white/15 text-[11px]">本科及以上</span>
          </div>
        </div>

        <Card title="岗位职责" icon={<Briefcase className="h-4 w-4" />}>
          <ul className="space-y-2 text-sm text-foreground/85 leading-relaxed list-disc pl-4">
            <li>负责 AI 产品 0-1 设计与迭代,定义产品功能和体验</li>
            <li>结合大模型能力,设计可落地的 AI 应用场景</li>
            <li>协调研发、设计、运营,推动产品上线</li>
          </ul>
        </Card>

        <Card title="企业真实需求" subtitle={`基于 ${company} 近 30 天 JD 抓取`}>
          <div className="space-y-2 text-sm">
            <Req label="懂 LLM / Prompt 工程" weight={92} />
            <Req label="有数据分析 & SQL 基础" weight={78} />
            <Req label="完整产品交付经验" weight={70} />
            <Req label="行业敏感度(教育/金融/B端)" weight={55} />
          </div>
        </Card>

        <Card title="核心技能要求">
          <div className="flex flex-wrap gap-2">
            {["Prompt工程","Agent设计","PRD","Figma","用户研究","SQL","数据分析","项目管理"].map(s => (
              <Tag key={s} tone="primary">{s}</Tag>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Stat icon={<TrendingUp className="h-4 w-4" />} label="行业趋势" value="+38%" hint="3年岗位增速" />
          <Stat icon={<DollarSign className="h-4 w-4" />} label="薪资区间" value="18-35K" hint="一线 · 应届" />
        </div>

        <Card title="晋升路径">
          <ol className="relative ml-3 space-y-3.5 border-l border-border pl-5">
            {[
              { t: "产品助理 / APM", y: "0-1年 · 8-15K" },
              { t: "产品经理", y: "1-3年 · 18-30K" },
              { t: "高级产品经理", y: "3-5年 · 30-50K" },
              { t: "产品总监", y: "5年+ · 50K+" },
            ].map((s, i) => (
              <li key={s.t} className="relative">
                <span className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-background ${i === 0 ? "bg-primary" : "bg-muted-foreground/40"}`} />
                <div className="text-sm font-medium">{s.t}</div>
                <div className="text-xs text-muted-foreground">{s.y}</div>
              </li>
            ))}
          </ol>
        </Card>

        <Card title="典型项目案例" icon={<Lightbulb className="h-4 w-4" />}>
          <div className="space-y-2">
            {["智能客服 Agent 从 0 到 1","教育场景大模型应用设计","To B 产品 PMF 验证"].map(p => (
              <div key={p} className="p-3 rounded-xl bg-muted/60 text-sm">{p}</div>
            ))}
          </div>
        </Card>

        <Card title="推荐学习内容" icon={<BookOpen className="h-4 w-4" />}>
          <div className="space-y-2 text-sm">
            {[
              { t: "《俞军产品方法论》", k: "书籍" },
              { t: "DeepLearning.AI Prompt 课程", k: "课程" },
              { t: "Lenny's Newsletter AI 系列", k: "文章" },
            ].map(r => (
              <div key={r.t} className="flex items-center justify-between p-3 rounded-xl border border-border">
                <span>{r.t}</span>
                <Tag tone="muted">{r.k}</Tag>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MobileShell>
  );
}

function Req({ label, weight }: { label: string; weight: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span className="text-foreground/80">{label}</span><span className="tabular-nums">{weight}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${weight}%` }} />
      </div>
    </div>
  );
}

function Stat({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="text-xl font-semibold tracking-tight mt-1">{value}</div>
      <div className="text-[11px] text-muted-foreground">{hint}</div>
    </div>
  );
}