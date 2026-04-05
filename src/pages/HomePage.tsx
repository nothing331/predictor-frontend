import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserSummary } from "../api/user";
import AppHeader from "../components/AppHeader";
import GiftClaimButton from "../components/GiftClaimButton";
import SiteFooter from "../components/SiteFooter";
import { toHomeMarketCard } from "../features/markets/homeMarketMapper";
import { getMarketPath } from "../features/markets/marketRoutes";
import { useMarkets } from "../hooks/useMarkets";
import { AuthStore } from "../store/authStore";
import { isSessionAuthenticated } from "../utils/auth";

export default function HomePage() {
  const { data: openMarkets = [], isLoading, isError, refetch } = useMarkets("OPEN");
  const { data: resolvedMarkets = [], isLoading: isResolvedLoading } = useMarkets("RESOLVED");
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const allOpenCards = openMarkets.map(toHomeMarketCard);
  const categories = [
    "All",
    ...Array.from(
      new Set(
        allOpenCards
          .map((market) => market.category?.trim() || "General")
          .filter(Boolean),
      ),
    ),
  ];

  const filteredOpenCards = allOpenCards
    .filter(
      (market) => activeCategory === "All" || market.category === activeCategory,
    )
    .filter((market) => {
      const searchValue = search.trim().toLowerCase();
      if (!searchValue) return true;
      return [market.title, market.category, ...market.outcomes.map((o) => o.label)]
        .join(" ")
        .toLowerCase()
        .includes(searchValue);
    });

  const resolvedCards = resolvedMarkets.map(toHomeMarketCard).slice(0, 4);

  useEffect(() => {
    if (activeCategory !== "All" && !categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [activeCategory, categories]);

  return (
    <div className="page-shell">
      <div className="page-content">
        <AppHeader>
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
        </AppHeader>

        <HowToPlayBanner />

        <div className="grid gap-6 md:gap-10 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0 space-y-8 md:space-y-12">
            {/* Live Markets */}
            <section>
              <div className="flex items-center gap-2 mb-4 md:gap-3 md:mb-6">
                <span className="flex h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-[var(--color-accent-green)] animate-pulse" />
                <h2 className="section-title">Live Markets</h2>
              </div>

              {isLoading ? <MarketBoardSkeleton /> : null}
              {isError ? <MarketBoardError onRetry={() => refetch()} /> : null}
              {!isLoading && !isError && filteredOpenCards.length === 0 ? (
                <MarketBoardEmpty
                  hasActiveFilters={activeCategory !== "All" || !!search.trim()}
                />
              ) : null}
              {!isLoading && !isError && filteredOpenCards.length > 0 ? (
                <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                  {filteredOpenCards.map((market) => (
                    <MarketCard key={market.id} market={market} />
                  ))}
                </div>
              ) : null}
            </section>

            {/* Resolved Markets */}
            {!isResolvedLoading && resolvedCards.length > 0 ? (
              <section>
                <div className="section-divider pt-6 md:pt-8">
                  <div className="flex items-center justify-between gap-4 mb-4 md:mb-6">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="material-symbols-outlined text-[1.25rem] text-[color:var(--text-muted)]">
                        check_circle
                      </span>
                      <h2 className="section-title">Resolved</h2>
                    </div>
                  </div>

                  <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                    {resolvedCards.map((market) => (
                      <MarketCard key={market.id} market={market} />
                    ))}
                  </div>
                </div>
              </section>
            ) : null}
          </main>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            {isAuthenticated ? (
              <HomeSidebar />
            ) : (
              <SignupIncentiveCard />
            )}
          </aside>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}

/* ── Shared market card ── */

type HomeMarketCard = ReturnType<typeof toHomeMarketCard>;

function MarketCard({ market }: { market: HomeMarketCard }) {
  return (
    <Link
      aria-label={`Open market ${market.title}`}
      className="app-panel-subtle flex h-full flex-col justify-between px-3.5 py-4 text-[inherit] no-underline transition-transform duration-200 hover:-translate-y-1 md:px-5 md:py-6"
      to={getMarketPath(market.id)}
    >
      <div className="min-w-0">
        <div className="mb-3 flex items-start gap-3 md:mb-6 md:gap-4">
          <span className="flex h-9 w-9 md:h-12 md:w-12 flex-none items-center justify-center rounded-full bg-primary text-[#16130f]">
            <span className="material-symbols-outlined text-[1.1rem] md:text-[1.5rem]">
              {market.icon}
            </span>
          </span>
          <div className="min-w-0">
            <p className="eyebrow mb-1 md:mb-2">{market.category}</p>
            <h2 className="type-heading-md">{market.title}</h2>
          </div>
        </div>

        <div className="space-y-2.5 md:space-y-4">
          {market.outcomes.map((outcome) => (
            <div
              key={`${market.id}-${outcome.id}`}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 md:gap-4"
            >
              <span
                className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full text-[color:var(--text-muted)]"
                style={{
                  background:
                    "color-mix(in srgb, var(--surface-soft) 78%, transparent)",
                }}
              >
                <span className="material-symbols-outlined text-[1rem] md:text-[1.25rem]">
                  {outcome.icon}
                </span>
              </span>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2 md:gap-3">
                  <span className="type-body-lg truncate font-medium">
                    {outcome.label}
                  </span>
                  <span className="type-body-sm font-mono text-[color:var(--text-muted)]">
                    {outcome.odds}
                  </span>
                </div>
                <div
                  className={`mt-1.5 h-[2px] w-10 md:w-14 rounded-full ${outcome.accent}`}
                />
              </div>
              <span
                className={`chip !px-2 md:!px-3 ${
                  outcome.id === "YES" ? "chip-primary" : "chip-secondary"
                }`}
              >
                {outcome.probability}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider type-body-sm mt-5 flex items-center justify-between gap-3 pt-3 md:mt-8 md:gap-4 md:pt-4">
        <span className="muted-copy">{market.volume}</span>
        <span className="muted-copy">{market.statusLabel}</span>
      </div>
    </Link>
  );
}

/* ── Signup Incentive ── */

function SignupIncentiveCard() {
  return (
    <section
      className="overflow-hidden relative"
      style={{
        background: "linear-gradient(160deg, #0d1115 0%, #141a20 40%, #1a2030 100%)",
        border: "3px solid var(--border-strong)",
        boxShadow: "var(--shadow-strong)",
      }}
    >
      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--border-soft) 1px, transparent 1px), linear-gradient(90deg, var(--border-soft) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top section: headline + badge */}
      <div className="relative px-5 pt-6 pb-5 md:px-7 md:pt-7">
        <div className="flex items-start justify-between gap-3 mb-4">
          <p
            className="eyebrow"
            style={{ color: "var(--color-accent-green)" }}
          >
            Starter bonus
          </p>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 70%, var(--color-accent-green)))",
              color: "#0d1115",
              transform: "rotate(2deg)",
              border: "2px solid #0d1115",
              boxShadow: "3px 3px 0 rgba(0,0,0,0.4)",
            }}
          >
            <span className="material-symbols-outlined text-[0.85rem]">
              star
            </span>
            Free credit
          </span>
        </div>

        <h2
          className="uppercase leading-[0.95] font-bold mb-1"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 4vw, 1.75rem)",
            color: "#fff",
          }}
        >
          Sign up
          <br />
          to get free
        </h2>

        <p
          className="font-mono font-bold leading-none mt-2"
          style={{
            fontSize: "clamp(3.5rem, 10vw, 4.5rem)",
            color: "var(--color-primary)",
            textShadow: "0 0 40px color-mix(in srgb, var(--color-primary) 30%, transparent)",
            letterSpacing: "-0.03em",
          }}
        >
          {"\u0192"}1,000
        </p>
      </div>

      {/* Value props */}
      <div className="relative px-5 pb-5 md:px-7 space-y-4">
        <div className="flex items-start gap-3">
          <span
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full mt-0.5"
            style={{
              background: "color-mix(in srgb, var(--color-primary) 15%, transparent)",
              border: "1.5px solid color-mix(in srgb, var(--color-primary) 30%, transparent)",
            }}
          >
            <span
              className="material-symbols-outlined text-[1.1rem]"
              style={{ color: "var(--color-primary)" }}
            >
              redeem
            </span>
          </span>
          <div>
            <p className="type-body-md font-semibold" style={{ color: "#fff" }}>
              Claim your free balance
            </p>
            <p className="type-body-sm mt-0.5" style={{ color: "color-mix(in srgb, #fff 55%, transparent)" }}>
              Start funded. Get {"\u0192"}500 on signup + {"\u0192"}500 every 12 hours.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full mt-0.5"
            style={{
              background: "color-mix(in srgb, var(--color-accent-green) 15%, transparent)",
              border: "1.5px solid color-mix(in srgb, var(--color-accent-green) 30%, transparent)",
            }}
          >
            <span
              className="material-symbols-outlined text-[1.1rem]"
              style={{ color: "var(--color-accent-green)" }}
            >
              trending_up
            </span>
          </span>
          <div>
            <p className="type-body-md font-semibold" style={{ color: "#fff" }}>
              Trade live markets
            </p>
            <p className="type-body-sm mt-0.5" style={{ color: "color-mix(in srgb, #fff 55%, transparent)" }}>
              Buy shares in outcomes you believe in. Earn when you're right.
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="relative px-5 pb-6 md:px-7 md:pb-7 space-y-3">
        <Link
          className="flex w-full items-center justify-center gap-2 px-5 py-4 font-bold uppercase tracking-[0.12em] text-[0.9rem] no-underline transition-transform duration-150 hover:-translate-y-0.5"
          to="/login"
          style={{
            background: "var(--color-primary)",
            color: "#0d1115",
            border: "3px solid #0d1115",
            boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
          }}
        >
          <span className="material-symbols-outlined text-[1.25rem]">bolt</span>
          Sign up now
        </Link>

        <Link
          className="flex w-full items-center justify-center gap-2 px-5 py-3.5 font-bold uppercase tracking-[0.12em] text-[0.85rem] no-underline transition-colors duration-150"
          to="/login"
          style={{
            background: "transparent",
            color: "#fff",
            border: "3px solid var(--border-strong)",
          }}
        >
          I already have access
        </Link>
      </div>
    </section>
  );
}

