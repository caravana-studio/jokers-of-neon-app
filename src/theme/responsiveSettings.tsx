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

  const baseScales: { [key: string]: number } = {
    "16:9": 1.5,
    "16:10": 2, //si
    "4:3": 3.6,
    "3:2": 1.3,
    "21:9": 1.8,
    "18.5:9": 1.6,
    "5:3": 1.35,
    "2.39:1": 1.7,
    "3:4": 2.5, //si
    "9:16": 3.6, //si
    "8:7": 2, //si
  };

  const specialBaseScales: { [key: string]: number } = {
    "16:9": 1.2,
    "16:10": 1.1,
    "4:3": 1.0,
    "3:2": 1.1,
    "21:9": 1.5,
    "18.5:9": 1.3,
    "5:3": 1.1,
    "2.39:1": 1.6,
    "3:4": 1.2,
    "9:16": 2,
    "8:7": 1.2, //si
  };

  const getBaseScaleForAspectRatio = (
    ratio: number,
    isSpecialCard: boolean
  ): number => {
    const scales = isSpecialCard ? specialBaseScales : baseScales;

    for (const key in scales) {
      const [width, height] = key.split(":").map(Number);
      const aspectRatio = width / height;

      if (Math.abs(aspectRatio - ratio) < 0.0001) {
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

    return scales[closestKey] || 1;
  };

  useEffect(() => {
    const handleResize = throttle(() => {
      const newAspectRatio = window.innerWidth / window.innerHeight;
      setAspectRatio(newAspectRatio);

      console.log("aspect ratio: " + newAspectRatio);
      console.log(
        "base scale ratio: " + getBaseScaleForAspectRatio(newAspectRatio, false)
      );

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
