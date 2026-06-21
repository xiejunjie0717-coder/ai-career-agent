import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, FileCheck2, FileText, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { AsyncState } from "@/components/AsyncState";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { loadState, saveState } from "@/lib/agent-store";

export const Route = createFileRoute("/upload")({
  head: () => ({ meta: [{ title: "上传岗位 JD｜Pathwise Career" }] }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const current = loadState();
    if (current.jdText) {
      setFileName(current.jdFileName);
      setStatus("success");
      setMessage("文件已保存在当前浏览器，可继续进行岗位分析。");
    }
  }, []);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus("loading");
    setMessage("");

    try {
      const { extractPdfText } = await import("@/lib/pdf");
      const text = await extractPdfText(file);
      if (!text.trim()) throw new Error("PDF 中未解析到可用文本");

      localStorage.setItem("knowledge_base", text);
      localStorage.setItem("jd_text", text);
      localStorage.setItem("jd_file_name", file.name);
      saveState({
        jdText: text,
        jdFileName: file.name,
        jobProfile: null,
        gapReport: null,
        roadmap: null,
        projects: [],
        resumeReport: null,
        interviewReport: null,
      });
      setStatus("success");
      setMessage(`已解析 ${text.length} 个字符，并同步为当前 JD 与 PDF 问答上下文。`);
      toast.success("JD PDF 解析成功");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "PDF 解析失败，请更换文件后重试。");
      toast.error("PDF 解析失败");
    }
  };

  return (
    <MobileShell title="上传岗位 JD" showBack>
      <div className="space-y-6">
        <PageHeader
          title="上传真实岗位 JD"
          description="PDF 会在浏览器中提取全文，并作为岗位分析和 PDF 全文问答原型的上下文。"
          nextHint="解析成功后生成结构化岗位画像。"
        />

        <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <SectionCard
            title="选择 JD PDF"
            description="当前为浏览器端 PDF.js 全文提取，不是生产级文档知识库。"
          >
            <label className="flex cursor-pointer flex-col items-center rounded-3xl border border-dashed border-primary/30 bg-primary-soft/35 px-6 py-12 text-center transition hover:border-primary/50 hover:bg-primary-soft/55">
              <UploadCloud className="h-9 w-9 text-primary" />
              <span className="mt-4 font-semibold">点击选择 PDF 文件</span>
              <span className="mt-2 text-xs leading-5 text-muted-foreground">
                建议上传可公开展示、文本可复制的岗位 JD PDF
              </span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleUpload}
                className="sr-only"
              />
            </label>
          </SectionCard>

          <div className="space-y-4">
            {status === "loading" ? (
              <AsyncState
                status="loading"
                title="正在解析 PDF"
                description="正在提取文本并保存到当前浏览器，请不要关闭页面。"
              />
            ) : null}
            {status === "error" ? (
              <AsyncState status="error" title="PDF 解析失败" description={message} />
            ) : null}
            {status === "success" ? (
              <SectionCard title="已上传文件">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <FileCheck2 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{fileName}</div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {message || "文件已保存在当前浏览器，可继续进行岗位分析。"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/analysis-jd" })}
                  className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
                >
                  <FileText className="h-4 w-4" />
                  开始分析 JD
                  <ArrowRight className="h-4 w-4" />
                </button>
              </SectionCard>
            ) : null}
            {status === "idle" ? (
              <AsyncState
                status="empty"
                title="等待上传岗位文件"
                description="上传后会在这里显示文件名、解析状态和下一步入口。"
              />
            ) : null}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
