import Link from "next/link";
import { Suspense } from "react";
import { logout } from "@/app/actions/auth";
import BrandMark from "@/components/BrandMark";
import { getCurrentUser } from "@/lib/dal";

const linkClassName = "text-sm text-ink-soft transition-colors hover:text-ink";

const SECTION_LINKS = [
  { href: "/#features", label: "功能" },
  { href: "/#how", label: "使用流程" },
  { href: "/#privacy", label: "隱私" },
  { href: "/#faq", label: "常見問題" },
];

async function UserMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center gap-5">
        <Link href="/login" className={linkClassName}>
          登入
        </Link>
        <Link href="/signup" className="btn-primary px-4 py-2">
          免費開始
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5">
      <Link href="/history" className={linkClassName}>
        我的紀錄
      </Link>
      <form action={logout}>
        <button type="submit" className={linkClassName} title={user.email}>
          登出
        </button>
      </form>
      <Link href="/review" className="btn-primary px-4 py-2">
        審查合約
      </Link>
    </div>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-5">
        <BrandMark compactOnMobile />
        <nav aria-label="主要導覽" className="hidden items-center gap-8 md:flex">
          {SECTION_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClassName}>
              {link.label}
            </Link>
          ))}
        </nav>
        {/* 讀取登入狀態需要 request 資料，用 Suspense 讓其他部分先顯示 */}
        <Suspense fallback={<div className="h-9 w-32 animate-pulse rounded-full bg-line/60" />}>
          <UserMenu />
        </Suspense>
      </div>
    </header>
  );
}
