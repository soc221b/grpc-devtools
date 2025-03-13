import React from "react";
import { Tab, TabList as _TabList } from "@headlessui/react";
import { tabs } from "@/entities/detail";
import IconButton from "@/components/IconButton";
import { useDetailRequestId } from "@/hooks/use-detail-request-id";

const TabList = () => {
  const [, setDetailRequestId] = useDetailRequestId();
  const handleCloseDetail = () => {
    setDetailRequestId(null);
  };

  return (
    <div className="flex items-center bg-[#ffffff] dark:bg-[#282828]">
      <IconButton onClick={handleCloseDetail} data-detail-tab-close>
        <span className="material-symbols-rounded">close</span>
      </IconButton>
      <_TabList>
        {({ selectedIndex }) => (
          <>
            {tabs.map((tab, index) => {
              return (
                <Tab
                  data-detail-tab={tab}
                  key={tab}
                  className={
                    "p-1 cursor-default" +
                    (selectedIndex === index
                      ? " text-[#333333] dark:text-[#eaeaea] bg-[#f1f3f4] dark:bg-[#000000] border-b border-[#1b73e8] dark:border-none hover:bg-[#dfe1e5] dark:hover:bg-[#000000] focus-visible:bg-[#DFE1E5] dark:focus-visible:bg-[#202023]"
                      : " text-[#5f6367] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed] hover:bg-[#dfe1e5] dark:hover:bg-[#35363a]")
                  }
                >
                  {tab.toUpperCase()[0] + tab.toLowerCase().slice(1)}
                </Tab>
              );
            })}
          </>
        )}
      </_TabList>
    </div>
  );
};

export default TabList;
