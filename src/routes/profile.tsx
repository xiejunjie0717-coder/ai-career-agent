import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Settings, Heart, Folder, BookOpen, BarChart3 } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { Card } from "@/components/ui-primitives";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "个人中心" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <MobileShell showTabs rightSlot={<Settings className="h-5 w-5 text-muted-foreground" />}>
      <div className="space-y-5">
        <div className="flex items-center gap-4 pt-1">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-primary-foreground text-2xl font-semibold">
            李
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-lg font-semibold">李同学</div>
            <div className="text-xs text-muted-foreground mt-0.5">目标 · AI 产品经理 @ 字节跳动</div>
            <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-primary-soft text-[11px] text-accent-foreground font-medium">
              成长等级 Lv.3 · 探索者
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Stat value="12" label="学习天数" />
          <Stat value="48h" label="累计时长" />
          <Stat value="3" label="完成项目" />
        </div>

        <Card title="能力成长曲线" icon={<BarChart3 className="h-4 w-4" />}>
          <GrowthChart />
          <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
            <span>第1周</span><span>第2周</span><span>第3周</span><span>第4周</span><span>本周</span>
          </div>
        </Card>

        <Card title="快捷入口">
          <div className="divide-y divide-border -mx-1">
            <Row icon={<Folder className="h-4 w-4 text-rose-500" />} label="已完成项目" hint="3" to="/projects" />
            <Row icon={<BookOpen className="h-4 w-4 text-emerald-500" />} label="学习记录" hint="48 小时" to="/tasks" />
            <Row icon={<Heart className="h-4 w-4 text-rose-500" />} label="收藏岗位" hint="8" to="/jobs" />
            <Row icon={<Settings className="h-4 w-4 text-muted-foreground" />} label="系统设置" />
          </div>
        </Card>
      </div>
    </MobileShell>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <div className="text-xl font-semibold tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function Row({ icon, label, hint, to }: { icon: React.ReactNode; label: string; hint?: string; to?: string }) {
  const inner = (
    <div className="flex items-center gap-3 px-1 py-3">
      <span>{icon}</span>
      <span className="flex-1 text-sm">{label}</span>
      {hint && <span className="text-xs text-muted-foreground tabular-nums">{hint}</span>}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : <div>{inner}</div>;
}

function GrowthChart() {
  const pts = [20, 35, 30, 55, 70];
  const W = 240, H = 80, step = W / (pts.length - 1);
  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${H - (v / 100) * H}`).join(" ");
  const area = path + ` L ${W} ${H} L 0 ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g)" />
      <path d={path} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((v, i) => (
        <circle key={i} cx={i * step} cy={H - (v / 100) * H} r="3" fill="var(--background)" stroke="var(--primary)" strokeWidth="2" />
      ))}
    </svg>
  );
}