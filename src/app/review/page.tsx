import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ContractChecker from "@/components/ContractChecker";
import PageHeading from "@/components/PageHeading";
import { getCurrentUser } from "@/lib/dal";

export const metadata: Metadata = { title: "審查合約｜AI 合約審查器" };

async function ReviewWorkspace() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <ContractChecker />;
}

export default function ReviewPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-5 py-14 sm:py-20">
      <PageHeading eyebrow="New review" title="審查一份合約" body="上傳後 AI 會以你的立場逐條審閱，通常約 40 秒完成。" />
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-line/50" />}>
        <ReviewWorkspace />
      </Suspense>
    </main>
  );
}
