import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { searchJobsServer } from "@/lib/api/search.functions";

export const Route = createFileRoute("/jobs")({
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
  const [results, setResults] = useState<JobSearchResult[]>([]);

  const searchJobs = async () => {
    try {
      setLoading(true);

      const data = await searchJobsServer({
        data: {
          keyword,
        },
      });

      setResults(data);
    } catch (err) {
      console.error(err);
      alert("搜索失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileShell title="岗位搜索" showTabs>
      <div className="space-y-4">

        <div className="flex gap-2">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="输入岗位名称"
            className="flex-1 border rounded-xl px-4 py-2"
          />

          <button
            onClick={searchJobs}
            className="px-4 py-2 rounded-xl bg-blue-500 text-white flex items-center gap-2"
          >
            <Search size={18} />
            搜索
          </button>
        </div>

        {loading && (
          <div>搜索中...</div>
        )}

        {results.map((item, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 space-y-2"
          >
            <h3 className="font-bold">
              {item.title}
            </h3>

            <div className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin size={14} />
              网络搜索结果
            </div>

            <p className="text-sm">
              {item.content}
            </p>

            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500"
            >
              查看原文
            </a>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}
