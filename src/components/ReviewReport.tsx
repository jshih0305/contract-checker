import type { ReactNode } from "react";
import type { ContractAnalysis, RiskLevel } from "@/lib/analysis-schema";

const RISK_LABELS: Record<RiskLevel, string> = {
  low: "低風險",
  medium: "中風險",
  high: "高風險",
};

const RISK_STYLES: Record<RiskLevel, string> = {
  low: "bg-risk-low-soft text-risk-low",
  medium: "bg-risk-medium-soft text-risk-medium",
  high: "bg-risk-high-soft text-risk-high",
};

const RISK_DOT: Record<RiskLevel, string> = {
  low: "bg-risk-low",
  medium: "bg-risk-medium",
  high: "bg-risk-high",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium leading-none ${RISK_STYLES[level]}`}
    >
      <span className={`size-1.5 rounded-full ${RISK_DOT[level]}`} />
      {RISK_LABELS[level]}
    </span>
  );
}

function Section({ title, count, children }: { title: string; count?: number; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5 border-t border-line px-6 py-8 sm:px-10">
      <h3 className="eyebrow">
        {title}
        {count !== undefined && <span className="ml-2 text-accent">{String(count).padStart(2, "0")}</span>}
      </h3>
      {children}
    </section>
  );
}

type ReviewReportProps = {
  fileName: string;
  fileUrl: string;
  analysis: ContractAnalysis;
};

export default function ReviewReport({ fileName, fileUrl, analysis }: ReviewReportProps) {
  const riskCounts = analysis.risks.reduce(
    (counts, risk) => ({ ...counts, [risk.severity]: counts[risk.severity] + 1 }),
    { high: 0, medium: 0, low: 0 } as Record<RiskLevel, number>,
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_60px_-40px_rgb(26_23_20/0.35)]">
      <header className="flex flex-col gap-6 px-6 pb-8 pt-9 sm:px-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="eyebrow">審查報告</p>
            <h2 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">{analysis.contractType}</h2>
            {analysis.parties.length > 0 && <p className="text-sm text-muted">{analysis.parties.join("　·　")}</p>}
          </div>
          <RiskBadge level={analysis.overallRisk} />
        </div>

        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
          {(["high", "medium", "low"] as const).map((level) => (
            <div key={level} className="flex flex-col gap-1 bg-paper px-4 py-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted">
                <span className={`size-1.5 rounded-full ${RISK_DOT[level]}`} />
                {RISK_LABELS[level]}
              </dt>
              <dd className="font-serif text-2xl font-bold">{riskCounts[level]}</dd>
            </div>
          ))}
        </dl>

        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex w-fit items-center gap-2 text-sm text-ink-soft transition-colors hover:text-accent"
        >
          <span aria-hidden className="grid size-7 place-items-center rounded-md border border-line font-mono text-[10px]">
            DOC
          </span>
          <span className="underline decoration-line-strong underline-offset-4 group-hover:decoration-accent">{fileName}</span>
          <span aria-hidden>↗</span>
        </a>
      </header>

      <Section title="摘要">
        <p className="font-serif text-[17px] leading-9 text-ink">{analysis.summary}</p>
      </Section>

      {analysis.risks.length > 0 && (
        <Section title="風險條款" count={analysis.risks.length}>
          <ol className="flex flex-col gap-4">
            {analysis.risks.map((risk, index) => (
              <li key={index} className="flex flex-col gap-4 rounded-xl border border-line bg-paper p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <blockquote className="font-serif text-[15px] leading-7 text-ink-soft">「{risk.clause}」</blockquote>
                  <RiskBadge level={risk.severity} />
                </div>
                <p className="leading-7 text-ink">{risk.issue}</p>
                <div className="border-l-2 border-accent pl-4">
                  <p className="mb-1 text-xs font-medium tracking-wider text-accent">修改建議</p>
                  <p className="text-sm leading-7 text-ink-soft">{risk.suggestion}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {analysis.keyTerms.length > 0 && (
        <Section title="關鍵條件">
          <dl className="flex flex-col divide-y divide-line">
            {analysis.keyTerms.map((item) => (
              <div key={item.term} className="grid gap-1 py-3.5 first:pt-0 last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="text-sm font-medium text-muted">{item.term}</dt>
                <dd className="leading-7 text-ink">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {analysis.missingClauses.length > 0 && (
        <Section title="建議補充的條款" count={analysis.missingClauses.length}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {analysis.missingClauses.map((clause) => (
              <li key={clause} className="flex gap-3 text-sm leading-7 text-ink-soft">
                <span aria-hidden className="mt-[11px] h-px w-3 shrink-0 bg-accent" />
                {clause}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <footer className="border-t border-line bg-paper px-6 py-4 text-xs text-muted sm:px-10">
        本報告由 AI 產生，僅供參考，不構成法律意見。
      </footer>
    </article>
  );
}
