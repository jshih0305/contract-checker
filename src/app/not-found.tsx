import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 px-5 py-24 text-center">
      <p className="font-mono text-sm tracking-[0.3em] text-accent">404</p>
      <h1 className="font-serif text-3xl font-bold tracking-tight">找不到這個頁面</h1>
      <p className="leading-7 text-ink-soft">頁面可能已被移除，或你沒有權限查看這份內容。</p>
      <Link href="/" className="btn-secondary">
        回到首頁
      </Link>
    </main>
  );
}
