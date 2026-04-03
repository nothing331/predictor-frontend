import axios from "axios";
import { clearProtectedQueryData } from "@/lib/queryClient";
import { AuthStore } from "@/store/authStore";
import {
  buildAttachedAppErrorMeta,
  resolveApiRequestMeta,
  shouldAttachAccessToken,
  shouldRetryOnUnauthorized,
} from "@/api/requestPolicy";
import { attachAppErrorMeta } from "@/utils/error";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

let refreshPromise: Promise<string> | null = null;

function resetProtectedSession() {
  AuthStore.getState().logout();
  clearProtectedQueryData();
}

async function performAuthRefresh() {
  const authState = AuthStore.getState();
  const refreshToken = authState.refreshToken;

  if (!refreshToken) {
    resetProtectedSession();
    throw new Error("Your session has expired. Please sign in again.");
  }

  try {
    const { data } = await axios.post<RefreshTokenResponse>(
      `${API_BASE_URL}/v1/auth/refresh`,
      { refreshToken },
    );

    AuthStore.getState().saveAuth(
      data.accessToken,
      data.refreshToken,
      data.expiresInSeconds,
    );

    return data.accessToken;
  } catch (error) {
    resetProtectedSession();
    throw error;
  }
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = performAuthRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const config = error.config;
    const requestMeta = resolveApiRequestMeta(config?.appMeta);

    if (
      config &&
      error.response?.status === 401 &&
      !config._retry &&
      shouldRetryOnUnauthorized(requestMeta)
    ) {
      config._retry = true;

      try {
        const accessToken = await refreshAccessToken();

        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${accessToken}`;
        config.appMeta = requestMeta;

        return apiClient(config);
      } catch {
        attachAppErrorMeta(
          error,
          buildAttachedAppErrorMeta(requestMeta, 401, true),
        );
        return Promise.reject(error);
      }
    }

    attachAppErrorMeta(
      error,
      buildAttachedAppErrorMeta(requestMeta, error.response?.status),
    );

    return Promise.reject(error);
  },
);

apiClient.interceptors.request.use((config) => {
  const requestMeta = resolveApiRequestMeta(config.appMeta);
  config.appMeta = requestMeta;

  if (!shouldAttachAccessToken(requestMeta)) {
    return config;
  }

  const token = AuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
