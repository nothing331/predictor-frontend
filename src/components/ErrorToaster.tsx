import { useEffect, useMemo, useState } from "react";
import { ErrorStore } from "../store/errorStore";

const toneClasses = {
  error: "border-[color:rgba(255,100,116,0.45)]",
  warning: "border-[color:rgba(214,255,87,0.4)]",
  info: "border-[color:rgba(110,124,255,0.45)]",
} as const;

const tonePriority = {
  error: 0,
  warning: 1,
  info: 2,
} as const;

export default function ErrorToaster() {
  const toasts = ErrorStore((state) => state.toasts);
  const dismissToast = ErrorStore((state) => state.dismissToast);
  const [isCompact, setIsCompact] = useState(() =>
    window.matchMedia("(max-width: 640px)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsCompact(event.matches);
    };

    setIsCompact(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const visibleToasts = useMemo(() => {
    const hasErrorToast = toasts.some((toast) => toast.tone === "error");
    const filteredToasts = hasErrorToast
      ? toasts.filter((toast) => toast.tone !== "info")
      : toasts;
    const prioritized = [...filteredToasts].sort(
      (left, right) => tonePriority[left.tone] - tonePriority[right.tone],
    );
    const maxVisible = isCompact ? 1 : 3;

    return prioritized.slice(0, maxVisible);
  }, [isCompact, toasts]);

  return (
    <div
      className={`pointer-events-none fixed z-50 flex flex-col ${
        isCompact
          ? "left-2 right-2 top-2 gap-2"
          : "right-4 top-4 w-[min(24rem,calc(100vw-2rem))] gap-3"
      }`}
    >
      {visibleToasts.map((toast) => (
        <article
          key={toast.id}
          className={`pointer-events-auto app-panel-subtle ${toneClasses[toast.tone]} ${
            isCompact ? "px-3 py-3" : "px-4 py-4"
          } shadow-[0_12px_40px_rgba(0,0,0,0.16)]`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className={`eyebrow ${isCompact ? "mb-1" : "mb-2"}`}>
                {toast.tone === "error"
                  ? "Error"
                  : toast.tone === "warning"
                    ? "Warning"
                    : "Notice"}
              </p>
              <p className={isCompact ? "text-sm font-semibold" : "type-body-md font-semibold"}>
                {toast.title}
              </p>
              <p
                className={`text-[color:var(--text-muted)] ${
                  isCompact ? "mt-1 text-xs leading-snug" : "type-body-sm mt-2"
                }`}
              >
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
