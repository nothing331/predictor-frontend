export const MARKET_ROUTE_PATTERN = "/market/:marketId";

export function getMarketPath(marketId: string) {
  return `/market/${encodeURIComponent(marketId)}`;
}

export function parseMarketIdParam(marketId?: string) {
  if (!marketId) {
    return "";
  }

  try {
    return decodeURIComponent(marketId);
  } catch {
    return marketId;
  }
}
