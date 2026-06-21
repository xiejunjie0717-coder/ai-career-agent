import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  FileText,
  FolderKanban,
  ListTodo,
  Map,
  Mic,
  Route as RouteIcon,
  SearchCheck,
  Target,
  Upload,
} from "lucide-react";

import { PathwiseWordmark } from "@/components/PathwiseWordmark";
import { WorkflowStepper } from "@/components/WorkflowStepper";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pathwise Career｜让求职有方向，让成长有路线" },
      {
        name: "description",
        content:
          "从读懂岗位、发现能力差距，到完成项目、优化简历与面试训练，把零散的求职准备整理成一条清晰、可执行的成长路线。",
      },
    ],
  }),
  component: LandingPage,
});

const values = [
  {
    index: "01",
    title: "看懂岗位真正筛选什么",
    description: "从真实 JD 中提取职责、技能、关键词与面试评估标准。",
    icon: SearchCheck,
  },
  {
    index: "02",
    title: "知道自己差在哪里",
    description: "对比岗位画像与个人能力，明确优势和最值得优先补齐的能力。",
    icon: Target,
  },
  {
    index: "03",
    title: "把差距拆成可完成的任务",
    description: "将差距转化为学习路线、作品集项目和持续推进的行动。",
    icon: Map,
  },
  {
    index: "04",
    title: "用项目和简历证明能力",
    description: "复用岗位、能力和项目上下文，让每一步准备形成连续证据。",
    icon: CheckCircle2,
  },
];

