import { Box, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGameStore } from "../state/useGameStore";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { formatNumber } from "../utils/formatNumber";
import { RollingNumber } from "./RollingNumber";

interface ScoreTotalProps {
  plainDesktop?: boolean;
}

export const ScoreTotal = ({ plainDesktop = false }: ScoreTotalProps) => {
  const { t } = useTranslation(["game"]);
  const { isSmallScreen } = useResponsiveValues();
  const { totalScore } = useGameStore();
  const usePlainDesktopStyles = plainDesktop && !isSmallScreen;

  if (usePlainDesktopStyles) {
    return (
      <Flex width="100%" alignItems="center" gap={2}>
        <Text
          fontSize="10px"
          letterSpacing="0.08em"
          whiteSpace="nowrap"
          textTransform="uppercase"
          opacity={0.9}
        >
          {t("game.score-total")}
        </Text>
        <Box h="1px" flex={1} bg="whiteAlpha.500" />
        <Text
          whiteSpace="nowrap"
          fontSize={{ base: "10px", md: "14px" }}
          lineHeight={1}
          fontWeight={500}
          fontFamily="Orbitron"
        >
          {formatNumber(totalScore)}
        </Text>
      </Flex>
    );
  }

  return (
    <Text
      size="s"
      mt={0}
      textAlign={["right", "center"]}
      whiteSpace="nowrap"
    >
      {t("game.score-total")}: <RollingNumber n={totalScore} />
    </Text>
  );
};
