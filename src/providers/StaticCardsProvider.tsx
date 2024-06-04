import { PropsWithChildren, createContext, useContext } from "react";
import { useGetStaticCommonCards } from "../queries/useGetStaticCommonCards";
import { useGetStaticEffectCards } from "../queries/useGetStaticEffectCards";
import { useGetStaticEffects } from "../queries/useGetStaticEffects";
import { StaticCommonCard, StaticEffectCard } from "../types/Card";

interface IStaticCardsContext {
  effectCards: StaticEffectCard[];
  commonCards: StaticCommonCard[]
}

const StaticCardsContext = createContext<IStaticCardsContext>({
  effectCards: [],
  commonCards: []
});
export const useStaticCards = () => useContext(StaticCardsContext);

export const StaticCardsProvider = ({ children }: PropsWithChildren) => {
  const { data: effects } = useGetStaticEffects();
  const { data: effectCards } = useGetStaticEffectCards(effects);
  const { data: commonCards } = useGetStaticCommonCards();
  return (
    <StaticCardsContext.Provider value={{ effectCards, commonCards }}>
      {children}
    </StaticCardsContext.Provider>
  );
};
