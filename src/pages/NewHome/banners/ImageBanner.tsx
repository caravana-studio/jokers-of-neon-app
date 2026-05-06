import { Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useResponsiveValues } from "../../../theme/responsiveSettings";

interface ImageBannerProps {
  url: string;
  navigateTo?: string;
}
export const ImageBanner = ({ url, navigateTo }: ImageBannerProps) => {
  const { isSmallScreen } = useResponsiveValues();
  const navigate = useNavigate();
  return (
    <Flex
      backgroundImage={`url('${url}')`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundColor="rgba(0,0,0,0.5)"
      borderRadius={"15px"}
      w="100%"
      h={isSmallScreen ? "120px" : "250px"}
      onClick={() => {
        if (navigateTo) {
          navigateTo.startsWith("http")
            ? window.open(navigateTo, "_blank")
            : navigate(navigateTo);
        }
      }}
    />
  );
};
