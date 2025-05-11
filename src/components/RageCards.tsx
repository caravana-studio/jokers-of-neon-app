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
  const { isSmallScreen, cardScale } = useResponsiveValues();
  const { highlightCard } = useCardHighlight();

  const cardWidth = CARD_WIDTH * cardScale;
  const cardHeight = CARD_HEIGHT * cardScale;
  const visibleCards = rageCards.length;
  const maxVisibleCards = 5;
  const totalSpacing = (maxVisibleCards - 2) * 16;
  const containerWidth = cardWidth * maxVisibleCards + totalSpacing;

  return (
    <Box w={`${containerWidth}px`} pr={visibleCards >= 9 ? "7%" : 4}>
      <Flex
        width={"100%"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        gap={{ base: "8px", sm: "14px" }}
      >
        {!rageCards.length && (
          <Text mx={6} size="l">
            {t("no-cards")}
          </Text>
        )}
        {rageCards.length > 0 && (
          <SimpleGrid
            columns={visibleCards}
            position="relative"
            width={visibleCards > 5 ? "97%" : "max-content"}
            alignItems={isSmallScreen ? "center" : "inherit"}
            columnGap={3}
            pb={isSmallScreen ? 0 : 4}
          >
            {rageCards.map((card, index) => (
              <Box
                key={index}
                width={`${cardWidth}px`}
                onClick={() => isSmallScreen && highlightCard(card)}
              >
                <CardImage3D
                  card={card}
                  height={`${cardHeight}px`}
                  width={"auto"}
                  small
                />
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Flex>
    </Box>
  );
};
