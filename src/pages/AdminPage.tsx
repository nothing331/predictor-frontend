import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import AppHeader from "@/components/AppHeader";
import { AuthStore } from "@/store/authStore";
import { isSessionAuthenticated } from "@/utils/auth";
import {
  useCreateMarket,
  useMarkets,
  useResolveMarket,
} from "@/hooks/useMarkets";
import { formatProbability } from "@/features/markets/marketPresentation";

type FormState = {
  name: string;
  description: string;
  category: string;
  liquidity: string;
  yesLabel: string;
  noLabel: string;
};

const initialFormState: FormState = {
  name: "",
  description: "",
  category: "General",
  liquidity: "",
  yesLabel: "Yes",
  noLabel: "No",
};

const categoryPresets = [
  "General",
  "Politics",
  "Tech",
  "Sports",
  "Crypto",
  "Entertainment",
];

export default function AdminPage() {
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const role = AuthStore((state) => state.role);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);

  if (!isAuthenticated || role !== "ADMIN") {
    return <Navigate replace to="/" />;
  }

  return (
    <div className="page-shell">
      <div className="page-content">
        <AppHeader />

        <div className="mb-6">
          <p className="eyebrow mb-2">Admin controls</p>
          <h1 className="display-title">Manage Markets</h1>
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          <CreateMarketSection />
          <ResolveMarketSection />
        </div>
      </div>
    </div>
  );
}

