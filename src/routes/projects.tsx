import { createFileRoute } from "@tanstack/react-router";
import { Star, Upload } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { Card, Tag, PrimaryButton } from "@/components/ui-primitives";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "项目实战" }] }),
  component: ProjectsPage,
});

const PROJECTS = [
  { t: "AI 智能客服 Agent", d: "中级", goal: "落地一个能多轮对话的客服 Agent", tags: ["LangChain","Prompt","UX"], score: 4.8 },
  { t: "招聘 JD 抓取分析工具", d: "初级", goal: "用爬虫 + LLM 提取岗位关键信息", tags: ["Python","LLM"], score: 4.5 },
  { t: "教育场景 AI 助教", d: "高级", goal: "为 K12 设计一个学科辅导 AI", tags: ["产品","Prompt","教育"], score: 4.9 },
];

function ProjectsPage() {
  return (
    <MobileShell title="项目实战" showBack>
      <div className="space-y-5">
        <Card title="本周推荐项目" subtitle="基于你的能力差距匹配">
          {PROJECTS.map(p => (
            <div key={p.t} className="p-3 rounded-xl border border-border space-y-2 mt-3 first:mt-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-sm">{p.t}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.goal}</div>
                </div>
                <Tag tone={p.d === "高级" ? "warning" : p.d === "中级" ? "primary" : "success"}>{p.d}</Tag>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map(t => <Tag key={t} tone="muted">{t}</Tag>)}
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="tabular-nums">{p.score}</span>
                  <span className="text-muted-foreground ml-1">· 1.2k 人在做</span>
                </div>
                <button className="text-xs text-primary font-medium">查看详情</button>
              </div>
            </div>
          ))}
        </Card>

        <Card title="项目说明">
          <ol className="text-sm text-foreground/85 list-decimal pl-4 space-y-1.5">
            <li>认领项目后会获得完整任务拆解</li>
            <li>每个阶段提交即可获得 AI 评分</li>
            <li>完成后自动生成作品集案例</li>
          </ol>
        </Card>

        <Card title="项目成果展示">
          <div className="grid grid-cols-2 gap-2">
            {["智能客服 Demo","JD 分析报告"].map((t, i) => (
              <div key={t} className="aspect-square rounded-xl bg-gradient-to-br from-primary-soft to-muted flex items-center justify-center text-xs text-center p-2">
                <span>{t}<br/><span className="text-muted-foreground">已发布</span></span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="评分系统">
          <div className="space-y-2 text-sm">
            {[["完整度","90"],["产品思维","85"],["AI 应用","70"],["代码质量","60"]].map(([k,v]) => (
              <div key={k}>
                <div className="flex justify-between text-xs mb-1"><span>{k}</span><span className="tabular-nums text-muted-foreground">{v}</span></div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <PrimaryButton icon={<Upload className="h-4 w-4" />}>提交我的项目</PrimaryButton>
      </div>
    </MobileShell>
  );
}