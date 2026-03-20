import { Link } from "react-router-dom";
import BrandMark from "../components/BrandMark";

const categories = ["All", "Politics", "Tech", "Sports", "Crypto"];

const markets = [
  {
    category: "Tech",
    title: "Will OpenAI announce GPT-5 before June 2025?",
    volume: "$2.4M vol",
    marketCount: "86 markets",
    icon: "neurology",
    outcomes: [
      { icon: "smart_toy", label: "OpenAI", odds: "1.47x", probability: "68%", accent: "bg-primary" },
      { icon: "schedule", label: "Delay", odds: "3.12x", probability: "32%", accent: "bg-secondary" },
    ],
  },
  {
    category: "Politics",
    title: "Who will win the next presidential election cycle?",
    volume: "$18.9M vol",
    marketCount: "112 markets",
    icon: "ballot",
    outcomes: [
      { icon: "how_to_vote", label: "Reform Bloc", odds: "2.38x", probability: "42%", accent: "bg-secondary" },
      { icon: "account_balance", label: "Status Quo", odds: "1.72x", probability: "58%", accent: "bg-primary" },
    ],
  },
  {
    category: "Sports",
    title: "Will the Lakers make the playoffs this season?",
    volume: "$500K vol",
    marketCount: "39 markets",
    icon: "sports_basketball",
    outcomes: [
      { icon: "sports_score", label: "Yes", odds: "6.67x", probability: "15%", accent: "bg-primary" },
      { icon: "block", label: "No", odds: "1.18x", probability: "85%", accent: "bg-secondary" },
    ],
  },
  {
    category: "Crypto",
    title: "Will Bitcoin print a new all-time high this quarter?",
    volume: "$8.7M vol",
    marketCount: "54 markets",
    icon: "currency_bitcoin",
    outcomes: [
      { icon: "trending_up", label: "Breakout", odds: "2.04x", probability: "49%", accent: "bg-primary" },
      { icon: "trending_flat", label: "Rangebound", odds: "1.96x", probability: "51%", accent: "bg-secondary" },
    ],
  },
];

const tradeHistory = [
  {
    market: "GPT-5 Announcement",
    position: "Yes 1,200 shares",
    value: "$816.00",
    change: "+12.4%",
    changeTone: "status-positive",
  },
  {
    market: "Election Reform Market",
    position: "No 500 shares",
    value: "$290.00",
    change: "-4.2%",
    changeTone: "status-negative",
  },
  {
    market: "Bitcoin ATH",
    position: "Yes 240 shares",
    value: "$144.00",
    change: "+6.8%",
    changeTone: "status-positive",
  },
];

export default function HomePage() {
  return (
    <div className="page-shell">
      <div className="page-content">
        <header className="surface-line mb-8 pb-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <BrandMark caption="Live probability board" />

            <div className="flex flex-1 flex-col gap-4 xl:max-w-4xl xl:flex-row xl:items-center xl:justify-end">
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

              <div className="flex flex-wrap gap-3">
                <Link className="action-ghost !border-transparent !px-3" to="/login">
                  Sign in
                </Link>
                <Link className="action-secondary" to="/create-account">
                  Join now
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0">
            <section className="grid gap-6 lg:grid-cols-2">
              {markets.map((market) => (
                <article
                  key={market.title}
                  className="app-panel-subtle flex h-full flex-col justify-between px-5 py-6 md:px-7 md:py-7"
                >
                  <div className="min-w-0">
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-4">
                        <span
                          className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-primary text-[#16130f]"
                        >
                          <span className="material-symbols-outlined text-[1.5rem]">
                            {market.icon}
                          </span>
                        </span>

                        <div className="min-w-0">
                          <p className="eyebrow mb-2">{market.category}</p>
                          <h2 className="type-heading-md">
                            {market.title}
                          </h2>
                        </div>
                      </div>

                      <span className="eyebrow whitespace-nowrap">Live market</span>
                    </div>

                    <div className="space-y-4">
                      {market.outcomes.map((outcome) => (
                        <div
                          key={`${market.title}-${outcome.label}`}
                          className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4"
                        >
                          <span
                            className="flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--text-muted)]"
                            style={{
                              background:
                                "color-mix(in srgb, var(--surface-soft) 78%, transparent)",
                            }}
                          >
                              <span className="material-symbols-outlined text-[1.25rem]">
                                {outcome.icon}
                              </span>
                            </span>

                            <div className="min-w-0">
                              <div className="flex items-center justify-between gap-3">
                                <span className="type-body-lg truncate font-medium">
                                  {outcome.label}
                                </span>
                                <span className="type-body-sm font-mono text-[color:var(--text-muted)]">
                                  {outcome.odds}
                                </span>
                              </div>
                            <div
                              className={`mt-2 h-[2px] w-14 rounded-full ${outcome.accent}`}
                            />
                          </div>

                          <button className="chip chip-soft !border-[var(--border-soft)] !bg-transparent !px-3">
                            {outcome.probability}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="section-divider type-body-sm mt-8 flex items-center justify-between gap-4 pt-4">
                    <span className="muted-copy">{market.volume}</span>
                    <span className="muted-copy">{market.marketCount}</span>
                  </div>
                </article>
              ))}
            </section>
          </main>

          <aside className="xl:sticky xl:top-6 xl:self-start">
            <section className="app-panel-subtle overflow-hidden">
              <div className="px-5 py-6 md:px-6">
                <p className="eyebrow mb-3">Account rail</p>
                <h2 className="section-title">Trade history</h2>

                <div className="mt-6 flex items-end justify-between gap-3">
                  <div>
                    <p className="metric-value text-primary">$12.45K</p>
                    <p className="muted-copy type-body-sm">24 open positions</p>
                  </div>
                  <span className="chip chip-soft !border-transparent !bg-transparent">
                    +8.4% week
                  </span>
                </div>
              </div>

              {tradeHistory.map((trade) => (
                <article
                  key={`${trade.market}-${trade.position}`}
                  className="section-divider px-5 py-5 md:px-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="type-body-md font-semibold leading-snug">{trade.market}</p>
                      <p className="type-body-sm mt-2 text-[color:var(--text-muted)]">
                        {trade.position}
                      </p>
                    </div>
                    <span
                      className={`type-body-sm font-mono font-semibold ${trade.changeTone}`}
                    >
                      {trade.change}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="muted-copy type-body-sm">Current value</span>
                    <span className="type-utility font-mono font-semibold">{trade.value}</span>
                  </div>
                </article>
              ))}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
