import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { Link, useParams } from "react-router-dom";
import type {
  MarketDto,
  MarketHistoryPoint,
  MarketOutcomeDto,
  MarketUserPositionDto,
} from "@/api/market";
import MarketHistoryChart from "@/components/MarketHistoryChart";
import {
  buildHistoryPointKey,
  getLatestHistoryPoint,
  marketHistoryRangeOptions,
  mergeMarketHistoryPoints,
  type MarketHistoryRangePreset,
} from "@/features/markets/marketHistory";
import {
  formatCompactCurrency,
  formatPrice,
  formatProbability,
  getCategoryIcon,
  getMarketCategory,
} from "@/features/markets/marketPresentation";
import { toHistoryPointFromTradeEvent } from "@/features/markets/marketEvents";
import {
  getMarketPath,
  parseMarketIdParam,
} from "@/features/markets/marketRoutes";
import { useMarketPosition } from "@/hooks/useAccount";
import { useMarketEventStream } from "@/hooks/useMarketEventStream";
import { useMarketHistory } from "@/hooks/useMarketHistory";
import { useCreateTrade, useMarket } from "@/hooks/useMarkets";
import { AuthStore } from "@/store/authStore";
import { isSessionAuthenticated } from "@/utils/auth";
import {
  FCoinName,
  FCoinSymbol,
  formatFCoinAmount,
  formatFCoinDelta,
} from "@/utils/currency";
import BrandMark from "../components/BrandMark";
import HeaderAccountActions from "../components/HeaderAccountActions";

const categories = ["All", "Politics", "Tech", "Sports", "Crypto"];
const quickAmounts = [
  { amount: 1, label: formatFCoinDelta(1, { maximumFractionDigits: 0 }) },
  { amount: 5, label: formatFCoinDelta(5, { maximumFractionDigits: 0 }) },
  { amount: 10, label: formatFCoinDelta(10, { maximumFractionDigits: 0 }) },
  { amount: 100, label: formatFCoinDelta(100, { maximumFractionDigits: 0 }) },
];

