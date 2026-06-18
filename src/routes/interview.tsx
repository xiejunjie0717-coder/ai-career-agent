import { createFileRoute } from "@tanstack/react-router";
import { Mic, Bot, FileText, Play } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { Card, PrimaryButton, Tag } from "@/components/ui-primitives";

export const Route = createFileRoute("/interview")({
  head: () => ({ meta: [{ title: "模拟面试" }] }),
  component: InterviewPage,
});

const QUESTIONS = [
  "请做一个 3 分钟自我介绍",
  "说一个你最有成就感的项目",
  "如何设计一款 AI 学习助手?",
  "用户增长停滞,你会怎么分析?",
  "为什么选择我们公司?",
];

function InterviewPage() {
  return (
    <MobileShell title="模拟面试" showBack
      footer={<PrimaryButton icon={<Play className="h-4 w-4" />}>开始 AI 面试</PrimaryButton>}>
      <div className="space-y-5">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">目标岗位</div>
              <div className="font-semibold mt-0.5">AI 产品经理 · 字节跳动</div>
            </div>
            <Tag tone="primary">中等难度</Tag>
          </div>
        </Card>

        <Card title="常见面试题" subtitle="基于真实面经整理">
          <div className="space-y-2">
            {QUESTIONS.map((q, i) => (
              <div key={q} className="flex items-start gap-3 p-3 rounded-xl border border-border">
                <span className="h-6 w-6 rounded-full bg-primary-soft text-primary text-xs font-semibold flex items-center justify-center shrink-0">{i + 1}</span>
                <div className="text-sm flex-1">{q}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="AI 面试官" icon={<Bot className="h-4 w-4" />}>
          <div className="rounded-xl bg-gradient-to-br from-primary-soft to-background p-4 space-y-3">
            <div className="flex items-start gap-2">
              <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-card rounded-xl rounded-tl-sm px-3 py-2 text-sm">
                你好,我是你的 AI 面试官 Aria 👋 准备好了我们就开始?
              </div>
            </div>
            <button className="w-full h-12 rounded-xl bg-card border border-border flex items-center justify-center gap-2 text-sm">
              <Mic className="h-4 w-4 text-primary" /> 按住开始语音回答
            </button>
          </div>
        </Card>

        <Card title="历史回答分析">
          <div className="space-y-2.5">
            {[["逻辑清晰度", 85],["专业度", 70],["表达流畅度", 60],["亮点呈现", 55]].map(([k,v]) => (
              <div key={k as string}>
                <div className="flex justify-between text-xs mb-1"><span>{k}</span><span className="tabular-nums">{v}/100</span></div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="改进建议" icon={<FileText className="h-4 w-4" />}>
          <ul className="text-sm space-y-1.5 list-disc pl-4">
            <li>项目介绍补充量化结果,如转化率、活跃用户数</li>
            <li>STAR 结构化表达可以更紧凑</li>
            <li>避免使用「应该」「可能」等模糊词汇</li>
          </ul>
        </Card>

        <button className="w-full h-11 rounded-xl border border-border bg-card text-sm font-medium">
          生成完整面试报告 →
        </button>
      </div>
    </MobileShell>
  );
}