export type AppRoute =
  | "/"
  | "/dashboard"
  | "/analysis"
  | "/assessment"
  | "/gap"
  | "/roadmap"
  | "/projects"
  | "/resume"
  | "/interview"
  | "/tasks"
  | "/profile";

export type NavigationItem = {
  to: AppRoute;
  label: string;
  icon:
    | "home"
    | "dashboard"
    | "target"
    | "brain"
    | "gap"
    | "roadmap"
    | "projects"
    | "resume"
    | "interview"
    | "tasks"
    | "profile";
};

export const primaryNavigation: NavigationItem[] = [
  { to: "/", label: "产品首页", icon: "home" },
  { to: "/dashboard", label: "成长工作台", icon: "dashboard" },
  { to: "/tasks", label: "任务中心", icon: "tasks" },
  { to: "/profile", label: "成长档案", icon: "profile" },
];

export const workflowNavigation: NavigationItem[] = [
  { to: "/analysis", label: "岗位分析", icon: "target" },
  { to: "/assessment", label: "能力评估", icon: "brain" },
  { to: "/gap", label: "差距诊断", icon: "gap" },
  { to: "/roadmap", label: "学习路线", icon: "roadmap" },
  { to: "/projects", label: "项目推荐", icon: "projects" },
  { to: "/resume", label: "简历优化", icon: "resume" },
  { to: "/interview", label: "模拟面试", icon: "interview" },
];
