// 前後端共用的上傳限制
const MIME_TYPES_BY_EXTENSION = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt: "text/plain",
} as const;

export type ContractMimeType = (typeof MIME_TYPES_BY_EXTENSION)[keyof typeof MIME_TYPES_BY_EXTENSION];

export const ACCEPT_ATTRIBUTE = ".pdf,.docx,.txt";

// Vercel Serverless Function 的 request body 上限是 4.5MB
export const MAX_FILE_SIZE = 4 * 1024 * 1024;

// 有些瀏覽器／作業系統不會帶 file.type，因此以副檔名判斷
export function getContractMimeType(file: File): ContractMimeType | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return MIME_TYPES_BY_EXTENSION[extension as keyof typeof MIME_TYPES_BY_EXTENSION] ?? null;
}

export function validateContractFile(file: File): string | null {
  if (!getContractMimeType(file)) {
    return "只支援 PDF、Word（.docx）或純文字（.txt）檔案";
  }
  if (file.size === 0) {
    return "檔案是空的";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "檔案大小不能超過 4MB";
  }
  return null;
}
