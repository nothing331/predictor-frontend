import { useEffect } from "react";
import { refreshAuthSession } from "@/api/client";
import { AuthStore } from "@/store/authStore";
import { isSessionAuthenticated } from "@/utils/auth";

export function useAuthBootstrap() {
  const accessToken = AuthStore((state) => state.accessToken);
  const refreshToken = AuthStore((state) => state.refreshToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const hasHydrated = AuthStore((state) => state.hasHydrated);
  const isRefreshing = AuthStore((state) => state.isRefreshing);
  const logout = AuthStore((state) => state.logout);
  const setRefreshing = AuthStore((state) => state.setRefreshing);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);

  useEffect(() => {
    if (!hasHydrated || isAuthenticated || isRefreshing) {
      return;
    }

    if (!refreshToken) {
      if (accessToken || expiresAt) {
        logout();
      }
      return;
    }

    let isActive = true;
    setRefreshing(true);

    void refreshAuthSession()
      .catch(() => undefined)
      .finally(() => {
        if (!isActive) {
          return;
        }

        setRefreshing(false);
      });

    return () => {
      isActive = false;
    };
  }, [
    accessToken,
    expiresAt,
    hasHydrated,
    isAuthenticated,
    isRefreshing,
    logout,
    refreshToken,
    setRefreshing,
  ]);
}
