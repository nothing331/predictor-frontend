import type { MarketHistoryPoint } from "@/api/market";

export type MarketHistoryRangePreset = "1D" | "1W" | "1M" | "ALL";

export const marketHistoryRangeOptions: Array<{
  id: MarketHistoryRangePreset;
  label: string;
}> = [
  { id: "1D", label: "1D" },
  { id: "1W", label: "1W" },
  { id: "1M", label: "1M" },
  { id: "ALL", label: "All" },
];

export function getMarketHistoryParams(rangePreset: MarketHistoryRangePreset) {
  const now = new Date();

  switch (rangePreset) {
    case "1D":
      return {
        from: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        limit: 400,
        to: now.toISOString(),
      };
    case "1W":
      return {
        from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        limit: 700,
        to: now.toISOString(),
      };
    case "1M":
      return {
        from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        limit: 1000,
        to: now.toISOString(),
      };
    case "ALL":
    default:
      return {
        limit: 1000,
      };
  }
}

export function buildHistoryPointKey(
  point: Pick<MarketHistoryPoint, "eventType" | "timestamp" | "tradeId">,
) {
  if (point.tradeId) {
    return `trade:${point.tradeId}`;
  }

  return `${point.eventType}:${point.timestamp}`;
}

export function mergeMarketHistoryPoints(
  historyPoints: MarketHistoryPoint[],
  livePoints: MarketHistoryPoint[],
) {
  return [...historyPoints, ...livePoints].sort(
    (left, right) =>
      new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime(),
  );
}

export function getLatestHistoryPoint(points: MarketHistoryPoint[]) {
  return points[points.length - 1] ?? null;
}
