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
  description?: string;
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

export type ResolveMarketRequest = {
  outcomeId: "YES" | "NO";
};

export type ResolveMarketResponse = {
  status: string;
  message: string;
  marketId: string;
  resolvedOutcome: "YES" | "NO";
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

export type MarketUserTradeDto = {
  tradeId: string;
  outcome: "YES" | "NO";
  sharesBought: number;
  cost: number;
  tradedAt: string;
};

export type MarketUserPositionDto = {
  userId: string;
  marketId: string;
  marketName: string;
  marketStatus: "OPEN" | "RESOLVED";
  resolvedOutcome: "YES" | "NO" | null;
  currentYesChance: number;
  currentNoChance: number;
  yesSharesHeld: number;
  noSharesHeld: number;
  totalInvested: number;
  totalYesInvested: number;
  totalNoInvested: number;
  firstTradeAt: string | null;
  lastTradeAt: string | null;
  projectedPayoutIfYes: number;
  projectedPayoutIfNo: number;
  realizedPayout: number | null;
  realizedNetPnl: number | null;
  tradeCount: number;
  trades: MarketUserTradeDto[];
};

export type GetMarketHistoryParams = {
  from?: string;
  to?: string;
  limit?: number;
};

export async function getMarkets(status?: "OPEN" | "RESOLVED") {
  const { data } = await apiClient.get<MarketDto[]>("/v1/markets", {
    params: status ? { status } : undefined,
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

export async function getCurrentUserMarketPosition(marketId: string) {
  const { data } = await apiClient.get<MarketUserPositionDto>(
    `/v1/markets/${encodeURIComponent(marketId)}/me`,
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

export async function resolveMarket(
  marketId: string,
  payload: ResolveMarketRequest,
) {
  const { data } = await apiClient.post<ResolveMarketResponse>(
    `/v1/markets/${encodeURIComponent(marketId)}/resolve`,
    payload,
  );
  return data;
}

export async function createMarket(payload: CreateMarketRequest) {
  const { data } = await apiClient.post<CreateMarketResponse>("/v1/markets", payload);
  return data;
}

export type MarketPositionResponse = {
  userId: string;
  marketId: string;
  marketName: string;
  marketStatus: "OPEN" | "RESOLVED";
  resolvedOutcome: "YES" | "NO" | null;
  currentYesChance: number;
  currentNoChance: number;
  yesSharesHeld: number;
  noSharesHeld: number;
  totalInvested: number;
  totalYesInvested: number;
  totalNoInvested: number;
  projectedPayoutIfYes: number;
  projectedPayoutIfNo: number;
  realizedPayout: number | null;
  realizedNetPnl: number | null;
  tradeCount: number;
};

export async function getMarketPosition(marketId: string) {
  const { data } = await apiClient.get<MarketPositionResponse>(
    `/v1/markets/${encodeURIComponent(marketId)}/me`,
  );
  return data;
}
