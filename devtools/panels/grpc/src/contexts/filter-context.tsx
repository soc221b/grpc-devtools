import { FilterAction, filterReducer, initialFilter } from "@/reducers/filter-reducer";
import React, { createContext, useContext, useReducer } from "react";

export const FilterContext = createContext(initialFilter);

export const FilterDispatchContext = createContext<React.Dispatch<FilterAction>>(() => {});

export const FilterProvider = ({ children }: { children?: JSX.Element }) => {
  const [
    filter,
    dispatch,
  ] = useReducer(filterReducer, initialFilter);

  return (
    <FilterContext.Provider value={filter}>
      <FilterDispatchContext.Provider value={dispatch}>{children}</FilterDispatchContext.Provider>
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  return useContext(FilterContext);
};

export const useFilterDispatch = () => {
  return useContext(FilterDispatchContext);
};
