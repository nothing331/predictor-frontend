import { apiClient } from "./client";

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
};

export type AuthMeResponse = {
  userId: string;
  email: string | null;
  name: string | null;
  pictureUrl: string | null;
  balance: number;
  role: "USER" | "ADMIN";
  giftAvailable: boolean;
  nextGiftAt: string | null;
};

export type GiftClaimResponse = {
  balance: number;
  claimedAmount: number;
  claimed: boolean;
  lastClaimedAt: string;
  nextGiftAt: string | null;
  giftAvailable: boolean;
};

export async function loginWithGoogle(idToken: string) {
  const { data } = await apiClient.post<TokenResponse>("/v1/auth/google", {
    tokenId: idToken,
  });
  return data;
}

export async function demoLogin(username: string, password: string) {
  const { data } = await apiClient.post<TokenResponse>("/v1/auth/demo/login", {
    username,
    password,
  });
  return data;
}

export async function demoRegister(
  username: string,
  password: string,
  email: string,
) {
  const { data } = await apiClient.post<TokenResponse>(
    "/v1/auth/demo/register",
    { username, password, email },
  );
  return data;
}

export async function fetchAuthMe() {
  const { data } = await apiClient.get<AuthMeResponse>("/v1/auth/me");
  return data;
}

export async function claimGift() {
  const { data } = await apiClient.post<GiftClaimResponse>(
    "/v1/users/me/gift-claim",
  );
  return data;
}

export async function logoutApi(refreshToken: string) {
  await apiClient.post("/v1/auth/logout", { refreshToken });
}
