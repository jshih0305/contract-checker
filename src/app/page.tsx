import Link from "next/link";
import type { ReactNode } from "react";
import { Seal } from "@/components/BrandMark";
import ContractMock from "@/components/landing/ContractMock";
import { RiskBadge } from "@/components/ReviewReport";

const FACTS = [
  { value: "約 40 秒", label: "完成一份合約審閱" },
  { value: "PDF・Word・TXT", label: "常見格式直接上傳" },
  { value: "繁體中文", label: "以台灣法律語境撰寫" },
  { value: "僅本人可見", label: "合約與結果綁定帳號" },
];

const STEPS = [
  { title: "上傳合約", body: "拖曳 PDF、Word 或純文字檔，單一檔案最大 4MB。" },
  { title: "AI 逐條審閱", body: "以「上傳者」的立場閱讀全文，找出不利、模糊或可能違法的條款。" },
  { title: "取得審查報告", body: "風險分級、修改建議、缺漏條款一次整理，隨時回到紀錄查看。" },
];

const FEATURES = [
  {
    index: "壹",
    title: "風險分級",
    body: "每一條問題條款都標上高、中、低風險，並附上原文，讓你一眼看出哪裡最需要談。",
  },
  {
    index: "貳",
    title: "可直接使用的修改建議",
    body: "不只指出問題，還給出可以貼回合約的改寫版本，帶著它和對方協商。",
  },
  {
    index: "參",
    title: "缺漏條款提醒",
    body: "押金返還期限、修繕責任、爭議管轄……合約沒寫到的，往往才是日後爭議的來源。",
  },
  {
    index: "肆",
    title: "關鍵條件整理",
    body: "期間、金額、付款方式、違約金，自動整理成一張清單，不必再翻找全文。",
  },
];

const PRIVACY = [
  { title: "只有你看得到", body: "每份合約都綁定你的帳號，其他會員無法查詢、無法開啟原始檔案。" },
  { title: "密碼加密保存", body: "密碼以 bcrypt 單向雜湊後才存入資料庫，連我們也看不到原始密碼。" },
  { title: "安全的登入狀態", body: "登入憑證存在瀏覽器無法以程式讀取的 cookie 中，並經過簽章驗證。" },
];