/* ── How to Play ── */

function HowToPlayBanner() {
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem("howtoplay-seen") !== "true";
    } catch {
      return true;
    }
  });

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem("howtoplay-seen", "true");
    } catch {
      // ignore
    }
  };

  if (!open) return null;

  return (
    <section className="mb-5 md:mb-8 app-panel-subtle overflow-hidden">
      <div className="px-3.5 py-3 md:px-7 md:py-5 flex items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <span className="flex h-7 w-7 md:h-9 md:w-9 flex-none items-center justify-center rounded-full bg-primary text-[#16130f]">
            <span className="material-symbols-outlined text-[0.9rem] md:text-[1.1rem]">sports_esports</span>
          </span>
          <div className="min-w-0">
            <p className="type-body-sm md:type-body-md font-semibold">New here? Here's how it works</p>
            <p className="type-body-sm text-[color:var(--text-muted)] mt-0.5 md:mt-1 hidden md:block">
              Sign in &rarr; Pick a market &rarr; Buy shares in the outcome you believe &rarr; Earn when you're right. Claim free {"\u0192"}500 every 12 hours.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="flex-none text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] transition-colors"
          onClick={dismiss}
          aria-label="Dismiss"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </section>
  );
}

/* ── Sidebar ── */

function HomeSidebar() {
  const balance = AuthStore((state) => state.balance);
  const { data: summary, isLoading } = useQuery({
    queryKey: ["user-summary"],
    queryFn: getUserSummary,
    staleTime: 60 * 1000,
  });

  return (
    <section className="app-panel-subtle overflow-hidden">
      <div className="px-3.5 py-4 md:px-6 md:py-6 space-y-4 md:space-y-5">
        <div>
          <p className="eyebrow mb-2">Your balance</p>
          <p className="type-value-md font-mono font-bold text-primary">
            {"\u0192"}{(balance ?? summary?.availableBalance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <GiftClaimButton />

        <div className="section-divider pt-5">
          <p className="eyebrow mb-4">Recent positions</p>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="animate-pulse h-16 app-panel-subtle" />
              ))}
            </div>
          ) : summary && summary.recentMarkets.length > 0 ? (
            <div className="space-y-3">
              {summary.recentMarkets.map((market) => (
                <Link
                  key={market.marketId}
                  className="block app-panel-subtle px-4 py-3 text-[inherit] no-underline hover:-translate-y-0.5 transition-transform"
                  to={getMarketPath(market.marketId)}
                >
                  <p className="type-body-sm font-semibold leading-snug truncate mb-2">
                    {market.marketName}
                  </p>
                  <div className="flex items-center justify-between gap-2 type-body-sm">
                    <span className="text-[color:var(--text-muted)]">
                      {market.marketStatus === "OPEN" ? "Open" : "Resolved"}
                    </span>
                    <span className="font-mono font-semibold">
                      {(market.currentYesChance * 100).toFixed(0)}% Yes
                    </span>
                  </div>
                  {(market.userYesShares > 0 || market.userNoShares > 0) ? (
                    <div className="flex items-center gap-3 mt-2 type-body-sm text-[color:var(--text-muted)]">
                      {market.userYesShares > 0 ? (
                        <span>{market.userYesShares.toFixed(1)} Yes</span>
                      ) : null}
                      {market.userNoShares > 0 ? (
                        <span>{market.userNoShares.toFixed(1)} No</span>
                      ) : null}
                    </div>
                  ) : null}
                </Link>
              ))}
            </div>
          ) : (
            <p className="type-body-sm text-[color:var(--text-muted)]">
              No positions yet. Trade on a market to see your positions here.
            </p>
          )}
        </div>

        <Link
          className="action-ghost w-full justify-center no-underline"
          to="/portfolio"
        >
          View full portfolio
        </Link>
      </div>
    </section>
  );
}

