import Link from "next/link";
import BrandMark from "@/components/BrandMark";

const FOOTER_LINKS = [
  {
    title: "產品",
    links: [
      { href: "/#features", label: "功能" },
      { href: "/#how", label: "使用流程" },
      { href: "/#sample", label: "報告範例" },
    ],
  },
  {
    title: "帳號",
    links: [
      { href: "/review", label: "審查合約" },
      { href: "/history", label: "我的紀錄" },
      { href: "/signup", label: "註冊" },
    ],
  },
  {
    title: "說明",
    links: [
      { href: "/#privacy", label: "隱私與安全" },
      { href: "/#faq", label: "常見問題" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-4">
          <BrandMark />
          <p className="max-w-xs text-sm leading-7 text-muted">簽名之前，先讓 AI 讀過每一條。以律師視角審閱合約，把風險攤在你眼前。</p>
        </div>
        {FOOTER_LINKS.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <p className="eyebrow">{group.title}</p>
            <ul className="flex flex-col gap-2.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-soft transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© AI 合約審查器</p>
          <p>審查結果由 AI 產生，僅供參考，不構成法律意見；重大交易請諮詢執業律師。</p>
        </div>
      </div>
    </footer>
  );
}
