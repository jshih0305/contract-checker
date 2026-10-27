import { z } from "zod";

export const riskLevels = ["low", "medium", "high"] as const;

export const contractAnalysisSchema = z.object({
  contractType: z.string().describe("合約類型，例如：租賃合約、勞動契約、保密協議"),
  parties: z.array(z.string()).describe("合約當事人"),
  summary: z.string().describe("合約重點摘要，3-5 句"),
  overallRisk: z.enum(riskLevels).describe("整體風險等級"),
  risks: z
    .array(
      z.object({
        clause: z.string().describe("相關條款原文或條號"),
        issue: z.string().describe("問題說明"),
        severity: z.enum(riskLevels),
        suggestion: z.string().describe("具體修改建議"),
      }),
    )
    .describe("風險條款清單，依嚴重程度由高到低排列"),
  missingClauses: z.array(z.string()).describe("建議補充但合約中缺少的條款"),
  keyTerms: z
    .array(
      z.object({
        term: z.string().describe("項目名稱，例如：合約期間、付款條件、違約金"),
        detail: z.string(),
      }),
    )
    .describe("關鍵條件整理"),
});

export type ContractAnalysis = z.infer<typeof contractAnalysisSchema>;
export type RiskLevel = (typeof riskLevels)[number];
