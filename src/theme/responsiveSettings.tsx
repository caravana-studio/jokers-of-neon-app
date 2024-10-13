import { useState, useEffect } from "react";
import { useBreakpointValue } from "@chakra-ui/react";

export const useResponsiveValues = () => {
  const [aspectRatio, setAspectRatio] = useState<number>(
    window.innerWidth / window.innerHeight
  );

  useEffect(() => {
    const handleResize = () => {
      const newAspectRatio = window.innerWidth / window.innerHeight;
      setAspectRatio(newAspectRatio);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const baseScale = useBreakpointValue({
    base: 0.25,
    sm: 0.78,
    md: 0.45,
  });

  const cardScale =
    baseScale && aspectRatio
      ? aspectRatio > 1
        ? baseScale * aspectRatio
        : baseScale * (1 / aspectRatio)
      : 1;

  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return { cardScale, isSmallScreen };
};
