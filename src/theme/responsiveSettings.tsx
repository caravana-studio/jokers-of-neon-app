import { useState, useEffect } from "react";
import { useBreakpointValue } from "@chakra-ui/react";

export const useResponsiveValues = () => {
  const [aspectRatio, setAspectRatio] = useState<number>(
    window.innerWidth / window.innerHeight
  );
  const [baseScale, setBaseScale] = useState<number | undefined>(undefined);

  const defaultBaseScale = useBreakpointValue({
    base: 0.25,
    sm: 0.65,
    md: 0.65,
  });

  useEffect(() => {
    const handleResize = () => {
      const newAspectRatio = window.innerWidth / window.innerHeight;
      setAspectRatio(newAspectRatio);

      if (window.innerWidth === 540 && window.innerHeight === 720) {
        setBaseScale(0.4); // Adjust for 540x720 resolution
      } else if (window.innerWidth === 1024 && window.innerHeight === 1366) {
        setBaseScale(0.9); // Adjust for 1024x1366 resolution
      } else {
        setBaseScale(defaultBaseScale);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [defaultBaseScale]);

  const cardScale = baseScale
    ? baseScale *
      (aspectRatio > 1 ? 1 + (aspectRatio - 1) * 0.5 : 1 / aspectRatio)
    : 1;

  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return { cardScale, isSmallScreen };
};
