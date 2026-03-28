import { useQuery } from "@tanstack/react-query";
import { getMarketHistory } from "@/api/market";
import {
  getMarketHistoryParams,
  type MarketHistoryRangePreset,
} from "@/features/markets/marketHistory";

export function useMarketHistory(
  marketId: string,
  rangePreset: MarketHistoryRangePreset,
  enabled = true,
) {
  return useQuery({
    enabled: !!marketId && enabled,
    queryKey: ["market-history", marketId, rangePreset],
    queryFn: () => getMarketHistory(marketId, getMarketHistoryParams(rangePreset)),
  });
}
