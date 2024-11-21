import { useState, useEffect } from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import { throttle } from "lodash";

export const useResponsiveValues = () => {
  const [aspectRatio, setAspectRatio] = useState<number>(
    window.innerWidth / window.innerHeight
  );
  const [cardScale, setCardScale] = useState<number>(1);
  const [specialCardScale, setSpecialCardScale] = useState<number>(1);
  const [isCardScaleCalculated, setIsCardScaleCalculated] = useState(false);

  const referenceWidthDesktop = 1920;
  const referenceHeightDesktop = 1080;

  const baseScales: { [key: string]: number } = {
    "375:667": 3.8,
    "768:1423": 2.5,
    "16:10": 1.4,
    "2:1": 1.4,
    "1.85:1": 1.4,
    "1.96:1": 1.4,
    "17:9": 1.8,
    "126:65": 1.8,
    "130:69": 1.4,
    "151:80": 1.4,
    "1774:937": 1.4,
    "1938:937": 1.3,
    "4:3": 1.6,
    "21:9": 1,
    "3:2": 1.4,
    "5:3": 1.5,
    "3:4": 2,
    "9:16": 2.5,
    "8:7": 1.9,
    "1024:1127": 2,
    "2.165:1": 1.35,
    "19:9": 1.2,
    "22:9": 1.2,
    "32:10": 1,
  };

  const specialBaseScales: { [key: string]: number } = {
    "375:667": 3.7,
    "768:1423": 2.5,
    "16:10": 1.2,
    "1.58:1": 0.9,
    "1.61:1": 0.9,
    "1.96:1": 0.9,
    "2:1": 0.9,
    "17:9": 1,
    "126:65": 1.8,
    "4:3": 0.85,
    "21:9": 0.7,
    "3:2": 0.9,
    "5:3": 0.8,
    "3:4": 1.7,
    "9:16": 2,
    "8:7": 0.8,
    "1024:1127": 1.1,
    "2.165:1": 0.7,
    "22:9": 1,
    "32:10": 1,
  };

  const getBaseScaleForAspectRatio = (
    ratio: number,
    isSpecialCard: boolean
  ): number => {
    const scales = isSpecialCard ? specialBaseScales : baseScales;

    const TOLERANCE = 0.0001;

    for (const key in scales) {
      const [width, height] = key.split(":").map(Number);
      const aspectRatio = width / height;

      if (Math.abs(aspectRatio - ratio) < TOLERANCE) {
        return scales[key];
      }
    }

    // If no exact match is found, find the closest match by comparing absolute differences
    let closestKey = "";
    let closestDiff = Infinity;

    Object.keys(scales).forEach((key) => {
      const [width, height] = key.split(":").map(Number);
      const aspectRatio = width / height;

      const diff = Math.abs(aspectRatio - ratio);

      if (diff < closestDiff) {
        closestDiff = diff;
        closestKey = key;
      }
    });

    // If no closest match, return 1 (or a fallback scale of your choice)
    return scales[closestKey] || 1;
  };

  useEffect(() => {
    const handleResize = throttle(() => {
      const newAspectRatio = window.innerWidth / window.innerHeight;
      setAspectRatio(newAspectRatio);

      const baseScale = getBaseScaleForAspectRatio(newAspectRatio, false);

      const specialBaseScale = getBaseScaleForAspectRatio(newAspectRatio, true);

      const horizontalFactor = window.innerWidth / 1920; // Relative to a reference width
      const verticalFactor = Math.min(1, window.innerHeight / 1080); // Limited by a reference height

      const calculatedCardScale = baseScale * horizontalFactor * verticalFactor;
      setCardScale(calculatedCardScale);

      const calculatedSpecialCardScale =
        specialBaseScale * horizontalFactor * verticalFactor;
      setSpecialCardScale(calculatedSpecialCardScale);

      setIsCardScaleCalculated(true);
    }, 200);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isSmallScreen = useBreakpointValue(
    { base: true, md: false },
    { ssr: false }
  );

  return { cardScale, specialCardScale, isSmallScreen, isCardScaleCalculated };
};
