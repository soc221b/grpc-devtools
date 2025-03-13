import IconButton from "@/components/IconButton";
import React, { useState } from "react";

const ShouldShowSearch = () => {
  const [
    shouldOpenSearchSidebar,
    setShouldOpenSearchSidebar,
  ] = useState(false);

  return (
    <IconButton onClick={() => setShouldOpenSearchSidebar(!shouldOpenSearchSidebar)}>
      <span className="material-symbols-rounded">search</span>
    </IconButton>
  );
};

export default ShouldShowSearch;
