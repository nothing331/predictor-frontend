import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppErrorBoundary from "./components/AppErrorBoundary";
import ErrorToaster from "./components/ErrorToaster";
import { ErrorStore } from "./store/errorStore";
import { normalizeAppError } from "./utils/error";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      const normalized = normalizeAppError(error, "Data request failed");
      ErrorStore.getState().pushToast({
        title: normalized.title,
        message: normalized.message,
        tone: "error",
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      const normalized = normalizeAppError(error, "Action failed");
      ErrorStore.getState().pushToast({
        title: normalized.title,
        message: normalized.message,
        tone: "error",
      });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
          <ErrorToaster />
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </AppErrorBoundary>
  </React.StrictMode>
);
