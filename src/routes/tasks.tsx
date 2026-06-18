import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Flame, Clock, Award } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { Card, Tag } from "@/components/ui-primitives";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "任务中心" }] }),
  component: TasksPage,
});

const TODAY = [
  { t: "完成 5 道 SQL 练习", est: "30分钟", done: false },
  { t: "阅读《俞军产品方法论》第 2 章", est: "45分钟", done: false },
  { t: "Prompt 工程小练习 ×3", est: "20分钟", done: true },
];
const WEEK = [
  { t: "完成 Agent 项目原型", est: "本周内" },
  { t: "拆解 ChatGPT 产品体验", est: "本周内" },
];
const DONE = [
  "搭建个人 GPT 助手", "阅读 LLM 应用综述", "完成 3 篇行业分析",
];
const BADGES = [
  { e: "🔥", t: "学习狂人" },
  { e: "📚", t: "阅读达人" },
  { e: "🤖", t: "AI 入门" },
  { e: "🏆", t: "Lv.3 成长者" },
];

function TasksPage() {
  const [tab, setTab] = useState<"today" | "week" | "done">("today");
  return (
    <MobileShell title="任务中心" showTabs rightSlot={<button className="text-xs text-primary font-medium">设置</button>}>
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-2">
          <Stat icon={<Flame className="h-4 w-4 text-orange-500" />} value="12" label="连续学习天" />
          <Stat icon={<Clock className="h-4 w-4 text-blue-500" />} value="48h" label="累计时长" />
          <Stat icon={<Award className="h-4 w-4 text-amber-500" />} value="Lv.3" label="成长等级" />
        </div>

        <div className="flex gap-1 p-1 bg-muted rounded-xl">
          {[
            { k: "today", l: "今日" },
            { k: "week", l: "本周" },
            { k: "done", l: "已完成" },
          ].map(t => (
            <button key={t.k} onClick={() => setTab(t.k as typeof tab)}
              className={`flex-1 h-9 rounded-lg text-sm font-medium transition ${tab === t.k ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
              {t.l}
            </button>
          ))}
        </div>

        {tab === "today" && (
          <div className="space-y-2">
            {TODAY.map((t, i) => <TaskRow key={i} task={t} />)}
          </div>
        )}
        {tab === "week" && (
          <div className="space-y-2">
            {WEEK.map((t, i) => <TaskRow key={i} task={{ ...t, done: false }} />)}
          </div>
        )}
        {tab === "done" && (
          <div className="space-y-2">
            {DONE.map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 text-sm">
                <Check className="h-4 w-4 text-emerald-500" /><span className="line-through text-muted-foreground">{t}</span>
              </div>
            ))}
          </div>
        )}

        <Card title="成就徽章">
          <div className="grid grid-cols-4 gap-2">
            {BADGES.map(b => (
              <div key={b.t} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-muted/50">
                <div className="text-2xl">{b.e}</div>
                <div className="text-[11px]">{b.t}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MobileShell>
  );
}

function TaskRow({ task }: { task: { t: string; est: string; done: boolean } }) {
  const [done, setDone] = useState(task.done);
  return (
    <button onClick={() => setDone(!done)}
      className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition ${
        done ? "bg-muted/40 border-border" : "bg-card border-border hover:border-primary/40"
      }`}>
      <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
        done ? "bg-primary border-primary" : "border-border"
      }`}>
        {done && <Check className="h-3 w-3 text-primary-foreground" />}
      </span>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : ""}`}>{task.t}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">{task.est}</div>
      </div>
      <Tag tone="muted">+10 XP</Tag>
    </button>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}