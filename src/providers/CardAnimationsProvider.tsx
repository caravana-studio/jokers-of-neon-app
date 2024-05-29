import { PropsWithChildren, createContext, useContext, useState } from "react";

interface ICardAnimationsContext {
  animatedCardIdx: number | undefined;
  setAnimatedCardIdx: (idx: number | undefined) => void;
  points: number;
  setPoints: (points: number) => void;
  multi: number;
  setMulti: (multi: number) => void;
}

const CardAnimationsContext = createContext<ICardAnimationsContext>({
  animatedCardIdx: undefined,
  setAnimatedCardIdx: (_) => {},
  points: 0,
  setPoints: (_) => {},
  multi: 0,
  setMulti: (_) => {},
});
export const useCardAnimations = () => useContext(CardAnimationsContext);

export const CardAnimationsProvider = ({ children }: PropsWithChildren) => {
  const [animatedCardIdx, setAnimatedCardIdx] = useState<number | undefined>();
  const [points, setPoints] = useState(0);
  const [multi, setMulti] = useState(0);
  return (
    <CardAnimationsContext.Provider
      value={{
        animatedCardIdx,
        setAnimatedCardIdx,
        points,
        setPoints,
        multi,
        setMulti,
      }}
    >
      {children}
    </CardAnimationsContext.Provider>
  );
};
