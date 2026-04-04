import { ReactNode } from "react";
import BrandMark from "./BrandMark";
import HeaderAccountActions from "./HeaderAccountActions";

type AppHeaderProps = {
  children?: ReactNode;
};

export default function AppHeader({ children }: AppHeaderProps) {
  return (
    <header className="surface-line mb-8 pb-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <BrandMark />

        <div className="flex flex-1 flex-col gap-4 xl:max-w-4xl xl:flex-row xl:items-center xl:justify-end">
          {children}
          <HeaderAccountActions />
        </div>
      </div>
    </header>
  );
}
