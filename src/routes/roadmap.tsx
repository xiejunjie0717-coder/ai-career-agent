import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Folder, Calendar, Trophy } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { Card, PrimaryButton, ProgressBar } from "@/components/ui-primitives";

export const Route = createFileRoute("/roadmap")({
  head: () => ({ meta: [{ title: "成长路线 — 职途 Agent" }] }),
  component: RoadmapPage,
});

const PHASES = [
  { d: 30, t: "夯实基础", color: "from-blue-400 to-primary",
    items: [
      { type: "每日", text: "30min Prompt 练习 + 复盘" },
      { type: "每周", text: "完成 1 章《俞军产品方法论》" },
      { type: "课程", text: "DeepLearning.AI Prompt Engineering" },
      { type: "项目", text: "搭建一个 ChatGPT 个人助手" },
    ] },
  { d: 60, t: "实战进阶", color: "from-primary to-violet-500",
    items: [
      { type: "每日", text: "1 道 SQL 题 + 1 篇行业文章" },
      { type: "每周", text: "拆解 1 个明星 AI 产品并写分析" },
      { type: "课程", text: "吴恩达《LangChain for LLM》" },
      { type: "项目", text: "完成 1 个 Agent 全链路项目" },
    ] },
  { d: 90, t: "冲刺 Offer", color: "from-violet-500 to-fuchsia-500",
    items: [
      { type: "每日", text: "30min 模拟面试 + 复盘" },
      { type: "每周", text: "投递 5 个目标公司岗位" },
      { type: "书籍", text: "《结构化思维》面试准备" },
      { type: "项目", text: "包装作品集 & 上线个人站" },
    ] },
];

function RoadmapPage() {
  const navigate = useNavigate();
  return (
    <MobileShell
      title="成长路线"
      showBack
      footer={<PrimaryButton onClick={() => navigate({ to: "/tasks" })} icon={<ArrowRight className="h-4 w-4" />}>开始执行</PrimaryButton>}
    >
      <div className="space-y-5">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs text-muted-foreground">成长进度</div>
              <div className="text-lg font-semibold">90 天 AI 产品经理冲刺</div>
            </div>
            <div className="text-2xl font-semibold text-primary tabular-nums">12<span className="text-sm text-muted-foreground">/90</span></div>
          </div>
          <ProgressBar value={12} max={90} />
          <div className="flex justify-between mt-3 text-[11px] text-muted-foreground">
            <span className="text-primary font-medium">✓ 入门</span>
            <span>进阶</span><span>实战</span><span>Offer</span>
          </div>
        </Card>

        {PHASES.map((p, i) => (
          <div key={p.d} className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className={`bg-gradient-to-r ${p.color} text-primary-foreground px-5 py-3.5 flex items-center justify-between`}>
              <div>
                <div className="text-[11px] uppercase tracking-wider opacity-80">阶段 {i + 1}</div>
                <div className="font-semibold">{p.t}</div>
              </div>
              <div className="text-2xl font-semibold tabular-nums">{p.d}天</div>
            </div>
            <ul className="p-4 space-y-2">
              {p.items.map((it, idx) => (
                <li key={idx} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/50">
                  <span className="mt-0.5"><IconFor type={it.type} /></span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-muted-foreground">{it.type}任务</div>
                    <div className="text-sm text-foreground leading-snug">{it.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <Card title="里程碑系统" icon={<Trophy className="h-4 w-4" />}>
          <div className="grid grid-cols-3 gap-2">
            {[
              { t: "首个项目上线", done: true },
              { t: "30 天打卡", done: false },
              { t: "首面邀请", done: false },
            ].map(m => (
              <div key={m.t} className={`p-3 rounded-xl text-center ${m.done ? "bg-primary-soft" : "bg-muted/60"}`}>
                <div className={`text-2xl ${m.done ? "" : "grayscale opacity-50"}`}>🏅</div>
                <div className="text-[11px] mt-1">{m.t}</div>
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
    "每日": <Calendar className="h-4 w-4 text-blue-500" />,
    "每周": <Calendar className="h-4 w-4 text-violet-500" />,
    "课程": <BookOpen className="h-4 w-4 text-emerald-500" />,
    "书籍": <BookOpen className="h-4 w-4 text-amber-500" />,
    "项目": <Folder className="h-4 w-4 text-rose-500" />,
  };
  return <>{map[type]}</>;
}