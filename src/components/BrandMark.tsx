import Link from "next/link";

// 印章造型的品牌標誌
export function Seal({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-grid size-7 shrink-0 place-items-center rounded-[6px] bg-accent font-serif text-[15px] font-bold leading-none text-accent-ink ${className}`}
    >
      審
    </span>
  );
}

export default function BrandMark({ compactOnMobile = false }: { compactOnMobile?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="AI 合約審查器 首頁">
      <Seal className="transition-transform duration-300 group-hover:-rotate-6" />
      <span className={`font-serif text-[17px] font-bold tracking-wide ${compactOnMobile ? "hidden sm:inline" : ""}`}>
        AI 合約審查器
      </span>
    </Link>
  );
}
