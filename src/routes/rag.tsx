import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Brain, Send } from "lucide-react";

import { MobileShell } from "@/components/MobileShell";
import { askKnowledge } from "@/lib/rag";

export const Route = createFileRoute("/rag")({
  component: RAGPage,
});

function RAGPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);

      const res = await askKnowledge(question);

      setAnswer(res);
    } catch (err) {
      console.error(err);

      setAnswer("知识库查询失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileShell
      title="RAG知识库"
      showBack
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-medium">
              AI知识库问答
            </span>
          </div>

          <textarea
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            placeholder="例如：AI产品经理需要掌握哪些核心技能？"
            rows={5}
            className="w-full rounded-xl border border-border p-3 text-sm resize-none"
          />
        </div>

        <button
          onClick={handleAsk}
          disabled={loading}
          className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />

          {loading
            ? "知识库查询中..."
            : "开始提问"}
        </button>

        {answer && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-semibold mb-3">
              AI回答
            </h3>

            <div className="whitespace-pre-wrap text-sm leading-7">
              {answer}
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}