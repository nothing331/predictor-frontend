import { ErrorStore } from "../store/errorStore";

const toneClasses = {
  error: "border-[color:rgba(255,100,116,0.45)]",
  warning: "border-[color:rgba(214,255,87,0.4)]",
  info: "border-[color:rgba(110,124,255,0.45)]",
} as const;

export default function ErrorToaster() {
  const toasts = ErrorStore((state) => state.toasts);
  const dismissToast = ErrorStore((state) => state.dismissToast);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => (
        <article
          key={toast.id}
          className={`pointer-events-auto app-panel-subtle ${toneClasses[toast.tone]} px-4 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.16)]`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow mb-2">
                {toast.tone === "error"
                  ? "Error"
                  : toast.tone === "warning"
                    ? "Warning"
                    : "Notice"}
              </p>
              <p className="type-body-md font-semibold">{toast.title}</p>
              <p className="type-body-sm mt-2 text-[color:var(--text-muted)]">
                {toast.message}
              </p>
            </div>

            <button
              className="text-[color:var(--text-muted)]"
              onClick={() => dismissToast(toast.id)}
              type="button"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