export default function MarketPage() {
  const { marketId: marketIdParam } = useParams();
  const marketId = parseMarketIdParam(marketIdParam);
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);
  const {
    data: market,
    error,
    isError,
    isLoading,
    refetch,
  } = useMarket(marketId);
  const marketPositionQuery = useMarketPosition(marketId);
  const [activeRange, setActiveRange] = useState<MarketHistoryRangePreset>("ALL");
  const {
    data: history,
    isError: isHistoryError,
    isLoading: isHistoryLoading,
    refetch: refetchHistory,
  } = useMarketHistory(marketId, activeRange, market?.status === "OPEN");
  const tradeMutation = useCreateTrade(marketId);
  const [selectedOutcome, setSelectedOutcome] =
    useState<MarketOutcomeDto["outcomeId"] | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [livePoints, setLivePoints] = useState<MarketHistoryPoint[]>([]);
  const seenLiveKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!market?.outcomes.length) {
      return;
    }

    setSelectedOutcome((current) => {
      if (
        current &&
        market.outcomes.some((outcome) => outcome.outcomeId === current)
      ) {
        return current;
      }

      return market.outcomes[0].outcomeId;
    });
  }, [market]);

  useEffect(() => {
    if (!history) {
      return;
    }

    setLivePoints([]);
    seenLiveKeysRef.current = new Set(
      history.points.map((point) => buildHistoryPointKey(point)),
    );
  }, [history]);

  const streamEnabled =
    !!marketId &&
    !isLoading &&
    !isError &&
    !!market &&
    market.status === "OPEN" &&
    !!history &&
    !isHistoryError;
  const { status: streamStatus } = useMarketEventStream({
    enabled: streamEnabled,
    marketId,
    onReconnectNeeded: async () => {
      const [marketResult, historyResult] = await Promise.all([
        refetch(),
        refetchHistory(),
      ]);

      if (marketResult.error) {
        throw marketResult.error;
      }

      if (historyResult.error) {
        throw historyResult.error;
      }
    },
    onMarketResolved: async () => {
      await Promise.all([refetch(), refetchHistory()]);
    },
    onTradeExecuted: async (event) => {
      const key = event.payload.tradeId
        ? `trade:${event.payload.tradeId}`
        : `TradeExecuted:${event.occurredAt}`;

      if (seenLiveKeysRef.current.has(key)) {
        return;
      }

      seenLiveKeysRef.current.add(key);
      setLivePoints((current) => [...current, toHistoryPointFromTradeEvent(event)]);
    },
  });

  if (!marketId) {
    return <MarketNotFound />;
  }

  if (isLoading) {
    return <MarketPageSkeleton />;
  }

  if (isError) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return <MarketNotFound marketId={marketId} />;
    }

    return <MarketPageError onRetry={() => refetch()} />;
  }

  if (!market) {
    return <MarketNotFound marketId={marketId} />;
  }

  const category = getMarketCategory(market.category);
  const isResolvedMarket = market.status === "RESOLVED";
  const marketIcon = getCategoryIcon(category);
  const descriptionBlocks = buildDescriptionBlocks(market);
  const leadOutcome = getLeadOutcome(market.outcomes);
  const resolvedLabel = getResolvedLabel(market);
  const tradeDestination = `/login?redirectTo=${encodeURIComponent(
    getMarketPath(market.marketId),
  )}`;
  const combinedHistoryPoints = mergeMarketHistoryPoints(
    history?.points ?? [],
    livePoints,
  );
  const latestHistoryPoint = getLatestHistoryPoint(combinedHistoryPoints);
  const activeTradeOutcome =
    market.outcomes.find((outcome) => outcome.outcomeId === selectedOutcome) ??
    market.outcomes[0];
  const amountValue = parseAmountInput(amountInput);
  const canTrade =
    market.status === "OPEN" &&
    isAuthenticated &&
    !!activeTradeOutcome &&
    amountValue > 0;
  const chartStatus = isResolvedMarket
    ? null
    : getChartStatus({
        hasHistory: combinedHistoryPoints.length > 0,
        isHistoryLoading,
        isStreamEnabled: streamEnabled,
        streamStatus,
      });

  return (
    <div className="page-shell">
      <div className="page-content">
        <header className="surface-line mb-8 pb-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <BrandMark caption="Live market detail" />

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
                {categories.map((entry) => (
                  <button
                    key={entry}
                    className={`chip ${
                      entry === category ? "chip-primary" : "chip-soft"
                    } ${entry === category ? "" : "!border-transparent !bg-transparent"}`}
                    type="button"
                  >
                    {entry}
                  </button>
                ))}
              </div>

              <HeaderAccountActions />
            </div>
          </div>
        </header>

        <main className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_328px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  className="eyebrow text-[inherit] no-underline"
                  to="/"
                >
                  Back to board
                </Link>
                <span className="eyebrow">{category}</span>
                <span className="eyebrow">
                  {market.status === "OPEN" ? "Open market" : "Resolved market"}
                </span>
                <span className="eyebrow">ID {shortenMarketId(market.marketId)}</span>
              </div>

              <div className="flex items-start gap-5">
                <span className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-primary text-[#16130f]">
                  <span className="material-symbols-outlined text-[2rem]">
                    {marketIcon}
                  </span>
                </span>

                <div className="min-w-0">
                  <h1 className="display-title">{market.marketName}</h1>
                  <p className="muted-copy mt-4 max-w-3xl type-body-md">
                    Market ID: {market.marketId}
                  </p>
                </div>
              </div>
            </div>

            {isResolvedMarket ? (
              <ResolvedMarketSummary
                market={market}
                resolvedLabel={resolvedLabel}
              />
            ) : (
              <section className="app-panel-subtle overflow-hidden px-5 py-6 md:px-8 md:py-8">
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    <p className="eyebrow">Price history</p>
                    <div className="market-history-summary">
                      {market.outcomes.map((outcome) => (
                        <article
                          key={outcome.outcomeId}
                          className={`market-history-signal ${
                            outcome.outcomeId === "YES"
                              ? "market-history-signal-yes"
                              : "market-history-signal-no"
                          }`}
                        >
                          <span className="eyebrow">{outcome.label}</span>
                          <strong className="market-history-signal-value">
                            {latestHistoryPoint
                              ? formatProbability(
                                  outcome.outcomeId === "YES"
                                    ? latestHistoryPoint.yesProbability
                                    : latestHistoryPoint.noProbability,
                                )
                              : formatProbability(outcome.probability)}
                          </strong>
                        </article>
                      ))}
                      <article className="market-history-meta">
                        <span className="eyebrow">Last update</span>
                        <strong className="market-history-meta-value">
                          {latestHistoryPoint
                            ? formatRelativeTimestamp(latestHistoryPoint.timestamp)
                            : "Waiting for history"}
                        </strong>
                      </article>
                    </div>
                  </div>

                  <div className="market-live-shell">
                    <span className={`market-live-badge ${chartStatus?.toneClass ?? ""}`}>
                      <span className="market-live-dot" />
                      {chartStatus?.label ?? "Snapshot mode"}
                    </span>
                    <div className="flex items-center gap-3 text-[color:var(--text-muted)]">
                      <span className="material-symbols-outlined">event</span>
                      <span className="material-symbols-outlined">forum</span>
                      <span className="material-symbols-outlined">ios_share</span>
                      <span className="material-symbols-outlined">download</span>
                    </div>
                  </div>
                </div>

                <div className="chart-surface h-80 w-full md:h-[26rem]">
                  {isHistoryLoading && !history ? (
                    <ChartHistoryLoading />
                  ) : isHistoryError && !history ? (
                    <ChartHistoryError onRetry={() => refetchHistory()} />
                  ) : combinedHistoryPoints.length > 0 ? (
                    <MarketHistoryChart points={combinedHistoryPoints} />
                  ) : (
                    <ChartHistoryEmpty />
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <span className="muted-copy">
                    {formatCompactCurrency(market.totalValue)} vol ·{" "}
                    {combinedHistoryPoints.length} plotted points
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {marketHistoryRangeOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`chip ${
                          activeRange === option.id
                            ? "chip-primary"
                            : "chip-soft !border-transparent !bg-transparent"
                        }`}
                        onClick={() => setActiveRange(option.id)}
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </section>

          <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <section className="app-panel-subtle overflow-hidden">
              <div className="px-5 py-6 md:px-6">
                <div className="mb-5 flex items-start gap-4">
                  <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-primary text-[#16130f]">
                    <span className="material-symbols-outlined text-[2rem]">
                      {marketIcon}
                    </span>
                  </span>

                  <div>
                    <p className="muted-copy type-body-sm">{market.marketName}</p>
                    <p className="type-heading-sm mt-2 text-primary">
                      {market.status === "OPEN"
                        ? `Buy ${leadOutcome?.label ?? "Outcome"}`
                        : resolvedLabel}
                    </p>
                  </div>
                </div>

                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <button className="chip chip-primary" type="button">
                      {market.status === "OPEN" ? "Buy" : "Resolved"}
                    </button>
                    <span className="chip chip-soft !border-transparent !bg-transparent">
                      Budget order
                    </span>
                  </div>
                  <span className="eyebrow">
                    {market.status === "OPEN" ? FCoinName : resolvedLabel}
                  </span>
                </div>

                <div className="mb-5 grid grid-cols-2 gap-3">
                  {market.outcomes.slice(0, 2).map((outcome) => (
                    <button
                      key={outcome.outcomeId}
                      className={`trade-outcome-option ${
                        selectedOutcome === outcome.outcomeId
                          ? outcome.outcomeId === "YES"
                            ? "trade-outcome-option-yes"
                            : "trade-outcome-option-no"
                          : "trade-outcome-option-idle"
                      }`}
                      onClick={() => setSelectedOutcome(outcome.outcomeId)}
                      type="button"
                    >
                      <span>{outcome.label}</span>
                      <span className="trade-outcome-option-price">
                        {formatPrice(outcome.probability)}
                      </span>
                    </button>
                  ))}
                </div>

                <label className="mb-5 block">
                  <span className="eyebrow mb-3 block">Amount</span>
                  <div className="app-panel-subtle field-shell trade-amount-shell">
                    <span className="trade-amount-prefix">{FCoinSymbol}</span>
                    <input
                      className="app-input type-value-lg font-mono font-semibold"
                      inputMode="decimal"
                      placeholder="0.00"
                      type="text"
                      value={amountInput}
                      onChange={(event) =>
                        setAmountInput(normalizeAmountInput(event.target.value))
                      }
                    />
                  </div>
                </label>

                <div className="mb-5 flex flex-wrap gap-2">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount.label}
                      className="trade-quick-fill"
                      onClick={() =>
                        setAmountInput(
                          formatAmountInput(amountValue + quickAmount.amount),
                        )
                      }
                      type="button"
                    >
                      {quickAmount.label}
                    </button>
                  ))}
                </div>

                <p className="muted-copy mb-5 type-body-sm">
                  The backend prices this as a budget order. Enter {FCoinName},
                  pick an outcome, and the server computes shares for you.
                </p>

                {market.status !== "OPEN" ? (
                  <button
                    className="action-secondary w-full justify-center"
                    disabled
                    type="button"
                  >
                    Market resolved
                  </button>
                ) : isAuthenticated ? (
                  <button
                    className={`w-full justify-center ${
                      activeTradeOutcome?.outcomeId === "NO"
                        ? "action-secondary"
                        : "action-primary"
                    }`}
                    disabled={!canTrade || tradeMutation.isPending}
                    onClick={() => {
                      if (!activeTradeOutcome || amountValue <= 0) {
                        return;
                      }

                      tradeMutation.mutate(
                        {
                          amount: amountValue,
                          outcome: activeTradeOutcome.outcomeId,
                        },
                        {
                          onSuccess: () => {
                            setAmountInput("");
                          },
                        },
                      );
                    }}
                    type="button"
                  >
                    {tradeMutation.isPending
                      ? "Submitting trade..."
                      : `Trade ${activeTradeOutcome?.label ?? "market"}`}
                  </button>
                ) : (
                  <Link
                    className="action-secondary w-full justify-center no-underline"
                    to={tradeDestination}
                  >
                    Sign in to trade
                  </Link>
                )}
              </div>
            </section>

            <MarketPositionPanel
              isAuthenticated={isAuthenticated}
              market={market}
              onRetry={() => marketPositionQuery.refetch()}
              position={marketPositionQuery.data}
              tradeDestination={tradeDestination}
              isError={marketPositionQuery.isError}
              isLoading={marketPositionQuery.isLoading}
            />
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

function MarketPageSkeleton() {
  return (
    <div className="page-shell">
      <div className="page-content">
        <header className="surface-line mb-8 pb-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <BrandMark caption="Live market detail" />
            <div className="app-panel-subtle h-14 w-full max-w-4xl animate-pulse" />
          </div>
        </header>

        <main className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_328px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-8">
            <div className="app-panel-subtle h-40 animate-pulse" />
            <div className="app-panel-subtle h-[34rem] animate-pulse" />
            <div className="app-panel-subtle h-[24rem] animate-pulse" />
          </section>
          <aside className="app-panel-subtle h-[32rem] animate-pulse" />
        </main>
      </div>
    </div>
  );
}

function MarketPageError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="page-shell">
      <div className="page-content">
        <section className="market-state-card app-panel-subtle px-6 py-7 md:px-8 md:py-8">
          <p className="eyebrow">Market unavailable</p>
          <h1 className="type-heading-sm mt-3 uppercase">
            We could not load this market
          </h1>
          <p className="mt-4 max-w-2xl text-[color:var(--text-muted)]">
            The detail endpoint did not return a usable response. Retry the
            market fetch or go back to the home board.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="action-secondary" type="button" onClick={onRetry}>
              Retry detail
            </button>
            <Link className="chip chip-soft text-[inherit] no-underline" to="/">
              Back to board
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function MarketNotFound({ marketId }: { marketId?: string }) {
  return (
    <div className="page-shell">
      <div className="page-content">
        <section className="market-state-card app-panel-subtle px-6 py-7 md:px-8 md:py-8">
          <p className="eyebrow">Market missing</p>
          <h1 className="type-heading-sm mt-3 uppercase">
            We could not find that market
          </h1>
          <p className="mt-4 max-w-2xl text-[color:var(--text-muted)]">
            {marketId
              ? `No market detail was returned for ${marketId}.`
              : "The requested market id is missing from the URL."}
          </p>
          <Link className="action-secondary mt-6 inline-flex no-underline" to="/">
            Back to board
          </Link>
        </section>
      </div>
    </div>
  );
}

function ResolvedMarketSummary({
  market,
  resolvedLabel,
}: {
  market: MarketDto;
  resolvedLabel: string;
}) {
  return (
    <section className="resolved-market-panel app-panel-subtle overflow-hidden px-5 py-6 md:px-8 md:py-8">
      <div className="resolved-market-panel-hero">
        <div>
          <p className="eyebrow">Market closed</p>
          <h2 className="type-heading-lg mt-3 uppercase">{resolvedLabel}</h2>
          <p className="resolved-market-panel-copy">
            This market has finished resolving, so the live chart and rolling
            update feed are no longer shown on this screen.
          </p>
        </div>

        <span className="market-status-pill market-status-pill-resolved">
          Resolved market
        </span>
      </div>

      <div className="resolved-market-summary">
        {market.outcomes.map((outcome) => {
          const isWinningOutcome = outcome.outcomeId === market.resolvedOutcome;

          return (
            <article
              key={outcome.outcomeId}
              className={`resolved-market-summary-card ${
                isWinningOutcome ? "resolved-market-summary-card-winning" : ""
              }`}
            >
              <span className="eyebrow">
                {isWinningOutcome ? "Winning outcome" : "Closed outcome"}
              </span>
              <strong>{outcome.label}</strong>
              <span>{formatProbability(outcome.probability)}</span>
            </article>
          );
        })}

        <article className="resolved-market-summary-card">
          <span className="eyebrow">Settled volume</span>
          <strong>{formatCompactCurrency(market.totalValue)}</strong>
          <span>Total market volume recorded at close</span>
        </article>
      </div>
    </section>
  );
}

function MarketPositionPanel({
  isAuthenticated,
  isError,
  isLoading,
  market,
  onRetry,
  position,
  tradeDestination,
}: {
  isAuthenticated: boolean;
  isError: boolean;
  isLoading: boolean;
  market: MarketDto;
  onRetry: () => void;
  position?: MarketUserPositionDto;
  tradeDestination: string;
}) {
  const hasExposure = hasMarketExposure(position);
  const yesLabel = getOutcomeLabel(market, "YES");
  const noLabel = getOutcomeLabel(market, "NO");
  const isResolvedMarket = market.status === "RESOLVED";
  const resolvedOutcomeLabel = market.resolvedOutcome
    ? getOutcomeLabel(market, market.resolvedOutcome)
    : "Awaiting resolution";
  const realizedPayout = position?.realizedPayout ?? 0;
  const realizedNetPnl = position?.realizedNetPnl ?? 0;
  const resultToneClass =
    realizedNetPnl > 0
      ? "market-position-card-positive"
      : realizedNetPnl < 0
        ? "market-position-card-negative"
        : "market-position-card-neutral";

  if (!isAuthenticated) {
    return (
      <section className="market-position-panel app-panel-subtle overflow-hidden">
        <div className="market-position-shell">
          <div className="market-position-header">
            <div>
              <p className="eyebrow">Your market ledger</p>
              <h2 className="type-heading-sm mt-3 uppercase">
                Sign in to track this market
              </h2>
            </div>
            <span className="market-position-status">Private desk view</span>
          </div>

          <p className="market-position-copy">
            Once you enter the desk, this panel will show your invested {FCoinName},
            outcome exposure, and payout view for this exact market.
          </p>

          <div className="market-position-grid">
            <article className="market-position-card market-position-card-primary">
              <span className="eyebrow">Track investment</span>
              <strong>Live exposure</strong>
              <span>See how much of your desk is riding on this market.</span>
            </article>
            <article className="market-position-card">
              <span className="eyebrow">See settlement</span>
              <strong>Clear payout view</strong>
              <span>Know what each closing outcome would return to you.</span>
            </article>
          </div>

          <Link
            className="action-primary market-position-cta no-underline"
            to={tradeDestination}
          >
            Sign in to unlock your ledger
          </Link>
        </div>
      </section>
    );
  }

  if (isLoading && !position) {
    return (
      <section className="market-position-panel app-panel-subtle overflow-hidden">
        <div className="market-position-shell">
          <div className="market-position-loading">
            <div className="market-position-loading-block h-4 w-36" />
            <div className="market-position-loading-block h-16 w-full" />
            <div className="market-position-loading-grid">
              <div className="market-position-loading-block h-28 w-full" />
              <div className="market-position-loading-block h-28 w-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="market-position-panel app-panel-subtle overflow-hidden">
        <div className="market-position-shell">
          <div className="market-position-header">
            <div>
              <p className="eyebrow">Your market ledger</p>
              <h2 className="type-heading-sm mt-3 uppercase">
                Position data is temporarily unavailable
              </h2>
            </div>
            <span className="market-position-status">Retry needed</span>
          </div>

          <p className="market-position-copy">
            The new market position endpoint did not return a usable response yet.
            Retry this panel without losing the rest of the market screen.
          </p>

          <button className="action-secondary market-position-cta" onClick={onRetry} type="button">
            Retry position data
          </button>
        </div>
      </section>
    );
  }

  if (!position) {
    return null;
  }

  return (
    <section className="market-position-panel app-panel-subtle overflow-hidden">
      <div className="market-position-shell">
        <div className="market-position-header">
          <div>
            <p className="eyebrow">
              {isResolvedMarket ? "Your settled slip" : "Your market ledger"}
            </p>
            <h2 className="type-heading-sm mt-3 uppercase">
              {isResolvedMarket
                ? hasExposure
                  ? "Your position has closed"
                  : "No position was booked here"
                : hasExposure
                  ? "Your exposure is live"
                  : "No live position yet"}
            </h2>
          </div>
          <span className="market-position-status">
            {isResolvedMarket ? "Resolved market" : `${position.tradeCount} trade${position.tradeCount === 1 ? "" : "s"}`}
          </span>
        </div>

        {isResolvedMarket ? (
          <>
            <div className="market-position-hero">
              <span className="eyebrow">Settled payout</span>
              <strong>{formatFCoinAmount(realizedPayout)}</strong>
              <p>
                {hasExposure
                  ? `Resolved to ${resolvedOutcomeLabel}. This reflects the actual payout returned after settlement.`
                  : "You did not hold a position when this market settled."}
              </p>
            </div>

            <div className="market-position-grid">
              <article className="market-position-card">
                <span className="eyebrow">Total invested</span>
                <strong>{formatFCoinAmount(position.totalInvested)}</strong>
                <span>Combined cost basis across every fill in this market.</span>
              </article>
              <article className={`market-position-card ${resultToneClass}`}>
                <span className="eyebrow">Net result</span>
                <strong>{formatFCoinDelta(realizedNetPnl)}</strong>
                <span>
                  {realizedNetPnl > 0
                    ? "You closed this market in profit."
                    : realizedNetPnl < 0
                      ? "This market settled below your cost basis."
                      : "This market closed flat against your cost basis."}
                </span>
              </article>
            </div>
          </>
        ) : (
          <>
            <div className="market-position-hero">
              <span className="eyebrow">Current investment</span>
              <strong>{formatFCoinAmount(position.totalInvested)}</strong>
              <p>
                {hasExposure
                  ? `You are currently holding ${formatShareCount(position.yesSharesHeld + position.noSharesHeld)} across this market.`
                  : "No orders have been filled here yet. Once you trade, this ledger will track your exposure and closing payout view."}
              </p>
            </div>

            <div className="market-position-grid">
              <article className="market-position-card market-position-card-primary">
                <span className="eyebrow">{yesLabel} closes</span>
                <strong>{formatFCoinAmount(position.projectedPayoutIfYes)}</strong>
                <span>
                  {formatShareCount(position.yesSharesHeld)} held ·{" "}
                  {formatProbability(position.currentYesChance)} live chance
                </span>
              </article>
              <article className="market-position-card">
                <span className="eyebrow">{noLabel} closes</span>
                <strong>{formatFCoinAmount(position.projectedPayoutIfNo)}</strong>
                <span>
                  {formatShareCount(position.noSharesHeld)} held ·{" "}
                  {formatProbability(position.currentNoChance)} live chance
                </span>
              </article>
            </div>
          </>
        )}

        <div className="market-position-detail-grid">
          <article className="market-position-metric">
            <span className="eyebrow">Invested on {yesLabel}</span>
            <strong>{formatFCoinAmount(position.totalYesInvested)}</strong>
          </article>
          <article className="market-position-metric">
            <span className="eyebrow">Invested on {noLabel}</span>
            <strong>{formatFCoinAmount(position.totalNoInvested)}</strong>
          </article>
          <article className="market-position-metric">
            <span className="eyebrow">Last activity</span>
            <strong>{formatLedgerTimestamp(position.lastTradeAt)}</strong>
          </article>
        </div>

        <div className="market-position-footer">
          <div>
            <span className="eyebrow">Trade activity</span>
            <p>
              {position.tradeCount > 0
                ? `${position.tradeCount} fill${position.tradeCount === 1 ? "" : "s"} since ${formatLedgerTimestamp(position.firstTradeAt)}`
                : "No fills recorded on this market yet."}
            </p>
          </div>

          {position.trades.length > 0 ? (
            <div className="market-position-trade-stack">
              {position.trades.slice(0, 2).map((trade) => (
                <div key={trade.tradeId} className="market-position-trade-pill">
                  <span>{getOutcomeLabel(market, trade.outcome)}</span>
                  <strong>{formatFCoinAmount(trade.cost)}</strong>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function buildDescriptionBlocks(market: MarketDto) {
  const category = getMarketCategory(market.category);
  const liveOutcomeSummary = market.outcomes
    .map(
      (outcome) =>
        `${outcome.label} at ${formatProbability(outcome.probability)}`,
    )
    .join(", ");

  return [
    `${market.marketName} is loaded from the live market detail endpoint with category ${category}, status ${market.status}, and reported volume ${formatCompactCurrency(market.totalValue)}.`,
    market.resolvedOutcome
      ? `The current payload marks this market as resolved to ${market.resolvedOutcome}. The outcome snapshot right now is ${liveOutcomeSummary}.`
      : `The current payload marks this market as open. The live outcome snapshot right now is ${liveOutcomeSummary}.`,
    "Resolution notes, supporting links, and historical commentary are still placeholder content on this screen until the backend exposes richer market-detail fields.",
  ];
}

function getLeadOutcome(outcomes: MarketOutcomeDto[]) {
  return outcomes.reduce<MarketOutcomeDto | undefined>((top, outcome) => {
    if (!top || outcome.probability > top.probability) {
      return outcome;
    }

    return top;
  }, undefined);
}

function getResolvedLabel(market: MarketDto) {
  if (!market.resolvedOutcome) {
    return "Awaiting resolution";
  }

  const resolvedOutcome = market.outcomes.find(
    (outcome) => outcome.outcomeId === market.resolvedOutcome,
  );

  return `Resolved to ${resolvedOutcome?.label ?? market.resolvedOutcome}`;
}

function normalizeAmountInput(value: string) {
  const sanitized = value.replace(/[^\d.]/g, "");

  if (!sanitized) {
    return "";
  }

  const [whole = "", ...decimalParts] = sanitized.split(".");
  const decimals = decimalParts.join("").slice(0, 2);

  if (sanitized.includes(".")) {
    return `${whole}.${decimals}`;
  }

  return whole;
}

function parseAmountInput(value: string) {
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatAmountInput(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "";
  }

  return value.toFixed(2).replace(/\.?0+$/, "");
}

function shortenMarketId(marketId: string) {
  if (marketId.length <= 16) {
    return marketId;
  }

  return `${marketId.slice(0, 8)}...${marketId.slice(-4)}`;
}

function ChartHistoryLoading() {
  return (
    <div className="market-chart-loading">
      <div className="market-chart-loading-block h-5 w-40" />
      <div className="market-chart-loading-block h-28 w-full" />
      <div className="market-chart-loading-grid">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="market-chart-loading-block h-full w-full"
          />
        ))}
      </div>
    </div>
  );
}

function ChartHistoryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="market-chart-state">
      <p className="eyebrow">History unavailable</p>
      <h2 className="type-heading-sm mt-3 uppercase">
        We could not load this chart
      </h2>
      <p className="mt-4 max-w-xl text-[color:var(--text-muted)]">
        The history endpoint did not return a usable graph snapshot yet. Retry
        the chart request while keeping the rest of the market page visible.
      </p>
      <button className="action-secondary mt-6" onClick={onRetry} type="button">
        Retry chart
      </button>
    </div>
  );
}

function ChartHistoryEmpty() {
  return (
    <div className="market-chart-state">
      <p className="eyebrow">No history yet</p>
      <h2 className="type-heading-sm mt-3 uppercase">
        The chart is waiting for its first point
      </h2>
      <p className="mt-4 max-w-xl text-[color:var(--text-muted)]">
        This market detail loaded, but the backend has not returned any history
        points for the selected range yet.
      </p>
    </div>
  );
}

function getChartStatus({
  hasHistory,
  isHistoryLoading,
  isStreamEnabled,
  streamStatus,
}: {
  hasHistory: boolean;
  isHistoryLoading: boolean;
  isStreamEnabled: boolean;
  streamStatus:
    | "idle"
    | "connecting"
    | "live"
    | "reconnecting"
    | "live-delayed";
}) {
  if (isHistoryLoading && !hasHistory) {
    return {
      label: "Loading history",
      toneClass: "market-live-badge-loading",
    };
  }

  if (!isStreamEnabled) {
    return {
      label: "Snapshot mode",
      toneClass: "market-live-badge-idle",
    };
  }

  switch (streamStatus) {
    case "live":
      return { label: "Live", toneClass: "market-live-badge-live" };
    case "reconnecting":
      return {
        label: "Reconnecting...",
        toneClass: "market-live-badge-warning",
      };
    case "live-delayed":
      return {
        label: "Live delayed",
        toneClass: "market-live-badge-warning",
      };
    case "connecting":
      return {
        label: "Connecting live...",
        toneClass: "market-live-badge-loading",
      };
    case "idle":
    default:
      return { label: "Snapshot mode", toneClass: "market-live-badge-idle" };
  }
}

function formatRelativeTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  }).format(date);
}

function formatLedgerTimestamp(timestamp: string | null) {
  if (!timestamp) {
    return "No activity";
  }

  return formatRelativeTimestamp(timestamp);
}

function getOutcomeLabel(
  market: MarketDto,
  outcomeId: MarketOutcomeDto["outcomeId"],
) {
  return (
    market.outcomes.find((outcome) => outcome.outcomeId === outcomeId)?.label ??
    outcomeId
  );
}

function hasMarketExposure(position?: MarketUserPositionDto) {
  if (!position) {
    return false;
  }

  return (
    position.tradeCount > 0 ||
    position.totalInvested > 0 ||
    position.yesSharesHeld > 0 ||
    position.noSharesHeld > 0
  );
}

function formatShareCount(value: number) {
  const shares = Number.isFinite(value) ? value : 0;
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 3,
    minimumFractionDigits: shares > 0 && shares < 1 ? 3 : 0,
  }).format(shares);

  return `${formatted} share${shares === 1 ? "" : "s"}`;
}
