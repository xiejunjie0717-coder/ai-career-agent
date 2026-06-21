import { Link } from "@tanstack/react-router";
import { ArrowRight, Inbox } from "lucide-react";

type EmptyRoute =
  | "/"
  | "/dashboard"
  | "/upload"
  | "/analysis"
  | "/assessment"
  | "/gap"
  | "/roadmap"
  | "/projects"
  | "/resume"
  | "/interview"
  | "/tasks";

export function EmptyState({
  title,
  description,
  actionLabel,
  to,
}: {
  title: string;
  description: string;
  actionLabel: string;
  to: EmptyRoute;
}) {
  return (
    <div className="surface-card flex flex-col items-center px-6 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-soft text-primary">
        <Inbox className="h-5 w-5" />
      </span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      <Link
        to={to}
        className="pathwise-button mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
