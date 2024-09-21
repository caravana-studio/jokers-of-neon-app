import { Box, Button, Flex, Text, useTheme } from "@chakra-ui/react";
import { useState } from "react";
import { useCurrentSpecialCards } from "../dojo/queries/useCurrentSpecialCards.tsx";
import { useGame } from "../dojo/queries/useGame";
import { useGameContext } from "../providers/GameProvider.tsx";
import { Card } from "../types/Card.ts";
import { CardsRow } from "./CardsRow";
import { TiltCard } from "./TiltCard.tsx";

interface SpecialCardsProps {
  inStore?: boolean;
}

export const SpecialCards = ({ inStore = false }: SpecialCardsProps) => {
  const { colors } = useTheme();
  const game = useGame();
  const maxLength = game?.len_max_current_special_cards ?? 5;

  const { discardSpecialCard, specialCards, isRageRound } = useGameContext();
  const [discardedCards, setDiscardedCards] = useState<Card[]>([]);
  const [preselectedCard, setPreselectedCard] = useState<Card | undefined>();

  return (
    <Box
      className="special-cards-step-3"
      width="100%"
      boxShadow={inStore ? "none" : `0px 26px 30px -30px ${isRageRound ? colors.neonPink : colors.neonGreen}`}
    >
      {inStore ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {specialCards.map((card) => {
            const isDiscarded = discardedCards
              .map((card) => card.card_id)
              .includes(card.card_id!);

            return (
              card &&
              !isDiscarded && (
                <Box
                  key={card.id}
                  mx={3}
                  mb={3}
                  sx={{
                    borderRadius: 5,
                    boxShadow:
                      preselectedCard?.card_id === card.card_id
                        ? `0px 0px 10px 4px ${colors.neonGreen}`
                        : "none",
                  }}
                >
                  <TiltCard
                    card={card}
                    onClick={() => {
                      setPreselectedCard((prev) =>
                        prev === card ? undefined : card
                      );
                    }}
                  />
                </Box>
              )
            );
          })}
        </Box>
      ) : (
        <CardsRow cards={specialCards} />
      )}
      <Flex sx={{ mt: 1, mx: 1 }} justifyContent="space-between">
        <Box>{!inStore && <Text size="l">Special cards</Text>}</Box>
        <Text className="special-cards-step-2" size="l">
          {"<"}
          {specialCards.length}/{maxLength}
          {">"}
        </Text>
      </Flex>
      {inStore && (
        <Flex mt={4} justifyContent='flex-end'>
          <Button
            variant={preselectedCard === undefined ? "defaultOutline" : "solid"}
            isDisabled={preselectedCard === undefined}
            width={{base: "100%", md: "30%"}}
            fontSize={12}
            onClick={() => {
              preselectedCard &&
                discardSpecialCard(preselectedCard.idx).then((response) => {
                  if (response) {
                    setDiscardedCards((prev) => [...prev, preselectedCard]);
                    setPreselectedCard(undefined);
                  }
                });
            }}
          >
            Drop card
          </Button>
        </Flex>
      )}
    </Box>
  );
};
