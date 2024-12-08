import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Suits } from "../enums/suits";

interface ICardAnimationsContext {
  animatedCard: IAnimatedCard | undefined;
  setAnimatedCard: (card: IAnimatedCard | undefined) => void;
  animateSecondChanceCard: boolean;
  setAnimateSecondChanceCard: (animate: boolean) => void;
  animatedPowerUp: IAnimatedPowerUp | undefined;
  setAnimatedPowerUp: (powerUp: IAnimatedPowerUp | undefined) => void;
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

interface IAnimatedPowerUp {
  idx?: number;
  points?: number;
  multi?: number;
  animationIndex: number;
}

const CardAnimationsContext = createContext<ICardAnimationsContext>({
  animatedCard: undefined,
  setAnimatedCard: (_) => {},
  animateSecondChanceCard: false,
  setAnimateSecondChanceCard: (_) => {},
  animatedPowerUp: undefined,
  setAnimatedPowerUp: (_) => {},
});
export const useCardAnimations = () => useContext(CardAnimationsContext);

export const CardAnimationsProvider = ({ children }: PropsWithChildren) => {
  const [animatedCard, setAnimatedCard] = useState<IAnimatedCard | undefined>();
  const [animatedPowerUp, setAnimatedPowerUp] = useState<
  IAnimatedPowerUp | undefined
  >();
  const [animateSecondChanceCard, setAnimateSecondChanceCard] = useState(false);
  return (
    <CardAnimationsContext.Provider
      value={{
        animatedCard,
        setAnimatedCard,
        animateSecondChanceCard,
        setAnimateSecondChanceCard,
        animatedPowerUp,
        setAnimatedPowerUp,
      }}
    >
      {children}
    </CardAnimationsContext.Provider>
  );
};
