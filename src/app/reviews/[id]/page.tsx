import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import ReviewReport from "@/components/ReviewReport";
import { getCurrentUser } from "@/lib/dal";
import { getReviewDetailForUser } from "@/lib/reviews";

export const metadata: Metadata = { title: "審查報告｜AI 合約審查器" };

async function ReviewDetail({ params }: { params: PageProps<"/reviews/[id]">["params"] }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  // 只查得到自己的合約，別人的 id 一律回 404
  const review = await getReviewDetailForUser(user.id, id);
  if (!review) notFound();

  return <ReviewReport fileName={review.fileName} fileUrl={review.fileUrl} analysis={review.analysis} />;
}

export default function ReviewPage({ params }: PageProps<"/reviews/[id]">) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-5 py-14 sm:py-20">
      <Link href="/history" className="group inline-flex w-fit items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
        <span aria-hidden className="transition-transform group-hover:-translate-x-1">
          ←
        </span>
        返回我的紀錄
      </Link>
      <Suspense fallback={<div className="h-[32rem] animate-pulse rounded-2xl bg-line/50" />}>
        <ReviewDetail params={params} />
      </Suspense>
    </main>
  );
}
