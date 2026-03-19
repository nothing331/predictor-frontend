import { Link } from "react-router-dom";

type BrandMarkProps = {
  caption?: string;
  to?: string;
};

export default function BrandMark({
  caption = "Signal-led prediction exchange",
  to = "/",
}: BrandMarkProps) {
  return (
    <Link className="brand-mark" to={to}>
      <span className="brand-sigil">
        <span className="material-symbols-outlined text-[2rem] font-bold">
          bolt
        </span>
      </span>
      <span className="min-w-0">
        <span className="brand-wordmark block">PredictKaro</span>
        <span className="eyebrow block mt-2">{caption}</span>
      </span>
    </Link>
  );
}
