import { apiClient } from "./client";

const loginRequestMeta = {
  authMode: "none",
  errorMode: "toast",
  retryOn401: false,
} as const;

const currentUserRequestMeta = {
  authMode: "required",
  errorMode: "silent",
  retryOn401: true,
} as const;

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
  }, {
    appMeta: loginRequestMeta,
  });
  return data;
}

export async function getCurrentUser() {
  const { data } = await apiClient.get<CurrentUserResponse>("/v1/auth/me", {
    appMeta: currentUserRequestMeta,
  });
  return data;
}
