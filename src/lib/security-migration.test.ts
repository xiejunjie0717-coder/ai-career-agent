import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = async (path: string) => readFile(path, "utf8");

test("RAG uses the AI server function without browser secrets", async () => {
  const rag = await source("src/lib/rag.ts");
  const viteSecretName = ["VITE", "SILICONFLOW", "API", "KEY"].join("_");
  const unsafeBrowserOption = ["dangerously", "Allow", "Browser"].join("");

  assert.match(rag, /runAiOperation/);
  assert.match(rag, /operation:\s*"knowledge-answer"/);
  assert.doesNotMatch(rag, new RegExp(viteSecretName));
  assert.doesNotMatch(rag, new RegExp(unsafeBrowserOption));
  assert.doesNotMatch(rag, /new OpenAI/);
});

test("job search uses the Tavily server function", async () => {
  const jobs = await source("src/routes/jobs.tsx");
  const viteSecretName = ["VITE", "TAVILY", "API", "KEY"].join("_");

  assert.match(jobs, /searchJobsServer/);
  assert.doesNotMatch(jobs, new RegExp(viteSecretName));
  assert.doesNotMatch(jobs, /api\.tavily\.com/);
});

test("AI generators use valid operation identifiers", async () => {
  const ai = await source("src/lib/ai.ts");

  for (const operation of [
    "project-recommendations",
    "resume-report",
    "interview-questions",
    "interview-evaluation",
  ]) {
    assert.match(ai, new RegExp(`completeJson\\("${operation}"`));
  }
});
