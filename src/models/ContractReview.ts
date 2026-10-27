import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { riskLevels } from "@/lib/analysis-schema";

const riskSchema = new Schema(
  {
    clause: { type: String, required: true },
    issue: { type: String, required: true },
    severity: { type: String, enum: riskLevels, required: true },
    suggestion: { type: String, required: true },
  },
  { _id: false },
);

const keyTermSchema = new Schema(
  {
    term: { type: String, required: true },
    detail: { type: String, required: true },
  },
  { _id: false },
);

const analysisSchema = new Schema(
  {
    contractType: { type: String, required: true },
    parties: { type: [String], default: [] },
    summary: { type: String, required: true },
    overallRisk: { type: String, enum: riskLevels, required: true },
    risks: { type: [riskSchema], default: [] },
    missingClauses: { type: [String], default: [] },
    keyTerms: { type: [keyTermSchema], default: [] },
  },
  { _id: false },
);

const contractReviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    blobUrl: { type: String, required: true },
    blobPathname: { type: String, required: true },
    model: { type: String, required: true },
    analysis: { type: analysisSchema, required: true },
  },
  { timestamps: true },
);

export type ContractReviewDoc = InferSchemaType<typeof contractReviewSchema>;

// 避免 HMR 時重複註冊 model
export const ContractReview: Model<ContractReviewDoc> =
  (mongoose.models.ContractReview as Model<ContractReviewDoc>) ||
  mongoose.model<ContractReviewDoc>("ContractReview", contractReviewSchema);
