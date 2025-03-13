import HorizontalDivider from "@/components/HorizontalDivider";
import { useDetail, useDetailDispatch } from "@/contexts/detail-context";
import { tabs } from "@/entities/detail";
import { TabGroup as _TabGroup } from "@headlessui/react";
import React from "react";
import TabList from "./tab-group/TabList";
import TabPanels from "./tab-group/TabPanels";

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
