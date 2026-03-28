import { apiClient } from "./client";

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
};

export type CurrentUserResponse = {
  userId: string;
  email: string | null;
  name: string | null;
  pictureUrl: string | null;
  balance: number;
  role: "ADMIN" | "USER";
  giftAvailable: boolean;
  nextGiftAt: string | null;
};

export async function loginWithGoogle(idToken: string) {
  const { data } = await apiClient.post<TokenResponse>("/v1/auth/google", {
    tokenId: idToken,
  });
  return data;
}

export async function getCurrentUser() {
  const { data } = await apiClient.get<CurrentUserResponse>("/v1/auth/me");
  return data;
}
