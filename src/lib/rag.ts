import { runAiOperation } from "@/lib/api/ai.functions";

export async function askKnowledge(
  question: string
) {
  const knowledge =
    localStorage.getItem(
      "knowledge_base"
    ) || "";

  if (!knowledge) {
    return "知识库为空，请先上传PDF文件。";
  }

  try {
    const response = await runAiOperation({
      data: {
        operation: "knowledge-answer",
        payload: {
          knowledge,
          question,
        },
      },
    });

    return response || "暂无回答";
  } catch (error) {
    console.error(error);
    return "暂无回答";
  }
}
