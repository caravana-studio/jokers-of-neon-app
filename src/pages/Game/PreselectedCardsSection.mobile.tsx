import { Box } from "@chakra-ui/react";
import { AnimatedCard } from "../../components/AnimatedCard.tsx";
import { CurrentPlay } from "../../components/CurrentPlay.tsx";
import { ModifiableCard } from "../../components/ModifiableCard.tsx";
import { TiltCard } from "../../components/TiltCard.tsx";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps.ts";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { Card } from "../../types/Card.ts";

export const MobilePreselectedCardsSection = () => {
  const {
    preSelectedCards,
    hand,
    getModifiers,
    togglePreselected,
    discardAnimation,
    playAnimation,
  } = useGameContext();

  return (
    <>
      <Box
        gap={2}
        py={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: `${CARD_HEIGHT * 2 + 70}px`,
          width: "100%",
        }}
        className="tutorial-modifiers-step-3"
      >
        <Box
          sx={{
            maxWidth: `${CARD_WIDTH * 5}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            minHeight: `${CARD_HEIGHT * 2 + 30}px`,
          }}
        >
          {preSelectedCards.map((idx) => {
            const card = hand.find((c) => c.idx === idx);
            const modifiers = getModifiers(idx);
            const modifiedCard: Card = { ...card!, modifiers };
            return (
              card && (
                <Box key={card.id} mx={3} mb={3}>
                  <ModifiableCard id={card.id}>
                    <AnimatedCard
                      idx={card.idx}
                      discarded={discardAnimation}
                      played={playAnimation}
                    >
                      <TiltCard
                        cursor="pointer"
                        card={modifiedCard}
                        onClick={() => {
                          togglePreselected(idx);
                        }}
                      />
                    </AnimatedCard>
                  </ModifiableCard>
                </Box>
              )
            );
          })}
        </Box>
        <CurrentPlay />
      </Box>
    </>
  );
};
