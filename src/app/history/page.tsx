import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import PageHeading from "@/components/PageHeading";
import { RiskBadge } from "@/components/ReviewReport";
import { getCurrentUser } from "@/lib/dal";
import { listReviewsForUser } from "@/lib/reviews";

export const metadata: Metadata = { title: "我的紀錄｜AI 合約審查器" };

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Taipei",
});

async function ReviewList() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const reviews = await listReviewsForUser(user.id);

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
        <p className="font-serif text-xl font-bold">還沒有審查紀錄</p>
        <p className="text-sm text-muted">上傳第一份合約，審查結果會保存在這裡。</p>
        <Link href="/review" className="btn-primary">
          審查合約
        </Link>
      </div>
    );
  }

  return (
    <ul className="overflow-hidden rounded-2xl border border-line bg-surface">
      {reviews.map((review) => (
        <li key={review.id} className="border-t border-line first:border-t-0">
          <Link
            href={`/reviews/${review.id}`}
            className="group flex items-center justify-between gap-6 px-5 py-5 transition-colors hover:bg-paper sm:px-7"
          >
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="truncate font-serif text-lg font-bold">{review.fileName}</span>
              <span className="text-sm text-muted">
                {review.contractType}
                <span className="mx-2 text-line-strong">/</span>
                {review.riskCount} 項風險
                <span className="mx-2 text-line-strong">/</span>
                {dateFormatter.format(new Date(review.createdAt))}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <RiskBadge level={review.overallRisk} />
              <span aria-hidden className="hidden text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent sm:inline">
                →
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function HistoryPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-5 py-14 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <PageHeading eyebrow="History" title="我的紀錄" body="你審查過的每一份合約，只有你看得到。" />
        <Link href="/review" className="btn-primary">
          審查新合約
        </Link>
      </div>
      <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-line/50" />}>
        <ReviewList />
      </Suspense>
    </main>
  );
}
