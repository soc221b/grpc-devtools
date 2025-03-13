import VerticalDivider from "@/components/VerticalDivider";
import React from "react";
import ClearAll from "./toolbar/ClearAll";
import ShouldRecord from "./toolbar/ShouldRecord";
import ShouldShowFilter from "./toolbar/ShouldShowFilter";
// import ShouldShowSearch from "./toolbar/ShouldShowSearch";
import Rate from "@/components/Rate";
import BugReport from "./toolbar/BugReport";
import Download from "./toolbar/Download";
import ShouldPreserveLog from "./toolbar/ShouldPreserveLog";
import Upload from "./toolbar/Upload";

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
