import { useEffect, useState } from "react";

const socialLinks = [
  {
    label: "X",
    href: "https://x.com/Ayush54426067",
    icon: <XIcon />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ayushgupta331/",
    icon: <LinkedInIcon />,
  },
];

export default function SiteBottomBar() {
  const [activeSheet, setActiveSheet] = useState<"disclaimer" | "terms" | null>(
    null,
  );

  useEffect(() => {
    if (!activeSheet) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveSheet(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSheet]);

  return (
    <>
      <footer className="site-bottom-bar-wrap">
        <div className="site-bottom-bar">
          <div className="site-footer-top">
            <div className="site-footer-inline">
              <button
                className="site-footer-text-link"
                onClick={() => setActiveSheet("disclaimer")}
                type="button"
              >
                Disclaimer
              </button>
              <span className="site-footer-divider" />
              <button
                className="site-footer-text-link"
                onClick={() => setActiveSheet("terms")}
                type="button"
              >
                Terms of Service
              </button>
              <span className="site-footer-divider" />
              <span className="site-footer-note">Virtual credits only</span>
            </div>

            <div className="site-footer-socials">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  aria-label={link.label}
                  className="site-footer-social-link"
                  href={link.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="site-footer-bottom">
            <p>Free-to-play prediction arena. Strategy first, no cash value.</p>
            {/* <p>Prediction Arena</p> */}
          </div>
        </div>
      </footer>

      {activeSheet ? (
        <div
          className="site-bottom-sheet-overlay"
          onClick={() => setActiveSheet(null)}
        >
          <div
            className="site-bottom-sheet app-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="site-bottom-sheet-head">
              <div>
                <p className="eyebrow">Read before playing</p>
                <h2 className="site-bottom-sheet-title">
                  {activeSheet === "disclaimer"
                    ? "Disclaimer"
                    : "Terms of Service"}
                </h2>
              </div>

              <button
                aria-label={`Close ${activeSheet}`}
                className="site-bottom-sheet-close"
                onClick={() => setActiveSheet(null)}
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {activeSheet === "disclaimer" ? (
              <div className="site-bottom-sheet-disclaimer">
                <p className="site-bottom-sheet-disclaimer-lead">
                  This platform is a{" "}
                  <strong>free-to-play simulation game</strong> intended for
                  entertainment and educational purposes only.
                </p>
                <ul className="site-bottom-sheet-disclaimer-list">
                  <li>No real money is involved at any stage.</li>
                  <li>
                    All credits used within the platform are virtual and have no
                    monetary value.
                  </li>
                  <li>
                    Credits cannot be withdrawn, transferred, or exchanged for
                    cash, cryptocurrency, or any real-world rewards.
                  </li>
                  <li>
                    This platform does not facilitate betting, gambling, or
                    wagering of any kind.
                  </li>
                </ul>
                <p>
                  The outcomes and probabilities displayed are part of a
                  simulated environment and do not constitute financial,
                  investment, or betting advice.
                </p>
                <p>
                  Users are advised to participate responsibly and understand
                  that this is a game based on predictions and not a real
                  financial market.
                </p>
                <p>
                  By using this platform, you acknowledge that you are
                  participating in a virtual, non-monetary experience.
                </p>
              </div>
            ) : (
              <div className="site-bottom-sheet-terms">
                <p className="site-bottom-sheet-disclaimer-lead">
                  By accessing and using this platform, you agree to the
                  following terms.
                </p>

                <section className="site-bottom-sheet-terms-section">
                  <p className="site-bottom-sheet-terms-kicker">1. Eligibility</p>
                  <ul className="site-bottom-sheet-disclaimer-list">
                    <li>You must be at least 18 years old to use this platform.</li>
                    <li>
                      By using the service, you confirm that you meet this
                      requirement.
                    </li>
                  </ul>
                </section>

                <section className="site-bottom-sheet-terms-section">
                  <p className="site-bottom-sheet-terms-kicker">
                    2. Nature of the Platform
                  </p>
                  <ul className="site-bottom-sheet-disclaimer-list">
                    <li>This platform is a simulation-based prediction game.</li>
                    <li>
                      It does not involve real-money transactions, betting, or
                      gambling.
                    </li>
                  </ul>
                </section>

                <section className="site-bottom-sheet-terms-section">
                  <p className="site-bottom-sheet-terms-kicker">
                    3. Virtual Credits
                  </p>
                  <ul className="site-bottom-sheet-disclaimer-list">
                    <li>
                      All credits are virtual and are provided for gameplay
                      purposes only.
                    </li>
                    <li>
                      Credits have no real-world value and cannot be redeemed or
                      transferred.
                    </li>
                  </ul>
                </section>

                <section className="site-bottom-sheet-terms-section">
                  <p className="site-bottom-sheet-terms-kicker">4. Fair Usage</p>
                  <p className="site-bottom-sheet-terms-copy">
                    You agree not to:
                  </p>
                  <ul className="site-bottom-sheet-disclaimer-list">
                    <li>
                      Use bots, scripts, or automation to manipulate gameplay.
                    </li>
                    <li>
                      Attempt to exploit pricing, scoring, or system mechanics.
                    </li>
                    <li>Create multiple accounts for unfair advantage.</li>
                  </ul>
                </section>

                <section className="site-bottom-sheet-terms-section">
                  <p className="site-bottom-sheet-terms-kicker">
                    5. No Financial Advice
                  </p>
                  <ul className="site-bottom-sheet-disclaimer-list">
                    <li>
                      Information and predictions on this platform do not
                      constitute financial or investment advice.
                    </li>
                    <li>
                      Users are responsible for their own decisions outside the
                      platform.
                    </li>
                  </ul>
                </section>

                <section className="site-bottom-sheet-terms-section">
                  <p className="site-bottom-sheet-terms-kicker">
                    6. Account Suspension
                  </p>
                  <p className="site-bottom-sheet-terms-copy">
                    We reserve the right to:
                  </p>
                  <ul className="site-bottom-sheet-disclaimer-list">
                    <li>
                      Suspend or terminate accounts that violate these terms.
                    </li>
                    <li>
                      Modify or reset virtual credits if misuse is detected.
                    </li>
                  </ul>
                </section>

                <section className="site-bottom-sheet-terms-section">
                  <p className="site-bottom-sheet-terms-kicker">
                    7. Service Availability
                  </p>
                  <ul className="site-bottom-sheet-disclaimer-list">
                    <li>
                      The platform is provided "as is" without guarantees of
                      uptime or accuracy.
                    </li>
                    <li>
                      Features may change, be updated, or removed at any time.
                    </li>
                  </ul>
                </section>

                <section className="site-bottom-sheet-terms-section">
                  <p className="site-bottom-sheet-terms-kicker">
                    8. Limitation of Liability
                  </p>
                  <ul className="site-bottom-sheet-disclaimer-list">
                    <li>
                      We are not liable for any losses, damages, or decisions
                      made based on the platform&apos;s content.
                    </li>
                    <li>
                      Since no real money is involved, all gameplay outcomes are
                      purely virtual.
                    </li>
                  </ul>
                </section>

                <section className="site-bottom-sheet-terms-section">
                  <p className="site-bottom-sheet-terms-kicker">
                    9. Changes to Terms
                  </p>
                  <ul className="site-bottom-sheet-disclaimer-list">
                    <li>These terms may be updated at any time.</li>
                    <li>
                      Continued use of the platform implies acceptance of updated
                      terms.
                    </li>
                  </ul>
                </section>

                <p className="site-bottom-sheet-terms-final">
                  By using this platform, you agree to all the above terms.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function XIcon() {
  return (
    <svg
      aria-hidden="true"
      className="site-footer-social-svg"
      viewBox="0 0 24 24"
    >
      <path
        d="M18.244 2H21.5l-7.11 8.127L22.75 22h-6.543l-5.125-6.705L5.21 22H1.95l7.606-8.693L1.5 2h6.707l4.632 6.113L18.244 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      className="site-footer-social-svg"
      viewBox="0 0 24 24"
    >
      <path
        d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 0 0 3.25 4.97c0 1.08.87 1.97 2 1.97 1.12 0 2-.89 2-1.97C7.25 3.89 6.37 3 5.25 3ZM20.75 12.74c0-3.31-1.77-4.86-4.13-4.86-1.9 0-2.75 1.04-3.22 1.77V8.5H10V20h3.38v-6.16c0-1.62.31-3.18 2.32-3.18 1.98 0 2 1.85 2 3.29V20h3.38l-.01-7.26Z"
        fill="currentColor"
      />
    </svg>
  );
}
