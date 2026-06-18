import type { ReactNode } from "react";

export function Card({ title, subtitle, icon, action, children, className = "" }: {
  title?: string; subtitle?: string; icon?: ReactNode; action?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 space-y-3 ${className}`}>
      {(title || icon) && (
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              {icon && <span className="text-primary">{icon}</span>}
              {title && <h2 className="font-semibold tracking-tight">{title}</h2>}
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

export function Tag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "primary" | "success" | "warning" | "muted" }) {
  const tones = {
    default: "bg-card border border-border text-foreground",
    primary: "bg-primary-soft text-accent-foreground",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    muted: "bg-muted text-muted-foreground",
  };
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function PrimaryButton({ children, onClick, disabled, icon }: { children: ReactNode; onClick?: () => void; disabled?: boolean; icon?: ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 disabled:opacity-40 transition shadow-sm shadow-primary/25 active:scale-[0.98]"
    >
      {children} {icon}
    </button>
  );
}

export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}