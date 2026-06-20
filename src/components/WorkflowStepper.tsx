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
  { label: "目标岗位", icon: FileSearch },
  { label: "岗位要求", icon: Target },
  { label: "能力盘点", icon: Brain },
  { label: "差距排序", icon: GitCompareArrows },
  { label: "成长路线", icon: Map },
  { label: "项目证据", icon: FolderKanban },
  { label: "简历表达", icon: FileText },
  { label: "面试训练", icon: Mic },
  { label: "行动任务", icon: ListTodo },
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
                <span className="workflow-step-icon flex h-10 w-10 items-center justify-center rounded-md border border-primary/20 bg-primary-soft text-primary">
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
                  className={`workflow-connector mx-2 h-px flex-1 bg-primary/30 ${
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
