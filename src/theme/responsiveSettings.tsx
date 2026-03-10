import { useState, useEffect } from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import { throttle } from "lodash";

export const useResponsiveValues = () => {
  const [cardScale, setCardScale] = useState<number>(1);
  const [isCardScaleCalculated, setIsCardScaleCalculated] = useState(false);

  const baseScales: { [key: string]: number } = {
    "375:667": 2.5, //iphone SE
    "207:448": 2.6, //iphone XR
    "195:422": 2.6, //iphone 12 pro
    "215:466": 2.6, //iphone 14 pro max
    "412:915": 2.6, //pixel 7, samsung galaxy s20 ultra
    "18:37": 2.6, //samsung galaxy s8+
    "3:4": 2, //ipad mini, surface duo
    "4:3": 1, //ipad mini, surface duo (horizontal)
    "41:59": 2.2, //ipad air
    "59:41": 1.2, //ipad air (horizontal)
    "512:683": 2.2, //ipad pro
    "683:512": 1.3, //ipad pro (horizontal)
    "2:3": 2.2, //surface pro
    "3:2": 1.3, //surface pro (horizontal)
    "1280:853": 1.2, //asus zenbook fold (horizontal)
    "128:75": 0.7, //nest hub
    "8:5": 1.2, //nest hub max
    "640:289": 1.5, //desktop 4k
    "369:289": 1.6, //desktop 1476x1156
    "720:703": 1.5, //laptop L
    "256:289": 2.3, //laptop
    "16:9": 1.5, //laptop dami
    "16:10": 1.4, //steam deck
    "384:371": 1.4, //tablet
    "126:65": 1.4, //m3 pro chrome
    "756:407": 1.4, //m3 pro safari
  };

  const getBaseScaleForAspectRatio = (
    ratio: number,
    scales: { [key: string]: number }
  ): number => {
    const aspectScaleEntries = Object.entries(scales)
      .map(([key, scale]) => {
        const [width, height] = key.split(":").map(Number);

        return {
          scale,
          diff: Math.abs(width / height - ratio),
        };
      })
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 3);

    if (!aspectScaleEntries.length) return 1;

    const epsilon = 0.002;

    let weightedScale = 0;
    let totalWeight = 0;

    aspectScaleEntries.forEach(({ scale, diff }) => {
      const weight = 1 / (diff + epsilon);
      weightedScale += scale * weight;
      totalWeight += weight;
    });

    return totalWeight ? weightedScale / totalWeight : 1;
  };

  useEffect(() => {
    const handleResize = throttle(() => {
      const newAspectRatio = window.innerWidth / window.innerHeight;
      const baseScale = getBaseScaleForAspectRatio(newAspectRatio, baseScales);

      const widthScale = window.innerWidth / 1920;
      const heightScale = window.innerHeight / 1080;
      const minViewportScale = Math.min(widthScale, heightScale);
      const areaViewportScale = Math.sqrt(widthScale * heightScale);

      // In desktop we blend min-dimension and area scale to avoid abrupt jumps.
      const viewportScale =
        window.innerWidth >= 1024
          ? minViewportScale * 0.85 + areaViewportScale * 0.15
          : minViewportScale;

      const calculatedCardScale = baseScale * viewportScale;
      setCardScale(calculatedCardScale);

      setIsCardScaleCalculated(true);
    }, 200);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      handleResize.cancel();
    };
  }, []);

  const isSmallScreen = useBreakpointValue(
    { base: true, md: false },
    { ssr: false }
  );

  return { cardScale, isSmallScreen, isCardScaleCalculated };
};
