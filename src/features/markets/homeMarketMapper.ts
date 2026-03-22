import type { MarketDto } from "@/api/market";
import {
  formatCompactCurrency,
  formatOdds,
  formatProbability,
  getCategoryIcon,
  getMarketCategory,
  getOutcomeIcon,
} from "./marketPresentation";

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

export function toHomeMarketCard(market: MarketDto): HomeMarketCard {
  const category = getMarketCategory(market.category);

  return {
    id: market.marketId,
    title: market.marketName,
    category,
    icon: getCategoryIcon(category),
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
