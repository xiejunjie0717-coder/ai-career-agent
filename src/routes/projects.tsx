import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  MessageSquareText,
  Sparkles,
  Target,
} from "lucide-react";

import { MobileShell } from "@/components/MobileShell";
import { Card, Tag, PrimaryButton } from "@/components/ui-primitives";
import { generateProjectRecommendations } from "@/lib/ai";
import {
  loadState,
  saveState,
  type AgentState,
  type ProjectRecommendation,
} from "@/lib/agent-store";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "项目实战" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<AgentState | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const current = loadState();
    setState(current);

    if (
      current.projects.length ||
      !current.jobProfile ||
      !current.abilityProfile ||
      !current.gapReport
    ) {
      return;
    }

    setLoading(true);
    generateProjectRecommendations({
      targetJob: current.targetJob,
      jobProfile: current.jobProfile,
      abilityProfile: current.abilityProfile,
      gapReport: current.gapReport,
      roadmap: current.roadmap,
    })
      .then((projects) => {
        saveState({ projects, resumeReport: null, interviewReport: null });
        setState(loadState());
      })
      .finally(() => setLoading(false));
  }, []);

  if (!state) return null;

  if (!state.jobProfile || !state.abilityProfile || !state.gapReport) {
    return (
      <MobileShell title="项目实战" showBack>
        <Card title="暂时无法生成项目推荐">
          <p className="text-sm text-muted-foreground leading-6">
            请先完成岗位分析、能力评估和 Gap 差距分析，系统会根据真实短板推荐项目。
          </p>
          <PrimaryButton onClick={() => navigate({ to: "/gap" })}>
            返回差距分析
          </PrimaryButton>
        </Card>
      </MobileShell>
    );
  }

  return (
    <MobileShell
      title="项目实战"
      showBack
      footer={
        <PrimaryButton
          onClick={() => navigate({ to: "/resume" })}
          disabled={loading || state.projects.length === 0}
          icon={<ArrowRight className="h-4 w-4" />}
        >
          用推荐项目优化简历
        </PrimaryButton>
      }
    >
      <div className="space-y-5">
        <Card
          title="个性化项目推荐"
          subtitle={`面向 ${state.targetJob || state.jobProfile.title}，对应当前能力差距`}
          icon={<Sparkles className="h-4 w-4" />}
        >
          {loading && (
            <p className="text-sm text-muted-foreground">
              正在生成项目推荐，AI 失败时将自动使用本地方案……
            </p>
          )}
          {!loading && state.projects.length === 0 && (
            <p className="text-sm text-muted-foreground">
              暂未生成项目，请刷新页面重试。
            </p>
          )}
        </Card>

        {state.projects.map((project, index) => (
          <ProjectCard key={`${project.title}-${index}`} project={project} />
        ))}

        {state.roadmap && (
          <Card title="与学习路线的关系">
            <p className="text-sm text-foreground/85 leading-6">
              这些项目用于把“{state.roadmap.goal30Days}”转化为可演示成果。建议按入门、进阶、面试亮点的顺序完成。
            </p>
          </Card>
        )}
      </div>
    </MobileShell>
  );
}

function ProjectCard({ project }: { project: ProjectRecommendation }) {
  const tone =
    project.difficulty === "面试亮点"
      ? "warning"
      : project.difficulty === "进阶"
        ? "primary"
        : "success";

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">
              推荐项目 · {project.difficulty}
            </div>
            <h2 className="font-semibold tracking-tight mt-1">{project.title}</h2>
          </div>
          <Tag tone={tone}>{project.difficulty}</Tag>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock3 className="h-3.5 w-3.5" />
          预计 {project.estimatedDays} 天
        </div>

        <div className="flex flex-wrap gap-2">
          {project.targetSkill.map((skill) => (
            <Tag key={skill} tone="primary">
              {skill}
            </Tag>
          ))}
        </div>

        <Section title="产品场景" icon={<Target className="h-4 w-4" />}>
          <p>{project.productScenario}</p>
        </Section>

        <Section title="核心功能" icon={<Sparkles className="h-4 w-4" />}>
          <BulletList items={project.coreFeatures} />
        </Section>

        <Section title="技术与工具" icon={<BriefcaseBusiness className="h-4 w-4" />}>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((item) => (
              <Tag key={item} tone="muted">
                {item}
              </Tag>
            ))}
          </div>
        </Section>

        <Section title="交付物与简历价值" icon={<BriefcaseBusiness className="h-4 w-4" />}>
          <BulletList items={project.deliverables} />
          <div className="mt-2 p-3 rounded-xl bg-primary-soft/60 text-sm leading-6">
            {project.valueForResume}
          </div>
        </Section>

        <Section title="面试讲法" icon={<MessageSquareText className="h-4 w-4" />}>
          <BulletList items={project.interviewTalkingPoints} />
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 text-sm text-foreground/85 leading-6">
      <div className="flex items-center gap-2 font-medium text-foreground">
        <span className="text-primary">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1 list-disc pl-4">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
