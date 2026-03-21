// src/store/authStore.ts (Zustand)
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthProfile {
  name: string;
  email?: string | null;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  profile: AuthProfile | null;

  saveAuth: (
    accessToken: string,
    refreshToken: string,
    expiresInSeconds: number,
    profile?: AuthProfile | null,
  ) => void;
  saveProfile: (profile: AuthProfile | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const AuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      profile: null,

      saveAuth: (accessToken, refreshToken, expiresInSeconds, profile) => {
        set({
          accessToken,
          refreshToken,
          expiresAt: Date.now() + expiresInSeconds * 1000,
          profile: profile !== undefined ? profile : get().profile,
        });
      },

      saveProfile: (profile) => set({ profile }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          profile: null,
        }),

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
        profile: state.profile,
      }),
    },
  ),
);
