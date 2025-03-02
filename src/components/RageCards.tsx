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

  return (
    <Box width={"100%"}>
      <Flex
        width={"100%"}
        alignItems={"center"}
        gap={{ base: "8px", sm: "14px" }}
      >
        {!rageCards.length && (
          <Text mx={6} size="l">
            {t("no-cards")}
          </Text>
        )}
        {rageCards && rageCards.length > 0 && (
          <SimpleGrid
            columns={5}
            position="relative"
            width={"100%"}
            alignItems={isSmallScreen ? "center" : "inherit"}
            columnGap={2}
            pb={isSmallScreen ? 0 : 4}
          >
            {rageCards.map((card, index) => {
              return (
                <Box
                  position="relative"
                  height={`100%`}
                  width={`${CARD_WIDTH * cardScale}px`}
                  onClick={() => {
                    isSmallScreen && highlightCard(card);
                  }}
                  key={index}
                >
                  <CardImage3D
                    card={card}
                    small
                    height={`${CARD_HEIGHT * cardScale}`}
                  />
                </Box>
              );
            })}
          </SimpleGrid>
        )}
      </Flex>
    </Box>
  );
};
