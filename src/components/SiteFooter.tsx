import { useState } from "react";
import { Link } from "react-router-dom";

type ModalType = "disclaimer" | "tos" | null;

export default function SiteFooter() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <footer className="mt-10 md:mt-16 section-divider pt-0">
      {/* How to Play - expandable section */}
      <section className="app-panel overflow-hidden">
        <button
          type="button"
          className="w-full px-3.5 py-3.5 md:px-8 md:py-6 flex items-center justify-between gap-3 md:gap-4 text-left cursor-pointer bg-transparent border-none"
          onClick={() => setHowToPlayOpen((o) => !o)}
        >
          <div className="flex items-center gap-2 md:gap-3">
            <span className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary text-[#16130f]">
              <span className="material-symbols-outlined text-[1rem] md:text-[1.25rem]">
                sports_esports
              </span>
            </span>
            <h3 className="type-heading-sm uppercase">How to Play</h3>
          </div>
          <span
            className="material-symbols-outlined text-[1.5rem] transition-transform duration-300"
            style={{
              transform: howToPlayOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            expand_more
          </span>
        </button>

        {howToPlayOpen ? (
          <div className="px-3.5 pb-4 md:px-8 md:pb-8">
            <div className="grid gap-3 md:gap-6 md:grid-cols-3">
              <HowToPlayStep
                number="01"
                icon="account_circle"
                title="Sign in"
                description="Use your Google account to create a free profile. You'll receive starting funds to begin trading immediately."
              />
              <HowToPlayStep
                number="02"
                icon="query_stats"
                title="Pick a market"
                description="Browse open prediction markets. Each one asks a yes-or-no question about the future. The price reflects the crowd's current belief."
              />
              <HowToPlayStep
                number="03"
                icon="paid"
                title="Trade & earn"
                description="Buy shares in the outcome you believe in. If you're right when the market resolves, your shares pay out. Claim free funds every 12 hours to keep playing."
              />
            </div>
          </div>
        ) : null}
      </section>

      {/* Bottom bar */}
      <div className="mt-4 px-1 pb-6 md:mt-6 md:px-2 md:pb-8">
        <div className="flex flex-col gap-4 md:gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-lg space-y-3">
            <Link className="brand-mark inline-flex" to="/">
              <span className="brand-sigil">
                <span className="material-symbols-outlined text-[1.5rem] font-bold">
                  bolt
                </span>
              </span>
              <span className="brand-wordmark">PredictKaro</span>
            </Link>
            <p className="type-body-sm text-[color:var(--text-muted)] leading-relaxed">
              PredictKaro is a prediction market platform for entertainment and educational purposes only.
              No real money is involved. Virtual currency has no cash value.
              Past performance does not guarantee future results. Play responsibly.
            </p>
          </div>

          <div className="flex flex-col items-start gap-5 md:items-end">
            <div className="flex flex-wrap gap-3">
              <SocialLink
                icon="svg-x"
                label="X / Twitter"
                href="https://x.com/predictkaro"
              />
              <SocialLink
                icon="svg-github"
                label="GitHub"
                href="https://github.com/predictkaro"
              />
              <SocialLink
                icon="svg-discord"
                label="Discord"
                href="https://discord.gg/predictkaro"
              />
            </div>

            <div className="flex flex-wrap gap-4 type-body-sm">
              <button
                type="button"
                className="eyebrow text-[inherit] bg-transparent border-none cursor-pointer p-0 hover:text-primary transition-colors"
                onClick={() => setActiveModal("disclaimer")}
              >
                Disclaimer
              </button>
              <span className="text-[color:var(--border-soft)]">|</span>
              <button
                type="button"
                className="eyebrow text-[inherit] bg-transparent border-none cursor-pointer p-0 hover:text-primary transition-colors"
                onClick={() => setActiveModal("tos")}
              >
                Terms of Service
              </button>
            </div>

            <p className="type-body-sm text-[color:var(--text-muted)]">
              &copy; {new Date().getFullYear()} PredictKaro. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Legal Modals */}
      {activeModal ? (
        <LegalModal
          type={activeModal}
          onClose={() => setActiveModal(null)}
        />
      ) : null}
    </footer>
  );
}

/* ── Legal Modal ── */

