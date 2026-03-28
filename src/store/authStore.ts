// src/store/authStore.ts (Zustand)
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { decodeJwtPayload, getSessionRole } from "../utils/auth";

export interface AuthProfile {
  name: string;
  userId?: string | null;
  email?: string | null;
  pictureUrl?: string | null;
  balance?: number | null;
}

export type AuthRole = "ADMIN" | "USER" | null;

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  profile: AuthProfile | null;
  role: AuthRole;

  saveAuth: (
    accessToken: string,
    refreshToken: string,
    expiresInSeconds: number,
    profile?: AuthProfile | null,
  ) => void;
  saveProfile: (profile: AuthProfile | null) => void;
  setRole: (role: AuthRole) => void;
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
      role: null,

      saveAuth: (accessToken, refreshToken, expiresInSeconds, profile) => {
        const payload = decodeJwtPayload<{ role?: string }>(accessToken);

        set({
          accessToken,
          refreshToken,
          expiresAt: Date.now() + expiresInSeconds * 1000,
          profile: profile !== undefined ? profile : get().profile,
          role: getSessionRole(payload?.role),
        });
      },

      saveProfile: (profile) => set({ profile }),

      setRole: (role) => set({ role }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          profile: null,
          role: null,
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
        role: state.role,
      }),
    },
  ),
);
