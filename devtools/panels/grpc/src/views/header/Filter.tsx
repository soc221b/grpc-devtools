import React from "react";
import Input from "./filter/Input";
import Invert from "./filter/Invert";
import CaseSensitive from "./filter/CaseSensitive";

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
