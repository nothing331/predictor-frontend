import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BrandMark from "../components/BrandMark";
import CreateMarketDock from "../components/CreateMarketDock";
import GiftClaimRail from "../components/GiftClaimRail";
import HeaderAccountActions from "../components/HeaderAccountActions";
import HowToPlayDialog from "../components/HowToPlayDialog";
import { useAccountSummary } from "../hooks/useAccount";
import {
  toHomeMarketCard,
  type HomeMarketCard,
} from "../features/markets/homeMarketMapper";
import { getMarketPath } from "../features/markets/marketRoutes";
import { useMarkets, useResolveMarket } from "../hooks/useMarkets";
import { AuthStore } from "../store/authStore";
import {
  hasApiBackedSession,
  isAdminSession,
  isSessionAuthenticated,
} from "../utils/auth";
import { formatFCoinAmount } from "../utils/currency";

type HomeBoardMode = "TRADE" | "ADMIN";
type ResolutionChoice = "YES" | "NO";

const boardModes: {
  id: HomeBoardMode;
  label: string;
  caption: string;
  icon: string;
}[] = [
  {
    id: "TRADE",
    label: "Trade board",
    caption: "Browse live markets and place positions.",
    icon: "monitoring",
  },
  {
    id: "ADMIN",
    label: "Admin desk",
    caption: "Create markets and settle open outcomes.",
    icon: "admin_panel_settings",
  },
];

const INITIAL_MARKET_BATCH = 4;
const MARKET_BATCH_SIZE = 4;

