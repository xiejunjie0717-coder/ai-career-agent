import type { ReactNode } from "react";

export function Card({
  title,
  subtitle,
  icon,
  action,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`surface-card space-y-4 p-5 sm:p-6 ${className}`}>
      {(title || icon) && (
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              {icon && <span className="text-primary">{icon}</span>}
              {title && <h2 className="font-semibold tracking-tight text-foreground">{title}</h2>}
            </div>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between px-1">
      <h2 className="text-sm font-semibold tracking-tight">{children}</h2>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

export function Tag({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "primary" | "success" | "warning" | "muted";
}) {
  const tones = {
    default: "bg-card border border-border text-foreground",
    primary: "bg-primary-soft text-accent-foreground",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="pathwise-button flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 sm:mx-auto sm:w-fit sm:min-w-52"
    >
      {children} {icon}
    </button>
  );
}

export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-2 overflow-hidden rounded-full bg-muted">
      <div
        className="progress-fill h-full rounded-full bg-primary transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
