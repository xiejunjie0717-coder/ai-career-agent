export type JobProfile = {
  title: string;
  company: string;
  responsibilities: string[];
  requiredSkills: string[];
  niceToHaveSkills: string[];
  tools: string[];
  keywords: string[];
  evaluationCriteria: string[];
  summary: string;
};

export type AbilityProfile = {
  education: string;
  experience: string;
  skills: string[];
  strengths: string;
  weaknesses: string;
  summary: string;
  matchScore: number;
  advantages: string[];
  gaps: string[];
  suggestions: string[];
};

export type GapReport = {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  riskPoints: string[];
  priorityGaps: string[];
  nextActions: string[];
};

export type RoadmapPhase = {
  days: number;
  title: string;
  weeklyGoals: string[];
  dailyTasks: string[];
  recommendedProjects: string[];
  recommendedResources: string[];
  acceptanceCriteria: string[];
};

export type Roadmap = {
  title: string;
  goal30Days: string;
  phases: RoadmapPhase[];
};

export type ProjectRecommendation = {
  title: string;
  targetSkill: string[];
  difficulty: "入门" | "进阶" | "面试亮点";
  valueForResume: string;
  productScenario: string;
  coreFeatures: string[];
  techStack: string[];
  deliverables: string[];
  interviewTalkingPoints: string[];
  estimatedDays: number;
};

export type ResumeReport = {
  matchScore: number;
  missingKeywords: string[];
  suggestedSkills: string[];
  projectExperienceDraft: string[];
  selfEvaluationDraft: string;
  optimizationAdvice: string[];
  riskPoints: string[];
};

export type InterviewQuestionType =
  | "岗位理解题"
  | "项目经历题"
  | "AI 产品设计题"
  | "技术理解题"
  | "行为面试题";

export type InterviewQuestion = {
  id: string;
  type: InterviewQuestionType;
  question: string;
  expectedPoints: string[];
  relatedSkill: string;
  difficulty: "基础" | "中等" | "困难";
  userAnswer: string;
  score: number | null;
  feedback: string;
  missingPoints: string[];
  optimizedAnswer: string;
  nextPracticeSuggestion: string;
};

export type InterviewReport = {
  targetRole: string;
  interviewFocus: string[];
  questions: InterviewQuestion[];
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  improvementAdvice: string[];
};

export type TaskSource = "roadmap" | "project" | "interview";

export type TaskStatus = "todo" | "doing" | "done";

export type TaskPriority = "high" | "medium" | "low";

export type AgentTask = {
  id: string;
  source: TaskSource;
  title: string;
  description: string;
  category: "学习" | "项目" | "面试";
  estimatedMinutes: number;
  status: TaskStatus;
  priority: TaskPriority;
  relatedSkill: string;
  createdAt: string;
  completedAt: string | null;
};

export type AgentState = {
  targetJob: string;
  dreamCompany: string;
  education: string;
  experience: string;
  skills: string[];
  strengths: string;
  weaknesses: string;
  jdText: string;
  jdFileName: string;
  jobProfile: JobProfile | null;
  abilityProfile: AbilityProfile | null;
  gapReport: GapReport | null;
  roadmap: Roadmap | null;
  projects: ProjectRecommendation[];
  resumeReport: ResumeReport | null;
  interviewReport: InterviewReport | null;
  tasks: AgentTask[];
};

const KEY = "agent-state-v1";

const defaults: AgentState = {
  targetJob: "",
  dreamCompany: "",
  education: "",
  experience: "",
  skills: [],
  strengths: "",
  weaknesses: "",
  jdText: "",
  jdFileName: "",
  jobProfile: null,
  abilityProfile: null,
  gapReport: null,
  roadmap: null,
  projects: [],
  resumeReport: null,
  interviewReport: null,
  tasks: [],
};

export function loadState(): AgentState {
  if (typeof window === "undefined") return defaults;

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;

    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export function saveState(patch: Partial<AgentState>) {
  if (typeof window === "undefined") return;

  const next = { ...loadState(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
}