export default function HomePage() {
  const { data: markets = [], isLoading, isError, refetch } = useMarkets();
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const role = AuthStore((state) => state.role);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);
  const hasApiSession = hasApiBackedSession(accessToken);
  const isAdmin = isAdminSession(role);
  const resolveMarketMutation = useResolveMarket();
  const [activeMode, setActiveMode] = useState<HomeBoardMode>("TRADE");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedResolutions, setSelectedResolutions] = useState<
    Record<string, ResolutionChoice>
  >({});

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

  const filteredMarkets = markets
    .filter(
      (market) =>
        activeCategory === "All" ||
        (market.category?.trim() || "General") === activeCategory,
    )
    .filter((market) => {
      const searchValue = search.trim().toLowerCase();

      if (!searchValue) {
        return true;
      }

      return [
        market.marketName,
        market.category?.trim() || "General",
        ...market.outcomes.map((outcome) => outcome.label),
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchValue);
    });
  const tradeCards = filteredMarkets
    .map(toHomeMarketCard)
    .sort((left, right) => {
      if (left.status === right.status) {
        return 0;
      }

      return left.status === "OPEN" ? -1 : 1;
    });
  const adminCards = filteredMarkets
    .filter((market) => market.status === "OPEN")
    .map(toHomeMarketCard);
  const openMarketCount = adminCards.length;
  const adminCategoryCount = new Set(adminCards.map((market) => market.category)).size;

  const resolvingMarketId = resolveMarketMutation.variables?.marketId ?? null;
  const selectedResolutionCount = Object.keys(selectedResolutions).length;
  const availableBoardModes = isAdmin
    ? boardModes
    : boardModes.filter((mode) => mode.id === "TRADE");
  const isAdminDeskActive = isAdmin && activeMode === "ADMIN";
  const searchPlaceholder =
    isAdminDeskActive
      ? "Search markets ready for settlement"
      : "Search markets, creators, or topics";

  useEffect(() => {
    if (activeCategory !== "All" && !categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [activeCategory, categories]);

  useEffect(() => {
    if (!isAdmin && activeMode === "ADMIN") {
      setActiveMode("TRADE");
    }
  }, [activeMode, isAdmin]);

  useEffect(() => {
    const visibleIds = new Set(
      filteredMarkets
        .filter((market) => market.status === "OPEN")
        .map((market) => market.marketId),
    );

    setSelectedResolutions((current) => {
      const nextEntries = Object.entries(current).filter(([marketId]) =>
        visibleIds.has(marketId),
      );

      if (nextEntries.length === Object.keys(current).length) {
        return current;
      }

      return Object.fromEntries(nextEntries) as Record<string, ResolutionChoice>;
    });
  }, [filteredMarkets]);

  function handleResolutionSelection(
    marketId: string,
    outcomeId: ResolutionChoice,
  ) {
    setSelectedResolutions((current) => {
      if (current[marketId] === outcomeId) {
        const next = { ...current };
        delete next[marketId];
        return next;
      }

      return {
        ...current,
        [marketId]: outcomeId,
      };
    });
  }

  function handleResolveMarket(marketId: string) {
    const outcomeId = selectedResolutions[marketId];

    if (!outcomeId) {
      return;
    }

    resolveMarketMutation.mutate(
      { marketId, outcomeId },
      {
        onSuccess: () => {
          setSelectedResolutions((current) => {
            const next = { ...current };
            delete next[marketId];
            return next;
          });
        },
      },
    );
  }

  return (
    <div className="page-shell">
      <div className="page-content">
        <header className="surface-line mb-8 pb-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex flex-col gap-4 xl:max-w-xl">
              <BrandMark
                caption={
                  isAdminDeskActive
                    ? "Market operations desk"
                    : "Live probability board"
                }
              />

              {isAdmin && (
                <div className="home-mode-switch app-panel-subtle">
                  {availableBoardModes.map((mode) => {
                    const isActive = activeMode === mode.id;

                    return (
                      <button
                        key={mode.id}
                        aria-pressed={isActive}
                        className={`home-mode-tab ${
                          isActive ? "home-mode-tab-active" : ""
                        }`}
                        type="button"
                        onClick={() => setActiveMode(mode.id)}
                      >
                        <span className="home-mode-tab-icon">
                          <span className="material-symbols-outlined">
                            {mode.icon}
                          </span>
                        </span>
                        <span className="min-w-0">
                          <span className="home-mode-tab-label">{mode.label}</span>
                          <span className="home-mode-tab-copy">{mode.caption}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-4 xl:max-w-4xl xl:items-end">
              <div className="flex w-full flex-col gap-3 xl:max-w-3xl xl:flex-row xl:items-stretch">
                <label className="app-panel-subtle field-shell search-shell flex-1">
                  <span className="material-symbols-outlined">search</span>
                  <input
                    className="app-input search-input uppercase"
                    placeholder={searchPlaceholder}
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </label>

                <button
                  className="how-to-play-trigger"
                  onClick={() => setIsHowToPlayOpen(true)}
                  type="button"
                >
                  <span className="material-symbols-outlined">stadia_controller</span>
                  <span>
                    <span className="how-to-play-trigger-label">How to play</span>
                    <span className="how-to-play-trigger-copy">
                      Open game guide
                    </span>
                  </span>
                </button>
              </div>

              <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-end">
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
          </div>
        </header>

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0">
            {!isAdminDeskActive ? (
              <>
                <TradeBoard
                  cards={tradeCards}
                  hasActiveFilters={activeCategory !== "All" || !!search.trim()}
                  isAdmin={isAdmin}
                  isError={isError}
                  isLoading={isLoading}
                  onRetry={() => refetch()}
                />
              </>
            ) : (
              <>
                <ResolveDesk
                  cards={adminCards}
                  categoryCount={adminCategoryCount}
                  hasActiveFilters={activeCategory !== "All" || !!search.trim()}
                  isError={isError}
                  isLoading={isLoading}
                  onResolve={handleResolveMarket}
                  onRetry={() => refetch()}
                  onSelectResolution={handleResolutionSelection}
                  pendingMarketId={resolvingMarketId}
                  selectedResolutionCount={selectedResolutionCount}
                  selectedResolutions={selectedResolutions}
                />

                <CreateMarketDock
                  categorySuggestions={categories.filter(
                    (category) => category !== "All",
                  )}
                />
              </>
            )}
          </main>

          <aside className="xl:sticky xl:top-6 xl:self-start">
            {!isAdminDeskActive ? (
              isAuthenticated ? (
                <div className="space-y-4">
                  {hasApiSession ? <GiftClaimRail /> : null}
                  <TradeHistoryRail />
                </div>
              ) : (
                <GuestSignupRail />
              )
            ) : (
              <AdminDeskRail
                isAuthenticated={isAuthenticated}
                openMarketCount={openMarketCount}
                selectedResolutionCount={selectedResolutionCount}
              />
            )}
          </aside>
        </div>
      </div>

      <HowToPlayDialog
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
}

function TradeBoard({
  cards,
  hasActiveFilters,
  isAdmin,
  isLoading,
  isError,
  onRetry,
}: {
  cards: HomeMarketCard[];
  hasActiveFilters: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_MARKET_BATCH);
  const feedSignature = cards.map((card) => `${card.id}:${card.status}`).join("|");
  const visibleCards = cards.slice(0, visibleCount);
  const remainingCount = Math.max(cards.length - visibleCards.length, 0);

  useEffect(() => {
    setVisibleCount(INITIAL_MARKET_BATCH);
  }, [feedSignature]);

  useEffect(() => {
    if (visibleCount >= cards.length) {
      return;
    }

    const node = loadMoreRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }

        setVisibleCount((current) =>
          Math.min(current + MARKET_BATCH_SIZE, cards.length),
        );
      },
      {
        rootMargin: "320px 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [cards.length, visibleCount]);

  if (isLoading) {
    return <MarketBoardSkeleton />;
  }

  if (isError) {
    return <MarketBoardError onRetry={onRetry} />;
  }

  if (cards.length === 0) {
    return <MarketBoardEmpty hasActiveFilters={hasActiveFilters} isAdmin={isAdmin} />;
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
      {visibleCards.map((market) => (
        <Link
          key={market.id}
          aria-label={`Open market ${market.title}`}
          className={`market-board-card app-panel-subtle flex h-full flex-col justify-between px-5 py-6 text-[inherit] no-underline transition-transform duration-200 hover:-translate-y-1 md:px-7 md:py-7 ${
            market.status === "RESOLVED" ? "market-board-card-resolved" : ""
          }`}
          to={getMarketPath(market.id)}
        >
          <div className="min-w-0">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-4">
                <span
                  className={`flex h-12 w-12 flex-none items-center justify-center rounded-full ${
                    market.status === "RESOLVED"
                      ? "bg-secondary text-[#f4efe6]"
                      : "bg-primary text-[#16130f]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[1.5rem]">
                    {market.icon}
                  </span>
                </span>

                <div className="min-w-0">
                  <p className="eyebrow mb-2">{market.category}</p>
                  <h2 className="type-heading-md">{market.title}</h2>
                </div>
              </div>

              <span
                className={`market-status-pill ${
                  market.status === "RESOLVED"
                    ? "market-status-pill-resolved"
                    : "market-status-pill-open"
                }`}
              >
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

                  <span
                    className={`chip !px-3 ${
                      outcome.id === "YES" ? "chip-primary" : "chip-secondary"
                    }`}
                  >
                    {outcome.probability}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-divider type-body-sm mt-8 flex items-center justify-between gap-4 pt-4">
            <span className="muted-copy">{market.volume}</span>
            <span className="muted-copy">{market.statusLabel}</span>
          </div>
        </Link>
      ))}
      </div>

      {remainingCount > 0 ? (
        <div className="market-feed-footer app-panel-subtle">
          <div>
            <p className="eyebrow">Feed pagination</p>
            <h3 className="type-heading-sm mt-3 uppercase">
              Showing {visibleCards.length} of {cards.length} markets
            </h3>
            <p className="market-feed-footer-copy">
              Scroll through the board and the next 4 market dossiers will load
              automatically into the feed.
            </p>
          </div>

          <div className="market-feed-footer-meta">
            <div className="market-feed-footer-stat">
              <span className="eyebrow">Next batch</span>
              <strong>{Math.min(MARKET_BATCH_SIZE, remainingCount)}</strong>
            </div>
            <div className="market-feed-footer-stat">
              <span className="eyebrow">Remaining</span>
              <strong>{remainingCount}</strong>
            </div>
          </div>

          <div ref={loadMoreRef} className="market-feed-sentinel">
            <span className="market-feed-sentinel-line" />
            <span className="chip chip-soft">Loading more on scroll</span>
            <span className="market-feed-sentinel-line" />
          </div>
        </div>
      ) : cards.length > INITIAL_MARKET_BATCH ? (
        <div className="market-feed-footer market-feed-footer-complete app-panel-subtle">
          <p className="eyebrow">Full board loaded</p>
          <h3 className="type-heading-sm mt-3 uppercase">
            All {cards.length} markets are in view
          </h3>
        </div>
      ) : null}
    </section>
  );
}

function ResolveDesk({
  cards,
  categoryCount,
  hasActiveFilters,
  isError,
  isLoading,
  onResolve,
  onRetry,
  onSelectResolution,
  pendingMarketId,
  selectedResolutionCount,
  selectedResolutions,
}: {
  cards: HomeMarketCard[];
  categoryCount: number;
  hasActiveFilters: boolean;
  isError: boolean;
  isLoading: boolean;
  onResolve: (marketId: string) => void;
  onRetry: () => void;
  onSelectResolution: (marketId: string, outcomeId: ResolutionChoice) => void;
  pendingMarketId: string | null;
  selectedResolutionCount: number;
  selectedResolutions: Record<string, ResolutionChoice>;
}) {
  if (isLoading) {
    return <ResolveDeskSkeleton />;
  }

  if (isError) {
    return <ResolveDeskError onRetry={onRetry} />;
  }

  if (cards.length === 0) {
    return <ResolveDeskEmpty hasActiveFilters={hasActiveFilters} />;
  }

  return (
    <section className="resolve-desk-shell">
      <div className="resolve-desk-hero app-panel">
        <div className="resolve-desk-hero-copy">
          <p className="eyebrow">Settlement control</p>
          <h2 className="type-heading-lg">Run creation and settlement from one command lane</h2>
          <p className="resolve-desk-lead">
            Publish fresh markets, pick the final outcome when events end, and
            manage the live board from a single operator surface.
          </p>
        </div>

        <div className="resolve-desk-metrics">
          <div className="resolve-desk-metric">
            <span className="eyebrow">Open feed</span>
            <strong>{cards.length}</strong>
            <span>Open markets in the current filter set</span>
          </div>
          <div className="resolve-desk-metric">
            <span className="eyebrow">Categories</span>
            <strong>{categoryCount || 1}</strong>
            <span>Topics currently represented</span>
          </div>
          <div className="resolve-desk-metric">
            <span className="eyebrow">Armed picks</span>
            <strong>{selectedResolutionCount}</strong>
            <span>Resolution picks staged locally</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5">
        {cards.map((market) => {
          const selectedOutcome = selectedResolutions[market.id];
          const isPending = pendingMarketId === market.id;

          return (
            <article key={market.id} className="resolve-market-card app-panel-subtle">
              <div className="resolve-market-card-head">
                <div className="min-w-0">
                  <p className="eyebrow mb-2">{market.category}</p>
                  <h3 className="type-heading-sm">{market.title}</h3>
                </div>

                <div className="resolve-market-meta">
                  <span className="chip chip-soft">{market.volume}</span>
                  <Link
                    className="action-ghost !border-transparent !px-3"
                    to={getMarketPath(market.id)}
                  >
                    Open market
                  </Link>
                </div>
              </div>

              <div className="resolve-market-strip">
                {market.outcomes.map((outcome) => (
                  <div
                    key={`${market.id}-${outcome.id}-probability`}
                    className="resolve-market-strip-item"
                  >
                    <span
                      className={`resolve-market-signal ${
                        outcome.id === "YES"
                          ? "resolve-market-signal-yes"
                          : "resolve-market-signal-no"
                      }`}
                    />
                    <div>
                      <p className="eyebrow">{outcome.label}</p>
                      <p className="type-body-lg font-semibold">{outcome.probability}</p>
                    </div>
                    <span className="type-body-sm font-mono text-[color:var(--text-muted)]">
                      {outcome.odds}
                    </span>
                  </div>
                ))}
              </div>

              <div className="resolve-market-selector">
                {market.outcomes.map((outcome) => {
                  const isActive = selectedOutcome === outcome.id;

                  return (
                    <button
                      key={`${market.id}-${outcome.id}-action`}
                      aria-pressed={isActive}
                      className={`resolve-choice ${
                        outcome.id === "YES"
                          ? "resolve-choice-yes"
                          : "resolve-choice-no"
                      } ${isActive ? "resolve-choice-active" : ""}`}
                      type="button"
                      onClick={() => onSelectResolution(market.id, outcome.id)}
                    >
                      <span className="resolve-choice-label">
                        Resolve to {outcome.label}
                      </span>
                      <span className="resolve-choice-copy">
                        {isActive ? "Armed for submission" : "Stage this final answer"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="resolve-market-footer">
                <p className="resolve-market-warning">
                  This action settles the market immediately and should only be
                  used when the real-world result is confirmed.
                </p>

                <button
                  className={`${
                    selectedOutcome === "NO" ? "action-secondary" : "action-primary"
                  }`}
                  disabled={!selectedOutcome || isPending}
                  type="button"
                  onClick={() => onResolve(market.id)}
                >
                  {isPending
                    ? "Resolving..."
                    : selectedOutcome
                      ? `Resolve to ${selectedOutcome}`
                      : "Choose outcome first"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TradeHistoryRail() {
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);
  const hasApiSession = hasApiBackedSession(accessToken);
  const {
    data: accountSummary,
    isError,
    isLoading,
  } = useAccountSummary();

  const availableBalance = accountSummary?.availableBalance ?? 0;
  const recentMarkets = accountSummary?.recentMarkets ?? [];

  return (
    <section className="app-panel-subtle overflow-hidden">
      <div className="px-5 py-6 md:px-6">
        <p className="eyebrow mb-3">Account rail</p>
        <h2 className="section-title">Recent book</h2>

        <div className="mt-6 flex items-end justify-between gap-3">
          <div>
            <p className="metric-value text-primary">
              {formatFCoinAmount(availableBalance, {
                compact: availableBalance >= 1000,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="muted-copy type-body-sm">
              Available balance ready for new trades
            </p>
          </div>
          <span className="chip chip-soft">Cash only</span>
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="section-divider px-5 py-5 md:px-6">
          <p className="type-body-md font-semibold">Sign in to sync your desk</p>
          <p className="type-body-sm mt-2 text-[color:var(--text-muted)]">
            Your available balance and recent market exposure will appear here once
            you connect your account.
          </p>
        </div>
      ) : null}

      {isAuthenticated && !hasApiSession ? (
        <div className="section-divider px-5 py-5 md:px-6">
          <p className="type-body-md font-semibold">Live account summary unavailable</p>
          <p className="type-body-sm mt-2 text-[color:var(--text-muted)]">
            This session is using local demo credentials, so only backend-backed
            accounts can load recent market data.
          </p>
        </div>
      ) : null}

      {isAuthenticated && hasApiSession && isLoading ? (
        <div className="grid gap-3 px-5 pb-5 md:px-6">
          {Array.from({ length: 3 }, (_, index) => (
            <article
              key={index}
              className="section-divider animate-pulse px-5 py-5 md:px-6"
            >
              <div className="market-state-block h-5 w-40" />
              <div className="market-state-block mt-4 h-4 w-28" />
              <div className="market-state-block mt-5 h-18 w-full" />
            </article>
          ))}
        </div>
      ) : null}

      {isAuthenticated && hasApiSession && isError ? (
        <div className="section-divider px-5 py-5 md:px-6">
          <p className="type-body-md font-semibold">Account summary offline</p>
          <p className="type-body-sm mt-2 text-[color:var(--text-muted)]">
            We could not load your recent market summary right now. Your balance
            card will refresh automatically on the next successful request.
          </p>
        </div>
      ) : null}

      {isAuthenticated && hasApiSession && !isLoading && !isError && recentMarkets.length === 0 ? (
        <div className="section-divider px-5 py-5 md:px-6">
          <p className="type-body-md font-semibold">No recent markets yet</p>
          <p className="type-body-sm mt-2 text-[color:var(--text-muted)]">
            Your last three traded markets will appear here after your first filled
            position.
          </p>
        </div>
      ) : null}

      {isAuthenticated &&
        hasApiSession &&
        !isLoading &&
        !isError &&
        recentMarkets.map((market) => {
          const totalShares = market.userYesShares + market.userNoShares;

          return (
            <article
              key={market.marketId}
              className="section-divider px-5 py-5 md:px-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Link
                    className="type-body-md font-semibold leading-snug hover:underline"
                    to={getMarketPath(market.marketId)}
                  >
                    {market.marketName}
                  </Link>
                  <p className="type-body-sm mt-2 text-[color:var(--text-muted)]">
                    Last traded {formatRailTimestamp(market.lastTradedAt)}
                  </p>
                </div>

                <span
                  className={`chip ${
                    market.marketStatus === "OPEN" ? "chip-primary" : "chip-soft"
                  }`}
                >
                  {market.marketStatus === "OPEN"
                    ? "Open"
                    : market.resolvedOutcome
                      ? `Resolved ${market.resolvedOutcome}`
                      : "Resolved"}
                </span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="app-panel-soft p-3">
                  <p className="eyebrow mb-3">Your shares</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="type-body-sm text-[color:var(--text-muted)]">
                        YES
                      </span>
                      <span className="type-utility font-semibold">
                        {formatShareCount(market.userYesShares)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="type-body-sm text-[color:var(--text-muted)]">
                        NO
                      </span>
                      <span className="type-utility font-semibold">
                        {formatShareCount(market.userNoShares)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-[var(--border-soft)] pt-3">
                      <span className="type-body-sm text-[color:var(--text-muted)]">
                        Total held
                      </span>
                      <span className="type-utility font-semibold">
                        {formatShareCount(totalShares)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="app-panel-soft p-3">
                  <p className="eyebrow mb-3">Settlement outlook</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="type-body-sm text-[color:var(--text-muted)]">
                        If YES settles
                      </span>
                      <span className="type-utility font-semibold">
                        {formatFCoinAmount(market.projectedPayoutIfYes)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="type-body-sm text-[color:var(--text-muted)]">
                        If NO settles
                      </span>
                      <span className="type-utility font-semibold">
                        {formatFCoinAmount(market.projectedPayoutIfNo)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="chip chip-primary">
                  YES {Math.round(market.currentYesChance * 100)}%
                </span>
                <span className="chip chip-secondary">
                  NO {Math.round(market.currentNoChance * 100)}%
                </span>
              </div>
            </article>
          );
        })}
    </section>
  );
}

function formatShareCount(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 3,
  }).format(value);
}

function formatRailTimestamp(timestamp: string) {
  const parsed = new Date(timestamp);

  if (Number.isNaN(parsed.getTime())) {
    return "recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

function GuestSignupRail() {
  return (
    <section className="signup-banner app-panel overflow-hidden">
      <div className="signup-banner-hero">
        <div className="signup-banner-head">
          <div>
            <p className="eyebrow">Funded desk pass</p>
            <p className="signup-banner-kicker">Sign up to get free</p>
            <h2 className="signup-banner-amount">
              {formatFCoinAmount(1000, { maximumFractionDigits: 0 })}
            </h2>
          </div>
          <div className="signup-banner-ticket">
            <span>Starter</span>
            <strong>Credit</strong>
          </div>
        </div>
      </div>


      <div className="section-divider signup-banner-notes">
        <div className="signup-banner-note">
          <span className="material-symbols-outlined">savings</span>
          <div>
            <p className="type-body-md font-semibold">
              Claim your free balance
            </p>
            <p className="type-body-sm text-[color:var(--text-muted)]">
              Start funded instead of opening an empty shell.
            </p>
          </div>
        </div>

        <div className="signup-banner-note">
          <span className="material-symbols-outlined">trending_up</span>
          <div>
            <p className="type-body-md font-semibold">Trade the live board</p>
            <p className="type-body-sm text-[color:var(--text-muted)]">
              Follow open markets and price movement from the same home desk.
            </p>
          </div>
        </div>
      </div>

      <div className="signup-banner-actions">
        <Link className="action-primary" to="/create-account">
          Sign up now
        </Link>
        <Link className="action-ghost" to="/login">
          I already have access
        </Link>
      </div>
    </section>
  );
}

function AdminDeskRail({
  isAuthenticated,
  openMarketCount,
  selectedResolutionCount,
}: {
  isAuthenticated: boolean;
  openMarketCount: number;
  selectedResolutionCount: number;
}) {
  return (
    <section className="resolve-rail app-panel-subtle overflow-hidden">
      <div className="resolve-rail-header">
        <p className="eyebrow mb-3">Admin protocol</p>
        <h2 className="section-title">Operator notes</h2>
        <p className="resolve-rail-copy">
          Use the admin desk to launch new markets, pick winners for completed
          events, and let the open board refetch the fresh state.
        </p>
      </div>

      <div className="resolve-rail-stats">
        <div className="resolve-rail-stat">
          <span className="eyebrow">Signed in</span>
          <strong>{isAuthenticated ? "Yes" : "No"}</strong>
        </div>
        <div className="resolve-rail-stat">
          <span className="eyebrow">Open markets</span>
          <strong>{openMarketCount}</strong>
        </div>
        <div className="resolve-rail-stat">
          <span className="eyebrow">Armed picks</span>
          <strong>{selectedResolutionCount}</strong>
        </div>
      </div>

      <div className="section-divider px-5 py-5 md:px-6">
        <div className="resolve-rail-step">
          <span className="resolve-rail-step-index">01</span>
          <div>
            <p className="type-body-md font-semibold">Verify the final result</p>
            <p className="type-body-sm text-[color:var(--text-muted)]">
              Make sure the real-world outcome is final before you settle the market.
            </p>
          </div>
        </div>
      </div>

      <div className="section-divider px-5 py-5 md:px-6">
        <div className="resolve-rail-step">
          <span className="resolve-rail-step-index">02</span>
          <div>
            <p className="type-body-md font-semibold">Create or arm an action</p>
            <p className="type-body-sm text-[color:var(--text-muted)]">
              Draft a new market below or select the correct outcome directly on the resolve card.
            </p>
          </div>
        </div>
      </div>

      <div className="section-divider px-5 py-5 md:px-6">
        <div className="resolve-rail-step">
          <span className="resolve-rail-step-index">03</span>
          <div>
            <p className="type-body-md font-semibold">Publish or settle</p>
            <p className="type-body-sm text-[color:var(--text-muted)]">
              Admin actions use the protected create and resolve endpoints and refresh the board.
            </p>
          </div>
        </div>
      </div>
    </section>
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

function ResolveDeskSkeleton() {
  return (
    <section className="grid gap-5">
      <article className="resolve-market-card app-panel animate-pulse">
        <div className="market-state-block h-4 w-28" />
        <div className="market-state-block mt-4 h-[4.5rem] w-full" />
        <div className="market-state-block mt-6 h-[5.5rem] w-full" />
      </article>

      {Array.from({ length: 3 }, (_, index) => (
        <article
          key={index}
          className="resolve-market-card app-panel-subtle animate-pulse"
        >
          <div className="market-state-block h-4 w-24" />
          <div className="market-state-block mt-4 h-12 w-full" />
          <div className="market-state-block mt-5 h-20 w-full" />
          <div className="market-state-block mt-5 h-16 w-full" />
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

function ResolveDeskError({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="market-state-card app-panel-subtle px-6 py-7 md:px-8 md:py-8">
      <p className="eyebrow">Admin desk offline</p>
      <h2 className="type-heading-sm mt-3 uppercase">
        We could not load the admin queue
      </h2>
      <p className="mt-4 max-w-2xl text-[color:var(--text-muted)]">
        The open market feed is unavailable right now, so the admin desk cannot
        safely show markets to manage. Retry once the board connection returns.
      </p>
      <button className="action-secondary mt-6" type="button" onClick={onRetry}>
        Retry admin desk
      </button>
    </section>
  );
}

function MarketBoardEmpty({
  hasActiveFilters,
  isAdmin,
}: {
  hasActiveFilters: boolean;
  isAdmin: boolean;
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
          : isAdmin
            ? "Switch to the Admin desk when you are ready to publish the next market."
            : "Check back soon for the next market launch as new markets arrive on the live board."}
      </p>
    </section>
  );
}

function ResolveDeskEmpty({
  hasActiveFilters,
}: {
  hasActiveFilters: boolean;
}) {
  return (
    <section className="market-state-card app-panel-subtle px-6 py-7 md:px-8 md:py-8">
      <p className="eyebrow">
        {hasActiveFilters ? "No queue match" : "No markets to settle"}
      </p>
      <h2 className="type-heading-sm mt-3 uppercase">
        {hasActiveFilters
          ? "Nothing in the admin desk matches this filter"
          : "The settlement queue is clear"}
      </h2>
      <p className="mt-4 max-w-2xl text-[color:var(--text-muted)]">
        {hasActiveFilters
          ? "Clear the search term or switch categories to expose more open markets."
          : "Once open markets exist, they will appear here with direct YES and NO resolution controls."}
      </p>
    </section>
  );
}
