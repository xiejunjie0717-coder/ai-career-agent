import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  LoaderCircle,
  MessageSquareText,
  RefreshCw,
  Send,
  Sparkles,
  Target,
} from "lucide-react";

import { MobileShell } from "@/components/MobileShell";
import { Card, PrimaryButton, ProgressBar, Tag } from "@/components/ui-primitives";
import {
  evaluateInterviewAnswer,
  generateInterviewQuestions,
} from "@/lib/ai";
import {
  loadState,
  saveState,
  type AgentState,
  type InterviewQuestion,
  type InterviewReport,
} from "@/lib/agent-store";

export const Route = createFileRoute("/interview")({
  head: () => ({ meta: [{ title: "模拟面试" }] }),
  component: InterviewPage,
});

function InterviewPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<AgentState | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);

  const createInterview = async (current: AgentState) => {
    if (
      !current.jobProfile ||
      !current.abilityProfile ||
      !current.gapReport ||
      !current.resumeReport
    ) {
      return;
    }

    setLoadingQuestions(true);
    const interviewReport = await generateInterviewQuestions({
      targetJob: current.targetJob,
      jobProfile: current.jobProfile,
      abilityProfile: current.abilityProfile,
      gapReport: current.gapReport,
      projects: current.projects,
      resumeReport: current.resumeReport,
    });
    saveState({ interviewReport });
    setState(loadState());
    setLoadingQuestions(false);
  };

  useEffect(() => {
    const current = loadState();
    setState(current);

    if (!current.interviewReport) {
      void createInterview(current);
    }
  }, []);

  if (!state) return null;

  if (
    !state.jobProfile ||
    !state.abilityProfile ||
    !state.gapReport ||
    !state.resumeReport
  ) {
    return (
      <MobileShell title="模拟面试" showBack>
        <Card title="请先完成简历优化">
          <p className="text-sm text-muted-foreground leading-6">
            模拟面试需要结合目标岗位、能力差距、项目推荐和简历报告生成。请先完成前面的主链路。
          </p>
          <PrimaryButton onClick={() => navigate({ to: "/resume" })}>
            前往简历优化
          </PrimaryButton>
        </Card>
      </MobileShell>
    );
  }

  const report = state.interviewReport;

  const updateQuestionAnswer = (questionId: string, answer: string) => {
    if (!report) return;

    const nextReport = {
      ...report,
      questions: report.questions.map((question) =>
        question.id === questionId
          ? { ...question, userAnswer: answer }
          : question,
      ),
    };
    saveState({ interviewReport: nextReport });
    setState({ ...state, interviewReport: nextReport });
  };

  const evaluateQuestion = async (question: InterviewQuestion) => {
    if (!report || evaluatingId) return;

    setEvaluatingId(question.id);
    const evaluation = await evaluateInterviewAnswer({
      question,
      userAnswer: question.userAnswer,
      targetJob: state.targetJob,
      jobProfile: state.jobProfile!,
      projects: state.projects,
      resumeReport: state.resumeReport!,
    });
    const questions = report.questions.map((item) =>
      item.id === question.id
        ? {
            ...item,
            score: evaluation.score,
            feedback: evaluation.feedback,
            missingPoints: evaluation.missingPoints,
            optimizedAnswer: evaluation.optimizedAnswer,
            nextPracticeSuggestion: evaluation.nextPracticeSuggestion,
          }
        : item,
    );
    const nextReport = recalculateReport(report, questions);

    saveState({ interviewReport: nextReport });
    setState({ ...state, interviewReport: nextReport });
    setEvaluatingId(null);
  };

  return (
    <MobileShell
      title="模拟面试"
      showBack
      footer={
        <PrimaryButton
          onClick={() => void createInterview({ ...state, interviewReport: null })}
          disabled={loadingQuestions || evaluatingId !== null}
          icon={
            <RefreshCw
              className={`h-4 w-4 ${loadingQuestions ? "animate-spin" : ""}`}
            />
          }
        >
          重新生成面试题
        </PrimaryButton>
      }
    >
      <div className="space-y-5">
        <Card
          title="面试准备概览"
          subtitle={state.dreamCompany || state.jobProfile.company || "目标公司待定"}
          icon={<Bot className="h-4 w-4" />}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-muted-foreground">目标岗位</div>
              <div className="font-semibold mt-0.5">
                {report?.targetRole || state.targetJob || state.jobProfile.title}
              </div>
            </div>
            <Tag tone="primary">文本模拟面试</Tag>
          </div>

          {report && (
            <>
              <div className="flex flex-wrap gap-2">
                {report.interviewFocus.map((focus) => (
                  <Tag key={focus} tone="muted">
                    {focus}
                  </Tag>
                ))}
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>当前整体得分</span>
                  <span className="tabular-nums">{report.overallScore}/100</span>
                </div>
                <ProgressBar value={report.overallScore} />
              </div>
            </>
          )}
        </Card>

        {loadingQuestions && !report && (
          <Card>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
              正在生成岗位定制面试题，AI 失败时会自动使用本地题库……
            </div>
          </Card>
        )}

        {report?.questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            index={index}
            question={question}
            evaluating={evaluatingId === question.id}
            blocked={evaluatingId !== null && evaluatingId !== question.id}
            onAnswerChange={(answer) => updateQuestionAnswer(question.id, answer)}
            onEvaluate={() => void evaluateQuestion(question)}
          />
        ))}

        {report && (
          <>
            <Card title="你的面试优势" icon={<CheckCircle2 className="h-4 w-4" />}>
              <BulletList
                items={
                  report.strengths.length
                    ? report.strengths
                    : ["完成更多回答后，系统会总结可重点呈现的优势。"]
                }
              />
            </Card>

            <Card title="重点改进方向" icon={<AlertCircle className="h-4 w-4" />}>
              <BulletList items={report.weaknesses} />
            </Card>

            <Card title="整体练习建议" icon={<Sparkles className="h-4 w-4" />}>
              <BulletList items={report.improvementAdvice} />
            </Card>
          </>
        )}
      </div>
    </MobileShell>
  );
}

