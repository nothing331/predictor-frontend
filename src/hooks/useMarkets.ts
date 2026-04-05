import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTrade,
  createMarket,
  resolveMarket,
  getMarketById,
  getMarkets,
  type CreateTradeRequest,
  type CreateMarketRequest,
  type ResolveMarketRequest,
} from "@/api/market";
import { AuthStore } from "@/store/authStore";
import { ErrorStore } from "@/store/errorStore";
import { isAdminSession } from "@/utils/auth";

export function useMarkets(status?: "OPEN" | "RESOLVED") {
  return useQuery({
    queryKey: ["markets", { status: status ?? "ALL" }],
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
    mutationFn: async (payload: CreateMarketRequest) => {
      if (!isAdminSession(AuthStore.getState().role)) {
        throw new Error("Admin access is required to create markets.");
      }

      return createMarket(payload);
    },
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
      queryClient.invalidateQueries({ queryKey: ["market-position", marketId] });
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      ErrorStore.getState().pushToast({
        title: "Trade executed",
        message: `Bought ${trade.sharesBought.toFixed(3)} shares of ${trade.outcome} for ${formatCurrency(trade.cost)}.`,
        tone: "info",
      });
    },
  });
}

export function useResolveMarket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      marketId,
      payload,
    }: {
      marketId: string;
      payload: ResolveMarketRequest;
    }) => resolveMarket(marketId, payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["markets"] });
      queryClient.invalidateQueries({ queryKey: ["market", result.marketId] });
      ErrorStore.getState().pushToast({
        title: "Market resolved",
        message: `Resolved to ${result.resolvedOutcome}.`,
        tone: "info",
      });
    },
  });
}

function formatCurrency(value: number) {
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
  return `\u0192${formatted}`;
}
