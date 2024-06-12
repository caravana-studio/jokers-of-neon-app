import { Box } from "@chakra-ui/react";
import { ActionButton } from "../../components/ActionButton";
import { AnimatedCard } from "../../components/AnimatedCard";
import { CurrentPlay } from "../../components/CurrentPlay.tsx";
import { ModifiableCard } from "../../components/ModifiableCard";
import { RewardsDetail } from "../../components/RewardsDetail.tsx";
import { TiltCard } from "../../components/TiltCard";
import { CARD_HEIGHT_PX, CARD_WIDTH } from "../../constants/visualProps";
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
    discard,
    roundRewards,
  } = useGameContext();

  const handsLeft = round?.hands;
  const discardsLeft = round?.discards;

  return roundRewards ? (
    <RewardsDetail roundRewards={roundRewards} />
  ) : (
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
          gap: 5,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", height: CARD_HEIGHT_PX }}>
          {preSelectedCards.map((idx) => {
            const card = hand.find((c) => c.idx === idx);
            const modifiers = getModifiers(idx);
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
        <CurrentPlay />
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
