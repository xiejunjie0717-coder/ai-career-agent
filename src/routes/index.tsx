import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  FileText,
  FolderKanban,
  GitBranch,
  Github,
  ListTodo,
  Map,
  Mic,
  SearchCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { WorkflowStepper } from "@/components/WorkflowStepper";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Career Agent｜AI 职业成长助手" },
      {
        name: "description",
        content:
          "面向大学生、应届生和转行求职者的 AI 求职准备 Workflow，覆盖岗位分析、能力评估、学习路线、简历优化与模拟面试。",
      },
    ],
  }),
  component: LandingPage,
});

const values = [
  {
    title: "理解岗位真正要求",
    description: "从目标岗位或真实 JD 提取职责、技能、关键词与面试评估标准。",
    icon: SearchCheck,
  },
  {
    title: "定位关键能力差距",
    description: "将岗位画像与个人能力画像对比，明确匹配度、风险点和补齐优先级。",
    icon: Target,
  },
  {
    title: "生成可执行成长路线",
    description: "把抽象建议拆解为 Roadmap、作品集项目和可以持续跟踪的任务。",
    icon: Map,
  },
  {
    title: "完成求职准备闭环",
    description: "连接简历优化、模拟面试和任务执行，让每一步都有明确产出。",
    icon: CheckCircle2,
  },
];

const features = [
  {
    to: "/analysis" as const,
    title: "岗位分析",
    description: "将 JD 转换为结构化岗位画像。",
    icon: Target,
  },
  {
    to: "/assessment" as const,
    title: "能力评估",
    description: "形成面向目标岗位的个人能力画像。",
    icon: Brain,
  },
  {
    to: "/projects" as const,
    title: "项目推荐",
    description: "生成适合作品集展示的分阶段项目。",
    icon: FolderKanban,
  },
  {
    to: "/resume" as const,
    title: "简历优化",
    description: "围绕岗位关键词优化项目表达。",
    icon: FileText,
  },
  {
    to: "/interview" as const,
    title: "模拟面试",
    description: "生成岗位定制问题并获得回答反馈。",
    icon: Mic,
  },
  {
    to: "/tasks" as const,
    title: "任务中心",
    description: "将路线、项目和面试建议转成行动。",
    icon: ListTodo,
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-app text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="pressable flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-500 text-primary-foreground shadow-sm shadow-primary/20">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-tight">AI Career Agent</span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">
                AI 职业成长助手
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <a
              href="https://github.com/xiejunjie0717-coder/ai-career-agent"
              target="_blank"
              rel="noreferrer"
              className="pressable hidden h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground sm:flex"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <Link
              to="/dashboard"
              className="pressable inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90"
            >
              进入 Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="motion-page">
        <section className="relative overflow-hidden">
          <div className="hero-grid absolute inset-0 opacity-70" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:py-28">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                把求职准备变成一条
                <span className="block bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                  清晰、可执行的 AI Workflow
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                AI Career Agent
                面向大学生、应届生和转行求职者，将岗位分析、能力诊断、成长路线、作品集、简历和面试准备连接为连续的产品体验。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/dashboard"
                  className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                >
                  开始体验
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/upload"
                  className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-background px-6 text-sm font-semibold shadow-sm hover:border-primary/25 hover:bg-muted/50"
                >
                  上传岗位 JD
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span>无需注册即可体验</span>
                <span>本地数据持久化</span>
                <span>Server Function 保护 API Key</span>
              </div>
            </div>

            <ProductPreview />
          </div>
        </section>

        <section className="border-y border-border/70 bg-background/70">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeading
              title="从“我该准备什么”到“我今天做什么”"
              description="不提供彼此割裂的 AI 工具入口，而是让每个节点复用上一步的结构化结果。"
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {values.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="surface-card p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            title="一条连续的求职成长链路"
            description="从真实岗位要求出发，最终沉淀为可跟踪的执行任务和成长反馈。"
          />
          <div className="mt-10 rounded-3xl border border-border/70 bg-background p-5 shadow-sm sm:p-8">
            <WorkflowStepper />
          </div>
        </section>

        <section className="bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeading
              inverse
              title="覆盖完整求职准备场景"
              description="每个模块都可以独立使用，也能在同一个 AgentState 中形成连续上下文。"
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link
                    key={feature.to}
                    to={feature.to}
                    className="pressable group rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-blue-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <ArrowRight className="h-4 w-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-white/70" />
                    </div>
                    <h3 className="mt-5 font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-blue-600 px-6 py-12 text-center text-primary-foreground shadow-xl shadow-primary/15 sm:px-12">
            <GitBranch className="mx-auto h-8 w-8 opacity-90" />
            <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
              从目标岗位开始，建立你的求职准备 Dashboard
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              查看当前匹配度、流程进度、任务完成情况，并获得下一步行动建议。
            </p>
            <Link
              to="/dashboard"
              className="pressable mt-7 inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-6 text-sm font-semibold text-primary shadow-sm"
            >
              进入 Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>AI Career Agent｜AI 职业成长助手</span>
          <span>MVP / Prototype · 数据保存在当前浏览器</span>
        </div>
      </footer>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="product-preview relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-primary/15 to-blue-400/5 blur-2xl" />
      <div className="relative rounded-[1.75rem] border border-white/70 bg-background/90 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur sm:p-5">
        <div className="flex items-center justify-between border-b border-border/70 pb-4">
          <div>
            <div className="text-xs text-muted-foreground">Career Dashboard</div>
            <div className="mt-1 font-semibold">AI 产品经理实习</div>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            进行中
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <PreviewMetric value="72%" label="岗位匹配" />
          <PreviewMetric value="5/8" label="完成步骤" />
          <PreviewMetric value="64%" label="任务进度" />
        </div>
        <div className="mt-4 rounded-2xl border border-primary/15 bg-primary-soft/60 p-4">
          <div className="text-xs font-medium text-primary">下一步建议</div>
          <div className="mt-1 text-sm font-semibold">完善作品集项目证据</div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            围绕 Agent Workflow 和效果验证补充一项可演示项目。
          </p>
        </div>
        <div className="mt-4 space-y-3">
          {["岗位画像", "能力差距诊断", "学习路线"].map((label, index) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-border/70 px-3 py-2.5"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <span className="flex-1 text-sm font-medium">{label}</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-muted/65 p-3">
      <div className="text-lg font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function SectionHeading({
  title,
  description,
  inverse = false,
}: {
  title: string;
  description: string;
  inverse?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <h2
        className={`text-2xl font-semibold tracking-[-0.025em] sm:text-3xl ${
          inverse ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-3 text-sm leading-7 sm:text-base ${
          inverse ? "text-slate-400" : "text-muted-foreground"
        }`}
      >
        {description}
      </p>
    </div>
  );
}
