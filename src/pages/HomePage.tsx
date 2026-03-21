import { useEffect, useState } from "react";
import BrandMark from "../components/BrandMark";
import HeaderAccountActions from "../components/HeaderAccountActions";
import CreateMarketDock from "../components/CreateMarketDock";
import { toHomeMarketCard } from "../features/markets/homeMarketMapper";
import { useMarkets } from "../hooks/useMarkets";

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
  const { data: markets = [], isLoading, isError, refetch } = useMarkets("OPEN");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const cards = markets
    .map(toHomeMarketCard)
    .filter(
      (market) => activeCategory === "All" || market.category === activeCategory,
    )
    .filter((market) => {
      const searchValue = search.trim().toLowerCase();

      if (!searchValue) {
        return true;
      }

      return [market.title, market.category, ...market.outcomes.map((outcome) => outcome.label)]
        .join(" ")
        .toLowerCase()
        .includes(searchValue);
    });
  const categories = [
    "All",
    ...Array.from(
      new Set(
        markets
          .map((market) => market.category?.trim() || "General")
          .filter(Boolean),
      ),
    ),
  ];

  useEffect(() => {
    if (activeCategory !== "All" && !categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [activeCategory, categories]);

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
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`chip ${
                      activeCategory === category ? "chip-primary" : "chip-soft"
                    } ${
                      activeCategory === category
                        ? ""
                        : "!border-transparent !bg-transparent"
                    }`}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <HeaderAccountActions />
            </div>
          </div>
        </header>

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0">
            {isLoading ? <MarketBoardSkeleton /> : null}

            {isError ? <MarketBoardError onRetry={() => refetch()} /> : null}

            {!isLoading && !isError && cards.length === 0 ? (
              <MarketBoardEmpty
                hasActiveFilters={activeCategory !== "All" || !!search.trim()}
              />
            ) : null}

            {!isLoading && !isError && cards.length > 0 ? (
              <section className="grid gap-6 lg:grid-cols-2">
                {cards.map((market) => (
                  <article
                    key={market.id}
                    className="app-panel-subtle flex h-full flex-col justify-between px-5 py-6 md:px-7 md:py-7"
                  >
                    <div className="min-w-0">
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-4">
                          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-primary text-[#16130f]">
                            <span className="material-symbols-outlined text-[1.5rem]">
                              {market.icon}
                            </span>
                          </span>

                          <div className="min-w-0">
                            <p className="eyebrow mb-2">{market.category}</p>
                            <h2 className="type-heading-md">{market.title}</h2>
                          </div>
                        </div>

                        <span className="eyebrow whitespace-nowrap">
                          {market.statusLabel}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {market.outcomes.map((outcome) => (
                          <div
                            key={`${market.id}-${outcome.id}`}
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
                      <span className="muted-copy">{market.statusLabel}</span>
                    </div>
                  </article>
                ))}
              </section>
            ) : null}

            <CreateMarketDock categorySuggestions={categories.filter((category) => category !== "All")} />
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

function MarketBoardSkeleton() {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {Array.from({ length: 4 }, (_, index) => (
        <article
          key={index}
          className="market-state-card app-panel-subtle animate-pulse px-5 py-6 md:px-7 md:py-7"
        >
          <div className="market-state-block h-4 w-24" />
          <div className="market-state-block mt-5 h-16 w-full" />
          <div className="market-state-block mt-8 h-14 w-full" />
          <div className="market-state-block mt-4 h-14 w-full" />
          <div className="market-state-block mt-8 h-4 w-40" />
        </article>
      ))}
    </section>
  );
}

function MarketBoardError({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="market-state-card app-panel-subtle px-6 py-7 md:px-8 md:py-8">
      <p className="eyebrow">Board unavailable</p>
      <h2 className="type-heading-sm mt-3 uppercase">
        We could not load open markets
      </h2>
      <p className="mt-4 max-w-2xl text-[color:var(--text-muted)]">
        The live market feed did not return a usable response. Retry to fetch
        the current board again.
      </p>
      <button className="action-secondary mt-6" type="button" onClick={onRetry}>
        Retry feed
      </button>
    </section>
  );
}

function MarketBoardEmpty({
  hasActiveFilters,
}: {
  hasActiveFilters: boolean;
}) {
  return (
    <section className="market-state-card app-panel-subtle px-6 py-7 md:px-8 md:py-8">
      <p className="eyebrow">
        {hasActiveFilters ? "No match found" : "No open markets"}
      </p>
      <h2 className="type-heading-sm mt-3 uppercase">
        {hasActiveFilters
          ? "Nothing matches this board filter"
          : "The board is waiting for its next launch"}
      </h2>
      <p className="mt-4 max-w-2xl text-[color:var(--text-muted)]">
        {hasActiveFilters
          ? "Try another search term or switch back to All categories to widen the feed."
          : "Create a new market from the launchpad below and it will appear here once the backend accepts it."}
      </p>
    </section>
  );
}
