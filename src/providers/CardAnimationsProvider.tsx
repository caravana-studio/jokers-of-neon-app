import { PropsWithChildren, createContext, useContext, useState } from "react";

interface ICardAnimationsContext {
  animatedCard: IAnimatedCard | undefined;
  setAnimatedCard: (card: IAnimatedCard | undefined) => void;
}

interface IAnimatedCard {
  idx: number;
  points?: number;
  multi?: number;
  special_idx?: number;
}

const CardAnimationsContext = createContext<ICardAnimationsContext>({
  animatedCard: undefined,
  setAnimatedCard: (_) => {},
});
export const useCardAnimations = () => useContext(CardAnimationsContext);

export const CardAnimationsProvider = ({ children }: PropsWithChildren) => {
  const [animatedCard, setAnimatedCard] = useState<IAnimatedCard | undefined>();
  return (
    <CardAnimationsContext.Provider
      value={{
        animatedCard,
        setAnimatedCard,
      }}
    >
      {children}
    </CardAnimationsContext.Provider>
  );
};
