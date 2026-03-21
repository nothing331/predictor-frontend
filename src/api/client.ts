import axios from "axios";
import { ErrorStore } from "../store/errorStore";
import { normalizeAppError } from "../utils/error";
import { AuthStore } from "@/store/authStore";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
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
