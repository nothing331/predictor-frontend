import {
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { ErrorStore } from "@/store/errorStore";
import { normalizeAppError } from "@/utils/error";

function pushSharedErrorToast(error: unknown, fallbackTitle: string) {
  const normalized = normalizeAppError(error, fallbackTitle);

  if (!normalized.shouldToast) {
    return;
  }

  ErrorStore.getState().pushToast({
    title: normalized.title,
    message: normalized.message,
    tone: "error",
  });
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      pushSharedErrorToast(error, "Data request failed");
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      pushSharedErrorToast(error, "Action failed");
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export function clearProtectedQueryData() {
  queryClient.removeQueries({ queryKey: ["auth"] });
  queryClient.removeQueries({ queryKey: ["account"] });
  queryClient.removeQueries({ queryKey: ["market-position"] });
}
