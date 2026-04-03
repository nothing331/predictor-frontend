import { create } from "zustand";

export type ErrorToastTone = "error" | "warning" | "info";

export type ErrorToast = {
  id: string;
  title: string;
  message: string;
  tone: ErrorToastTone;
};

interface ErrorStoreState {
  toasts: ErrorToast[];
  pushToast: (toast: Omit<ErrorToast, "id">) => string;
  dismissToast: (id: string) => void;
}

const TOAST_LIFETIME_MS = 5000;
const TOAST_DEDUPE_WINDOW_MS = 4000;
const MAX_ACTIVE_TOASTS = 4;

const recentToastTimestamps = new Map<string, number>();

function getToastKey(toast: Omit<ErrorToast, "id"> | ErrorToast) {
  return [toast.tone, toast.title.trim(), toast.message.trim()].join("::");
}

function pruneRecentToasts(now: number) {
  recentToastTimestamps.forEach((timestamp, key) => {
    if (now - timestamp > TOAST_LIFETIME_MS) {
      recentToastTimestamps.delete(key);
    }
  });
}

export const ErrorStore = create<ErrorStoreState>((set, get) => ({
  toasts: [],
  pushToast: (toast) => {
    const now = Date.now();
    const toastKey = getToastKey(toast);
    pruneRecentToasts(now);

    const activeDuplicate = get()
      .toasts
      .find((item) => getToastKey(item) === toastKey);

    if (activeDuplicate) {
      return activeDuplicate.id;
    }

    const lastShownAt = recentToastTimestamps.get(toastKey);
    if (lastShownAt && now - lastShownAt < TOAST_DEDUPE_WINDOW_MS) {
      return `suppressed-${now}`;
    }

    recentToastTimestamps.set(toastKey, now);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }].slice(-MAX_ACTIVE_TOASTS),
    }));

    window.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((item) => item.id !== id),
      }));
    }, TOAST_LIFETIME_MS);

    return id;
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
