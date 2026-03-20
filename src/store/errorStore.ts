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

export const ErrorStore = create<ErrorStoreState>((set) => ({
  toasts: [],
  pushToast: (toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    window.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((item) => item.id !== id),
      }));
    }, 5000);

    return id;
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
