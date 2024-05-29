import { PropsWithChildren, createContext, useContext } from "react";
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

export const StaticCardsProvider = ({ children }: PropsWithChildren) => {
  const { data: effects } = useGetStaticEffects();
  const { data: effectCards } = useGetStaticEffectCards(effects);
  return (
    <StaticCardsContext.Provider value={{ effectCards }}>
      {children}
    </StaticCardsContext.Provider>
  );
};
