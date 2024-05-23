import { createContext, useContext } from "react";
import { useGetStaticEffectCards } from "../queries/useGetStaticEffectCards";
import { StaticEffectCard } from "../types/Card";
import { useGetStaticEffects } from "../queries/useGetStaticEffects";

interface IStaticCardsContext {
  effectCards: StaticEffectCard[];
}

const StaticCardsContext = createContext<IStaticCardsContext>({
  effectCards: [],
});
export const useStaticCards = () => useContext(StaticCardsContext);

interface StaticCardProviderProps {
  children: React.ReactNode;
}

export const StaticCardsProvider = ({ children }: StaticCardProviderProps) => {
  const { data: effects } = useGetStaticEffects();
  const { data: effectCards } = useGetStaticEffectCards(effects);
  return (
    <StaticCardsContext.Provider value={{ effectCards }}>
      {children}
    </StaticCardsContext.Provider>
  );
};