function LegalModal({
  type,
  onClose,
}: {
  type: "disclaimer" | "tos";
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        style={{
          background: "var(--surface-strong)",
          border: "3px solid var(--border-strong)",
          boxShadow: "12px 12px 0 rgba(0, 0, 0, 0.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between gap-4 px-6 py-5 flex-none"
          style={{
            borderBottom: "3px solid var(--border-strong)",
            background:
              type === "disclaimer"
                ? "linear-gradient(135deg, color-mix(in srgb, var(--color-accent-red) 8%, transparent), transparent)"
                : "linear-gradient(135deg, color-mix(in srgb, var(--color-secondary) 8%, transparent), transparent)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                background:
                  type === "disclaimer"
                    ? "color-mix(in srgb, var(--color-accent-red) 15%, transparent)"
                    : "color-mix(in srgb, var(--color-secondary) 15%, transparent)",
                border:
                  type === "disclaimer"
                    ? "2px solid color-mix(in srgb, var(--color-accent-red) 25%, transparent)"
                    : "2px solid color-mix(in srgb, var(--color-secondary) 25%, transparent)",
              }}
            >
              <span
                className="material-symbols-outlined text-[1.25rem]"
                style={{
                  color:
                    type === "disclaimer"
                      ? "var(--color-accent-red)"
                      : "var(--color-secondary)",
                }}
              >
                {type === "disclaimer" ? "warning" : "gavel"}
              </span>
            </span>
            <h2 className="type-heading-sm uppercase">
              {type === "disclaimer" ? "Disclaimer" : "Terms of Service"}
            </h2>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent border-none cursor-pointer text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-[var(--surface-soft)] transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[1.25rem]">
              close
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {type === "disclaimer" ? <DisclaimerContent /> : <TosContent />}
        </div>

        {/* Footer */}
        <div
          className="flex-none px-6 py-4"
          style={{ borderTop: "3px solid var(--border-strong)" }}
        >
          <button
            type="button"
            className="action-primary w-full justify-center"
            onClick={onClose}
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Disclaimer Content ── */

function DisclaimerContent() {
  return (
    <>
      <p className="type-body-md leading-relaxed">
        This platform is a <strong>free-to-play simulation game</strong> intended
        for entertainment and educational purposes only.
      </p>

      <div className="space-y-3">
        <LegalBullet
          icon="money_off"
          text="No real money is involved at any stage"
        />
        <LegalBullet
          icon="token"
          text="All credits used within the platform are virtual and have no monetary value"
        />
        <LegalBullet
          icon="block"
          text="Credits cannot be withdrawn, transferred, or exchanged for cash, cryptocurrency, or any real-world rewards"
        />
        <LegalBullet
          icon="casino"
          text="This platform does not facilitate betting, gambling, or wagering of any kind"
        />
      </div>

      <div
        className="app-panel-subtle px-5 py-4 space-y-3"
        style={{
          borderLeft: "4px solid var(--color-accent-red)",
        }}
      >
        <p className="type-body-sm leading-relaxed text-[color:var(--text-muted)]">
          The outcomes and probabilities displayed are part of a simulated
          environment and do not constitute financial, investment, or betting
          advice.
        </p>
        <p className="type-body-sm leading-relaxed text-[color:var(--text-muted)]">
          Users are advised to participate responsibly and understand that this is
          a game based on predictions and not a real financial market.
        </p>
      </div>

      <p className="type-body-sm leading-relaxed text-[color:var(--text-muted)]">
        By using this platform, you acknowledge that you are participating in a
        virtual, non-monetary experience.
      </p>
    </>
  );
}

/* ── TOS Content ── */

function TosContent() {
  return (
    <>
      <p className="type-body-sm leading-relaxed text-[color:var(--text-muted)]">
        By accessing and using this platform, you agree to the following terms:
      </p>

      <TosSection number="1" title="Eligibility">
        <LegalBullet icon="person" text="You must be at least 18 years old to use this platform" />
        <LegalBullet icon="verified" text="By using the service, you confirm that you meet this requirement" />
      </TosSection>

      <TosSection number="2" title="Nature of the Platform">
        <LegalBullet icon="sports_esports" text="This platform is a simulation-based prediction game" />
        <LegalBullet icon="money_off" text="It does not involve real-money transactions, betting, or gambling" />
      </TosSection>

      <TosSection number="3" title="Virtual Credits">
        <LegalBullet icon="token" text="All credits are virtual and are provided for gameplay purposes only" />
        <LegalBullet icon="block" text="Credits have no real-world value and cannot be redeemed or transferred" />
      </TosSection>

      <TosSection number="4" title="Fair Usage">
        <p className="type-body-sm text-[color:var(--text-muted)] mb-2">You agree not to:</p>
        <LegalBullet icon="smart_toy" text="Use bots, scripts, or automation to manipulate gameplay" />
        <LegalBullet icon="bug_report" text="Attempt to exploit pricing, scoring, or system mechanics" />
        <LegalBullet icon="group_add" text="Create multiple accounts for unfair advantage" />
      </TosSection>

      <TosSection number="5" title="No Financial Advice">
        <LegalBullet icon="info" text="Information and predictions on this platform do not constitute financial or investment advice" />
        <LegalBullet icon="person" text="Users are responsible for their own decisions outside the platform" />
      </TosSection>

      <TosSection number="6" title="Account Suspension">
        <p className="type-body-sm text-[color:var(--text-muted)] mb-2">We reserve the right to:</p>
        <LegalBullet icon="gavel" text="Suspend or terminate accounts that violate these terms" />
        <LegalBullet icon="restart_alt" text="Modify or reset virtual credits if misuse is detected" />
      </TosSection>

      <TosSection number="7" title="Service Availability">
        <LegalBullet icon="cloud_off" text='The platform is provided "as is" without guarantees of uptime or accuracy' />
        <LegalBullet icon="update" text="Features may change, be updated, or removed at any time" />
      </TosSection>

      <TosSection number="8" title="Limitation of Liability">
        <LegalBullet icon="shield" text="We are not liable for any losses, damages, or decisions made based on the platform's content" />
        <LegalBullet icon="money_off" text="Since no real money is involved, all gameplay outcomes are purely virtual" />
      </TosSection>

      <TosSection number="9" title="Changes to Terms">
        <LegalBullet icon="edit_note" text="These terms may be updated at any time" />
        <LegalBullet icon="check_circle" text="Continued use of the platform implies acceptance of updated terms" />
      </TosSection>

      <div
        className="app-panel-subtle px-5 py-4"
        style={{ borderLeft: "4px solid var(--color-primary)" }}
      >
        <p className="type-body-md font-semibold">
          By using this platform, you agree to all the above terms.
        </p>
      </div>
    </>
  );
}

/* ── Shared Legal Components ── */

function TosSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span
          className="type-body-sm font-mono font-bold"
          style={{ color: "var(--color-secondary)", opacity: 0.6 }}
        >
          {number}.
        </span>
        <h3 className="type-body-lg font-semibold uppercase">{title}</h3>
      </div>
      <div className="space-y-2 pl-7">{children}</div>
    </div>
  );
}

function LegalBullet({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="material-symbols-outlined text-[1rem] mt-0.5 flex-none"
        style={{ color: "var(--text-muted)" }}
      >
        {icon}
      </span>
      <p className="type-body-sm leading-relaxed text-[color:var(--text-muted)]">
        {text}
      </p>
    </div>
  );
}

/* ── How to Play Step ── */

function HowToPlayStep({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="app-panel-subtle px-3.5 py-3.5 md:px-5 md:py-5 space-y-2 md:space-y-3">
      <div className="flex items-center justify-between">
        <span className="type-value-md font-mono font-bold text-primary opacity-30">
          {number}
        </span>
        <span className="material-symbols-outlined text-[1.5rem] text-[color:var(--text-muted)]">
          {icon}
        </span>
      </div>
      <h4 className="type-body-lg font-semibold uppercase">{title}</h4>
      <p className="type-body-sm text-[color:var(--text-muted)] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/* ── Social Link ── */

function SocialLink({
  icon,
  label,
  href,
}: {
  icon: string;
  label: string;
  href: string;
}) {
  const iconMap: Record<string, React.ReactNode> = {
    "svg-x": (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    "svg-github": (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
    "svg-discord": (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  };

  return (
    <a
      className="flex h-10 w-10 items-center justify-center rounded-full app-panel-subtle text-[color:var(--text-muted)] hover:text-primary hover:-translate-y-1 transition-all no-underline"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {iconMap[icon] ?? (
        <span className="material-symbols-outlined text-[1.25rem]">link</span>
      )}
    </a>
  );
}
