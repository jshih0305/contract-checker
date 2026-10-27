import "server-only";
import { isValidObjectId } from "mongoose";
import type { ContractAnalysis, RiskLevel } from "@/lib/analysis-schema";
import { connectToDatabase } from "@/lib/mongodb";
import { ContractReview } from "@/models/ContractReview";

// 所有查詢都必須帶 userId，確保會員只能存取自己的資料

export type ReviewSummary = {
  id: string;
  fileName: string;
  contractType: string;
  overallRisk: RiskLevel;
  riskCount: number;
  createdAt: string;
};

export type ReviewDetail = {
  id: string;
  fileName: string;
  fileUrl: string;
  analysis: ContractAnalysis;
  createdAt: string;
};

// 不直接給前端 Blob 網址，改走會驗證身分的 API
export function getReviewFileUrl(reviewId: string) {
  return `/api/reviews/${reviewId}/file`;
}

export async function listReviewsForUser(userId: string): Promise<ReviewSummary[]> {
  await connectToDatabase();
  const reviews = await ContractReview.find({ userId })
    .select("fileName analysis.contractType analysis.overallRisk analysis.risks createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return reviews.map((review) => ({
    id: review._id.toString(),
    fileName: review.fileName,
    contractType: review.analysis.contractType,
    overallRisk: review.analysis.overallRisk,
    riskCount: review.analysis.risks.length,
    createdAt: review.createdAt.toISOString(),
  }));
}

export async function findReviewForUser(userId: string, reviewId: string) {
  if (!isValidObjectId(reviewId)) return null;
  await connectToDatabase();
  return ContractReview.findOne({ _id: reviewId, userId }).lean();
}

export async function getReviewDetailForUser(userId: string, reviewId: string): Promise<ReviewDetail | null> {
  const review = await findReviewForUser(userId, reviewId);
  if (!review) return null;

  const { analysis } = review;
  return {
    id: review._id.toString(),
    fileName: review.fileName,
    fileUrl: getReviewFileUrl(review._id.toString()),
    analysis: {
      contractType: analysis.contractType,
      parties: analysis.parties,
      summary: analysis.summary,
      overallRisk: analysis.overallRisk,
      risks: analysis.risks.map(({ clause, issue, severity, suggestion }) => ({ clause, issue, severity, suggestion })),
      missingClauses: analysis.missingClauses,
      keyTerms: analysis.keyTerms.map(({ term, detail }) => ({ term, detail })),
    },
    createdAt: review.createdAt.toISOString(),
  };
}
