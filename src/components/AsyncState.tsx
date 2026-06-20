import { AlertCircle, CheckCircle2, LoaderCircle, Sparkles } from "lucide-react";

type AsyncStateProps = {
  status: "loading" | "error" | "success" | "empty";
  title: string;
  description?: string;
  onRetry?: () => void;
};

export function AsyncState({ status, title, description, onRetry }: AsyncStateProps) {
  const Icon =
    status === "loading"
      ? LoaderCircle
      : status === "error"
        ? AlertCircle
        : status === "success"
          ? CheckCircle2
          : Sparkles;

  return (
    <div
      className={`rounded-2xl border p-5 ${
        status === "error"
          ? "border-red-200 bg-red-50"
          : status === "success"
            ? "border-emerald-200 bg-emerald-50"
            : "border-primary/15 bg-primary-soft/45"
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={`mt-0.5 h-5 w-5 shrink-0 ${
            status === "loading" ? "animate-spin text-primary" : "text-primary"
          }`}
        />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">{title}</div>
          {description ? (
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
          ) : null}
          {status === "loading" ? (
            <div className="mt-4 space-y-2">
              <div className="skeleton-shimmer h-2 rounded-full" />
              <div className="skeleton-shimmer h-2 w-4/5 rounded-full" />
            </div>
          ) : null}
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="pressable mt-3 rounded-xl bg-background px-3 py-2 text-xs font-semibold text-primary shadow-sm"
            >
              重新尝试
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
