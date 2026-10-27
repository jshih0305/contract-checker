import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { ResponseInputContent } from "openai/resources/responses/responses";
import mammoth from "mammoth";
import { contractAnalysisSchema, type ContractAnalysis } from "@/lib/analysis-schema";
import type { ContractMimeType } from "@/lib/contract-file";

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.5";

const openai = new OpenAI();

const SYSTEM_PROMPT = `你是一位資深的台灣執業律師，專長是合約審閱。
請從「上傳合約的使用者」立場審查合約，找出對使用者不利、模糊或有法律風險的條款，並提供具體可執行的修改建議。
請一律使用繁體中文回答。若內容不是合約，請在 summary 說明，並將 overallRisk 設為 low、其他陣列留空。`;

async function buildContractInput(file: File, mimeType: ContractMimeType): Promise<ResponseInputContent> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (mimeType === "application/pdf") {
    // PDF 直接交給模型讀取（含文字與版面）
    return {
      type: "input_file",
      filename: file.name,
      file_data: `data:application/pdf;base64,${buffer.toString("base64")}`,
    };
  }

  const text =
    mimeType === "text/plain"
      ? buffer.toString("utf8")
      : (await mammoth.extractRawText({ buffer })).value;

  if (!text.trim()) {
    throw new Error("無法從檔案中讀取到文字內容");
  }

  return { type: "input_text", text: `合約內容如下：\n\n${text}` };
}

export async function analyzeContract(file: File, mimeType: ContractMimeType): Promise<ContractAnalysis> {
  const response = await openai.responses.parse({
    model: OPENAI_MODEL,
    instructions: SYSTEM_PROMPT,
    input: [
      {
        role: "user",
        content: [
          await buildContractInput(file, mimeType),
          { type: "input_text", text: "請審查這份合約。" },
        ],
      },
    ],
    text: { format: zodTextFormat(contractAnalysisSchema, "contract_analysis") },
  });

  if (!response.output_parsed) {
    throw new Error("AI 沒有回傳有效的分析結果");
  }

  return response.output_parsed;
}
