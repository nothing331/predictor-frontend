import { apiClient } from "./client";

export type RecentMarketSummary = {
  marketId: string;
  marketName: string;
  marketStatus: "OPEN" | "RESOLVED";
  lastTradedAt: string;
  resolvedOutcome: "YES" | "NO" | null;
  userYesShares: number;
  userNoShares: number;
  currentYesChance: number;
  currentNoChance: number;
  projectedPayoutIfYes: number;
  projectedPayoutIfNo: number;
};

export type UserSummaryResponse = {
  userId: string;
  availableBalance: number;
  recentMarkets: RecentMarketSummary[];
};

export async function getUserSummary() {
  const { data } = await apiClient.get<UserSummaryResponse>(
    "/v1/users/me/summary",
  );
  return data;
}
