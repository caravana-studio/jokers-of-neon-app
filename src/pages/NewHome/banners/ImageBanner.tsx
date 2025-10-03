import { Flex } from "@chakra-ui/react";
import { useResponsiveValues } from "../../../theme/responsiveSettings";

interface ImageBannerProps {
  url: string;
}
export const ImageBanner = ({url}: ImageBannerProps) => {
  const { isSmallScreen } = useResponsiveValues();
  return (
    <Flex
      backgroundImage={`url('${url}')`}
      backgroundSize="cover"
      backgroundPosition="center"
      borderRadius={"15px"}
      w={isSmallScreen? "100%" : "700px"}
      h={isSmallScreen ? "120px" : "250px"}
    />
  );
};
