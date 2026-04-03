import axios from "axios";
import type { AttachedAppErrorMeta } from "@/api/requestPolicy";

const APP_ERROR_META_KEY = "__appErrorMeta";

type ErrorWithMeta = {
  [APP_ERROR_META_KEY]?: AttachedAppErrorMeta;
};

export type NormalizedAppError = {
  title: string;
  message: string;
  shouldToast: boolean;
  isAuthFailure: boolean;
};

export function attachAppErrorMeta<T>(
  error: T,
  meta: AttachedAppErrorMeta,
): T {
  if (error && typeof error === "object") {
    (error as ErrorWithMeta)[APP_ERROR_META_KEY] = meta;
  }

  return error;
}

export function getAttachedAppErrorMeta(
  error: unknown,
): AttachedAppErrorMeta | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  return (error as ErrorWithMeta)[APP_ERROR_META_KEY] ?? null;
}

export function normalizeAppError(
  error: unknown,
  fallbackTitle = "Something went wrong",
  fallbackMessage = "Please try again in a moment.",
): NormalizedAppError {
  const attachedMeta = getAttachedAppErrorMeta(error);

  if (axios.isAxiosError(error)) {
    const apiMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message;

    return {
      title: fallbackTitle,
      message: apiMessage || fallbackMessage,
      shouldToast: attachedMeta?.shouldToast ?? true,
      isAuthFailure: attachedMeta?.isAuthFailure ?? false,
    };
  }

  if (error instanceof Error) {
    return {
      title: fallbackTitle,
      message: error.message || fallbackMessage,
      shouldToast: attachedMeta?.shouldToast ?? true,
      isAuthFailure: attachedMeta?.isAuthFailure ?? false,
    };
  }

  return {
    title: fallbackTitle,
    message: fallbackMessage,
    shouldToast: attachedMeta?.shouldToast ?? true,
    isAuthFailure: attachedMeta?.isAuthFailure ?? false,
  };
}
