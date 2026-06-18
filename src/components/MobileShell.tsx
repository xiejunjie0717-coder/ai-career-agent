import type { ReactNode } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Home, ListTodo, Briefcase, User } from "lucide-react";

type Props = {
  title?: string;
  showBack?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  showTabs?: boolean;
  rightSlot?: ReactNode;
};

export function MobileShell({ title, showBack, children, footer, showTabs, rightSlot }: Props) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center">
      <div className="w-full max-w-[440px] flex flex-col min-h-screen border-x border-border/60 relative">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/60">
          <div className="flex items-center gap-3 px-5 h-14">
            {showBack ? (
              <button
                onClick={() => router.history.back()}
                className="-ml-2 p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="返回"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <Link to="/" className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold tracking-tight">职途 Agent</span>
              </Link>
            )}
            {title && showBack && (
              <h1 className="font-semibold text-base truncate flex-1">{title}</h1>
            )}
            {rightSlot && <div className="ml-auto">{rightSlot}</div>}
          </div>
        </header>
        <main className={`flex-1 px-5 py-6 ${footer ? "pb-32" : showTabs ? "pb-24" : "pb-8"}`}>{children}</main>
        {footer && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] px-5 pb-6 pt-3 bg-gradient-to-t from-background via-background to-transparent">
            {footer}
          </div>
        )}
        {showTabs && !footer && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-background/95 backdrop-blur-md border-t border-border/60">
            <div className="grid grid-cols-4 px-2 pt-2 pb-3">
              {[
                { to: "/", label: "首页", icon: Home },
                { to: "/tasks", label: "任务", icon: ListTodo },
                { to: "/jobs", label: "岗位", icon: Briefcase },
                { to: "/profile", label: "我的", icon: User },
              ].map((t) => {
                const active = pathname === t.to;
                const Icon = t.icon;
                return (
                  <Link
                    key={t.to}
                    to={t.to}
                    className={`flex flex-col items-center gap-0.5 py-1.5 rounded-lg transition-colors ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                    <span className="text-[10px] font-medium">{t.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}