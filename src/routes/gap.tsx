import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ThumbsUp, AlertTriangle, Lightbulb } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { Card, PrimaryButton, ProgressBar } from "@/components/ui-primitives";

export const Route = createFileRoute("/gap")({
  head: () => ({ meta: [{ title: "能力差距分析" }] }),
  component: GapPage,
});

const DIMS = [
  { k: "产品能力", v: 70 },
  { k: "AI 能力", v: 35 },
  { k: "技术能力", v: 55 },
  { k: "沟通能力", v: 80 },
  { k: "数据分析", v: 45 },
];

function GapPage() {
  const navigate = useNavigate();
  const match = 42;

  return (
    <MobileShell
      title="能力差距分析"
      showBack
      footer={<PrimaryButton onClick={() => navigate({ to: "/roadmap" })} icon={<ArrowRight className="h-4 w-4" />}>生成成长路线</PrimaryButton>}
    >
      <div className="space-y-5">
        <Card>
          <div className="flex items-center gap-4">
            <MatchRing value={match} />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">岗位匹配度</div>
              <div className="text-2xl font-semibold tracking-tight">{match}%</div>
              <div className="text-xs text-amber-600 mt-1">仍有较大成长空间</div>
            </div>
          </div>
        </Card>

        <Card title="能力雷达图" subtitle="基于你的回答与岗位要求对比">
          <RadarChart />
          <div className="space-y-2 pt-2">
            {DIMS.map(d => (
              <div key={d.k}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{d.k}</span><span className="tabular-nums text-muted-foreground">{d.v}/100</span>
                </div>
                <ProgressBar value={d.v} />
              </div>
            ))}
          </div>
        </Card>

        <Card title="优势分析" icon={<ThumbsUp className="h-4 w-4" />}>
          <ul className="text-sm space-y-1.5 text-foreground/85 list-disc pl-4">
            <li>沟通能力突出,适合协作密集型岗位</li>
            <li>产品基础扎实,有完整 PRD 撰写经验</li>
          </ul>
        </Card>

        <Card title="短板分析" icon={<AlertTriangle className="h-4 w-4" />}>
          <ul className="text-sm space-y-1.5 text-foreground/85 list-disc pl-4">
            <li><span className="font-medium text-amber-700">AI 能力薄弱</span>:缺少 Prompt / Agent 实操项目</li>
            <li><span className="font-medium text-amber-700">数据分析不足</span>:SQL 仅停留在基础查询</li>
          </ul>
        </Card>

        <Card title="改进建议" icon={<Lightbulb className="h-4 w-4" />}>
          <ol className="text-sm space-y-2 text-foreground/85 list-decimal pl-4">
            <li>2 周内完成 1 个 Agent 实战项目并上线</li>
            <li>每天 30 分钟练 SQL,1 个月达到中级</li>
            <li>读《俞军产品方法论》构建 AI 产品认知</li>
          </ol>
        </Card>
      </div>
    </MobileShell>
  );
}

function MatchRing({ value }: { value: number }) {
  const r = 28, c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} stroke="var(--muted)" strokeWidth="6" fill="none" />
      <circle cx="36" cy="36" r={r} stroke="var(--primary)" strokeWidth="6" fill="none"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        transform="rotate(-90 36 36)" />
      <text x="36" y="40" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--foreground)">{value}%</text>
    </svg>
  );
}

function RadarChart() {
  const cx = 110, cy = 100, R = 70;
  const n = DIMS.length;
  const pts = (scale: number) => DIMS.map((_, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = R * scale;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  });
  const polyStr = (pp: readonly (readonly [number, number])[]) => pp.map(p => p.join(",")).join(" ");
  const grid = [0.25, 0.5, 0.75, 1];
  const valPts = DIMS.map((d, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = R * (d.v / 100);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  });
  return (
    <svg viewBox="0 0 220 200" className="w-full">
      {grid.map(g => (
        <polygon key={g} points={polyStr(pts(g))} fill="none" stroke="var(--border)" strokeWidth="1" />
      ))}
      {pts(1).map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="var(--border)" strokeWidth="1" />
      ))}
      <polygon points={polyStr(valPts)} fill="var(--primary)" fillOpacity="0.2" stroke="var(--primary)" strokeWidth="2" />
      {DIMS.map((d, i) => {
        const a = (Math.PI * 2 * i) / n - Math.PI / 2;
        const r = R + 16;
        const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
        return <text key={d.k} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="var(--muted-foreground)">{d.k}</text>;
      })}
    </svg>
  );
}