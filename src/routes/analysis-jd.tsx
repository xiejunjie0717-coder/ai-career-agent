import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, FileText, Brain } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/analysis-jd")({
  component: JDAnalysisPage,
});

function JDAnalysisPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        const jdText = localStorage.getItem("jd_text");

        if (!jdText) {
          setAnalysis("未找到JD内容");
          setLoading(false);
          return;
        }

        const prompt = `
你是一名资深AI招聘顾问。

请分析以下岗位JD：

${jdText}

请按照以下格式输出：

【岗位名称】

【核心职责】

【核心技能要求】

【加分项】

【适合什么样的人】

【学习建议】

全程使用中文回答。
`;

        const response = await fetch(
          "https://api.siliconflow.cn/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SILICONFLOW_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "Qwen/Qwen3-8B",
              messages: [
                {
                  role: "user",
                  content: prompt,
                },
              ],
              temperature: 0.7,
            }),
          }
        );

        const data = await response.json();

        console.log("AI返回结果：", data);

        setAnalysis(
          data?.choices?.[0]?.message?.content || "分析失败"
        );
      } catch (error) {
        console.error(error);
        setAnalysis("AI分析失败");
      } finally {
        setLoading(false);
      }
    };

    runAnalysis();
  }, []);

  return (
    <MobileShell
      title="JD分析"
      showBack
      showTabs
    >
      <div className="space-y-4">
        <div className="rounded-2xl border p-4 bg-card">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} />
            <div className="font-semibold">
              JD分析结果
            </div>
          </div>

          {loading ? (
            <div className="text-gray-500">
              AI分析中...
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-sm leading-7">
              {analysis}
            </div>
          )}
        </div>

        {!loading && (
          <button
            onClick={() =>
              navigate({
                to: "/assessment",
              })
            }
            className="w-full bg-blue-500 text-white py-3 rounded-2xl font-medium flex items-center justify-center gap-2"
          >
            <Brain size={18} />
            开始能力评估
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </MobileShell>
  );
}