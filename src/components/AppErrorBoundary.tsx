import { Component, ErrorInfo, ReactNode } from "react";
import BrandMark from "./BrandMark";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export default class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App crashed", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-shell">
          <div className="page-content auth-stage">
            <section className="auth-card app-panel-subtle w-full">
              <div className="auth-card-header px-6 py-7 md:px-8 md:py-8">
                <BrandMark caption="Application fallback" />
                <div className="space-y-3">
                  <p className="eyebrow">Unexpected error</p>
                  <h1 className="type-heading-lg uppercase">
                    We hit a rendering problem
                  </h1>
                  <p className="type-body-md text-[color:var(--text-muted)]">
                    The app ran into an unexpected UI error. Reload this page to
                    continue, and check the latest popup for API-related details.
                  </p>
                </div>
              </div>

              <div className="section-divider px-6 py-7 md:px-8 md:py-8">
                <button
                  className="action-secondary"
                  onClick={() => window.location.reload()}
                  type="button"
                >
                  Reload app
                </button>
              </div>
            </section>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
