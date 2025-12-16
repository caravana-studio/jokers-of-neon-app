import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { BLUE, BLUE_RGBA } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";

type DiscountSignProps = {
  percentage: number;
  label?: string;
};

const glowPulse = keyframes`
  from {
    box-shadow: 0 0 20px 10px ${BLUE};
  }
  to {
    box-shadow: 0 0 5px 2px ${BLUE_RGBA(0.2)};
  }
`;

const textGlowPulse = keyframes`
  from {
      text-shadow: 0 0 7px white;
    }
    to {
      text-shadow: 0 0 1px white;
  }
`;

export const DiscountSign = ({
  percentage,
  label = "OFF",
}: DiscountSignProps) => {
  const { isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop.discount-sign",
  });
  return (
    <Box
      position="fixed"
      top={{ base: "115px", md: "210px" }}
      right={{ base: "-55px", md: "-80px" }}
      zIndex={1500}
      pointerEvents="none"
    >
      <Flex
        align="center"
        justify="center"
        w={{ base: "250px", md: "450px" }}
        h={{ base: "48px", md: "100px" }}
        transform="rotate(40deg)"
        transformOrigin="top right"
        bgColor={BLUE}
        boxShadow={`0 0 20px 5px ${BLUE}`}
        animation={`${glowPulse} 1s ease-in-out infinite alternate`}
        position="relative"
        aria-label={`${percentage}% ${label}`}
        flexDir={"column"}
        gap={0}
      >
        <Box
          as="span"
          display="flex"
          alignItems="center"
          gap={{ base: 1, md: 2 }}
          fontWeight={700}
        >
          <Heading
            fontSize={isSmallScreen ? "30px" : "70px"}
            lineHeight={1}
            animation={`${textGlowPulse} 1s ease-in-out infinite alternate`}
          >
            {percentage}%
          </Heading>
          <Heading
            fontSize={{ base: "14px", md: "25px" }}
            animation={`${textGlowPulse} 1s ease-in-out infinite alternate`}
          >
            {label}
          </Heading>
        </Box>
        <Text fontSize={{ base: "10px", md: "15px" }} lineHeight={1}>
          {t("all-products")}
        </Text>
      </Flex>
    </Box>
  );
};
