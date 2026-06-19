import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const searchSchema = z.object({
  keyword: z.string().trim().min(2).max(100),
});

export const searchJobsServer = createServerFn({ method: "POST" })
  .inputValidator(searchSchema)
  .handler(async ({ data }) => {
    const { searchTavilyJobs } = await import("../external-api.server");
    return searchTavilyJobs(data.keyword);
  });
