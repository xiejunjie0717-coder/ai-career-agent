import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Upload } from "lucide-react";

import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/upload")({
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();

  const [fileName, setFileName] = useState("");

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setFileName(file.name);

      const { extractPdfText } = await import(
        "@/lib/pdf"
      );

      const text = await extractPdfText(file);

      console.log("JD内容：");
      console.log(text);
      localStorage.setItem(
       "knowledge_base",
        text
      );

      alert("知识库导入成功");
      // 保存JD内容
      localStorage.setItem(
        "jd_text",
        text
      );

      // 保存文件名
      localStorage.setItem(
        "jd_file_name",
        file.name
      );
    } catch (error) {
      console.error(error);

      alert("PDF解析失败");
    }
  };

  return (
    <MobileShell
      title="上传岗位JD"
      showTabs
    >
      <div className="space-y-4">
        <div className="rounded-2xl border p-5 bg-card">
          <div className="flex items-center gap-2 mb-4">
            <Upload size={20} />
            <h2 className="text-lg font-semibold">
              上传岗位JD
            </h2>
          </div>

          <input
            type="file"
            accept=".pdf"
            onChange={handleUpload}
          />
        </div>

        {fileName && (
          <>
            <div className="rounded-2xl border p-4 bg-card">
              <div className="font-medium">
                已上传文件
              </div>
                  <div className="text-sm text-gray-500 mt-2">
                     {fileName}
                    </div>

                 <div className="text-xs text-green-600 mt-2">
                      ✓ 已同步到RAG知识库
                    </div>

              <div className="text-sm text-gray-500 mt-2">
                {fileName}
              </div>
            </div>

            <button
              onClick={() =>
                navigate({
                  to: "/analysis-jd",
                })
              }
              className="w-full bg-blue-500 text-white py-3 rounded-2xl font-medium"
            >
              开始分析JD
            </button>
          </>
        )}
      </div>
    </MobileShell>
  );
}