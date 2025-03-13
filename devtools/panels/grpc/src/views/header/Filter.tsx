import React from "react";
import CaseSensitive from "./filter/CaseSensitive";
import Input from "./filter/Input";
import Invert from "./filter/Invert";

const Filter = () => {
  return (
    <div data-filter className="flex flex-wrap items-center px-1 gap-2">
      <Input></Input>
      <Invert></Invert>
      <CaseSensitive></CaseSensitive>
    </div>
  );
};

export default Filter;
