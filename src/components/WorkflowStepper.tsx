import {
  Brain,
  FileSearch,
  FileText,
  FolderKanban,
  GitCompareArrows,
  ListTodo,
  Map,
  Mic,
  Target,
} from "lucide-react";

const steps = [
  { label: "岗位 / JD", icon: FileSearch },
  { label: "岗位画像", icon: Target },
  { label: "能力画像", icon: Brain },
  { label: "Gap", icon: GitCompareArrows },
  { label: "Roadmap", icon: Map },
  { label: "Projects", icon: FolderKanban },
  { label: "Resume", icon: FileText },
  { label: "Interview", icon: Mic },
  { label: "Tasks", icon: ListTodo },
];

export function WorkflowStepper({ completedSteps }: { completedSteps?: boolean[] }) {
  const currentStepIndex = completedSteps?.findIndex((complete) => !complete) ?? -1;

  return (
    <div className="overflow-x-auto pb-2">
      <ol className="flex min-w-[860px] items-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const active = index === currentStepIndex;
          const complete = completedSteps?.[index] ?? false;

          return (
            <li
              key={step.label}
              className={`workflow-step flex flex-1 items-center ${
                active ? "is-active" : complete ? "is-complete" : ""
              }`}
              aria-current={active ? "step" : undefined}
            >
              <div className="flex min-w-[76px] flex-col items-center text-center">
                <span className="workflow-step-icon flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={`mt-2 text-xs font-medium ${
                    active ? "text-primary" : "text-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 ? (
                <span
                  className={`workflow-connector mx-2 h-px flex-1 bg-gradient-to-r from-primary/35 to-border ${
                    complete ? "is-complete" : "opacity-70"
                  }`}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
