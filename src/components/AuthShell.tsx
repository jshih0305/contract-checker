import type { ReactNode } from "react";
import { Seal } from "@/components/BrandMark";

const POINTS = ["風險條款逐條標示與分級", "附上可直接使用的修改建議", "合約與結果只有你看得到"];

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 px-5 py-12 sm:py-20">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_40px_80px_-50px_rgb(26_23_20/0.4)] lg:grid-cols-2">
        <aside className="relative hidden flex-col justify-between gap-12 overflow-hidden bg-ink p-12 text-paper lg:flex">
          <div className="paper-grid pointer-events-none absolute inset-0 opacity-[0.08] [--line:#fff]" />
          <Seal className="relative size-10 rounded-[8px] text-xl" />
          <div className="relative flex flex-col gap-8">
            <p className="font-serif text-3xl font-bold leading-snug">
              簽名之前，
              <br />
              先讓 AI 讀過每一條。
            </p>
            <ul className="flex flex-col gap-3">
              {POINTS.map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-paper/70">
                  <span aria-hidden className="h-px w-4 bg-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="flex items-center px-6 py-12 sm:px-12 sm:py-16">{children}</div>
      </div>
    </main>
  );
}
