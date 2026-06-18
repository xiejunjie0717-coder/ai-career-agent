import { createFileRoute } from "@tanstack/react-router";
import { Upload, FileText, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { Card, PrimaryButton, Tag, ProgressBar } from "@/components/ui-primitives";

export const Route = createFileRoute("/resume")({
  head: () => ({ meta: [{ title: "简历优化" }] }),
  component: ResumePage,
});

function ResumePage() {
  const score = 72;
  return (
    <MobileShell title="简历优化" showBack
      footer={<PrimaryButton icon={<Sparkles className="h-4 w-4" />}>一键生成优化版简历</PrimaryButton>}>
      <div className="space-y-5">
        <Card>
          <button className="w-full flex flex-col items-center justify-center py-6 border-2 border-dashed border-border rounded-xl hover:border-primary/40 transition">
            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
            <div className="text-sm font-medium">上传简历</div>
            <div className="text-xs text-muted-foreground mt-0.5">支持 PDF / Word,最大 10MB</div>
          </button>
        </Card>

        <Card title="简历评分">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" stroke="var(--muted)" strokeWidth="7" fill="none" />
                <circle cx="40" cy="40" r="32" stroke="var(--primary)" strokeWidth="7" fill="none"
                  strokeDasharray={2 * Math.PI * 32} strokeDashoffset={(2 * Math.PI * 32) * (1 - score / 100)}
                  strokeLinecap="round" transform="rotate(-90 40 40)" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold tabular-nums">{score}</div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">还有提升空间</div>
              <div className="text-xs text-muted-foreground mt-1">3 处关键问题,5 处可优化</div>
              <Tag tone="warning">建议优化</Tag>
            </div>
          </div>
        </Card>

        <Card title="关键词分析" subtitle="对比目标岗位 JD">
          <div className="space-y-2">
            <div className="flex justify-between text-xs"><span>命中关键词</span><span className="text-emerald-600 tabular-nums">8 / 15</span></div>
            <ProgressBar value={53} />
            <div className="flex flex-wrap gap-1.5 pt-2">
              {["PRD","用户研究","Figma","项目管理","Axure"].map(t => <Tag key={t} tone="success">✓ {t}</Tag>)}
              {["Prompt","Agent","SQL","数据分析"].map(t => <Tag key={t} tone="warning">缺失 {t}</Tag>)}
            </div>
          </div>
        </Card>

        <Card title="岗位匹配分析">
          <div className="space-y-2.5 text-sm">
            {[["项目经验匹配",60],["技能匹配",53],["教育背景匹配",90],["亮点呈现",45]].map(([k,v]) => (
              <div key={k as string}>
                <div className="flex justify-between text-xs mb-1"><span>{k}</span><span className="tabular-nums">{v}%</span></div>
                <ProgressBar value={v as number} />
              </div>
            ))}
          </div>
        </Card>

        <Card title="问题诊断" icon={<AlertCircle className="h-4 w-4" />}>
          <ul className="space-y-2 text-sm">
            {[
              "项目经历缺少量化结果(数据 / 指标)",
              "未体现 AI 相关实践",
              "技能列表过于笼统",
            ].map(p => (
              <li key={p} className="flex gap-2"><span className="text-amber-500">•</span><span>{p}</span></li>
            ))}
          </ul>
        </Card>

        <Card title="优化建议" icon={<Sparkles className="h-4 w-4" />}>
          <div className="space-y-2 text-sm">
            {[
              "把「负责产品迭代」改成「主导 3 次迭代,DAU 提升 18%」",
              "新增 AI 实践板块,加入 1 个 Agent 项目",
              "拆分技能为「产品 / AI / 数据」三类",
            ].map(s => (
              <div key={s} className="p-3 rounded-xl bg-primary-soft/60 text-foreground/85">{s}</div>
            ))}
          </div>
        </Card>

        <Card title="优化前后对比" icon={<FileText className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-muted/60">
              <div className="text-muted-foreground mb-1">原版</div>
              <div>负责产品迭代,推动需求落地</div>
            </div>
            <div className="p-3 rounded-xl bg-primary-soft border border-primary/30">
              <div className="text-primary mb-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />优化后</div>
              <div>主导产品 3 次迭代,DAU +18%,留存 +12%</div>
            </div>
          </div>
        </Card>
      </div>
    </MobileShell>
  );
}