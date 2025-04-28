import { useEffect, useRef, useState } from "react";

export const useCardsFlipAnimation = (
  cardsLength: number,
  flipDelay: number,
  flipDuration: number
) => {
  const [flippedStates, setFlippedStates] = useState<boolean[]>([]);
  const [animationRunning, setAnimationRunning] = useState(true);
  const timeoutIds = useRef<number[]>([]);

  useEffect(() => {
    setFlippedStates(Array(cardsLength).fill(true));

    const delayTimeout = window.setTimeout(() => {
      for (let i = 0; i < cardsLength; i++) {
        const timeoutId = window.setTimeout(() => {
          setFlippedStates((prev) => {
            const updated = [...prev];
            updated[i] = false;
            return updated;
          });
        }, i * flipDuration);
        timeoutIds.current.push(timeoutId);
      }
    }, flipDelay);

    const finishTimeout = window.setTimeout(
      () => {
        setAnimationRunning(false);
      },
      flipDelay + cardsLength * flipDuration
    );

    timeoutIds.current.push(delayTimeout, finishTimeout);

    return () => {
      timeoutIds.current.forEach(clearTimeout);
      timeoutIds.current = [];
    };
  }, [cardsLength]);

  const skipFlipping = () => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
    setFlippedStates(Array(cardsLength).fill(false));
    setAnimationRunning(false);
  };

  return {
    flippedStates,
    animationRunning,
    skipFlipping,
  };
};
