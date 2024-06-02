import { GridItem, Heading, SimpleGrid } from "@chakra-ui/react";
import { TiltCard } from "../../components/TiltCard";
import { CARD_WIDTH } from "../../constants/visualProps";
import { useGameContext } from "../../providers/GameProvider";

export const HandSection = () => {
  const { round, hand, preSelectedCards, togglePreselected } = useGameContext();
  const handsLeft = round.hands;

  const cardIsPreselected = (cardIndex: number) => {
    return preSelectedCards.filter((idx) => idx === cardIndex).length > 0;
  };

  return (
    <>
      <SimpleGrid
        sx={{
          opacity: handsLeft > 0 ? 1 : 0.3,
          minWidth: `${CARD_WIDTH * 4}px`,
          maxWidth: `${CARD_WIDTH * 6.5}px`,
        }}
        columns={8}
      >
        {hand.map((card, index) => {
          return (
            <GridItem
              key={card.idx}
              w="100%"
              sx={{
                transform: ` rotate(${
                  (index - 3.5) * 3
                }deg) translateY(${Math.abs(index - 3.5) * 10}px)`,
              }}
            >
              {!cardIsPreselected(card.idx) && (
                <TiltCard
                  card={card}
                  onClick={() => {
                    if (!card.isModifier) {
                      togglePreselected(card.idx);
                    }
                  }}
                />
              )}
            </GridItem>
          );
        })}
      </SimpleGrid>
      {handsLeft === 0 && (
        <Heading
          variant="neonGreen"
          sx={{ position: "fixed", bottom: "100px", fontSize: 30 }}
        >
          you ran out of hands to play
        </Heading>
      )}
    </>
  );
};