const FAQS = [
  {
    q: "AI 的審查結果可以取代律師嗎？",
    a: "不行。AI 審查適合在簽約前快速掌握風險、準備協商重點；涉及重大金額或複雜交易時，仍建議交由執業律師確認。",
  },
  {
    q: "支援哪些合約類型？",
    a: "租賃、勞動、承攬、委任、買賣、保密協議（NDA）、合作備忘錄等常見合約都可以審查。AI 會先判斷合約類型，再依類型重點審閱。",
  },
  {
    q: "我上傳的合約會被其他人看到嗎？",
    a: "不會。合約檔案與審查結果都綁定在你的帳號下，只有登入後的你本人可以查看。",
  },
  {
    q: "檔案有大小或格式限制嗎？",
    a: "目前支援 PDF、Word（.docx）與純文字（.txt），單一檔案最大 4MB。",
  },
];

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: ReactNode; body?: string }) {
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl">{title}</h2>
      {body && <p className="leading-8 text-ink-soft">{body}</p>}
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="flex-1 overflow-x-clip">
      {/* Hero */}
      <section className="relative">
        <div className="paper-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 px-5 pb-24 pt-16 sm:pt-24 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-32">
          <div className="flex flex-col gap-8">
            <p className="eyebrow animate-rise flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />
              AI Contract Review
            </p>
            <h1 className="animate-rise font-serif text-[2.6rem] font-bold leading-[1.18] tracking-tight text-balance [animation-delay:100ms] sm:text-6xl">
              簽名之前，
              <br />
              先讓 AI 讀過
              <span className="relative whitespace-nowrap text-accent">
                每一條
                <svg aria-hidden viewBox="0 0 200 12" className="absolute -bottom-1 left-0 h-3 w-full" preserveAspectRatio="none">
                  <path d="M2 8 C 50 2, 150 2, 198 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
              。
            </h1>
            <p className="max-w-lg animate-rise text-lg leading-8 text-ink-soft [animation-delay:200ms]">
              上傳合約，AI 以律師的視角逐條審閱，標出對你不利的條款、給出可直接使用的修改建議，讓你帶著底氣去談。
            </p>
            <div className="flex animate-rise flex-wrap items-center gap-4 [animation-delay:300ms]">
              <Link href="/signup" className="btn-primary px-7 py-3.5">
                免費審查第一份合約
                <span aria-hidden>→</span>
              </Link>
              <Link href="#sample" className="btn-secondary px-7 py-3.5">
                看報告範例
              </Link>
            </div>
          </div>
          <ContractMock />
        </div>
      </section>

      {/* 產品事實 */}
      <section className="border-y border-line bg-surface">
        <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px bg-line lg:grid-cols-4">
          {FACTS.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-1.5 bg-surface px-5 py-8 lg:px-8">
              <dt className="order-2 text-sm text-muted">{fact.label}</dt>
              <dd className="font-serif text-lg font-bold tracking-tight sm:text-2xl">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 流程 */}
      <section id="how" className="mx-auto w-full max-w-6xl scroll-mt-20 px-5 py-24 lg:py-32">
        <SectionHeading eyebrow="How it works" title="三個步驟，把風險攤在眼前" />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-4 bg-paper p-8">
              <span className="font-mono text-sm text-accent">0{i + 1}</span>
              <h3 className="font-serif text-xl font-bold">{step.title}</h3>
              <p className="leading-7 text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 功能 */}
      <section id="features" className="scroll-mt-20 border-t border-line bg-surface">
        <div className="mx-auto grid w-full max-w-6xl gap-14 px-5 py-24 lg:grid-cols-[1fr_1.4fr] lg:py-32">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="What you get"
              title={
                <>
                  一份讀得懂、
                  <br />
                  用得上的審查報告
                </>
              }
              body="報告的每一段都對應到合約原文。你不需要懂法律術語，也能知道哪一條要改、該怎麼改。"
            />
          </div>
          <ul className="flex flex-col">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-8 first:border-t-0 first:pt-0">
                <span className="font-serif text-2xl text-accent">{feature.index}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif text-xl font-bold">{feature.title}</h3>
                  <p className="leading-7 text-ink-soft">{feature.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 報告範例 */}
      <section id="sample" className="mx-auto w-full max-w-6xl scroll-mt-20 px-5 py-24 lg:py-32">
        <SectionHeading eyebrow="Sample report" title="實際的審查報告長這樣" body="以下節錄自一份房屋租賃契約的審查結果。" />
        <div className="mt-14 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_80px_-50px_rgb(26_23_20/0.4)]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <h3 className="font-serif text-xl font-bold">房屋租賃契約</h3>
              <RiskBadge level="high" />
            </div>
            <p className="text-sm text-muted">5 項風險・10 項建議補充條款</p>
          </div>
          <div className="grid lg:grid-cols-[1fr_1.3fr]">
            <div className="flex flex-col gap-3 border-b border-line p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="eyebrow">摘要</p>
              <p className="leading-8 text-ink-soft">
                以承租人立場審查，本契約多數條款明顯偏向出租人：押金過高且由甲方自行決定是否返還、所有修繕均由乙方負擔、甲方可隨時終止契約。部分條款可能違反住宅租賃相關規範，建議簽署前務必修改。
              </p>
            </div>
            <div className="flex flex-col divide-y divide-line">
              {[
                {
                  clause: "第五條　甲方得隨時終止本契約，乙方不得異議。",
                  level: "high" as const,
                  suggestion: "刪除本條，改為僅限法定或重大違約事由，並提前 30 日書面通知、賠償搬遷費用。",
                },
                {
                  clause: "第二條　逾期一日，乙方應支付月租金 10% 之違約金。",
                  level: "medium" as const,
                  suggestion: "設 5 日寬限期，逾期改按日計算遲延利息，並以一個月租金之 10% 為上限。",
                },
              ].map((risk) => (
                <div key={risk.clause} className="flex flex-col gap-3 p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-serif text-[15px] leading-7">{risk.clause}</p>
                    <RiskBadge level={risk.level} />
                  </div>
                  <p className="border-l-2 border-accent pl-4 text-sm leading-7 text-ink-soft">
                    <span className="font-medium text-ink">建議　</span>
                    {risk.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 隱私 */}
      <section id="privacy" className="scroll-mt-20 bg-ink text-paper">
        <div className="mx-auto w-full max-w-6xl px-5 py-24 lg:py-32">
          <div className="flex max-w-2xl flex-col gap-4">
            <p className="eyebrow text-paper/50">Privacy</p>
            <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl">合約是你的事，只有你看得到</h2>
          </div>
          <ul className="mt-14 grid gap-10 md:grid-cols-3">
            {PRIVACY.map((item) => (
              <li key={item.title} className="flex flex-col gap-3 border-t border-paper/15 pt-6">
                <h3 className="font-serif text-lg font-bold">{item.title}</h3>
                <p className="leading-7 text-paper/65">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto grid w-full max-w-6xl scroll-mt-20 gap-12 px-5 py-24 lg:grid-cols-[1fr_1.4fr] lg:py-32">
        <SectionHeading eyebrow="FAQ" title="常見問題" />
        <div className="flex flex-col border-t border-line">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-serif text-lg font-bold [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full border border-line-strong text-muted transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pb-6 pr-12 leading-8 text-ink-soft">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24">
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-8 overflow-hidden rounded-3xl border border-line bg-surface px-6 py-20 text-center">
          <div className="paper-grid pointer-events-none absolute inset-0 opacity-50" />
          <Seal className="relative size-12 rounded-[10px] text-2xl" />
          <h2 className="relative font-serif text-3xl font-bold leading-tight tracking-tight text-balance sm:text-5xl">下一份合約，先讓 AI 看一眼</h2>
          <p className="relative max-w-md leading-8 text-ink-soft">註冊只需要 Email 和密碼，上傳後約 40 秒就能拿到完整報告。</p>
          <Link href="/signup" className="btn-primary relative px-8 py-4">
            免費開始
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
