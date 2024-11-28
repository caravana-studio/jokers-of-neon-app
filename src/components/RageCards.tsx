import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { CARD_HEIGHT } from "../constants/visualProps";
import { useCardHighlight } from "../providers/CardHighlightProvider";
import { useGameContext } from "../providers/GameProvider";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { TiltCard } from "./TiltCard";

export const RageCards = () => {
  const { t } = useTranslation("game", { keyPrefix: "rage-cards" });
  const { rageCards } = useGameContext();
  const { isSmallScreen, cardScale } = useResponsiveValues();
  const { highlightCard } = useCardHighlight();

  return (
    <Box width={"100%"}>
      <Flex height={`${CARD_HEIGHT * cardScale}px`}>
        {!rageCards.length && (
          <Text mx={6} size="l">
            {t("no-cards")}
          </Text>
        )}
        {rageCards?.length && (
          <SimpleGrid
            columns={5}
            position="relative"
            width={"100%"}
          >
            {rageCards.map((card, index) => {
              return (
                <TiltCard
                  onClick={() => {
                    isSmallScreen && highlightCard(card);
                  }}
                  card={card}
                  scale={cardScale}
                  key={index}
                />
              );
            })}
          </SimpleGrid>
        )}
      </Flex>
    </Box>
  );
};
