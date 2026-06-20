import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Check,
  CheckCircle2,
  FileText,
  FolderKanban,
  Github,
  ListTodo,
  Map,
  Mic,
  Route as RouteIcon,
  SearchCheck,
  Target,
} from "lucide-react";

import { WorkflowStepper } from "@/components/WorkflowStepper";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Career Agent｜把目标变成可执行的成长路线" },
      {
        name: "description",
        content:
          "从岗位分析、能力诊断到简历与面试训练，AI Career Agent 帮你看清差距、规划行动，并一步步靠近理想 Offer。",
      },
    ],
  }),
  component: LandingPage,
});

const values = [
  {
    index: "01",
    title: "先看清岗位真正需要什么",
    description: "从目标岗位或真实 JD 中提取职责、技能、关键词与面试评估标准。",
    icon: SearchCheck,
  },
  {
    index: "02",
    title: "知道差距，才知道下一步练什么",
    description: "对比岗位画像与个人能力，明确优势、风险和最值得优先补齐的能力。",
    icon: Target,
  },
  {
    index: "03",
    title: "把建议拆成今天能完成的行动",
    description: "将差距转化为学习路线、作品集项目和可以持续推进的任务。",
    icon: Map,
  },
  {
    index: "04",
    title: "让简历和面试围绕同一个目标",
    description: "复用岗位、能力和项目上下文，让每一步准备形成连续证据。",
    icon: CheckCircle2,
  },
];

