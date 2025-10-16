import React, { ReactNode, createContext, useContext, useState } from "react";
import { DeckFiltersContextType, DeckFiltersState } from "../types/DeckFilters";

const defaultFilters: DeckFiltersState = {
  isNeon: undefined,
  isModifier: undefined,
  isFigures: undefined,
  isAces: undefined,
  suit: null,
};

export const DeckFilterContext = createContext<DeckFiltersContextType | null>(
  null
);

export const DeckFilterProvider = ({ children }: { children: ReactNode }) => {
  const [filterButtonsState, setFilters] =
    useState<DeckFiltersState>(defaultFilters);

  const updateFilters = (filterToToggle: Partial<DeckFiltersState>) => {
    setFilters((currentFilters) => {
      const [key, value] = Object.entries(filterToToggle)[0] as [
        keyof DeckFiltersState,
        any,
      ];

      if (currentFilters[key] === value) {
        return defaultFilters;
      } else {
        return { ...defaultFilters, ...filterToToggle };
      }
    });
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
