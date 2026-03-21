import BrandMark from "../components/BrandMark";
import HeaderAccountActions from "../components/HeaderAccountActions";

const categories = ["All", "Politics", "Tech", "Sports", "Crypto"];

const contenders = [
  {
    icon: "psychology",
    label: "GPT-5",
    probability: "68%",
    yesPrice: "Yes 68c",
    noPrice: "No 32c",
    accent: "bg-primary",
  },
  {
    icon: "schedule",
    label: "Delayed launch",
    probability: "32%",
    yesPrice: "Yes 32c",
    noPrice: "No 68c",
    accent: "bg-secondary",
  },
];

const descriptionBlocks = [
  "This market resolves to YES if OpenAI officially announces and releases GPT-5, or an equivalent frontier successor, before September 30, 2024 at 11:59 PM PT.",
  "Public access, official release notes, or a confirmed rollout count as launch evidence. Teasers, demos, or unannounced private testing do not qualify on their own.",
  "If the deadline passes without a qualifying release, the market resolves to NO.",
];

const quickAmounts = ["+$1", "+$5", "+$10", "+$100", "Max"];

export default function MarketPage() {
  return (
    <div className="page-shell">
      <div className="page-content">
        <header className="surface-line mb-8 pb-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <BrandMark caption="Live probability board" />

            <div className="flex flex-1 flex-col gap-5 xl:max-w-5xl xl:flex-row xl:items-center xl:justify-end">
              <label className="app-panel-subtle field-shell search-shell flex-1">
                <span className="material-symbols-outlined">search</span>
                <input
                  className="app-input search-input uppercase"
                  placeholder="Search markets, creators, or topics"
                  type="text"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    className={`chip ${
                      index === 0 ? "chip-primary" : "chip-soft"
                    } ${index !== 0 ? "!border-transparent !bg-transparent" : ""}`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <HeaderAccountActions />
            </div>
          </div>
        </header>

        <main className="grid gap-8 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow">Tech</span>
                <span className="eyebrow">AI Models</span>
                <span className="eyebrow">Frontier Releases</span>
              </div>

              <div className="flex items-start gap-5">
                <span className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-primary text-[#16130f]">
                  <span className="material-symbols-outlined text-[2rem]">
                    neurology
                  </span>
                </span>

                <div className="min-w-0">
                  <h1 className="display-title">
                    Will GPT-5 release
                    <br />
                    before Q4 2024?
                  </h1>
                </div>
              </div>
            </div>

            <section className="app-panel-subtle overflow-hidden px-5 py-6 md:px-8 md:py-8">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="eyebrow">Price history</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="chip chip-primary">GPT-5 68%</span>
                    <span className="chip chip-soft !border-transparent !bg-transparent">
                      Delay 32%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[color:var(--text-muted)]">
                  <span className="material-symbols-outlined">event</span>
                  <span className="material-symbols-outlined">forum</span>
                  <span className="material-symbols-outlined">ios_share</span>
                  <span className="material-symbols-outlined">download</span>
                </div>
              </div>

              <div className="chart-surface h-80 w-full md:h-[26rem]">
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 1000 420"
                >
                  <path
                    d="M0,310 Q85,306 140,294 T260,250 T400,244 T560,200 T740,120 T1000,98"
                    fill="none"
                    stroke="#d6ff57"
                    strokeWidth="5"
                  />
                  <path
                    d="M0,332 Q120,324 220,320 T430,300 T590,262 T760,240 T1000,220"
                    fill="none"
                    stroke="#6e7cff"
                    strokeWidth="5"
                  />
                  <path
                    d="M0,310 Q85,306 140,294 T260,250 T400,244 T560,200 T740,120 T1000,98"
                    fill="url(#yesFill)"
                    opacity="0.15"
                  />
                  <defs>
                    <linearGradient id="yesFill" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#d6ff57" />
                      <stop offset="100%" stopColor="#d6ff57" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <span className="muted-copy">$98,412,742 vol</span>

                <div className="flex flex-wrap gap-2">
                  <span className="chip chip-soft !border-transparent !bg-transparent">
                    1D
                  </span>
                  <span className="chip chip-soft !border-transparent !bg-transparent">
                    1W
                  </span>
                  <span className="chip chip-soft !border-transparent !bg-transparent">
                    1M
                  </span>
                  <span className="chip chip-primary">All</span>
                </div>
              </div>
            </section>

            <section className="app-panel-subtle overflow-hidden">
              <div className="surface-line type-body-sm grid grid-cols-[minmax(0,1fr)_120px_150px_150px] gap-4 px-5 py-4 md:px-8">
                <span className="eyebrow">Outcome</span>
                <span className="eyebrow text-center">Chance</span>
                <span className="eyebrow text-center">Buy yes</span>
                <span className="eyebrow text-center">Buy no</span>
              </div>

              {contenders.map((contender) => (
                <article
                  key={contender.label}
                  className="surface-line last:border-b-0 grid grid-cols-[minmax(0,1fr)_120px_150px_150px] items-center gap-4 px-5 py-5 md:px-8"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <span
                      className="flex h-11 w-11 flex-none items-center justify-center rounded-full text-[color:var(--text-strong)]"
                      style={{
                        background:
                          "color-mix(in srgb, var(--surface-soft) 78%, transparent)",
                      }}
                    >
                      <span className="material-symbols-outlined text-[1.25rem]">
                        {contender.icon}
                      </span>
                    </span>

                    <div className="min-w-0">
                      <p className="type-body-lg truncate font-medium">
                        {contender.label}
                      </p>
                      <div className={`mt-2 h-[2px] w-14 rounded-full ${contender.accent}`} />
                    </div>
                  </div>

                  <span className="type-heading-sm text-center font-mono font-semibold">
                    {contender.probability}
                  </span>

                  <button className="chip chip-primary justify-center !py-3">
                    {contender.yesPrice}
                  </button>

                  <button className="chip chip-soft justify-center !border-[var(--border-soft)] !bg-transparent !py-3 text-secondary">
                    {contender.noPrice}
                  </button>
                </article>
              ))}
            </section>
          </section>

          <aside className="2xl:sticky 2xl:top-6 2xl:self-start">
            <section className="app-panel-subtle overflow-hidden">
              <div className="px-5 py-6 md:px-6">
                <div className="mb-5 flex items-start gap-4">
                  <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-primary text-[#16130f]">
                    <span className="material-symbols-outlined text-[2rem]">
                      neurology
                    </span>
                  </span>

                  <div>
                    <p className="muted-copy type-body-sm">
                      Will GPT-5 release before Q4 2024?
                    </p>
                    <p className="type-heading-sm mt-2 text-primary">
                      Buy Yes . GPT-5
                    </p>
                  </div>
                </div>

                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <button className="chip chip-primary">Buy</button>
                    <button className="chip chip-soft !border-transparent !bg-transparent">
                      Sell
                    </button>
                  </div>
                  <span className="eyebrow">Dollars</span>
                </div>

                <div className="mb-5 grid grid-cols-2 gap-3">
                  <button className="chip chip-primary justify-center !py-4">
                    Yes 68c
                  </button>
                  <button className="chip chip-soft justify-center !border-[var(--border-soft)] !bg-transparent !py-4 text-secondary">
                    No 32c
                  </button>
                </div>

                <label className="mb-5 block">
                  <span className="eyebrow mb-3 block">Amount</span>
                  <div className="app-panel-subtle field-shell">
                    <input
                      className="app-input type-value-lg font-mono font-semibold"
                      placeholder="$0"
                      type="text"
                    />
                  </div>
                </label>

                <div className="mb-5 flex flex-wrap gap-2">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      className="chip chip-soft !border-transparent !bg-transparent"
                    >
                      {amount}
                    </button>
                  ))}
                </div>

                <button className="action-secondary w-full justify-center">
                  Sign up to trade
                </button>
              </div>
            </section>
          </aside>
        </main>

        <section className="section-divider mt-10 pt-8">
          <div className="app-panel-subtle px-5 py-6 md:px-8 md:py-8">
            <p className="eyebrow mb-3">Market description</p>
            <h2 className="section-title mb-5">Resolution rules</h2>

            <div className="space-y-4">
              {descriptionBlocks.map((block) => (
                <p
                  key={block}
                  className="max-w-4xl leading-relaxed text-[color:var(--text-muted)]"
                >
                  {block}
                </p>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