function QuestionCard({
  index,
  question,
  evaluating,
  blocked,
  onAnswerChange,
  onEvaluate,
}: {
  index: number;
  question: InterviewQuestion;
  evaluating: boolean;
  blocked: boolean;
  onAnswerChange: (answer: string) => void;
  onEvaluate: () => void;
}) {
  const difficultyTone =
    question.difficulty === "困难"
      ? "warning"
      : question.difficulty === "中等"
        ? "primary"
        : "success";

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <span className="h-7 w-7 rounded-full bg-primary-soft text-primary text-xs font-semibold flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap gap-2">
              <Tag tone="muted">{question.type}</Tag>
              <Tag tone={difficultyTone}>{question.difficulty}</Tag>
            </div>
            <h2 className="font-medium leading-7">{question.question}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Target className="h-3.5 w-3.5" />
          考察能力：{question.relatedSkill}
        </div>

        <div className="rounded-xl bg-muted/50 p-3">
          <div className="text-xs font-medium mb-2">建议覆盖要点</div>
          <BulletList items={question.expectedPoints} />
        </div>

        <textarea
          value={question.userAnswer}
          onChange={(event) => onAnswerChange(event.target.value)}
          rows={6}
          placeholder="输入你的回答。建议使用 STAR 或“场景—问题—方案—结果—复盘”结构。"
          className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-ring/40 resize-none"
        />

        <button
          onClick={onEvaluate}
          disabled={evaluating || blocked}
          className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {evaluating ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {evaluating ? "AI 评分中..." : "提交回答并评分"}
        </button>

        {question.score !== null && (
          <div className="space-y-4 pt-2 border-t border-border">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>本题得分</span>
                <span className="font-semibold text-primary">
                  {question.score}/100
                </span>
              </div>
              <ProgressBar value={question.score} />
            </div>

            <ResultSection
              title="AI 反馈"
              icon={<MessageSquareText className="h-4 w-4" />}
            >
              <p>{question.feedback}</p>
            </ResultSection>

            {question.missingPoints.length > 0 && (
              <ResultSection
                title="缺失要点"
                icon={<AlertCircle className="h-4 w-4" />}
              >
                <BulletList items={question.missingPoints} />
              </ResultSection>
            )}

            <ResultSection
              title="优化答案"
              icon={<Sparkles className="h-4 w-4" />}
            >
              <div className="p-3 rounded-xl bg-primary-soft/60 leading-7">
                {question.optimizedAnswer}
              </div>
            </ResultSection>

            <ResultSection
              title="下一步练习"
              icon={<Target className="h-4 w-4" />}
            >
              <p>{question.nextPracticeSuggestion}</p>
            </ResultSection>
          </div>
        )}
      </div>
    </div>
  );
}

function recalculateReport(
  report: InterviewReport,
  questions: InterviewQuestion[],
): InterviewReport {
  const evaluated = questions.filter(
    (question): question is InterviewQuestion & { score: number } =>
      question.score !== null,
  );
  const overallScore = evaluated.length
    ? Math.round(
        evaluated.reduce((total, question) => total + question.score, 0) /
          evaluated.length,
      )
    : 0;
  const strengths = evaluated
    .filter((question) => question.score >= 75)
    .map((question) => `${question.relatedSkill}：${question.feedback}`);
  const weaknesses = Array.from(
    new Set([
      ...report.weaknesses,
      ...evaluated.flatMap((question) => question.missingPoints),
    ]),
  ).slice(0, 6);
  const improvementAdvice = Array.from(
    new Set([
      ...report.improvementAdvice,
      ...evaluated.map((question) => question.nextPracticeSuggestion),
    ]),
  ).slice(0, 8);

  return {
    ...report,
    questions,
    overallScore,
    strengths: strengths.length ? strengths : report.strengths,
    weaknesses,
    improvementAdvice,
  };
}

function ResultSection({
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
    <ul className="text-sm space-y-1.5 text-foreground/85 list-disc pl-4 leading-6">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
