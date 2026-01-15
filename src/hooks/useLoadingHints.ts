import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const HINT_ROTATION_INTERVAL = 4000;
const HINTS_COUNT = 11;

export const useLoadingHints = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "loading-screen.hints",
  });

  const hints = useMemo(() => {
    return Array.from({ length: HINTS_COUNT }, (_, i) => t(`${i + 1}`));
  }, [t]);

  const shuffledHints = useMemo(() => {
    return [...hints].sort(() => Math.random() - 0.5);
  }, [hints]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % shuffledHints.length);
    }, HINT_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [shuffledHints.length]);

  return shuffledHints[currentIndex];
};