const features = [
  {
    to: "/analysis" as const,
    title: "把复杂 JD 翻译成清晰的岗位要求",
    label: "岗位分析",
    icon: Target,
  },
  {
    to: "/assessment" as const,
    title: "形成你的能力画像与证据轮廓",
    label: "能力评估",
    icon: Brain,
  },
  {
    to: "/projects" as const,
    title: "把训练任务沉淀成可展示的项目证据",
    label: "项目推荐",
    icon: FolderKanban,
  },
  {
    to: "/resume" as const,
    title: "让每一段经历更贴近目标岗位",
    label: "简历优化",
    icon: FileText,
  },
  {
    to: "/interview" as const,
    title: "在正式面试前提前练熟表达",
    label: "模拟面试",
    icon: Mic,
  },
  {
    to: "/tasks" as const,
    title: "把今天真正值得完成的行动排清楚",
    label: "任务中心",
    icon: ListTodo,
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-app text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-app/94 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-5 sm:px-8 lg:px-12">
          <Link
            to="/"
            className="min-w-0 shrink inline-flex items-center"
            aria-label="Pathwise Career 首页"
          >
            <PathwiseWordmark mode="full" markSize={30} />
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a className="editorial-nav-link" href="#capabilities">
              产品能力
            </a>
            <a className="editorial-nav-link" href="#workflow">
              工作流程
            </a>
            <a className="editorial-nav-link" href="#about">
              项目说明
            </a>
          </nav>
          <Link
            to="/dashboard"
            className="landing-header-action pathwise-button group inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold hover:border-primary/45 hover:text-primary"
          >
            <span className="hidden sm:inline">进入成长工作台</span>
            <span className="sm:hidden">工作台</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </header>

      <main>
        <section className="border-b border-border/80">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:min-h-[740px] lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-12 lg:py-24">
            <div className="lg:col-span-5">
              <PathwiseWordmark className="hero-wordmark" markSize={42} animated />
              <h1 className="mt-9 max-w-[600px] text-[2.65rem] font-semibold leading-[1.04] tracking-[-0.055em] sm:text-6xl lg:text-[4.45rem]">
                让求职有方向，
                <br />
                让成长有路线
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                从读懂岗位、发现能力差距，到完成项目、优化简历与面试训练，把零散的求职准备整理成一条清晰、可执行的成长路线。
              </p>
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/dashboard"
                  className="pathwise-button group inline-flex h-12 items-center gap-3 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/92"
                >
                  <RouteIcon className="h-4 w-4" />
                  规划我的求职路线
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/upload"
                  className="pathwise-button group inline-flex h-11 items-center gap-2 rounded-full border border-border bg-transparent px-5 text-sm font-semibold hover:border-primary/50 hover:text-primary"
                >
                  <Upload className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                  上传岗位 JD，先看看差距
                </Link>
              </div>
              <p className="mt-7 text-xs leading-6 text-muted-foreground">
                无需注册即可体验 · 数据仅保存在当前浏览器 · API Key 由服务端函数保护
              </p>
            </div>

            <div className="lg:col-span-7 lg:pl-5">
              <CareerMaterials />
            </div>
          </div>
        </section>

        <section id="capabilities" className="border-b border-border/80 bg-background">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
            <SectionHeading
              eyebrow="从判断到行动"
              title="准备求职时，真正需要的是一条连续路线"
              description="每个环节都会复用前一步的结果，让岗位、能力、项目、简历与面试围绕同一个目标推进。"
            />
            <div className="mt-12 grid gap-x-10 gap-y-12 border-t border-border pt-8 md:grid-cols-2 xl:grid-cols-4">
              {values.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="group">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {item.index}
                      </span>
                      <Icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold leading-8 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="workflow" className="border-b border-border/80">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
            <SectionHeading
              eyebrow="成长路线"
              title="每完成一步，后面的建议都会更贴近你的目标"
              description="路线随进度逐段展开；当前节点只在状态变化时给出一次明确反馈。"
            />
            <div className="mt-12 border-y border-border bg-background/55 px-2 py-8 sm:px-6">
              <WorkflowStepper />
            </div>
          </div>
        </section>

        <section id="about" className="border-b border-border/80 bg-foreground text-background">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
            <SectionHeading
              inverse
              eyebrow="同一份职业上下文"
              title="不同工具解决不同问题，但最终都沉淀为你的职业证据"
              description="避免重复输入和孤立建议，让每一次分析、训练与修改都能推动下一步。"
            />
            <div className="mt-12 grid gap-px bg-background/15 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link
                    key={feature.to}
                    to={feature.to}
                    className="group bg-foreground p-6 transition-colors hover:bg-background/[0.055]"
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-primary-foreground" strokeWidth={1.8} />
                      <ArrowRight className="h-4 w-4 text-background/35 transition-transform group-hover:translate-x-1 group-hover:text-background" />
                    </div>
                    <div className="mt-8 text-xs font-semibold tracking-[0.12em] text-background/50">
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

        <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="grid border-y border-border py-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
            <div>
              <span className="eyebrow">下一步</span>
              <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                你的下一次求职，不必再从一张空白简历开始
              </h2>
            </div>
            <Link
              to="/dashboard"
              className="pathwise-button group mt-7 inline-flex h-12 w-fit items-center gap-3 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground lg:mt-0"
            >
              开始建立我的求职路线
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-[1440px] gap-4 px-5 py-9 text-xs text-muted-foreground sm:px-8 md:grid-cols-[auto_1fr_auto] md:items-center lg:px-12">
          <PathwiseWordmark mode="compact" markSize={24} />
          <span className="md:text-center">
            Find direction in your job search · Build a path for your growth
          </span>
          <span>数据保存在当前浏览器</span>
        </div>
      </footer>
    </div>
  );
}

function CareerMaterials() {
  return (
    <div className="career-materials" aria-label="从目标岗位到成长路线的职业材料">
      <div className="career-material career-material--resume">
        <div className="material-kicker">职业档案 / 01</div>
        <div className="mt-5 flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold">陈一航</div>
            <div className="mt-1 text-xs text-muted-foreground">AI 产品方向</div>
          </div>
          <span className="h-10 w-10 bg-primary/85" />
        </div>
        <MaterialLines />
        <div className="mt-7 border-l border-primary pl-3 text-xs font-semibold text-primary">
          项目经历待补强
        </div>
      </div>

      <div className="career-material career-material--jd">
        <div className="material-kicker">目标岗位 / JD</div>
        <h2 className="mt-4 text-xl font-semibold">AI 产品经理实习</h2>
        <p className="mt-1 text-xs text-muted-foreground">互联网 · 北京</p>
        <div className="mt-7 flex items-end justify-between border-b border-border pb-3">
          <span className="text-xs text-muted-foreground">岗位匹配度</span>
          <strong className="material-score text-4xl font-semibold tabular-nums text-primary">
            72%
          </strong>
        </div>
        <div className="mt-4 h-1 bg-border">
          <div className="material-progress h-full w-[72%] bg-primary" />
        </div>
        <div className="material-annotation mt-7">
          <span>关键差距</span>
          <strong>项目证据不足</strong>
        </div>
      </div>

      <div className="career-material career-material--evidence">
        <div className="material-kicker">证据整理 / 03</div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <span className="aspect-[4/3] border border-border" />
          <span className="aspect-[4/3] border border-border" />
        </div>
        <div className="mt-5 space-y-2">
          <span className="block h-px w-full bg-border" />
          <span className="block h-px w-4/5 bg-border" />
          <span className="block h-px w-2/3 bg-border" />
        </div>
      </div>

      <div className="career-route-sheet">
        <div>
          <div className="material-kicker">成长路线</div>
          <strong className="mt-2 block text-lg">已完成 5/8 个阶段</strong>
        </div>
        <div className="career-route-track" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((step) => (
            <span
              key={step}
              className={step < 5 ? "is-complete" : step === 5 ? "is-current" : ""}
            />
          ))}
        </div>
      </div>

      <div className="current-action-note">
        <span>当前行动</span>
        <strong>完善作品集项目证据</strong>
        <ArrowRight className="h-5 w-5" />
      </div>

      <svg className="career-material-route" viewBox="0 0 680 540" aria-hidden="true">
        <path d="M80 415 C150 475 255 438 340 468 S520 520 620 455" />
      </svg>
      <span className="career-route-pin" aria-hidden="true" />
    </div>
  );
}

function MaterialLines() {
  return (
    <div className="mt-8 space-y-3" aria-hidden="true">
      <span className="block h-px w-full bg-border" />
      <span className="block h-px w-5/6 bg-border" />
      <span className="block h-px w-3/4 bg-border" />
      <span className="mt-7 block h-px w-full bg-border" />
      <span className="block h-px w-4/5 bg-border" />
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
    <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7">
        <span className={`eyebrow ${inverse ? "text-background/65" : ""}`}>{eyebrow}</span>
        <h2
          className={`mt-5 max-w-4xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl ${
            inverse ? "text-background" : "text-foreground"
          }`}
        >
          {title}
        </h2>
      </div>
      <p
        className={`max-w-2xl text-sm leading-7 sm:text-base lg:col-span-5 lg:justify-self-end ${
          inverse ? "text-background/60" : "text-muted-foreground"
        }`}
      >
        {description}
      </p>
    </div>
  );
}
