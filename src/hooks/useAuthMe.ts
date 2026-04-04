import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAuthMe } from "@/api/auth";
import { AuthStore } from "@/store/authStore";
import { isSessionAuthenticated } from "@/utils/auth";

export function useAuthMe() {
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const saveUserData = AuthStore((state) => state.saveUserData);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);

  const query = useQuery({
    enabled: isAuthenticated,
    queryKey: ["auth-me"],
    queryFn: fetchAuthMe,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!query.data) return;

    const { balance, role, giftAvailable, nextGiftAt, name, email, pictureUrl } =
      query.data;

    saveUserData({
      balance,
      role,
      giftAvailable,
      nextGiftAt,
      profile: name ? { name, email, pictureUrl } : undefined,
    });
  }, [query.data, saveUserData]);

  return query;
}