function CreateMarketSection() {
  const createMarket = useCreateMarket();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateForm = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateCreateMarket(form);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setErrorMessage(null);

    createMarket.mutate(
      {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        category: form.category.trim() || undefined,
        liquidity: form.liquidity ? Number(form.liquidity) : undefined,
        yesLabel: form.yesLabel.trim() || undefined,
        noLabel: form.noLabel.trim() || undefined,
      },
      {
        onSuccess: () => setForm(initialFormState),
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response?.status === 409) {
            setErrorMessage(
              error.response?.data?.error ||
                "A market with this name already exists.",
            );
            return;
          }
          setErrorMessage("Could not create market. Please try again.");
        },
      },
    );
  };

  return (
    <section className="app-panel overflow-hidden">
      <div className="px-5 py-6 md:px-7 md:py-7">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-[#16130f]">
            <span className="material-symbols-outlined text-[1.25rem]">
              add_circle
            </span>
          </span>
          <h2 className="section-title">Create Market</h2>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          <label className="block">
            <span className="eyebrow mb-3 block">Market question</span>
            <div className="app-panel-subtle field-shell">
              <span className="material-symbols-outlined">help</span>
              <input
                className="app-input"
                placeholder="Will BTC close above 150k this year?"
                type="text"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
              />
            </div>
          </label>

          <label className="block">
            <span className="eyebrow mb-3 block">Description</span>
            <div className="app-panel-subtle field-shell launchpad-textarea-shell">
              <span className="material-symbols-outlined">notes</span>
              <textarea
                className="app-input launchpad-textarea"
                placeholder="Resolution criteria and context for traders."
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
              />
            </div>
          </label>

          <div>
            <span className="eyebrow mb-3 block">Category</span>
            <div className="flex flex-wrap gap-2 mb-3">
              {categoryPresets.map((cat) => (
                <button
                  key={cat}
                  className={`chip ${form.category === cat ? "chip-primary" : "chip-soft !border-transparent !bg-transparent"}`}
                  type="button"
                  onClick={() => updateForm("category", cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="app-panel-subtle field-shell">
              <span className="material-symbols-outlined">category</span>
              <input
                className="app-input"
                placeholder="General"
                type="text"
                value={form.category}
                onChange={(e) => updateForm("category", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <label className="block">
              <span className="eyebrow mb-3 block">Liquidity</span>
              <div className="app-panel-subtle field-shell">
                <span className="material-symbols-outlined">payments</span>
                <input
                  className="app-input"
                  inputMode="decimal"
                  placeholder="50"
                  type="text"
                  value={form.liquidity}
                  onChange={(e) => updateForm("liquidity", e.target.value)}
                />
              </div>
            </label>
            <label className="block">
              <span className="eyebrow mb-3 block">Yes label</span>
              <div className="app-panel-subtle field-shell">
                <input
                  className="app-input"
                  placeholder="Yes"
                  type="text"
                  value={form.yesLabel}
                  onChange={(e) => updateForm("yesLabel", e.target.value)}
                />
              </div>
            </label>
            <label className="block">
              <span className="eyebrow mb-3 block">No label</span>
              <div className="app-panel-subtle field-shell">
                <input
                  className="app-input"
                  placeholder="No"
                  type="text"
                  value={form.noLabel}
                  onChange={(e) => updateForm("noLabel", e.target.value)}
                />
              </div>
            </label>
          </div>

          <button
            className="action-primary w-full justify-center"
            disabled={createMarket.isPending}
            type="submit"
          >
            {createMarket.isPending ? "Creating..." : "Create market"}
          </button>

          {errorMessage ? (
            <p className="type-body-sm text-[color:var(--color-accent-red)]">
              {errorMessage}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}

function ResolveMarketSection() {
  const { data: openMarkets = [], isLoading } = useMarkets("OPEN");
  const resolveMutation = useResolveMarket();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmOutcome, setConfirmOutcome] = useState<"YES" | "NO" | null>(
    null,
  );

  const handleResolve = (marketId: string, outcome: "YES" | "NO") => {
    setConfirmingId(marketId);
    setConfirmOutcome(outcome);
  };

  const executeResolve = () => {
    if (!confirmingId || !confirmOutcome) return;
    resolveMutation.mutate(
      { marketId: confirmingId, payload: { outcomeId: confirmOutcome } },
      {
        onSuccess: () => {
          setConfirmingId(null);
          setConfirmOutcome(null);
        },
      },
    );
  };

  return (
    <section className="app-panel overflow-hidden">
      <div className="px-5 py-6 md:px-7 md:py-7">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white">
            <span className="material-symbols-outlined text-[1.25rem]">
              gavel
            </span>
          </span>
          <h2 className="section-title">Resolve Markets</h2>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="app-panel-subtle animate-pulse h-20 rounded-lg"
              />
            ))}
          </div>
        ) : openMarkets.length === 0 ? (
          <div className="app-panel-subtle px-5 py-8 text-center">
            <span className="material-symbols-outlined text-[2.5rem] text-[color:var(--text-muted)] mb-3 block">
              check_circle
            </span>
            <p className="type-body-md text-[color:var(--text-muted)]">
              All markets are resolved. No open markets to settle.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {openMarkets.map((market) => (
              <article
                key={market.marketId}
                className="app-panel-subtle px-4 py-4 md:px-5"
              >
                <p className="type-body-md font-semibold leading-snug mb-3">
                  {market.marketName}
                </p>

                <div className="flex items-center gap-3 mb-3 type-body-sm text-[color:var(--text-muted)]">
                  <span>{market.category || "General"}</span>
                  <span>
                    {formatProbability(market.outcomes[0]?.probability ?? 0.5)}{" "}
                    Yes
                  </span>
                </div>

                {confirmingId === market.marketId ? (
                  <div className="app-panel-strong px-4 py-3 space-y-3">
                    <p className="type-body-sm font-semibold">
                      Resolve as{" "}
                      <span
                        className={
                          confirmOutcome === "YES"
                            ? "text-primary"
                            : "text-secondary"
                        }
                      >
                        {confirmOutcome}
                      </span>
                      ? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        className="action-primary"
                        type="button"
                        disabled={resolveMutation.isPending}
                        onClick={executeResolve}
                      >
                        {resolveMutation.isPending
                          ? "Resolving..."
                          : "Confirm"}
                      </button>
                      <button
                        className="action-ghost"
                        type="button"
                        onClick={() => {
                          setConfirmingId(null);
                          setConfirmOutcome(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      className="chip chip-primary"
                      type="button"
                      onClick={() =>
                        handleResolve(market.marketId, "YES")
                      }
                    >
                      <span className="material-symbols-outlined text-[1rem]">
                        check
                      </span>
                      Resolve YES
                    </button>
                    <button
                      className="chip chip-secondary"
                      type="button"
                      onClick={() =>
                        handleResolve(market.marketId, "NO")
                      }
                    >
                      <span className="material-symbols-outlined text-[1rem]">
                        close
                      </span>
                      Resolve NO
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function validateCreateMarket(input: FormState) {
  if (!input.name.trim()) return "Market question is required.";
  if (input.liquidity) {
    const liquidity = Number(input.liquidity);
    if (!Number.isFinite(liquidity) || liquidity <= 0)
      return "Liquidity must be greater than 0.";
  }
  if (!input.yesLabel.trim() || !input.noLabel.trim())
    return "Outcome labels cannot be empty.";
  return null;
}
