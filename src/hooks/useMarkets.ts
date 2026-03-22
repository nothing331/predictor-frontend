import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTrade,
  createMarket,
  getMarketById,
  getMarkets,
  type CreateTradeRequest,
  type CreateMarketRequest,
} from "@/api/market";
import { ErrorStore } from "@/store/errorStore";

export function useMarkets(status: "OPEN" | "RESOLVED" = "OPEN") {
  return useQuery({
    queryKey: ["markets", { status }],
    queryFn: () => getMarkets(status),
  });
}

export function useMarket(marketId: string) {
  return useQuery({
    enabled: !!marketId,
    queryKey: ["market", marketId],
    queryFn: () => getMarketById(marketId),
  });
}

export function useCreateMarket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMarketRequest) => createMarket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["markets"] });
      ErrorStore.getState().pushToast({
        title: "Market created",
        message: "Your market is now live on the board.",
        tone: "info",
      });
    },
  });
}

export function useCreateTrade(marketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTradeRequest) => createTrade(marketId, payload),
    onSuccess: (trade) => {
      queryClient.invalidateQueries({ queryKey: ["market-history", marketId] });
      queryClient.invalidateQueries({ queryKey: ["markets"] });
      queryClient.invalidateQueries({ queryKey: ["market", marketId] });
      ErrorStore.getState().pushToast({
        title: "Trade executed",
        message: `Bought ${trade.sharesBought.toFixed(3)} shares of ${trade.outcome} for ${formatCurrency(trade.cost)}.`,
        tone: "info",
      });
    },
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(value);
}
