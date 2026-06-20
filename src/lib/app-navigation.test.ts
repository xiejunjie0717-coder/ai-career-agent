import assert from "node:assert/strict";
import test from "node:test";

import { primaryNavigation, workflowNavigation } from "./app-navigation.ts";

test("exposes landing and dashboard as separate primary destinations", () => {
  assert.deepEqual(
    primaryNavigation.map((item) => item.to),
    ["/", "/dashboard", "/tasks", "/profile"],
  );
});

test("keeps the existing career workflow routes in navigation order", () => {
  assert.deepEqual(
    workflowNavigation.map((item) => item.to),
    ["/analysis", "/assessment", "/gap", "/roadmap", "/projects", "/resume", "/interview"],
  );
});
