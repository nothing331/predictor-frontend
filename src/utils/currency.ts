export const FCoinSymbol = "ƒ";
export const FCoinName = "ƒCoin";

type FormatFCoinAmountOptions = {
  compact?: boolean;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
};

export function formatFCoinAmount(
  value: number,
  {
    compact = false,
    maximumFractionDigits = compact ? 1 : 2,
    minimumFractionDigits,
  }: FormatFCoinAmountOptions = {},
) {
  const amount = Number.isFinite(value) ? value : 0;
  const formattedValue = new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    minimumFractionDigits,
    notation: compact ? "compact" : "standard",
  }).format(amount);

  return `${FCoinSymbol}${formattedValue}`;
}

export function formatFCoinDelta(
  value: number,
  options?: Omit<FormatFCoinAmountOptions, "minimumFractionDigits">,
) {
  if (value === 0) {
    return `${FCoinSymbol}0`;
  }

  const sign = value > 0 ? "+" : "-";
  return `${sign}${formatFCoinAmount(Math.abs(value), options)}`;
}
