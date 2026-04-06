import axios from "axios";
import type { TokenResponse } from "./auth";
import { ErrorStore } from "../store/errorStore";
import { normalizeAppError } from "../utils/error";
import { AuthStore } from "@/store/authStore";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

let refreshPromise: Promise<TokenResponse> | null = null;

export async function refreshAuthSession() {
  const { refreshToken, saveAuth, logout } = AuthStore.getState();

  if (!refreshToken) {
    logout();
    throw new Error("Missing refresh token");
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const { refreshTokens } = await import("./auth");
      const tokens = await refreshTokens(refreshToken);
      saveAuth(tokens.accessToken, tokens.refreshToken, tokens.expiresInSeconds);
      return tokens;
    })()
      .catch((error) => {
        logout();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't intercept refresh endpoint failures (prevents infinite loop)
    if (originalRequest?.url?.includes("/v1/auth/refresh")) {
      return Promise.reject(error);
    }

    // Handle 401: attempt token refresh and retry once
    if (error.response?.status === 401 && !originalRequest?._retried) {
      originalRequest._retried = true;

      try {
        const tokens = await refreshAuthSession();

        // Retry original request with new token
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return apiClient(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    // Non-401 errors: show toast as before
    const normalized = normalizeAppError(
      error,
      "Request failed",
      "The server could not complete your request.",
    );

    ErrorStore.getState().pushToast({
      title: normalized.title,
      message: normalized.message,
      tone: "error",
    });

    return Promise.reject(error);
  },
);

apiClient.interceptors.request.use((config) => {
  const token = AuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
