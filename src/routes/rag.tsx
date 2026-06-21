import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Brain, FileText, Send } from "lucide-react";
import { toast } from "sonner";

import { AiResultActions } from "@/components/AiResultActions";
import { AsyncState } from "@/components/AsyncState";
import { EmptyState } from "@/components/EmptyState";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { askKnowledge } from "@/lib/rag";

export const Route = createFileRoute("/rag")({
  head: () => ({ meta: [{ title: "PDF 全文问答原型｜Pathwise Career" }] }),
  component: RAGPage,
});

function RAGPage() {
  const [hasKnowledge, setHasKnowledge] = useState<boolean | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setHasKnowledge(Boolean(localStorage.getItem("knowledge_base")));
  }, []);

  const handleAsk = async () => {
    if (!question.trim()) {
      toast.error("请先输入问题");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await askKnowledge(question);
      setAnswer(response);
      toast.success("知识库回答已生成");
    } catch (cause) {
      console.error(cause);
      setError("知识库查询失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileShell title="PDF 全文问答" showBack>
      <div className="space-y-6">
        <PageHeader
          title="PDF 全文知识库问答原型"
          description="当前实现会将浏览器中保存的 PDF 全文与问题一起提交给模型，不包含 Embedding、向量数据库、语义检索或引用溯源。"
          nextHint="上传 PDF 后提出与文档内容相关的问题。"
        />

        {hasKnowledge === null ? (
          <AsyncState status="loading" title="正在读取本地知识库" />
        ) : !hasKnowledge ? (
          <EmptyState
            title="知识库中还没有 PDF 内容"
            description="请先上传一份 PDF，文本会保存在当前浏览器并用于本页问答。"
            actionLabel="上传 PDF"
            to="/upload"
          />
        ) : (
          <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <SectionCard title="向当前 PDF 提问" description="问题越具体，回答越容易对应文档内容。">
              <div className="mb-3 flex items-center gap-2 text-xs text-emerald-700">
                <FileText className="h-4 w-4" />
                已载入当前浏览器中的 PDF 全文
              </div>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="例如：这份 JD 最看重哪些能力？"
                rows={7}
                className="w-full resize-none rounded-xl border border-input bg-background p-4 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              <button
                type="button"
                onClick={() => void handleAsk()}
                disabled={loading}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {loading ? "查询中..." : "开始提问"}
              </button>
            </SectionCard>

            <div className="space-y-4">
              {loading ? (
                <AsyncState
                  status="loading"
                  title="正在根据 PDF 全文生成回答"
                  description="当前原型不执行检索，会使用完整文档上下文。"
                />
              ) : null}
              {error ? (
                <AsyncState
                  status="error"
                  title="查询失败"
                  description={error}
                  onRetry={() => void handleAsk()}
                />
              ) : null}
              {answer ? (
                <SectionCard title="AI 回答" action={<AiResultActions text={answer} />}>
                  <div className="whitespace-pre-wrap text-sm leading-7 text-foreground/85">
                    {answer}
                  </div>
                </SectionCard>
              ) : !loading && !error ? (
                <AsyncState status="empty" title="等待问题" description="回答结果会显示在这里。" />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
