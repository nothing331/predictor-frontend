import { useQuery } from "@tanstack/react-query";
import { getMarketPosition } from "@/api/market";
import { AuthStore } from "@/store/authStore";
import { isSessionAuthenticated } from "@/utils/auth";

export function useMarketPosition(marketId: string) {
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);

  return useQuery({
    enabled: isAuthenticated && !!marketId,
    queryKey: ["market-position", marketId],
    queryFn: () => getMarketPosition(marketId),
    staleTime: 30 * 1000,
  });
}
