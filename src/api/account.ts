import { apiClient } from "./client";

export type AccountSummaryMarketDto = {
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

export type AccountSummaryDto = {
  userId: string;
  availableBalance: number;
  recentMarkets: AccountSummaryMarketDto[];
};

export type GiftClaimResponse = {
  balance: number;
  claimedAmount: number;
  claimed: boolean;
  lastClaimedAt: string | null;
  nextGiftAt: string | null;
  giftAvailable: boolean;
};

export async function getAccountSummary() {
  const { data } = await apiClient.get<AccountSummaryDto>("/v1/users/me/summary");
  return data;
}

export async function claimGift() {
  const { data } = await apiClient.post<GiftClaimResponse>(
    "/v1/users/me/gift-claim",
  );
  return data;
}
