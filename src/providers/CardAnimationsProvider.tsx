import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Suits } from "../enums/suits";

interface ICardAnimationsContext {
  animatedCard: IAnimatedCard | undefined;
  setAnimatedCard: (card: IAnimatedCard | undefined) => void;
  animateSecondChanceCard: boolean;
  setAnimateSecondChanceCard: (animate: boolean) => void;
}

interface IAnimatedCard {
  idx?: number[];
  points?: number;
  multi?: number;
  suit?: Suits;
  special_idx?: number;
  animationIndex: number;
  cash?: number;
}

const CardAnimationsContext = createContext<ICardAnimationsContext>({
  animatedCard: undefined,
  setAnimatedCard: (_) => {},
  animateSecondChanceCard: false,
  setAnimateSecondChanceCard: (_) => {},
});
export const useCardAnimations = () => useContext(CardAnimationsContext);

export const CardAnimationsProvider = ({ children }: PropsWithChildren) => {
  const [animatedCard, setAnimatedCard] = useState<IAnimatedCard | undefined>();
  const [animateSecondChanceCard, setAnimateSecondChanceCard] = useState(false);
  return (
    <CardAnimationsContext.Provider
      value={{
        animatedCard,
        setAnimatedCard,
        animateSecondChanceCard,
        setAnimateSecondChanceCard,
      }}
    >
      {children}
    </CardAnimationsContext.Provider>
  );
};
