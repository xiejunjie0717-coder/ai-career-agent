import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ThumbsUp, AlertTriangle, Lightbulb } from "lucide-react";

import { MobileShell } from "@/components/MobileShell";
import { Card, PrimaryButton, ProgressBar, Tag } from "@/components/ui-primitives";
import { generateGapReport } from "@/lib/ai";
import {
  loadState,
  saveState,
  type AgentState,
  type GapReport,
} from "@/lib/agent-store";

export const Route = createFileRoute("/gap")({
  head: () => ({ meta: [{ title: "能力差距分析" }] }),
  component: GapPage,
});

function GapPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<AgentState | null>(null);

  useEffect(() => {
    const current = loadState();
    let gapReport = current.gapReport;

    if (!gapReport && current.jobProfile && current.abilityProfile) {
      gapReport = generateGapReport(current.jobProfile, current.abilityProfile);
      saveState({
        gapReport,
        roadmap: null,
        projects: [],
        resumeReport: null,
        interviewReport: null,
      });
    }

    setState({ ...current, gapReport });
  }, []);

  if (!state) return null;

  const report = state.gapReport;

  if (!report) {
    return (
      <MobileShell title="能力差距分析" showBack>
        <Card title="暂时无法生成差距报告">
          <p className="text-sm text-muted-foreground leading-6">
            请先完成岗位分析和能力评估，系统需要两份结构化画像才能生成差距报告。
          </p>
          <PrimaryButton onClick={() => navigate({ to: "/analysis" })}>
            返回岗位分析
          </PrimaryButton>
        </Card>
      </MobileShell>
    );
  }

  const dimensions = buildDimensions(report);
  const advantages = state.abilityProfile?.advantages.length
    ? state.abilityProfile.advantages
    : report.matchedSkills.map((item) => `已具备岗位要求的“${item}”能力`);

  return (
    <MobileShell
      title="能力差距分析"
      showBack
      footer={
        <PrimaryButton
          onClick={() => navigate({ to: "/roadmap" })}
          icon={<ArrowRight className="h-4 w-4" />}
        >
          生成成长路线
        </PrimaryButton>
      }
    >
      <div className="space-y-5">
        <Card>
          <div className="flex items-center gap-4">
            <MatchRing value={report.matchScore} />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">岗位匹配度</div>
              <div className="text-2xl font-semibold tracking-tight">
                {report.matchScore}%
              </div>
              <div className="text-xs text-amber-600 mt-1">
                {report.priorityGaps.length
                  ? `优先补齐 ${report.priorityGaps.length} 项关键差距`
                  : "当前能力与岗位要求较匹配"}
              </div>
            </div>
          </div>
        </Card>

        <Card title="核心能力对比" subtitle="基于岗位画像与用户能力画像">
          <RadarChart dimensions={dimensions} />
          <div className="space-y-2 pt-2">
            {dimensions.map((dimension) => (
              <div key={dimension.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{dimension.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {dimension.value}/100
                  </span>
                </div>
                <ProgressBar value={dimension.value} />
              </div>
            ))}
          </div>
        </Card>

        <Card title="已匹配技能" icon={<ThumbsUp className="h-4 w-4" />}>
          {report.matchedSkills.length ? (
            <div className="flex flex-wrap gap-2">
              {report.matchedSkills.map((item) => (
                <Tag key={item} tone="success">
                  {item}
                </Tag>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              当前填写的技能与岗位必备技能尚未形成直接匹配。
            </p>
          )}
          {advantages.length > 0 && (
            <ul className="text-sm space-y-1.5 text-foreground/85 list-disc pl-4">
              {advantages.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="优先差距与风险" icon={<AlertTriangle className="h-4 w-4" />}>
          <div className="flex flex-wrap gap-2">
            {report.missingSkills.map((item) => (
              <Tag key={item} tone="warning">
                缺失 {item}
              </Tag>
            ))}
          </div>
          <ul className="text-sm space-y-1.5 text-foreground/85 list-disc pl-4">
            {report.riskPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card title="下一步行动" icon={<Lightbulb className="h-4 w-4" />}>
          <ol className="text-sm space-y-2 text-foreground/85 list-decimal pl-4">
            {report.nextActions.map((item) => (
              <li key={item}>{item.replace(/^\d+\.\s*/, "")}</li>
            ))}
          </ol>
        </Card>
      </div>
    </MobileShell>
  );
}

function buildDimensions(report: GapReport) {
  const skills = Array.from(
    new Set([...report.matchedSkills, ...report.missingSkills]),
  ).slice(0, 5);

  const fallback = report.priorityGaps.slice(0, 5);
  const labels = skills.length ? skills : fallback.length ? fallback : ["综合能力"];

  return labels.map((label) => ({
    label,
    value: report.matchedSkills.includes(label)
      ? Math.max(75, report.matchScore)
      : Math.min(55, report.matchScore),
  }));
}

function MatchRing({ value }: { value: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle
        cx="36"
        cy="36"
        r={radius}
        stroke="var(--muted)"
        strokeWidth="6"
        fill="none"
      />
      <circle
        cx="36"
        cy="36"
        r={radius}
        stroke="var(--primary)"
        strokeWidth="6"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
      />
      <text
        x="36"
        y="40"
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        fill="var(--foreground)"
      >
        {value}%
      </text>
    </svg>
  );
}

function RadarChart({
  dimensions,
}: {
  dimensions: { label: string; value: number }[];
}) {
  const centerX = 110;
  const centerY = 100;
  const radius = 70;
  const count = dimensions.length;
  const points = (scale: number) =>
    dimensions.map((_, index) => {
      const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
      const currentRadius = radius * scale;
      return [
        centerX + currentRadius * Math.cos(angle),
        centerY + currentRadius * Math.sin(angle),
      ] as const;
    });
  const polygon = (items: readonly (readonly [number, number])[]) =>
    items.map((point) => point.join(",")).join(" ");
  const valuePoints = dimensions.map((dimension, index) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const currentRadius = radius * (dimension.value / 100);
    return [
      centerX + currentRadius * Math.cos(angle),
      centerY + currentRadius * Math.sin(angle),
    ] as const;
  });

  return (
    <svg viewBox="0 0 220 200" className="w-full">
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon
          key={scale}
          points={polygon(points(scale))}
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
        />
      ))}
      {points(1).map((point, index) => (
        <line
          key={dimensions[index].label}
          x1={centerX}
          y1={centerY}
          x2={point[0]}
          y2={point[1]}
          stroke="var(--border)"
          strokeWidth="1"
        />
      ))}
      <polygon
        points={polygon(valuePoints)}
        fill="var(--primary)"
        fillOpacity="0.2"
        stroke="var(--primary)"
        strokeWidth="2"
      />
      {dimensions.map((dimension, index) => {
        const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
        const labelRadius = radius + 18;
        const x = centerX + labelRadius * Math.cos(angle);
        const y = centerY + labelRadius * Math.sin(angle);
        return (
          <text
            key={dimension.label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fill="var(--muted-foreground)"
          >
            {dimension.label}
          </text>
        );
      })}
    </svg>
  );
}