/* ── States ── */

function MarketBoardSkeleton() {
  return (
    <div className="grid gap-4 md:gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }, (_, index) => (
        <article
          key={index}
          className="market-state-card app-panel-subtle animate-pulse px-3.5 py-4 md:px-5 md:py-6"
        >
          <div className="market-state-block h-4 w-24" />
          <div className="market-state-block mt-5 h-16 w-full" />
          <div className="market-state-block mt-8 h-14 w-full" />
          <div className="market-state-block mt-4 h-14 w-full" />
          <div className="market-state-block mt-8 h-4 w-40" />
        </article>
      ))}
    </div>
  );
}

function MarketBoardError({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="market-state-card app-panel-subtle px-6 py-7 md:px-8 md:py-8">
      <p className="eyebrow">Error</p>
      <h2 className="type-heading-sm mt-3 uppercase">Could not load markets</h2>
      <p className="mt-4 max-w-2xl text-[color:var(--text-muted)]">
        Something went wrong while loading markets. Please try again.
      </p>
      <button className="action-secondary mt-6" type="button" onClick={onRetry}>
        Retry
      </button>
    </section>
  );
}

function MarketBoardEmpty({ hasActiveFilters }: { hasActiveFilters: boolean }) {
  return (
    <section className="market-state-card app-panel-subtle px-6 py-7 md:px-8 md:py-8">
      <p className="eyebrow">
        {hasActiveFilters ? "No match found" : "No open markets"}
      </p>
      <h2 className="type-heading-sm mt-3 uppercase">
        {hasActiveFilters ? "No matching markets" : "No markets yet"}
      </h2>
      <p className="mt-4 max-w-2xl text-[color:var(--text-muted)]">
        {hasActiveFilters
          ? "Try a different search term or category."
          : "No markets are available right now. Check back soon."}
      </p>
    </section>
  );
}
