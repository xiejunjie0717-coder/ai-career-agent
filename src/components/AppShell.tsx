import type { ReactNode } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,
  Brain,
  CircleGauge,
  FileText,
  FolderKanban,
  GitCompareArrows,
  Home,
  ListTodo,
  Map,
  Mic,
  Route as RouteIcon,
  Target,
  UserRound,
} from "lucide-react";

import { primaryNavigation, workflowNavigation, type NavigationItem } from "@/lib/app-navigation";

type AppShellProps = {
  title?: string;
  showBack?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  showTabs?: boolean;
  rightSlot?: ReactNode;
};

const iconMap = {
  home: Home,
  dashboard: CircleGauge,
  target: Target,
  brain: Brain,
  gap: GitCompareArrows,
  roadmap: Map,
  projects: FolderKanban,
  resume: FileText,
  interview: Mic,
  tasks: ListTodo,
  profile: UserRound,
} as const;

export function AppShell({
  title,
  showBack,
  children,
  footer,
  showTabs,
  rightSlot,
}: AppShellProps) {
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="min-h-screen bg-app text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-sidebar px-4 py-5 lg:flex lg:flex-col">
        <Brand />
        <nav className="mt-8 flex-1 space-y-7">
          <NavigationGroup label="产品" items={primaryNavigation} pathname={pathname} />
          <NavigationGroup label="求职工作流" items={workflowNavigation} pathname={pathname} />
        </nav>
        <div className="blueprint-panel rounded-lg border border-primary/20 bg-primary-soft/45 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <RouteIcon className="h-4 w-4 text-primary" />
            你的成长路线
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            看清差距、排好优先级，然后完成今天最值得推进的一步。
          </p>
          <Link
            to="/dashboard"
            className="mt-3 inline-flex items-center text-xs font-semibold text-primary"
          >
            查看当前进度
          </Link>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/92 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
            <div className="lg:hidden">
              {showBack ? (
                <button
                  type="button"
                  onClick={() => router.history.back()}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label="返回"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              ) : (
                <Brand compact />
              )}
            </div>
            <div className="min-w-0 flex-1">
              {title ? (
                <>
                  <div className="hidden text-xs text-muted-foreground sm:block">
                    Your Career Route
                  </div>
                  <h1 className="truncate text-base font-semibold tracking-tight">{title}</h1>
                </>
              ) : (
                <span className="hidden text-sm text-muted-foreground lg:block">
                  让成长路线清晰可执行
                </span>
              )}
            </div>
            {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
          </div>
        </header>

        <main
          className={`mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 ${
            footer ? "pb-32" : showTabs ? "pb-24" : "pb-10"
          }`}
        >
          <div className="motion-page">{children}</div>
        </main>

        {footer ? (
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/92 px-4 py-3 backdrop-blur-xl lg:left-64">
            <div className="mx-auto max-w-3xl">{footer}</div>
          </div>
        ) : null}

        {showTabs && !footer ? (
          <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/95 px-2 pb-2 pt-1 backdrop-blur-xl lg:hidden">
            <div className="mx-auto grid max-w-lg grid-cols-4">
              {primaryNavigation.map((item) => (
                <MobileNavigationItem key={item.to} item={item} active={pathname === item.to} />
              ))}
            </div>
          </nav>
        ) : null}
      </div>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="pressable flex items-center gap-2.5">
      <span className="grid h-9 w-9 grid-cols-2 gap-0.5 rounded-md bg-primary p-2 text-primary-foreground">
        <span className="border border-current" />
        <span className="border border-current bg-current" />
        <span className="border border-current bg-current" />
        <span className="border border-current" />
      </span>
      {!compact ? (
        <span>
          <span className="block text-sm font-semibold tracking-tight">AI Career Agent</span>
          <span className="block text-[11px] text-muted-foreground">让成长路线清晰可执行</span>
        </span>
      ) : null}
    </Link>
  );
}

function NavigationGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: NavigationItem[];
  pathname: string;
}) {
  return (
    <div>
      <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/75">
        {label}
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          const active = pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-item flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-sm font-medium ${
                active
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={active ? 2.3 : 1.9} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function MobileNavigationItem({ item, active }: { item: NavigationItem; active: boolean }) {
  const Icon = iconMap[item.icon];

  return (
    <Link
      to={item.to}
      className={`mobile-nav-item flex flex-col items-center gap-1 rounded-md py-2 text-[10px] font-medium ${
        active ? "is-active bg-primary-soft/70 text-primary" : "text-muted-foreground"
      }`}
    >
      <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
      {item.label === "产品首页" ? "首页" : item.label}
    </Link>
  );
}
