import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trophy, Building2 } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { Card, Tag } from "@/components/ui-primitives";

export const Route = createFileRoute("/offers")({
  head: () => ({ meta: [{ title: "Offer 管理" }] }),
  component: OffersPage,
});

const APPLIED = [
  { c: "字节跳动", role: "AI 产品经理", stage: "终面", color: "warning" as const },
  { c: "阿里巴巴", role: "AI 产品策划", stage: "二面", color: "primary" as const },
  { c: "腾讯", role: "智能客服 PM", stage: "笔试", color: "muted" as const },
  { c: "美团", role: "AIGC 内容产品", stage: "已投", color: "muted" as const },
];
const OFFERS = [
  { c: "字节跳动", role: "AI 产品经理", salary: "26K × 16", loc: "北京", growth: 92 },
  { c: "阿里巴巴", role: "AI 产品策划", salary: "24K × 15", loc: "杭州", growth: 85 },
];

function OffersPage() {
  const [tab, setTab] = useState<"flow" | "offer">("flow");
  return (
    <MobileShell title="Offer 管理" showBack>
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-2">
          <Mini value="12" label="已投递" />
          <Mini value="5" label="面试中" />
          <Mini value="2" label="Offer" highlight />
        </div>

        <div className="flex gap-1 p-1 bg-muted rounded-xl">
          {[
            { k: "flow", l: "投递进度" },
            { k: "offer", l: "Offer 对比" },
          ].map(t => (
            <button key={t.k} onClick={() => setTab(t.k as typeof tab)}
              className={`flex-1 h-9 rounded-lg text-sm font-medium transition ${tab === t.k ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
              {t.l}
            </button>
          ))}
        </div>

        {tab === "flow" && (
          <div className="space-y-2">
            {APPLIED.map((a, i) => (
              <div key={i} className="p-4 rounded-2xl border border-border bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{a.role}</div>
                  <div className="text-xs text-muted-foreground">{a.c}</div>
                </div>
                <Tag tone={a.color}>{a.stage}</Tag>
              </div>
            ))}
          </div>
        )}

        {tab === "offer" && (
          <>
            <div className="space-y-3">
              {OFFERS.map((o, i) => (
                <div key={i} className="p-4 rounded-2xl border border-border bg-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold flex items-center gap-1.5">
                        <Trophy className="h-4 w-4 text-amber-500" /> {o.c}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{o.role} · {o.loc}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-semibold text-primary tabular-nums">{o.salary}</div>
                      <div className="text-[11px] text-muted-foreground">成长性 {o.growth}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Card title="薪资对比">
              <div className="space-y-2">
                {OFFERS.map(o => (
                  <div key={o.c}>
                    <div className="flex justify-between text-xs mb-1"><span>{o.c}</span><span className="tabular-nums">{o.salary}</span></div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: o.c === "字节跳动" ? "100%" : "85%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card title="AI 职业发展建议">
              <p className="text-sm text-foreground/85 leading-relaxed">
                综合薪资、成长性与岗位匹配度,建议优先考虑 <span className="text-primary font-medium">字节跳动</span>。该岗位在大模型方向投入大,3 年内晋升空间更明显。
              </p>
            </Card>
          </>
        )}
      </div>
    </MobileShell>
  );
}

function Mini({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-3 text-center ${highlight ? "border-primary bg-primary-soft" : "border-border bg-card"}`}>
      <div className="text-xl font-semibold tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}