const features = [
  {
    to: "/analysis" as const,
    title: "读懂岗位，也读懂招聘方真正看重什么",
    label: "岗位分析",
    icon: Target,
  },
  {
    to: "/assessment" as const,
    title: "盘点你的能力，找到已经具备的优势",
    label: "能力评估",
    icon: Brain,
  },
  {
    to: "/projects" as const,
    title: "用项目证明能力，而不只是写在简历里",
    label: "项目推荐",
    icon: FolderKanban,
  },
  {
    to: "/resume" as const,
    title: "让每一段经历，都更贴近目标岗位",
    label: "简历优化",
    icon: FileText,
  },
  {
    to: "/interview" as const,
    title: "练习高频问题，也练习更有说服力的表达",
    label: "模拟面试",
    icon: Mic,
  },
  {
    to: "/tasks" as const,
    title: "把建议变成行动，让进度每天都看得见",
    label: "任务中心",
    icon: ListTodo,
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-app text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Brand />
          <nav className="flex items-center gap-2">
            <a
              href="https://github.com/xiejunjie0717-coder/ai-career-agent"
              target="_blank"
              rel="noreferrer"
              className="pressable hidden h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground sm:flex"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <Link
              to="/dashboard"
              className="pressable inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <span className="sm:hidden">开始</span>
              <span className="hidden sm:inline">开始规划</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="motion-page">
        <section className="relative overflow-hidden border-b border-border">
          <div className="hero-grid absolute inset-0 opacity-75" />
          <div className="relative mx-auto grid max-w-[1440px] lg:grid-cols-[0.78fr_1.22fr]">
            <div className="min-w-0 flex flex-col justify-center border-border px-4 py-16 sm:px-6 sm:py-20 lg:min-h-[720px] lg:border-r lg:px-10 lg:py-24">
              <span className="eyebrow">AI Career Growth System</span>
              <h1 className="mt-7 max-w-2xl break-all text-3xl font-semibold leading-[1.1] tracking-[-0.045em] sm:text-5xl lg:text-[4rem]">
                <span className="block">把求职目标，</span>
                <span className="block break-all text-primary">变成一条真正走得通的成长路线</span>
              </h1>
              <p className="mt-6 max-w-xl break-words [overflow-wrap:anywhere] text-base leading-8 text-muted-foreground sm:text-lg">
                从岗位分析、能力诊断到简历与面试训练，AI Career Agent
                帮你看清差距、规划行动，并一步步靠近理想 Offer。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/dashboard"
                  className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  开始规划成长路线
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#workflow"
                  className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-background px-6 text-sm font-semibold hover:border-primary/40 hover:bg-primary-soft/40"
                >
                  看看产品怎么工作
                </a>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-3 border-y border-border py-5">
                <Proof value="8" label="成长步骤" />
                <Proof value="1 条" label="连续上下文" />
                <Proof value="本机" label="数据保存" />
              </div>
            </div>

            <div className="blueprint-panel min-w-0 flex items-center px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
              <ProductPreview />
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
            <SectionHeading
              eyebrow="From insight to action"
              title="从“我该准备什么”，到“我今天先做什么”"
              description="不是八个彼此割裂的 AI 工具，而是一条复用前序结果、持续缩小差距的成长路线。"
            />
            <div className="mt-10 grid border-l border-t border-border md:grid-cols-2 xl:grid-cols-4">
              {values.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="group border-b border-r border-border bg-card p-6 transition-colors hover:bg-primary-soft/35"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {item.index}
                      </span>
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mt-10 text-lg font-semibold leading-7 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="workflow" className="border-b border-border">
          <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
            <SectionHeading
              eyebrow="Your route"
              title="每完成一步，后面的建议都会更贴近你的目标"
              description="从真实岗位要求出发，逐步沉淀能力证据、行动任务和可回顾的成长记录。"
            />
            <div className="blueprint-panel mt-10 rounded-lg border border-border bg-background p-5 sm:p-8">
              <WorkflowStepper />
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-foreground text-background">
          <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
            <SectionHeading
              inverse
              eyebrow="One shared context"
              title="每个功能都解决一个问题，也为下一步留下依据"
              description="岗位、能力、项目、简历与面试共享同一条成长上下文，减少重复输入和无效建议。"
            />
            <div className="mt-10 grid border-l border-t border-background/15 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link
                    key={feature.to}
                    to={feature.to}
                    className="group border-b border-r border-background/15 p-6 transition-colors hover:bg-background/[0.06]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <Icon className="h-4 w-4" />
                      </span>
                      <ArrowRight className="h-4 w-4 text-background/35 transition-transform group-hover:translate-x-1 group-hover:text-background" />
                    </div>
                    <div className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-background/50">
                      {feature.label}
                    </div>
                    <h3 className="mt-2 max-w-sm text-lg font-semibold leading-7">
                      {feature.title}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
          <div className="blueprint-panel grid overflow-hidden rounded-lg border border-primary/25 bg-primary-soft/50 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="p-7 sm:p-10">
              <RouteIcon className="h-7 w-7 text-primary" />
              <h2 className="mt-6 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
                先把目标说清楚，下一步就不再靠猜
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                建立目标岗位后，查看当前匹配度、路线进度和今天最值得推进的行动。
              </p>
            </div>
            <div className="border-t border-primary/20 p-7 lg:border-l lg:border-t-0 lg:p-10">
              <Link
                to="/dashboard"
                className="pressable inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground"
              >
                打开我的成长路线
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <span>AI Career Agent｜AI 职业成长助手</span>
          <span>MVP / Prototype · 数据保存在当前浏览器</span>
        </div>
      </footer>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="pressable flex items-center gap-2.5">
      <span className="grid h-9 w-9 grid-cols-2 gap-0.5 rounded-md bg-primary p-2 text-primary-foreground">
        <span className="border border-current" />
        <span className="border border-current bg-current" />
        <span className="border border-current bg-current" />
        <span className="border border-current" />
      </span>
      <span>
        <span className="block text-sm font-semibold tracking-tight">AI Career Agent</span>
        <span className="hidden text-[11px] text-muted-foreground sm:block">
          让成长路线清晰可执行
        </span>
      </span>
    </Link>
  );
}

function ProductPreview() {
  return (
    <div className="product-preview mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-border bg-background shadow-[0_18px_50px_oklch(0.19_0.025_155_/_0.10)]">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            My Career Route
          </span>
        </div>
        <span className="text-xs text-muted-foreground">更新于今天</span>
      </div>
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="border-b border-border bg-primary-soft/35 p-5 lg:border-b-0 lg:border-r">
          <div className="text-xs text-muted-foreground">目标岗位</div>
          <div className="mt-2 text-xl font-semibold">AI 产品经理实习</div>
          <div className="mt-1 text-xs text-muted-foreground">互联网 · 北京</div>
          <div className="mt-8">
            <div className="flex items-end justify-between">
              <span className="text-xs text-muted-foreground">岗位匹配度</span>
              <strong className="text-3xl font-semibold tabular-nums text-primary">72%</strong>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden bg-border">
              <div className="progress-fill h-full w-[72%] bg-primary" />
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-5">
            <div className="text-xs text-muted-foreground">优先差距</div>
            <ul className="mt-3 space-y-2 text-sm">
              {["业务指标设计", "用户研究证据", "项目复盘表达"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <PreviewMetric value="5/8" label="路线步骤" />
            <PreviewMetric value="64%" label="任务进度" />
            <PreviewMetric value="3" label="待补能力" />
          </div>
          <div className="mt-5 rounded-md border border-primary/20 bg-primary-soft/45 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-primary">今天最值得推进</div>
                <div className="mt-1 text-sm font-semibold">补充一项用户研究项目证据</div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              完成后将同步改善能力差距、项目表达和简历匹配度。
            </p>
          </div>
          <div className="mt-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Route progress
            </div>
            <div className="space-y-2">
              {["读懂岗位要求", "完成能力诊断", "生成成长路线"].map((label, index) => (
                <div
                  key={label}
                  className="flex items-center gap-3 border-b border-border py-2 last:border-0"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 text-sm font-medium">{label}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l-2 border-primary bg-muted/55 px-3 py-2.5">
      <div className="text-lg font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function Proof({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-border px-3 first:pl-0 last:border-r-0">
      <div className="text-lg font-semibold text-primary">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  inverse = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  inverse?: boolean;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
      <div>
        <span className={`eyebrow ${inverse ? "text-background/65" : ""}`}>{eyebrow}</span>
        <h2
          className={`mt-5 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl ${
            inverse ? "text-background" : "text-foreground"
          }`}
        >
          {title}
        </h2>
      </div>
      <p
        className={`max-w-2xl text-sm leading-7 sm:text-base lg:justify-self-end ${
          inverse ? "text-background/60" : "text-muted-foreground"
        }`}
      >
        {description}
      </p>
    </div>
  );
}
