export type AgentState = {
targetJob: string;
dreamCompany: string;
education: string;
experience: string;
skills: string[];
strengths: "",
weaknesses: "",
};

const KEY = "agent-state-v1";

const defaults: AgentState = {
targetJob: "",
dreamCompany: "",

education: "",
experience: "",

skills: [],

strengths: "",
weaknesses: "",
};

export function loadState(): AgentState {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export function saveState(patch: Partial<AgentState>) {
  if (typeof window === "undefined") return;
  const next = { ...loadState(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
}