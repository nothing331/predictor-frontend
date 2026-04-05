// src/store/authStore.ts (Zustand)
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { decodeJwtPayload, getSessionRole } from "../utils/auth";

export interface AuthProfile {
  name: string;
  userId?: string | null;
  email?: string | null;
  pictureUrl?: string | null;
}

export type AuthRole = "ADMIN" | "USER" | null;

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  profile: AuthProfile | null;
  balance: number | null;
  role: "USER" | "ADMIN" | null;
  giftAvailable: boolean;
  nextGiftAt: string | null;

  saveAuth: (
    accessToken: string,
    refreshToken: string,
    expiresInSeconds: number,
    profile?: AuthProfile | null,
  ) => void;
  saveProfile: (profile: AuthProfile | null) => void;
  saveUserData: (data: {
    balance: number;
    role: "USER" | "ADMIN";
    giftAvailable: boolean;
    nextGiftAt: string | null;
    profile?: AuthProfile | null;
  }) => void;
  updateBalance: (balance: number) => void;
  updateGift: (giftAvailable: boolean, nextGiftAt: string | null) => void;
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
      balance: null,
      role: null,
      giftAvailable: false,
      nextGiftAt: null,

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

      saveUserData: ({ balance, role, giftAvailable, nextGiftAt, profile }) => {
        const update: Partial<AuthState> = { balance, role, giftAvailable, nextGiftAt };
        if (profile !== undefined) {
          update.profile = profile;
        }
        set(update);
      },

      updateBalance: (balance) => set({ balance }),

      updateGift: (giftAvailable, nextGiftAt) =>
        set({ giftAvailable, nextGiftAt }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          profile: null,
          balance: null,
          role: null,
          giftAvailable: false,
          nextGiftAt: null,
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
        balance: state.balance,
        role: state.role,
        giftAvailable: state.giftAvailable,
        nextGiftAt: state.nextGiftAt,
      }),
    },
  ),
);
