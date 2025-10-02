import { Flex } from "@chakra-ui/react";
import { useResponsiveValues } from "../../../theme/responsiveSettings";

export const ComingSeasonBanner = () => {
  const { isSmallScreen } = useResponsiveValues();
  return (
    <Flex
      backgroundImage="url('/banners/s1-coming-soon.png')"
      backgroundSize="cover"
      backgroundPosition="center"
      borderRadius={"15px"}
      w={isSmallScreen? "100%" : "700px"}
      h={isSmallScreen ? "120px" : "250px"}
    />
  );
};
