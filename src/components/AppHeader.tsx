import { ReactNode } from "react";
import BrandMark from "./BrandMark";
import HeaderAccountActions from "./HeaderAccountActions";

type AppHeaderProps = {
  children?: ReactNode;
};

export default function AppHeader({ children }: AppHeaderProps) {
  return (
    <header className="surface-line mb-5 pb-5 md:mb-8 md:pb-8">
      <div className="flex items-center justify-between gap-3 md:gap-6">
        <BrandMark />
        <div className="flex items-center gap-2 md:gap-3">
          <HeaderAccountActions />
        </div>
      </div>

      {children ? (
        <div className="mt-3 flex flex-col gap-3 md:mt-4 md:flex-row md:items-center">
          {children}
        </div>
      ) : null}
    </header>
  );
}
