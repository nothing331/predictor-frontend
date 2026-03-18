import { ReactNode } from "react";
import BrandMark from "./BrandMark";

type AuthScaffoldProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  highlights: Array<{ icon: string; title: string; copy: string }>;
  stats: Array<{ label: string; value: string }>;
  children: ReactNode;
};

export default function AuthScaffold({
  eyebrow,
  title,
  subtitle,
  highlights,
  stats,
  children,
}: AuthScaffoldProps) {
  return (
    <div className="page-shell">
      <div className="page-content flex min-h-screen items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="app-panel app-panel-strong flex flex-col gap-8 p-6 md:p-8 lg:p-10">
            <BrandMark caption="Fast, social, high-signal forecasting" />

            <div className="space-y-4">
              <p className="eyebrow">{eyebrow}</p>
              <h1 className="display-title max-w-2xl">{title}</h1>
              <p className="max-w-xl text-base leading-relaxed text-[color:var(--text-muted)] md:text-lg">
                {subtitle}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="app-panel auth-stat">
                  <span className="eyebrow">{stat.label}</span>
                  <span className="metric-value text-primary">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="grid gap-4">
              {highlights.map((highlight) => (
                <div key={highlight.title} className="list-row">
                  <span className="list-icon">
                    <span className="material-symbols-outlined">
                      {highlight.icon}
                    </span>
                  </span>
                  <div>
                    <p className="font-semibold uppercase tracking-[0.18em]">
                      {highlight.title}
                    </p>
                    <p className="muted-copy mt-2 leading-relaxed">
                      {highlight.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="app-panel flex items-center p-5 md:p-8 lg:p-10">
            <div className="w-full">{children}</div>
          </section>
        </div>
      </div>
    </div>
  );
}
