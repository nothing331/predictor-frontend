import axios from "axios";

type NormalizedAppError = {
  title: string;
  message: string;
};

export function normalizeAppError(
  error: unknown,
  fallbackTitle = "Something went wrong",
  fallbackMessage = "Please try again in a moment.",
): NormalizedAppError {
  if (axios.isAxiosError(error)) {
    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message;

    return {
      title: fallbackTitle,
      message: apiMessage || fallbackMessage,
    };
  }

  if (error instanceof Error) {
    return {
      title: fallbackTitle,
      message: error.message || fallbackMessage,
    };
  }

  return {
    title: fallbackTitle,
    message: fallbackMessage,
  };
}
