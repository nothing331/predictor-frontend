import type { MarketOutcomeDto } from "@/api/market";

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

export function getMarketCategory(category?: string) {
  return category?.trim() || "General";
}

export function getCategoryIcon(category: string) {
  return categoryIconMap[category] || "hub";
}

export function getOutcomeIcon(
  outcomeId: MarketOutcomeDto["outcomeId"],
  index: number,
) {
  const icons = outcomeId === "YES" ? yesOutcomeIcons : noOutcomeIcons;
  return icons[index % icons.length];
}

export function formatProbability(probability: number) {
  return `${Math.round(clampProbability(probability) * 100)}%`;
}

export function formatOdds(probability: number) {
  if (probability <= 0) {
    return "--";
  }

  return `${(1 / probability).toFixed(2)}x`;
}

export function formatPrice(probability: number) {
  return `${Math.round(clampProbability(probability) * 100)}c`;
}

export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 1 : 2,
    notation: value >= 1000 ? "compact" : "standard",
    style: "currency",
  }).format(value);
}

function clampProbability(probability: number) {
  return Math.min(1, Math.max(0, probability));
}
