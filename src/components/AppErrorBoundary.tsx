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
                <BrandMark />
                <div className="space-y-3">
                  <p className="eyebrow">Unexpected error</p>
                  <h1 className="type-heading-lg uppercase">
                    Something went wrong
                  </h1>
                  <p className="type-body-md text-[color:var(--text-muted)]">
                    Something unexpected happened. Please reload the page to continue.
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
