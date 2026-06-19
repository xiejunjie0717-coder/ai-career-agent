import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, FileText, Brain } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { analyzeJobProfile } from "@/lib/ai";
import { loadState, saveState } from "@/lib/agent-store";

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
        const state = loadState();
        const jdText = state.jdText || localStorage.getItem("jd_text") || "";

        if (!jdText) {
          setAnalysis("未找到JD内容");
          return;
        }

        const { profile, text } = await analyzeJobProfile({
          jobName: state.targetJob || "JD 目标岗位",
          company: state.dreamCompany,
          jdText,
        });

        saveState({
          targetJob: profile.title,
          dreamCompany: profile.company || state.dreamCompany,
          jdText,
          jobProfile: profile,
          gapReport: null,
          roadmap: null,
          projects: [],
          resumeReport: null,
          interviewReport: null,
        });

        setAnalysis([
          text,
          "",
          `核心职责：\n${profile.responsibilities.map((item) => `• ${item}`).join("\n")}`,
          "",
          `核心技能：\n${profile.requiredSkills.map((item) => `• ${item}`).join("\n")}`,
          "",
          `加分项：\n${profile.niceToHaveSkills.map((item) => `• ${item}`).join("\n")}`,
        ].join("\n"));
      } catch (error) {
        console.error(error);
        setAnalysis("AI分析失败，请检查 API Key、网络连接或 SiliconFlow 余额。");
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
