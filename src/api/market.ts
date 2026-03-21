import { apiClient } from "./client";

// src/api/markets.ts
export type MarketOutcomeDto = {
  outcomeId: "YES" | "NO";
  label: string;
  probability: number;
};

export type MarketDto = {
  marketId: string;
  marketName: string;
  status: "OPEN" | "RESOLVED";
  resolvedOutcome: "YES" | "NO" | null;
  category?: string;
  outcomes: MarketOutcomeDto[];
  totalValue: number;
};

export type CreateMarketRequest = {
  name: string;
  description?: string;
  liquidity?: number;
  category?: string;
  yesLabel?: string;
  noLabel?: string;
};

export type CreateMarketResponse = {
  status: string;
  message: string;
  marketId: string;
};

export async function getMarkets(status: "OPEN" | "RESOLVED" = "OPEN") {
  const { data } = await apiClient.get<MarketDto[]>("/v1/markets", {
    params: { status },
  });
  return data;
}

export async function createMarket(payload: CreateMarketRequest) {
  const { data } = await apiClient.post<CreateMarketResponse>("/v1/markets", payload);
  return data;
}
