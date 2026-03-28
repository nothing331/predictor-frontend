import { useEffect, useState } from "react";

const socialLinks = [
  {
    label: "X",
    href: "https://x.com/",
    icon: <XIcon />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: <LinkedInIcon />,
  },
];

export default function SiteBottomBar() {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  useEffect(() => {
    if (!isDisclaimerOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDisclaimerOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDisclaimerOpen]);

  return (
    <>
      <footer className="site-bottom-bar-wrap">
        <div className="site-bottom-bar">
          <div className="site-footer-top">
            <div className="site-footer-inline">
              <button
                className="site-footer-text-link"
                onClick={() => setIsDisclaimerOpen(true)}
                type="button"
              >
                Disclaimer
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
            <p>Prediction Arena</p>
          </div>
        </div>
      </footer>

      {isDisclaimerOpen ? (
        <div
          className="site-bottom-sheet-overlay"
          onClick={() => setIsDisclaimerOpen(false)}
        >
          <div
            className="site-bottom-sheet app-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="site-bottom-sheet-head">
              <div>
                <p className="eyebrow">Read before playing</p>
                <h2 className="site-bottom-sheet-title">Disclaimer</h2>
              </div>

              <button
                aria-label="Close disclaimer"
                className="site-bottom-sheet-close"
                onClick={() => setIsDisclaimerOpen(false)}
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="site-bottom-sheet-disclaimer">
              <p>
                This platform is a free-to-play prediction game built for
                entertainment, practice, and strategy. Credits shown on the desk
                are virtual only and have no cash value.
              </p>
              <p>
                Nothing here should be treated as financial advice, or a promise of real-world reward. Market outcomes are
                part of a game system designed for play.
              </p>
              <p>
                Play responsibly, think critically, and treat every market as a
                strategy challenge rather than a money-making tool.
              </p>
            </div>
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
