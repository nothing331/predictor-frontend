// src/store/authStore.ts (Zustand)
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;

  saveAuth: (
    accessToken: string,
    refreshToken: string,
    expiresInSeconds: number,
  ) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const AuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,

      saveAuth: (accessToken, refreshToken, expiresInSeconds) => {
        set({
          accessToken,
          refreshToken,
          expiresAt: Date.now() + expiresInSeconds * 1000,
        });
      },

      logout: () =>
        set({ accessToken: null, refreshToken: null, expiresAt: null }),

      isAuthenticated: () => {
        const { accessToken, expiresAt } = get();
        return !!accessToken && !!expiresAt && Date.now() < expiresAt;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
      }),
    },
  ),
);
