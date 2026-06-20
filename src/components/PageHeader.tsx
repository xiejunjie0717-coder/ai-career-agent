import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

type PageHeaderProps = {
  step?: number;
  title: string;
  description: string;
  nextHint?: string;
  backTo?:
    | "/dashboard"
    | "/analysis"
    | "/assessment"
    | "/gap"
    | "/roadmap"
    | "/projects"
    | "/resume";
};

export function PageHeader({
  step,
  title,
  description,
  nextHint,
  backTo = "/dashboard",
}: PageHeaderProps) {
  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {step ? (
          <span className="rounded-full bg-primary-soft px-2.5 py-1 font-semibold text-primary">
            Workflow {step} / 8
          </span>
        ) : null}
        <Link
          to={backTo}
          className="inline-flex items-center gap-1 text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回 {backTo === "/dashboard" ? "Dashboard" : "上一步"}
        </Link>
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
      {nextHint ? (
        <div className="inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-primary-soft/50 px-3 py-2 text-xs text-muted-foreground">
          <ArrowRight className="h-3.5 w-3.5 text-primary" />
          下一步：{nextHint}
        </div>
      ) : null}
    </header>
  );
}
