import type { MarketDto } from "@/api/market";

export type HomeMarketCard = {
  id: string;
  title: string;
  category: string;
  icon: string;
  volume: string;
  statusLabel: string;
  outcomes: {
    id: "YES" | "NO";
    label: string;
    probability: string;
    odds: string;
    icon: string;
    accent: string;
  }[];
};

const categoryIconMap: Record<string, string> = {
  Tech: "neurology",
  Politics: "ballot",
  Sports: "sports_basketball",
  Crypto: "currency_bitcoin",
  General: "hub",
};

const yesOutcomeIcons = [
  "trending_up",
  "task_alt",
  "bolt",
  "rocket_launch",
];

const noOutcomeIcons = [
  "trending_flat",
  "block",
  "schedule",
  "shield",
];

export function toHomeMarketCard(market: MarketDto): HomeMarketCard {
  const category = market.category?.trim() || "General";

  return {
    id: market.marketId,
    title: market.marketName,
    category,
    icon: categoryIconMap[category] || "hub",
    volume: `${formatCompactCurrency(market.totalValue)} vol`,
    statusLabel: market.status === "OPEN" ? "Live market" : "Resolved",
    outcomes: market.outcomes.map((outcome, index) => ({
      id: outcome.outcomeId,
      label: outcome.label,
      probability: formatProbability(outcome.probability),
      odds: formatOdds(outcome.probability),
      accent: index === 0 ? "bg-primary" : "bg-secondary",
      icon: getOutcomeIcon(outcome.outcomeId, index),
    })),
  };
}

function formatProbability(probability: number) {
  return `${Math.round(probability * 100)}%`;
}

function formatOdds(probability: number) {
  if (probability <= 0) {
    return "--";
  }

  return `${(1 / probability).toFixed(2)}x`;
}

function getOutcomeIcon(outcomeId: "YES" | "NO", index: number) {
  const icons = outcomeId === "YES" ? yesOutcomeIcons : noOutcomeIcons;
  return icons[index % icons.length];
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 1 : 2,
    notation: value >= 1000 ? "compact" : "standard",
    style: "currency",
  }).format(value);
}
