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
      const { refreshToken, saveAuth, logout } = AuthStore.getState();

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        // Deduplicate concurrent refresh calls
        if (!refreshPromise) {
          const { refreshTokens } = await import("./auth");
          refreshPromise = refreshTokens(refreshToken).finally(() => {
            refreshPromise = null;
          });
        }

        const tokens = await refreshPromise;
        saveAuth(tokens.accessToken, tokens.refreshToken, tokens.expiresInSeconds);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return apiClient(originalRequest);
      } catch {
        logout();
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
