import { ReactNode } from "react";
import BrandMark from "./BrandMark";

type AuthScaffoldProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthScaffold({
  eyebrow,
  title,
  subtitle,
  children,
}: AuthScaffoldProps) {
  return (
    <div className="page-shell">
      <div className="page-content auth-stage">
        <section className="auth-card app-panel-subtle w-full">
          <div className="auth-card-header px-6 py-7 md:px-8 md:py-8">
            <BrandMark caption="Account access" />

            <div className="space-y-3">
              <p className="eyebrow">{eyebrow}</p>
              <h1 className="type-heading-lg uppercase">{title}</h1>
              <p className="max-w-xl leading-relaxed text-[color:var(--text-muted)]">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="section-divider px-6 py-7 md:px-8 md:py-8">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
