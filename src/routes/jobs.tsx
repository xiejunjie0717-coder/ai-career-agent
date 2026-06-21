import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, MapPin, Search } from "lucide-react";
import { toast } from "sonner";

import { AsyncState } from "@/components/AsyncState";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { searchJobsServer } from "@/lib/api/search.functions";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "岗位搜索｜Pathwise Career" }] }),
  component: JobsPage,
});

type JobSearchResult = {
  title: string;
  content: string;
  url: string;
};

function JobsPage() {
  const [keyword, setKeyword] = useState("AI产品经理");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<JobSearchResult[]>([]);

  const searchJobs = async () => {
    if (keyword.trim().length < 2) {
      toast.error("请输入至少两个字符的岗位关键词");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const data = await searchJobsServer({ data: { keyword } });
      setResults(data);
      if (!data.length) toast.info("暂未找到相关网络结果");
    } catch (cause) {
      console.error(cause);
      setError("岗位搜索暂时不可用，请检查 Tavily 服务配置或稍后重试。");
      toast.error("岗位搜索失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileShell title="岗位搜索" showTabs>
      <div className="space-y-6">
        <PageHeader
          title="岗位信息搜索"
          description="通过 Tavily 获取公开网络搜索摘要，仅用于 MVP 演示，不代表实时招聘、薪资或正式职位数据。"
          nextHint="找到参考岗位后，可返回首页设置目标岗位并上传真实 JD。"
        />
        <SectionCard title="搜索公开岗位信息">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void searchJobs();
              }}
              placeholder="输入岗位名称"
              className="h-11 flex-1 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
            <button
              type="button"
              onClick={() => void searchJobs()}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              {loading ? "搜索中..." : "搜索"}
            </button>
          </div>
        </SectionCard>

        {loading ? (
          <AsyncState
            status="loading"
            title="正在搜索公开网络信息"
            description="结果由 Tavily 返回并经过安全字段过滤。"
          />
        ) : null}
        {error ? (
          <AsyncState
            status="error"
            title="岗位搜索失败"
            description={error}
            onRetry={() => void searchJobs()}
          />
        ) : null}
        {!loading && searched && !error && !results.length ? (
          <AsyncState
            status="empty"
            title="暂无搜索结果"
            description="可以尝试更具体的岗位名称或公司关键词。"
          />
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          {results.map((item) => (
            <SectionCard key={item.url}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold leading-6">{item.title}</h3>
                <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
                  网络摘要
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                公开搜索结果 · 非实时招聘承诺
              </div>
              <p className="mt-3 line-clamp-5 text-sm leading-6 text-muted-foreground">
                {item.content}
              </p>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                查看来源
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </SectionCard>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
