import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthStore } from "@/store/authStore";
import { isSessionAuthenticated } from "@/utils/auth";
import { useCreateMarket } from "@/hooks/useMarkets";

type CreateMarketDockProps = {
  categorySuggestions: string[];
};

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

export default function CreateMarketDock({
  categorySuggestions,
}: CreateMarketDockProps) {
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);
  const createMarket = useCreateMarket();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const presets = Array.from(
    new Set(["General", "Politics", "Tech", "Sports", "Crypto", ...categorySuggestions]),
  );

  const updateForm = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setErrorMessage("Sign in to launch a new market.");
      return;
    }

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
        onSuccess: () => {
          setForm(initialFormState);
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response?.status === 409) {
            const message =
              error.response?.data?.error ||
              error.response?.data?.message ||
              "A market with this name already exists.";

            setErrorMessage(message);
            return;
          }

          setErrorMessage("We could not launch this market. Please try again.");
        },
      },
    );
  };

  return (
    <section className="launchpad-panel app-panel mt-12 overflow-hidden">
      <div className="launchpad-grid">
        <div className="launchpad-hero">
          <p className="eyebrow">Market launchpad</p>
          <h2 className="display-title launchpad-title">
            Write the next
            <br />
            live question
          </h2>
          <p className="launchpad-copy">
            Turn a sharp prediction into a tradable board. Set the framing,
            seed the opening liquidity, and publish it directly into the live
            desk below.
          </p>

          <div className="launchpad-stats">
            <div className="launchpad-stat">
              <span className="eyebrow">Format</span>
              <strong>Binary markets</strong>
            </div>
            <div className="launchpad-stat">
              <span className="eyebrow">Velocity</span>
              <strong>Home board publish</strong>
            </div>
            <div className="launchpad-stat">
              <span className="eyebrow">Default flow</span>
              <strong>Yes / No pricing</strong>
            </div>
          </div>
        </div>

        <div className="launchpad-form-shell">
          {!isAuthenticated ? (
            <div className="launchpad-guest app-panel-subtle">
              <p className="eyebrow">Members only</p>
              <h3 className="type-heading-sm mt-3 uppercase">
                Sign in to launch a market
              </h3>
              <p className="mt-4 max-w-xl text-[color:var(--text-muted)]">
                You can explore the board as a guest, but creating markets
                requires an active signed-in desk session.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="action-primary" to="/login">
                  Sign in
                </Link>
                <Link className="action-ghost" to="/create-account">
                  Join the desk
                </Link>
              </div>
            </div>
          ) : (
            <form className="launchpad-form app-panel-subtle" onSubmit={onSubmit}>
              <div className="launchpad-form-header">
                <div>
                  <p className="eyebrow">Create market</p>
                  <h3 className="type-heading-sm mt-3 uppercase">
                    Publish from home
                  </h3>
                </div>
                <span className="chip chip-primary">Live draft</span>
              </div>

              <label className="block">
                <span className="eyebrow mb-3 block">Market question</span>
                <div className="app-panel-subtle field-shell">
                  <span className="material-symbols-outlined">help</span>
                  <input
                    className="app-input"
                    placeholder="Will BTC close above 150k this year?"
                    type="text"
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                  />
                </div>
              </label>

              <label className="block">
                <span className="eyebrow mb-3 block">Description</span>
                <div className="app-panel-subtle field-shell launchpad-textarea-shell">
                  <span className="material-symbols-outlined">notes</span>
                  <textarea
                    className="app-input launchpad-textarea"
                    placeholder="Add the context, timing, or resolution notes traders should understand."
                    value={form.description}
                    onChange={(event) => updateForm("description", event.target.value)}
                  />
                </div>
              </label>

              <div>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="eyebrow block">Category</span>
                  <span className="type-body-sm muted-copy">
                    Pick a lane or type your own
                  </span>
                </div>

                <div className="launchpad-chip-row mb-4">
                  {presets.map((category) => (
                    <button
                      key={category}
                      className={`chip ${
                        form.category === category ? "chip-primary" : "chip-soft"
                      } ${form.category === category ? "" : "!border-transparent !bg-transparent"}`}
                      type="button"
                      onClick={() => updateForm("category", category)}
                    >
                      {category}
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
                    onChange={(event) => updateForm("category", event.target.value)}
                  />
                </div>
              </div>

              <div className="launchpad-form-grid">
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
                      onChange={(event) =>
                        updateForm("liquidity", event.target.value)
                      }
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="eyebrow mb-3 block">Yes label</span>
                  <div className="app-panel-subtle field-shell">
                    <span className="material-symbols-outlined">trending_up</span>
                    <input
                      className="app-input"
                      placeholder="Yes"
                      type="text"
                      value={form.yesLabel}
                      onChange={(event) => updateForm("yesLabel", event.target.value)}
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="eyebrow mb-3 block">No label</span>
                  <div className="app-panel-subtle field-shell">
                    <span className="material-symbols-outlined">trending_flat</span>
                    <input
                      className="app-input"
                      placeholder="No"
                      type="text"
                      value={form.noLabel}
                      onChange={(event) => updateForm("noLabel", event.target.value)}
                    />
                  </div>
                </label>
              </div>

              <div className="launchpad-submit-row">
                <div className="min-w-0">
                  <p className="eyebrow">Submit behavior</p>
                  <p className="type-body-sm mt-2 text-[color:var(--text-muted)]">
                    Creation publishes directly to the home board and refreshes
                    the open markets feed.
                  </p>
                </div>

                <button
                  className="action-secondary"
                  disabled={createMarket.isPending}
                  type="submit"
                >
                  {createMarket.isPending ? "Publishing..." : "Launch market"}
                </button>
              </div>

              {errorMessage ? (
                <p className="launchpad-feedback launchpad-feedback-error">
                  {errorMessage}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function validateCreateMarket(input: FormState) {
  if (!input.name.trim()) {
    return "Market question is required.";
  }

  if (input.liquidity) {
    const liquidity = Number(input.liquidity);

    if (!Number.isFinite(liquidity) || liquidity <= 0) {
      return "Liquidity must be greater than 0.";
    }
  }

  if (!input.yesLabel.trim() || !input.noLabel.trim()) {
    return "Outcome labels cannot be empty.";
  }

  return null;
}
