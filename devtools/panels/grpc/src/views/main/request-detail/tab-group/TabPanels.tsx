import useIsFocusIn from "@/hooks/use-is-focus-in";
import { TabPanels as _TabPanels } from "@headlessui/react";
import React, { useRef } from "react";
import TabPanelHeaders from "./tab-panels/TabPanelHeaders";
import TabPanelMessages from "./tab-panels/TabPanelMessages";

const TabPanels = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isFocusIn = useIsFocusIn({ ref, initialValue: false });

  return (
    <_TabPanels
      ref={ref}
      className="absolute w-full top-[25px] right-0 bottom-0 left-0 overflow-auto"
    >
      <TabPanelHeaders isFocusIn={isFocusIn}></TabPanelHeaders>
      <TabPanelMessages isFocusIn={isFocusIn}></TabPanelMessages>
    </_TabPanels>
  );
};

export default TabPanels;
