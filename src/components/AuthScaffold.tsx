import { ReactNode } from "react";
import { Link } from "react-router-dom";
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
            <div className="flex items-center justify-between gap-4">
              <BrandMark />
              <Link
                className="eyebrow text-[inherit] no-underline flex items-center gap-1"
                to="/"
              >
                Browse markets
                <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
              </Link>
            </div>

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
