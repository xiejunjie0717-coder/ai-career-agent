import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeTavilyResults,
  requireEnvironmentValue,
} from "./external-api.server.ts";

test("requireEnvironmentValue rejects missing secrets without exposing values", () => {
  assert.throws(
    () => requireEnvironmentValue("SILICONFLOW_API_KEY", ""),
    /SILICONFLOW_API_KEY/,
  );
});

test("normalizeTavilyResults returns only safe fields", () => {
  const results = normalizeTavilyResults({
    results: [
      {
        title: "AI 产品经理",
        content: "岗位描述",
        url: "https://example.com/job",
        raw_content: "不应返回",
        score: 0.99,
      },
    ],
  });

  assert.deepEqual(results, [
    {
      title: "AI 产品经理",
      content: "岗位描述",
      url: "https://example.com/job",
    },
  ]);
});
