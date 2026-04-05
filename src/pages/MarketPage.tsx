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
import AppHeader from "../components/AppHeader";
import SiteFooter from "../components/SiteFooter";

const quickAmounts = [
  { amount: 1, label: "+\u01921" },
  { amount: 5, label: "+\u01925" },
  { amount: 10, label: "+\u019210" },
  { amount: 100, label: "+\u0192100" },
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
  const { data: position } = useMarketPosition(marketId);
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
        <AppHeader />

        <main className="grid gap-5 md:gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 space-y-5 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <Link
                  className="eyebrow text-[inherit] no-underline flex items-center gap-1"
                  to="/"
                >
                  <span className="material-symbols-outlined text-[1rem]">arrow_back</span>
                  All markets
                </Link>
                <span className="eyebrow">{category}</span>
                <span className="eyebrow">
                  {market.status === "OPEN" ? "Open" : "Resolved"}
                </span>
              </div>

              <div className="flex items-start gap-3 md:gap-5">
                <span className="flex h-10 w-10 md:h-16 md:w-16 flex-none items-center justify-center rounded-xl md:rounded-2xl bg-primary text-[#16130f]">
                  <span className="material-symbols-outlined text-[1.25rem] md:text-[2rem]">
                    {marketIcon}
                  </span>
                </span>

                <div className="min-w-0">
                  <h1 className="display-title">{market.marketName}</h1>
                </div>
              </div>
            </div>

            <section className="app-panel-subtle overflow-hidden px-3.5 py-4 md:px-8 md:py-8">
              <div className="mb-4 md:mb-6 flex flex-wrap items-start justify-between gap-3 md:gap-4">
                <div className="space-y-2 md:space-y-3">
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

              <div className="chart-surface h-52 w-full md:h-[26rem]">
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

              <div className="mt-3 md:mt-4 flex flex-wrap items-center justify-between gap-3 md:gap-4">
                <span className="muted-copy type-body-sm">
                  {formatCompactCurrency(market.totalValue)} volume
                </span>

                <div className="flex flex-wrap gap-1.5 md:gap-2">
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

            <section className="app-panel-subtle overflow-hidden">
              <div className="surface-line type-body-sm grid grid-cols-[minmax(0,1fr)_80px] md:grid-cols-[minmax(0,1fr)_120px] gap-3 md:gap-4 px-3.5 py-3 md:px-8 md:py-4">
                <span className="eyebrow">Outcome</span>
                <span className="eyebrow text-center">Chance</span>
              </div>

              {market.outcomes.map((outcome, index) => (
                <article
                  key={outcome.outcomeId}
                  className="surface-line last:border-b-0 grid grid-cols-[minmax(0,1fr)_80px] md:grid-cols-[minmax(0,1fr)_120px] items-center gap-3 md:gap-4 px-3.5 py-3.5 md:px-8 md:py-5"
                >
                  <div className="flex min-w-0 items-center gap-3 md:gap-4">
                    <span
                      className="flex h-8 w-8 md:h-11 md:w-11 flex-none items-center justify-center rounded-full text-[color:var(--text-strong)]"
                      style={{
                        background:
                          "color-mix(in srgb, var(--surface-soft) 78%, transparent)",
                      }}
                    >
                      <span className="material-symbols-outlined text-[1.25rem]">
                        {getOutcomeIcon(outcome.outcomeId, index)}
                      </span>
                    </span>

                    <div className="min-w-0">
                      <p className="type-body-lg truncate font-medium">
                        {outcome.label}
                      </p>
                      <div
                        className={`mt-2 h-[2px] w-14 rounded-full ${
                          index === 0 ? "bg-primary" : "bg-secondary"
                        }`}
                      />
                    </div>
                  </div>

                  <span className="type-heading-sm text-center font-mono font-semibold">
                    {formatProbability(outcome.probability)}
                  </span>
                </article>
              ))}
            </section>
          </section>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <section className="app-panel-subtle overflow-hidden">
              <div className="px-3.5 py-4 md:px-6 md:py-6">
                <div className="mb-4 md:mb-5 flex items-start gap-3 md:gap-4">
                  <span className="flex h-10 w-10 md:h-14 md:w-14 flex-none items-center justify-center rounded-xl md:rounded-2xl bg-primary text-[#16130f]">
                    <span className="material-symbols-outlined text-[1.25rem] md:text-[2rem]">
                      {marketIcon}
                    </span>
                  </span>

                  <div>
                    <p className="muted-copy type-body-sm">{market.marketName}</p>
                    <p className="type-heading-sm mt-1 md:mt-2 text-primary">
                      {market.status === "OPEN"
                        ? `Buy ${leadOutcome?.label ?? "Outcome"}`
                        : resolvedLabel}
                    </p>
                  </div>
                </div>

                <div className="mb-4 md:mb-5 grid grid-cols-2 gap-2 md:gap-3">
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

                <label className="mb-4 md:mb-5 block">
                  <span className="eyebrow mb-2 md:mb-3 block">Amount</span>
                  <div className="app-panel-subtle field-shell trade-amount-shell">
                    <span className="trade-amount-prefix">{"\u0192"}</span>
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

                <div className="mb-4 md:mb-5 flex flex-wrap gap-1.5 md:gap-2">
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

                {isAuthenticated && position && position.tradeCount > 0 ? (
                  <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[1.25rem]">trending_up</span>
                      <p className="type-heading-sm uppercase">Your Position</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="app-panel-subtle px-4 py-3"
                        style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent)" }}
                      >
                        <p className="eyebrow mb-1">Invested</p>
                        <p className="type-heading-md font-mono font-bold">
                          {"\u0192"}{position.totalInvested.toFixed(2)}
                        </p>
                      </div>

                      <div className="app-panel-subtle px-4 py-3"
                        style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--color-secondary) 12%, transparent), transparent)" }}
                      >
                        <p className="eyebrow mb-1">Trades</p>
                        <p className="type-heading-md font-mono font-bold">
                          {position.tradeCount}
                        </p>
                      </div>
                    </div>

                    {position.yesSharesHeld > 0 ? (
                      <div className="app-panel-subtle px-4 py-3 flex items-center justify-between"
                        style={{ borderLeft: "4px solid var(--color-primary)" }}
                      >
                        <div>
                          <p className="eyebrow mb-1">Yes shares</p>
                          <p className="type-body-lg font-mono font-bold">{position.yesSharesHeld.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="eyebrow mb-1">Payout</p>
                          <p className="type-body-lg font-mono font-bold text-primary">{"\u0192"}{position.projectedPayoutIfYes.toFixed(2)}</p>
                        </div>
                      </div>
                    ) : null}

                    {position.noSharesHeld > 0 ? (
                      <div className="app-panel-subtle px-4 py-3 flex items-center justify-between"
                        style={{ borderLeft: "4px solid var(--color-secondary)" }}
                      >
                        <div>
                          <p className="eyebrow mb-1">No shares</p>
                          <p className="type-body-lg font-mono font-bold">{position.noSharesHeld.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="eyebrow mb-1">Payout</p>
                          <p className="type-body-lg font-mono font-bold text-secondary">{"\u0192"}{position.projectedPayoutIfNo.toFixed(2)}</p>
                        </div>
                      </div>
                    ) : null}

                    {position.realizedNetPnl !== null ? (
                      <div className={`app-panel-subtle px-4 py-3 text-center ${position.realizedNetPnl >= 0 ? "status-positive" : "status-negative"}`}
                        style={{ borderLeft: `4px solid ${position.realizedNetPnl >= 0 ? "var(--color-accent-green)" : "var(--color-accent-red)"}` }}
                      >
                        <p className="eyebrow mb-1">Realized P&L</p>
                        <p className="type-heading-md font-mono font-bold">
                          {position.realizedNetPnl >= 0 ? "+" : ""}{"\u0192"}{position.realizedNetPnl.toFixed(2)}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}
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

        {market.description ? (
          <section className="section-divider mt-6 pt-5 md:mt-10 md:pt-8">
            <div className="app-panel-subtle px-3.5 py-4 md:px-8 md:py-8">
              <p className="eyebrow mb-2 md:mb-3">About this market</p>
              <h2 className="section-title mb-3 md:mb-5">Resolution rules</h2>

              <p className="max-w-4xl leading-relaxed text-[color:var(--text-muted)]">
                {market.description}
              </p>
            </div>
          </section>
        ) : null}

        <SiteFooter />
      </div>
    </div>
  );
}

function MarketPageSkeleton() {
  return (
    <div className="page-shell">
      <div className="page-content">
        <AppHeader />

        <main className="grid gap-5 md:gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-5 md:space-y-8">
            <div className="app-panel-subtle h-28 md:h-40 animate-pulse" />
            <div className="app-panel-subtle h-64 md:h-[34rem] animate-pulse" />
            <div className="app-panel-subtle h-40 md:h-[24rem] animate-pulse" />
          </section>
          <aside className="app-panel-subtle h-72 md:h-[32rem] animate-pulse" />
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
          <p className="eyebrow">Error</p>
          <h1 className="type-heading-sm mt-3 uppercase">
            Could not load this market
          </h1>
          <p className="mt-4 max-w-2xl text-[color:var(--text-muted)]">
            Something went wrong. Please try again or go back.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="action-secondary" type="button" onClick={onRetry}>
              Retry detail
            </button>
            <Link className="chip chip-soft text-[inherit] no-underline" to="/">
              All markets
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
          <p className="eyebrow">Not found</p>
          <h1 className="type-heading-sm mt-3 uppercase">
            Market not found
          </h1>
          <p className="mt-4 max-w-2xl text-[color:var(--text-muted)]">
            {marketId
              ? "This market doesn't exist or may have been removed."
              : "No market was specified in the URL."}
          </p>
          <Link className="action-secondary mt-6 inline-flex no-underline" to="/">
            All markets
          </Link>
        </section>
      </div>
    </div>
  );
}


function getOutcomeIcon(outcomeId: string, index: number) {
  if (outcomeId === "YES") return "trending_up";
  if (outcomeId === "NO") return "trending_down";
  return index === 0 ? "trending_up" : "trending_down";
}

function MarketPositionPanel({
  isAuthenticated,
  onRetry,
  position,
  tradeDestination,
  isError,
  isLoading,
}: {
  isAuthenticated: boolean;
  market?: MarketDto;
  onRetry: () => void;
  position?: MarketUserPositionDto;
  tradeDestination: string;
  isError: boolean;
  isLoading: boolean;
}) {
  if (!isAuthenticated) {
    return (
      <section className="app-panel-subtle overflow-hidden px-3.5 py-4 md:px-6 md:py-6 mt-5">
        <p className="eyebrow mb-2">Your position</p>
        <p className="type-body-sm text-[color:var(--text-muted)] mb-4">
          Sign in to see your position in this market.
        </p>
        <Link className="action-secondary w-full justify-center no-underline" to={tradeDestination}>
          Sign in
        </Link>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="app-panel-subtle overflow-hidden px-3.5 py-4 md:px-6 md:py-6 mt-5 animate-pulse">
        <div className="h-4 w-24 bg-[var(--surface-soft)] rounded mb-4" />
        <div className="h-16 w-full bg-[var(--surface-soft)] rounded" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="app-panel-subtle overflow-hidden px-3.5 py-4 md:px-6 md:py-6 mt-5">
        <p className="eyebrow mb-2">Position error</p>
        <p className="type-body-sm text-[color:var(--text-muted)] mb-4">
          Could not load your position.
        </p>
        <button className="action-secondary" type="button" onClick={onRetry}>
          Retry
        </button>
      </section>
    );
  }

  if (!position || position.tradeCount === 0) {
    return null;
  }

  return (
    <section className="app-panel-subtle overflow-hidden px-3.5 py-4 md:px-6 md:py-6 mt-5">
      <p className="eyebrow mb-3">Your position</p>
      <div className="space-y-2 type-body-sm">
        <div className="flex justify-between">
          <span className="text-[color:var(--text-muted)]">Invested</span>
          <span className="font-mono font-semibold">{"\u0192"}{position.totalInvested.toFixed(2)}</span>
        </div>
        {position.yesSharesHeld > 0 ? (
          <div className="flex justify-between">
            <span className="text-[color:var(--text-muted)]">Yes shares</span>
            <span className="font-mono font-semibold">{position.yesSharesHeld.toFixed(2)}</span>
          </div>
        ) : null}
        {position.noSharesHeld > 0 ? (
          <div className="flex justify-between">
            <span className="text-[color:var(--text-muted)]">No shares</span>
            <span className="font-mono font-semibold">{position.noSharesHeld.toFixed(2)}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
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
      <p className="eyebrow">Error</p>
      <h2 className="type-heading-sm mt-3 uppercase">
        Could not load price history
      </h2>
      <p className="mt-4 max-w-xl text-[color:var(--text-muted)]">
        Please try again.
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
        No price history available
      </h2>
      <p className="mt-4 max-w-xl text-[color:var(--text-muted)]">
        Price history will appear here after the first trade.
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

