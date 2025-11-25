import { Flex, Heading } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { useResponsiveValues } from "../../../theme/responsiveSettings";

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
`;
export const HereSign = () => {
  const { t } = useTranslation("map");
  const { isSmallScreen } = useResponsiveValues();
  return (
    <Flex
      position="absolute"
      width="90%"
      height="90%"
      left={"-110%"}
      pr={1}
      zIndex={0}
      alignItems="center"
      justifyContent="center"
    >
      <Heading
        textShadow={"0 0 10px white"}
        lineHeight={1}
        fontSize={isSmallScreen ? 10 : 8}
        textAlign={"right"}
        animation={`${pulse} 2s ease-in-out infinite`}
        transformOrigin="center"
      >
        {t("here")}
      </Heading>
    </Flex>
  );
};
