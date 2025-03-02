import React from "react";
import VerticalDivider from "@/components/VerticalDivider";
import ShouldRecord from "./toolbar/ShouldRecord";
import ClearAll from "./toolbar/ClearAll";
import ShouldShowFilter from "./toolbar/ShouldShowFilter";
// import ShouldShowSearch from "./toolbar/ShouldShowSearch";
import ShouldPreserveLog from "./toolbar/ShouldPreserveLog";
import BugReport from "./toolbar/BugReport";
import Rate from "@/components/Rate";
import Upload from "./toolbar/Upload";
import Download from "./toolbar/Download";

const Toolbar = () => {
  return (
    <div className="flex flex-wrap items-center select-none px-1">
      <ShouldPreserveLog></ShouldPreserveLog>
      <ShouldRecord></ShouldRecord>
      <ClearAll></ClearAll>
      <VerticalDivider className="mx-1"></VerticalDivider>
      <ShouldShowFilter></ShouldShowFilter>
      {/* <ShouldShowSearch></ShouldShowSearch> */}
      <VerticalDivider className="mx-1"></VerticalDivider>
      <Upload></Upload>
      <Download></Download>
      <div className="grow"></div>
      <Rate></Rate>
      <BugReport></BugReport>
    </div>
  );
};

export default Toolbar;
