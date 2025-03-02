import React from "react";
import { TabGroup as _TabGroup } from "@headlessui/react";
import TabList from "./tab-group/TabList";
import TabPanels from "./tab-group/TabPanels";
import HorizontalDivider from "@/components/HorizontalDivider";
import { tabs } from "@/entities/detail";
import { useDetail, useDetailDispatch } from "@/contexts/detail-context";

const TabGroup = () => {
  const detail = useDetail();
  const detailDispatch = useDetailDispatch();
  const selectedIndex = tabs.findIndex((tab) => tab === detail.tab);

  return (
    <_TabGroup
      selectedIndex={selectedIndex}
      onChange={(index: number) => {
        detailDispatch({
          type: "switchedTab",
          tab: tabs.find((_, i) => i === index)!,
        });
      }}
      data-detail-request-id={detail.requestId}
      className="relative flex flex-col flex-1 min-w-[160px]"
    >
      <TabList></TabList>
      <div className="z-10">
        <HorizontalDivider></HorizontalDivider>
      </div>
      <TabPanels></TabPanels>
    </_TabGroup>
  );
};

export default TabGroup;
