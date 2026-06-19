import OpenAI from "openai";

import { getServerConfig } from "./config.server.ts";

const SILICONFLOW_BASE_URL = "https://api.siliconflow.cn/v1";
const SILICONFLOW_MODEL = "deepseek-ai/DeepSeek-V3";
const TAVILY_SEARCH_URL = "https://api.tavily.com/search";

export type SafeJobSearchResult = {
  title: string;
  content: string;
  url: string;
};

export function requireEnvironmentValue(name: string, value: string | undefined) {
  if (!value?.trim()) {
    throw new Error(`服务端未配置 ${name}`);
  }

  return value;
}

export async function completeWithSiliconFlow(input: {
  system: string;
  user: string;
  temperature?: number;
}) {
  const { siliconFlowApiKey } = getServerConfig();
  const apiKey = requireEnvironmentValue(
    "SILICONFLOW_API_KEY",
    siliconFlowApiKey,
  );
  const client = new OpenAI({
    apiKey,
    baseURL: SILICONFLOW_BASE_URL,
  });
  const response = await client.chat.completions.create({
    model: SILICONFLOW_MODEL,
    messages: [
      { role: "system", content: input.system },
      { role: "user", content: input.user },
    ],
    temperature: input.temperature ?? 0.3,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}

export function normalizeTavilyResults(value: unknown): SafeJobSearchResult[] {
  if (!value || typeof value !== "object") return [];

  const results = (value as { results?: unknown }).results;
  if (!Array.isArray(results)) return [];

  return results
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const result = item as Record<string, unknown>;
      const title = typeof result.title === "string" ? result.title : "";
      const content = typeof result.content === "string" ? result.content : "";
      const url = typeof result.url === "string" ? result.url : "";

      if (!title || !url) return null;
      return { title, content, url };
    })
    .filter((item): item is SafeJobSearchResult => item !== null);
}

export async function searchTavilyJobs(keyword: string) {
  const { tavilyApiKey } = getServerConfig();
  const apiKey = requireEnvironmentValue("TAVILY_API_KEY", tavilyApiKey);
  const response = await fetch(TAVILY_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      query: `${keyword} 招聘 岗位`,
      search_depth: "basic",
      max_results: 5,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily 搜索失败（HTTP ${response.status}）`);
  }

  return normalizeTavilyResults(await response.json());
}
