import { useBreakpointValue } from "@chakra-ui/react";

export const useResponsiveValues = () => {
  const cardScale = useBreakpointValue({
    base: 0.57,
    sm: 1.1,
    md: 1,
  });

  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return { cardScale, isSmallScreen };
};
