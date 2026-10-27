import { RiskBadge } from "@/components/ReviewReport";

// Hero 區的示意圖：一份正在被 AI 批註的合約

function TextLine({ width }: { width: string }) {
  return <span className="block h-[7px] rounded-full bg-line" style={{ width }} />;
}

export default function ContractMock() {
  return (
    <div className="relative mx-auto w-full max-w-[500px] lg:mx-0" aria-hidden>
      {/* 後方疊紙 */}
      <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-[2.5deg] rounded-[4px] border border-line bg-surface/70" />

      {/* 右側留白當作批註欄 */}
      <div className="relative rounded-[4px] border border-line bg-surface px-8 pb-12 pt-9 shadow-[0_30px_60px_-30px_rgb(26_23_20/0.35)] sm:pl-10 sm:pr-44">
        <p className="text-center font-serif text-lg font-bold tracking-[0.3em]">房屋租賃契約書</p>
        <div className="mt-6 flex flex-col gap-2.5">
          <TextLine width="92%" />
          <TextLine width="78%" />
        </div>

        <div className="mt-6 flex flex-col gap-4 font-serif text-[13px] leading-6 text-ink-soft">
          <p>
            <span className="font-bold text-ink">第三條　押金</span>
            <br />
            乙方應支付押金新台幣十萬元，
            <mark className="bg-transparent text-ink [background:linear-gradient(transparent_62%,var(--accent-soft)_62%)]">
              租期屆滿時甲方得視情況決定是否返還
            </mark>
            。
          </p>
          <div className="flex flex-col gap-2.5">
            <TextLine width="86%" />
            <TextLine width="64%" />
          </div>
          <p>
            <span className="font-bold text-ink">第五條　終止</span>
            <br />
            <mark className="bg-transparent text-ink [background:linear-gradient(transparent_62%,var(--accent-soft)_62%)]">
              甲方得隨時終止本契約
            </mark>
            ，乙方不得異議。
          </p>
          <div className="flex flex-col gap-2.5">
            <TextLine width="90%" />
            <TextLine width="72%" />
            <TextLine width="40%" />
          </div>
        </div>

        {/* 印章 */}
        <div className="absolute bottom-5 right-8 grid size-[76px] rotate-[-14deg] sm:right-auto sm:left-[38%] place-items-center rounded-full border-[2.5px] border-accent/80 text-accent/90">
          <div className="grid size-[64px] place-items-center rounded-full border border-accent/60">
            <span className="font-serif text-[13px] font-bold leading-tight tracking-widest">
              AI
              <br />
              已審
            </span>
          </div>
        </div>
      </div>

      {/* 批註卡片 */}
      <div className="absolute -right-10 top-[24%] hidden w-52 animate-rise rounded-xl border border-line bg-surface/95 p-4 shadow-[0_20px_40px_-20px_rgb(26_23_20/0.35)] backdrop-blur [animation-delay:500ms] sm:block">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-muted">第三條</span>
          <RiskBadge level="high" />
        </div>
        <p className="mt-2 text-[13px] leading-5 text-ink">押金返還由甲方單方決定，且金額達四個月租金。</p>
      </div>

      <div className="absolute -right-10 top-[56%] hidden w-52 animate-rise rounded-xl border border-line bg-surface/95 p-4 shadow-[0_20px_40px_-20px_rgb(26_23_20/0.35)] backdrop-blur [animation-delay:800ms] sm:block">
        <p className="text-xs font-medium text-muted">修改建議</p>
        <p className="mt-2 text-[13px] leading-5 text-ink">改為「僅限法定或重大違約事由，並提前 30 日書面通知」。</p>
      </div>
    </div>
  );
}
