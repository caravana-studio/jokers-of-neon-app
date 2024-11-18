import { Suits } from "../enums/suits";

export interface DeckFiltersState {
    isNeon?: boolean;
    isModifier?: boolean;
    suit: Suits | undefined | null;
  }
  
  export interface DeckFiltersContextType {
    filterButtonsState: DeckFiltersState;
    updateFilters: (newFilters: DeckFiltersState) => void;
  }