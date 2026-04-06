import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserSummary } from "@/api/user";
import { getMarketPath } from "@/features/markets/marketRoutes";
import AppHeader from "@/components/AppHeader";
import GiftClaimButton from "@/components/GiftClaimButton";
import SiteFooter from "@/components/SiteFooter";
import { AuthStore } from "@/store/authStore";
import { isSessionAuthenticated } from "@/utils/auth";

export default function PortfolioPage() {
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const hasHydrated = AuthStore((state) => state.hasHydrated);
  const isRefreshing = AuthStore((state) => state.isRefreshing);
  const balance = AuthStore((state) => state.balance);
  const profile = AuthStore((state) => state.profile);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);

  const {
    data: summary,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    enabled: isAuthenticated,
    queryKey: ["user-summary"],
    queryFn: getUserSummary,
    staleTime: 60 * 1000,
  });

  if (!hasHydrated || isRefreshing) {
    return (
      <div className="page-shell">
        <div className="page-content">
          <AppHeader />
          <main className="space-y-5 md:space-y-8">
            <section className="app-panel-subtle h-36 md:h-40 animate-pulse" />
            <section className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="app-panel-subtle h-32 md:h-40 animate-pulse" />
              ))}
            </section>
          </main>
          <SiteFooter />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login?redirectTo=/portfolio" />;
  }

  return (
    <div className="page-shell">
      <div className="page-content">
        <AppHeader />

        <main className="space-y-5 md:space-y-8">
          <section className="app-panel-subtle px-3.5 py-4 md:px-8 md:py-8">
            <div className="flex flex-wrap items-start justify-between gap-4 md:gap-6">
              <div>
                <p className="eyebrow mb-1 md:mb-2">Welcome back</p>
                <h1 className="display-title">{profile?.name ?? "User"}</h1>
              </div>

              <div className="flex flex-col items-end gap-2 md:gap-3">
                <div className="text-right">
                  <p className="eyebrow mb-1">Balance</p>
                  <p className="type-value-md font-mono font-semibold text-primary">
                    {"\u0192"}
                    {(balance ?? summary?.availableBalance ?? 0).toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}
                  </p>
                </div>
                <GiftClaimButton />
              </div>
            </div>
          </section>

          <section>
            <h2 className="section-title mb-3 md:mb-5">Recent Positions</h2>

            {isLoading ? (
              <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={i}
                    className="app-panel-subtle animate-pulse h-32 md:h-40"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="app-panel-subtle px-3.5 py-4 md:px-5 md:py-6">
                <p className="text-[color:var(--text-muted)]">
                  Could not load your positions.
                </p>
                <button
                  className="action-secondary mt-3 md:mt-4"
                  type="button"
                  onClick={() => refetch()}
                >
                  Retry
                </button>
              </div>
            ) : summary && summary.recentMarkets.length > 0 ? (
              <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
                {summary.recentMarkets.map((market) => (
                  <Link
                    key={market.marketId}
                    className="app-panel-subtle px-3.5 py-3.5 md:px-5 md:py-5 text-[inherit] no-underline transition-transform duration-200 hover:-translate-y-1"
                    to={getMarketPath(market.marketId)}
                  >
                    <p className="eyebrow mb-1 md:mb-2">
                      {market.marketStatus === "OPEN" ? "Open" : "Resolved"}
                    </p>
                    <h3 className="type-body-lg font-semibold leading-snug mb-3 md:mb-4">
                      {market.marketName}
                    </h3>

                    <div className="space-y-1.5 md:space-y-2 type-body-sm">
                      {market.userYesShares > 0 ? (
                        <div className="flex justify-between gap-3">
                          <span className="text-[color:var(--text-muted)]">
                            Yes shares
                          </span>
                          <span className="font-mono font-semibold">
                            {market.userYesShares.toFixed(2)}
                          </span>
                        </div>
                      ) : null}

                      {market.userNoShares > 0 ? (
                        <div className="flex justify-between gap-3">
                          <span className="text-[color:var(--text-muted)]">
                            No shares
                          </span>
                          <span className="font-mono font-semibold">
                            {market.userNoShares.toFixed(2)}
                          </span>
                        </div>
                      ) : null}

                      <div className="flex justify-between gap-3">
                        <span className="text-[color:var(--text-muted)]">
                          Current odds
                        </span>
                        <span className="font-mono font-semibold">
                          {(market.currentYesChance * 100).toFixed(0)}% Yes
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="app-panel-subtle px-3.5 py-4 md:px-5 md:py-6">
                <p className="text-[color:var(--text-muted)]">
                  You haven't traded any markets yet. Browse markets to get
                  started.
                </p>
                <Link className="action-secondary mt-3 md:mt-4 inline-flex no-underline" to="/">
                  Browse markets
                </Link>
              </div>
            )}
          </section>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
