import React, { ReactNode, createContext, useContext, useState } from "react";
import { DeckFiltersContextType, DeckFiltersState } from "../types/DeckFilters";

const defaultFilters: DeckFiltersState = {
  isNeon: undefined,
  isModifier: undefined,
  suit: null,
};

export const DeckFilterContext = createContext<DeckFiltersContextType | null>(
  null
);

export const DeckFilterProvider = ({ children }: { children: ReactNode }) => {
  const [filterButtonsState, setFilterButtonsState] =
    useState<DeckFiltersState>(defaultFilters);

  const updateFilters = (newFilters: DeckFiltersState) => {
    setFilterButtonsState(newFilters);
  };

  return (
    <DeckFilterContext.Provider value={{ filterButtonsState, updateFilters }}>
      {children}
    </DeckFilterContext.Provider>
  );
};

export const useDeckFilters = (): DeckFiltersContextType => {
  const context = useContext(DeckFilterContext);
  if (!context) {
    throw new Error("useDeckFilters must be used within a DeckFilterProvider");
  }
  return context;
};
