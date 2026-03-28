import { useEffect } from "react";
import { FCoinName } from "@/utils/currency";

const arenaSections = [
  {
    icon: "quiz",
    kicker: "What is this game?",
    title: "Predict real-world outcomes",
    intro: "You will see questions like:",
    examples: [
      "Will Team A win today?",
      "Will Bitcoin go above $70k this week?",
      "Will it rain tomorrow in Delhi?",
    ],
    points: [
      "YES means you think it will happen.",
      "NO means you think it will not happen.",
    ],
  },
  {
    icon: "savings",
    kicker: "What are credits?",
    title: "Virtual balance only",
    points: [
      `You start with a fixed number of virtual credits called ${FCoinName}.`,
      "Credits are not real money and cannot be withdrawn or exchanged.",
      "Use them to make predictions and track your performance.",
    ],
  },
  {
    icon: "query_stats",
    kicker: "How does scoring work?",
    title: "Better calls earn better returns",
    points: [
      "The more accurate your predictions, the more credits you earn.",
      "Prices and implied probabilities move based on what other players think.",
      "Early and smart predictions can give you better returns.",
    ],
  },
  {
    icon: "military_tech",
    kicker: "What is the goal?",
    title: "Grow, climb, compete",
    points: [
      "Grow your credits over time.",
      "Climb the leaderboard.",
      "Become the most accurate predictor on the board.",
    ],
  },
  {
    icon: "flash_on",
    kicker: "Tips",
    title: "Think before you act",
    points: [
      "Think logically, not emotionally.",
      "Follow trends, but do not blindly trust the crowd.",
      "Timing matters as much as accuracy.",
    ],
  },
];

export default function HowToPlayDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="how-to-play-overlay"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="how-to-play-dialog app-panel"
        onClick={(event) => event.stopPropagation()}
      >
          <div className="how-to-play-header">
          <div className="how-to-play-headline">
            <span className="how-to-play-badge">
              <span className="material-symbols-outlined">stadia_controller</span>
              Desk manual
            </span>
            <p className="eyebrow">Game guide</p>
            <h2 className="how-to-play-title">Welcome to the Prediction Arena</h2>
            <p className="how-to-play-copy">
              This is a free-to-play prediction game where you test your intuition
              about real-world events. No real money. No risk. Just skill,
              strategy, and fun.
            </p>
          </div>

          <button
            aria-label="Close how to play guide"
            className="how-to-play-close"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="how-to-play-scroll">

          <section className="how-to-play-grid">
            {arenaSections.map((section) => (
              <article key={section.title} className="how-to-play-panel">
                <div className="how-to-play-panel-head">
                  <span className="how-to-play-panel-icon">
                    <span className="material-symbols-outlined">{section.icon}</span>
                  </span>

                  <div>
                    <p className="eyebrow">{section.kicker}</p>
                    <h4 className="type-heading-sm mt-3 uppercase">{section.title}</h4>
                  </div>
                </div>

                {section.intro ? (
                  <p className="how-to-play-panel-copy">{section.intro}</p>
                ) : null}

                {section.examples ? (
                  <div className="how-to-play-example-list">
                    {section.examples.map((example) => (
                      <span key={example} className="how-to-play-example">
                        {example}
                      </span>
                    ))}
                  </div>
                ) : null}

                <ul className="how-to-play-list">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </section>

          <section className="how-to-play-final">
            <p className="eyebrow">Most importantly</p>
            <h3 className="section-title">This is strategy, not gambling</h3>
            <p>
              This is a game of thinking and strategy, not luck or gambling.
              Have fun and play responsibly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
