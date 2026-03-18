import AppSidebar from "../components/AppSidebar";

const quickAmounts = ["+$1", "+$5", "+$10", "+$100", "Max"];

const activityRows = [
  { trader: "0x4f...2a bought YES", amount: "$420.00", time: "2m ago" },
  { trader: "Whale_Alert bought NO", amount: "$2,500.00", time: "18m ago" },
  { trader: "0x91...bc bought YES", amount: "$15.00", time: "31m ago" },
];

const relatedMarkets = [
  { title: "Will OpenAI ship a reasoning-native coding agent this year?", probability: "79%" },
  { title: "Will a frontier model beat top human coders on public benchmarks?", probability: "28%" },
  { title: "Will GPT-5 launch with multimodal voice in general availability?", probability: "64%" },
];

const resolutionNotes = [
  "Buy YES if you believe GPT-5 or an equivalent frontier model launches before September 30, 2024.",
  "Buy NO if you think that deadline passes without a qualifying release.",
  "At settlement, YES resolves to $1.00 and NO resolves to $0.00, or the reverse.",
];

export default function MarketPage() {
  return (
    <div className="page-shell">
      <div className="page-content">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <AppSidebar />

          <main className="flex flex-col gap-6">
            <section className="app-panel app-panel-strong p-5 md:p-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="chip chip-soft">Tech</span>
                    <span className="chip chip-secondary">AI models</span>
                    <span className="chip chip-primary">High volume</span>
                  </div>

                  <div>
                    <p className="eyebrow mb-2">Featured contract</p>
                    <h1 className="display-title">
                      Will GPT-5 release
                      <br />
                      before Q4 2024?
                    </h1>
                  </div>

                  <p className="max-w-3xl text-base leading-relaxed text-[color:var(--text-muted)] md:text-lg">
                    Follow the live probability, understand the settlement rule,
                    and place a position from one clear trade ticket.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 xl:min-w-[360px] xl:grid-cols-1">
                  <div className="app-panel metric-card">
                    <span className="eyebrow">Probability</span>
                    <span className="metric-value text-primary">68%</span>
                  </div>
                  <div className="app-panel metric-card">
                    <span className="eyebrow">24H volume</span>
                    <span className="metric-value">$1.2M</span>
                  </div>
                  <div className="app-panel metric-card">
                    <span className="eyebrow">Ends in</span>
                    <span className="metric-value text-secondary">12d</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="flex flex-col gap-6">
                <section className="app-panel p-5 md:p-8">
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="eyebrow mb-2">Live chart</p>
                      <h2 className="section-title">Market momentum</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="chip chip-primary">Yes 68%</span>
                      <span className="chip chip-soft">No 32%</span>
                    </div>
                  </div>

                  <div className="chart-surface h-72 w-full md:h-80">
                    <svg
                      className="absolute inset-0 h-full w-full"
                      viewBox="0 0 1000 320"
                    >
                      <path
                        d="M0,255 Q90,244 170,250 T330,210 T470,184 T620,126 T810,96 T1000,74"
                        fill="none"
                        stroke="#d6ff57"
                        strokeWidth="8"
                      />
                      <path
                        d="M0,255 Q90,244 170,250 T330,210 T470,184 T620,126 T810,96 T1000,74 V320 H0 Z"
                        fill="url(#marketFill)"
                        opacity="0.26"
                      />
                      <defs>
                        <linearGradient id="marketFill" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#d6ff57" />
                          <stop offset="100%" stopColor="#d6ff57" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-6 font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                      <span>May 01</span>
                      <span>May 08</span>
                      <span>May 15</span>
                      <span>May 22</span>
                      <span>Today</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="chip chip-soft">1H</span>
                      <span className="chip chip-soft">6H</span>
                      <span className="chip chip-soft">1D</span>
                      <span className="chip chip-primary">1W</span>
                      <span className="chip chip-soft">1M</span>
                      <span className="chip chip-soft">All</span>
                    </div>
                  </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                  <article className="app-panel p-5 md:p-6">
                    <div className="mb-5 flex items-end justify-between gap-4">
                      <div>
                        <p className="eyebrow mb-2">How to trade</p>
                        <h2 className="section-title !text-[2rem]">
                          Contract summary
                        </h2>
                      </div>
                      <span className="chip chip-secondary">Clear settlement</span>
                    </div>

                    <div className="space-y-4">
                      {resolutionNotes.map((note, index) => (
                        <div key={note} className="list-row">
                          <span className="list-icon">
                            <span className="font-mono text-sm font-semibold">
                              {index + 1}
                            </span>
                          </span>
                          <p className="leading-relaxed text-[color:var(--text-muted)]">
                            {note}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="app-panel p-5 md:p-6">
                    <div className="mb-5">
                      <p className="eyebrow mb-2">Flow tape</p>
                      <h2 className="section-title !text-[2rem]">
                        Recent activity
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {activityRows.map((row) => (
                        <div
                          key={`${row.trader}-${row.amount}`}
                          className="border-b border-[var(--border-soft)] pb-3 last:border-b-0 last:pb-0"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-mono text-sm">{row.trader}</span>
                            <span className="chip chip-soft">{row.amount}</span>
                          </div>
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                            {row.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>
                </section>
              </div>

              <aside className="flex flex-col gap-6 2xl:sticky 2xl:top-6 2xl:self-start">
                <section className="app-panel app-panel-strong p-5 md:p-6">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow mb-2">Trade ticket</p>
                      <h2 className="section-title">Place your trade</h2>
                    </div>
                    <span className="chip chip-soft">Market</span>
                  </div>

                  <div className="mb-5 grid grid-cols-2 gap-3">
                    <button className="action-primary">Buy yes 68c</button>
                    <button className="action-secondary">Buy no 32c</button>
                  </div>

                  <div className="app-panel app-panel-soft mb-5 p-4">
                    <p className="eyebrow mb-3">What your choice means</p>
                    <p className="leading-relaxed text-[color:var(--text-muted)]">
                      Choose <span className="font-semibold text-[color:var(--text-strong)]">YES</span> if you expect the release before the deadline.
                      Choose <span className="font-semibold text-[color:var(--text-strong)]">NO</span> if you expect it to miss.
                    </p>
                  </div>

                  <label className="mb-5 block">
                    <span className="eyebrow mb-3 block">Amount</span>
                    <div className="app-panel field-shell">
                      <input
                        className="app-input font-mono text-3xl font-semibold"
                        placeholder="$0"
                        type="text"
                      />
                    </div>
                  </label>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        className="app-panel app-panel-soft px-3 py-2 font-mono text-sm uppercase tracking-[0.12em]"
                      >
                        {amount}
                      </button>
                    ))}
                  </div>

                  <div className="app-panel app-panel-soft mb-5 space-y-4 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="eyebrow">Estimated shares</span>
                      <span className="font-mono text-lg font-semibold">147.05</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="eyebrow">Max payout</span>
                      <span className="font-mono text-lg font-semibold text-primary">
                        $147.05
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="eyebrow">Avg. price</span>
                      <span className="font-mono text-lg font-semibold">0.68</span>
                    </div>
                  </div>

                  <button className="action-secondary w-full justify-center text-base">
                    Trade
                  </button>

                  <p className="mt-4 text-center text-xs uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
                    By trading, you agree to the market rules above.
                  </p>
                </section>

                <section className="app-panel p-5 md:p-6">
                  <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="eyebrow mb-2">Explore next</p>
                      <h2 className="section-title !text-[2rem]">
                        Related markets
                      </h2>
                    </div>
                    <span className="chip chip-soft">3 ideas</span>
                  </div>

                  <div className="space-y-4">
                    {relatedMarkets.map((market) => (
                      <article
                        key={market.title}
                        className="app-panel app-panel-soft flex items-start justify-between gap-4 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <span className="list-icon">
                            <span className="material-symbols-outlined">
                              insights
                            </span>
                          </span>
                          <p className="leading-relaxed">{market.title}</p>
                        </div>
                        <span className="font-mono text-lg font-semibold text-primary">
                          {market.probability}
                        </span>
                      </article>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
