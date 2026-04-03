import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppErrorBoundary from "./components/AppErrorBoundary";
import ErrorToaster from "./components/ErrorToaster";

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
