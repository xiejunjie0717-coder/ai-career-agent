import type { ReactNode } from "react";

export function SectionCard({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`surface-card p-5 sm:p-6 ${className}`}>
      {title || action ? (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title ? <h3 className="font-semibold tracking-tight">{title}</h3> : null}
            {description ? (
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
