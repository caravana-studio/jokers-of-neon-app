import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps";
import { useCardHighlight } from "../providers/CardHighlightProvider";
import { useGameContext } from "../providers/GameProvider";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { CardImage3D } from "./CardImage3D";

export const RageCards = () => {
  const { t } = useTranslation("game", { keyPrefix: "rage-cards" });
  const { rageCards } = useGameContext();
  const { isSmallScreen, specialCardScale } = useResponsiveValues();
  const { highlightCard } = useCardHighlight();

  return (
    <Box width={"100%"}>
      <Flex
        height={`${CARD_HEIGHT * specialCardScale}px`}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {!rageCards.length && (
          <Text mx={6} size="l">
            {t("no-cards")}
          </Text>
        )}
        {rageCards && rageCards.length > 0 && (
          <SimpleGrid columns={5} position="relative" width={"100%"}>
            {rageCards.map((card, index) => {
              return (
                <Box
                  height={
                    CARD_HEIGHT * (specialCardScale - specialCardScale * 0.1)
                  }
                  width={
                    CARD_WIDTH * (specialCardScale - specialCardScale * 0.1)
                  }
                  onClick={() => {
                    isSmallScreen && highlightCard(card);
                  }}
                  key={index}
                >
                  <CardImage3D card={card} small rage />
                </Box>
              );
            })}
          </SimpleGrid>
        )}
      </Flex>
    </Box>
  );
};
