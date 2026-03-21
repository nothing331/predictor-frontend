import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMarket, getMarkets, type CreateMarketRequest } from "@/api/market";
import { ErrorStore } from "@/store/errorStore";

export function useMarkets(status: "OPEN" | "RESOLVED" = "OPEN") {
  return useQuery({
    queryKey: ["markets", { status }],
    queryFn: () => getMarkets(status),
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
