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

export type CreateTradeRequest = {
  outcome: "YES" | "NO";
  amount: number;
};

export type CreateTradeResponse = {
  status: string;
  message: string;
  tradeId: string;
  sharesBought: number;
  cost: number;
  outcome: "YES" | "NO";
};

export type MarketHistoryPoint = {
  timestamp: string;
  yesProbability: number;
  noProbability: number;
  eventType: "INITIAL" | "TRADE" | "RESOLUTION";
  tradeId?: string;
  outcome?: "YES" | "NO";
  sharesBought?: number;
  cost?: number;
};

export type MarketHistoryResponse = {
  marketId: string;
  status: "OPEN" | "RESOLVED";
  points: MarketHistoryPoint[];
};

export type GetMarketHistoryParams = {
  from?: string;
  to?: string;
  limit?: number;
};

export async function getMarkets(status: "OPEN" | "RESOLVED" = "OPEN") {
  const { data } = await apiClient.get<MarketDto[]>("/v1/markets", {
    params: { status },
  });
  return data;
}

export async function getMarketById(marketId: string) {
  const { data } = await apiClient.get<MarketDto>(
    `/v1/markets/${encodeURIComponent(marketId)}`,
  );
  return data;
}

export async function getMarketHistory(
  marketId: string,
  params?: GetMarketHistoryParams,
) {
  const { data } = await apiClient.get<MarketHistoryResponse>(
    `/v1/markets/${encodeURIComponent(marketId)}/history`,
    {
      params,
    },
  );
  return data;
}

export async function createTrade(marketId: string, payload: CreateTradeRequest) {
  const { data } = await apiClient.post<CreateTradeResponse>(
    `/v1/markets/${encodeURIComponent(marketId)}/trades`,
    payload,
  );
  return data;
}

export async function createMarket(payload: CreateMarketRequest) {
  const { data } = await apiClient.post<CreateMarketResponse>("/v1/markets", payload);
  return data;
}
