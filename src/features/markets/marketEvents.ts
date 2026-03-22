import type { MarketHistoryPoint } from "@/api/market";

export type MarketCreatedEvent = {
  eventId: string;
  type: "MarketCreated";
  occurredAt: string;
  marketId: string;
  payload: {
    marketName: string;
  };
};

export type TradeExecutedEvent = {
  eventId: string;
  type: "TradeExecuted";
  occurredAt: string;
  marketId: string;
  payload: {
    tradeId: string;
    userId: string;
    outcome: "YES" | "NO";
    shareCount: number;
    cost: number;
    yesProbability: number;
    noProbability: number;
    qYes: number;
    qNo: number;
    status: "OPEN" | "RESOLVED";
  };
};

export type MarketResolvedEvent = {
  eventId: string;
  type: "MarketResolved";
  occurredAt: string;
  marketId: string;
  payload: {
    outcomeId: "YES" | "NO";
  };
};

export type DomainEvent =
  | MarketCreatedEvent
  | TradeExecutedEvent
  | MarketResolvedEvent;

export function parseDomainEvent(raw: string) {
  return JSON.parse(raw) as DomainEvent;
}

export function toHistoryPointFromTradeEvent(
  event: TradeExecutedEvent,
): MarketHistoryPoint {
  return {
    cost: event.payload.cost,
    eventType: "TRADE",
    noProbability: event.payload.noProbability,
    outcome: event.payload.outcome,
    sharesBought: event.payload.shareCount,
    timestamp: event.occurredAt,
    tradeId: event.payload.tradeId,
    yesProbability: event.payload.yesProbability,
  };
}
