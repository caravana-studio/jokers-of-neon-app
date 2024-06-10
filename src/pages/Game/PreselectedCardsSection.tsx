import { Box } from "@chakra-ui/react";
import { ActionButton } from "../../components/ActionButton";
import { AnimatedCard } from "../../components/AnimatedCard";
import { ModifiableCard } from "../../components/ModifiableCard";
import { TiltCard } from "../../components/TiltCard";
import { CARD_WIDTH } from "../../constants/visualProps";
import { useGameContext } from "../../providers/GameProvider";
import { Card } from "../../types/Card";

export const PreselectedCardsSection = () => {
  const {
    preSelectedCards,
    round,
    play,
    hand,
    getModifiers,
    togglePreselected,
    discardAnimation,
    playAnimation,
    discard
  } = useGameContext();

  const handsLeft = round?.hands;
  const discardsLeft = round?.discards;

  return (
    <>
      <ActionButton
        position="LEFT"
        disabled={
          preSelectedCards?.length === 0 || !handsLeft || handsLeft === 0
        }
        onClick={play}
        label={["PLAY", "HAND"]}
        secondLabel={`${handsLeft} left`}
      />

      <Box
        sx={{
          width: `${CARD_WIDTH * 7}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {preSelectedCards.map((idx) => {
            const card = hand.find((c) => c.idx === idx);
            const modifiers = getModifiers(idx)
            const modifiedCard: Card = { ...card!, modifiers };
            return (
              card && (
                <Box key={card.id} sx={{ mx: 6 }}>
                  <ModifiableCard id={card.id}>
                    <AnimatedCard
                      idx={card.idx}
                      discarded={discardAnimation}
                      played={playAnimation}
                    >
                      <TiltCard
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
      </Box>
      <ActionButton
        position="RIGHT"
        disabled={
          preSelectedCards?.length === 0 || !discardsLeft || discardsLeft === 0
        }
        onClick={discard}
        label={["DIS", "CARD"]}
        secondLabel={`${discardsLeft} left`}
      />
    </>
  );
};
