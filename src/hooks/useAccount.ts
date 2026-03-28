import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  claimGift,
  getAccountSummary,
  type AccountSummaryDto,
} from "@/api/account";
import { getCurrentUserMarketPosition } from "@/api/market";
import { getCurrentUser, type CurrentUserResponse } from "@/api/auth";
import { AuthStore } from "@/store/authStore";
import { ErrorStore } from "@/store/errorStore";
import {
  getSessionRole,
  hasApiBackedSession,
  isSessionAuthenticated,
  normalizeProfile,
} from "@/utils/auth";
import { formatFCoinAmount } from "@/utils/currency";

function useAuthenticatedSessionState() {
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);

  return {
    hasApiSession: isAuthenticated && hasApiBackedSession(accessToken),
    isAuthenticated,
  };
}

export function useCurrentUserBootstrap() {
  const saveProfile = AuthStore((state) => state.saveProfile);
  const setRole = AuthStore((state) => state.setRole);
  const query = useCurrentUserStatus();

  useEffect(() => {
    if (!query.data) {
      return;
    }

    saveProfile(
      normalizeProfile({
        balance: query.data.balance,
        email: query.data.email ?? undefined,
        name: query.data.name ?? undefined,
        pictureUrl: query.data.pictureUrl ?? undefined,
        userId: query.data.userId ?? undefined,
      }),
    );
    setRole(getSessionRole(query.data.role));
  }, [query.data, saveProfile, setRole]);

  return query;
}

export function useCurrentUserStatus() {
  const { hasApiSession } = useAuthenticatedSessionState();

  return useQuery({
    enabled: hasApiSession,
    queryKey: ["auth", "me"],
    queryFn: () => getCurrentUser(),
  });
}

export function useAccountSummary() {
  const { hasApiSession } = useAuthenticatedSessionState();

  return useQuery({
    enabled: hasApiSession,
    queryKey: ["account", "summary"],
    queryFn: () => getAccountSummary(),
  });
}

export function useMarketPosition(marketId: string) {
  const { hasApiSession } = useAuthenticatedSessionState();

  return useQuery({
    enabled: hasApiSession && !!marketId,
    queryKey: ["market-position", marketId],
    queryFn: () => getCurrentUserMarketPosition(marketId),
  });
}

export function useGiftClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => claimGift(),
    onSuccess: (gift) => {
      queryClient.setQueryData<CurrentUserResponse | undefined>(
        ["auth", "me"],
        (current) =>
          current
            ? {
                ...current,
                balance: gift.balance,
                giftAvailable: gift.giftAvailable,
                nextGiftAt: gift.nextGiftAt,
              }
            : current,
      );
      queryClient.setQueryData<AccountSummaryDto | undefined>(
        ["account", "summary"],
        (current) =>
          current
            ? {
                ...current,
                availableBalance: gift.balance,
              }
            : current,
      );

      const authState = AuthStore.getState();

      if (authState.profile) {
        authState.saveProfile(
          normalizeProfile({
            ...authState.profile,
            balance: gift.balance,
          }),
        );
      }

      void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      void queryClient.invalidateQueries({ queryKey: ["account", "summary"] });

      ErrorStore.getState().pushToast({
        title: gift.claimed ? "Gift claimed" : "Gift cooling down",
        message: gift.claimed
          ? `${formatFCoinAmount(gift.claimedAmount, {
              maximumFractionDigits: 0,
            })} was added to your desk balance.`
          : gift.nextGiftAt
            ? "Your next gift is still on cooldown."
            : "Your next gift is not available yet.",
        tone: "info",
      });
    },
  });
}
