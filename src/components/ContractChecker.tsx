"use client";

import Link from "next/link";
import { useEffect, useState, type DragEvent, type FormEvent } from "react";
import ReviewReport from "@/components/ReviewReport";
import type { ContractAnalysis } from "@/lib/analysis-schema";
import { ACCEPT_ATTRIBUTE, validateContractFile } from "@/lib/contract-file";

type ReviewResult = {
  id: string;
  fileName: string;
  fileUrl: string;
  analysis: ContractAnalysis;
  createdAt: string;
};

// 審查期間輪播的進度文字，讓等待不那麼空白
const PROGRESS_MESSAGES = ["正在讀取合約內容…", "辨識合約類型與當事人…", "逐條比對常見風險…", "撰寫修改建議…", "整理審查報告…"];

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function ProgressMessage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => Math.min(i + 1, PROGRESS_MESSAGES.length - 1)), 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div role="status" className="flex items-center gap-3 text-sm text-ink-soft">
      <span className="relative flex size-2.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
      </span>
      {PROGRESS_MESSAGES[index]}
    </div>
  );
}

export default function ContractChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReviewResult | null>(null);

  function selectFile(selected: File | undefined) {
    if (!selected) return;
    const validationError = validateContractFile(selected);
    setError(validationError);
    setFile(validationError ? null : selected);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (!isSubmitting) selectFile(event.dataTransfer.files[0]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/review", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "審查失敗，請稍後再試");
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "審查失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`group relative flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-dashed bg-surface px-6 py-14 text-center transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
            isDragging ? "border-accent bg-accent-soft/40" : "border-line-strong hover:border-ink"
          } ${isSubmitting ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            type="file"
            accept={ACCEPT_ATTRIBUTE}
            className="sr-only"
            onChange={(event) => selectFile(event.target.files?.[0])}
            disabled={isSubmitting}
          />
          {/* 文件圖示 */}
          <span
            aria-hidden
            className={`relative grid h-16 w-13 place-items-end rounded-[4px] border bg-paper p-2 transition-transform duration-300 group-hover:-translate-y-1 ${
              file ? "border-accent" : "border-line-strong"
            }`}
          >
            <span
              className={`absolute -right-px -top-px size-3.5 rounded-bl-[3px] border-b border-l bg-surface ${file ? "border-accent" : "border-line-strong"}`}
            />
            <span className="flex w-full flex-col gap-1">
              <span className="h-0.5 w-full rounded bg-line-strong" />
              <span className="h-0.5 w-3/4 rounded bg-line-strong" />
              <span className="h-0.5 w-full rounded bg-line-strong" />
            </span>
          </span>
          {file ? (
            <div className="flex flex-col gap-1">
              <span className="font-serif text-lg font-bold">{file.name}</span>
              <span className="text-sm text-muted">{formatSize(file.size)}・點擊可更換檔案</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <span className="font-serif text-lg font-bold">拖曳合約到這裡，或點擊選擇檔案</span>
              <span className="text-sm text-muted">PDF・Word（.docx）・TXT，最大 4MB</span>
            </div>
          )}
        </label>

        <div className="flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          {isSubmitting ? (
            <ProgressMessage />
          ) : (
            <p className="text-sm text-muted">檔案與結果只有你本人看得到。</p>
          )}
          <button type="submit" disabled={!file || isSubmitting} className="btn-primary px-8">
            {isSubmitting ? "審查中…" : "開始審查"}
          </button>
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-risk-high/30 bg-risk-high-soft px-4 py-3 text-sm text-risk-high">
            {error}
          </p>
        )}
      </form>

      {result && (
        <div className="flex animate-rise flex-col gap-4">
          <p className="text-sm text-muted">
            已儲存至
            <Link href="/history" className="mx-1 font-medium text-ink underline decoration-accent underline-offset-4">
              我的紀錄
            </Link>
            ，隨時可以回來查看。
          </p>
          <ReviewReport fileName={result.fileName} fileUrl={result.fileUrl} analysis={result.analysis} />
        </div>
      )}
    </div>
  );
}
