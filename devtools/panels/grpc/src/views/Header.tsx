import HorizontalDivider from "@/components/HorizontalDivider";
import { useConfig } from "@/contexts/config-context";
import React from "react";
import Filter from "./header/Filter";
import Toolbar from "./header/Toolbar";

const Header = ({ headerRef }: { headerRef: React.ClassAttributes<HTMLElement>["ref"] | null }) => {
  const config = useConfig();

  return (
    <header ref={headerRef} className="flex flex-col bg-[#ffffff] dark:bg-[#282828]">
      <Toolbar></Toolbar>
      <HorizontalDivider></HorizontalDivider>
      {config.shouldShowFilter && (
        <>
          <Filter></Filter>
          <HorizontalDivider></HorizontalDivider>
        </>
      )}
    </header>
  );
};

export default Header;
