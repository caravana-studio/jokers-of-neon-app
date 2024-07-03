import { Box } from "@chakra-ui/react";
import { ActionButton } from "../../components/ActionButton";
import { AnimatedCard } from "../../components/AnimatedCard";
import { CurrentPlay } from "../../components/CurrentPlay.tsx";
import { ModifiableCard } from "../../components/ModifiableCard";
import { TiltCard } from "../../components/TiltCard";
import { CARD_HEIGHT_PX, CARD_WIDTH } from "../../constants/visualProps";
import { useGameContext } from "../../providers/GameProvider";
import { useGetRound } from "../../queries/useGetRound.ts";
import { Card } from "../../types/Card";
import { useNavigate } from "react-router-dom";

export const PreselectedCardsSection = () => {
  const {
    preSelectedCards,
    play,
    hand,
    getModifiers,
    togglePreselected,
    discardAnimation,
    playAnimation,
    discard,
    roundRewards,
    gameId,
  } = useGameContext();

  const navigate = useNavigate();
  const { data: round } = useGetRound(gameId);
  const handsLeft = round?.hands;
  const discardsLeft = round?.discards;

  if (roundRewards) {
    navigate("/rewards");
  }

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
        gap={{ base: 2, md: 5 }}
        sx={{
          width: `${CARD_WIDTH * 7}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: CARD_HEIGHT_PX,
          }}
        >
          {preSelectedCards.map((idx) => {
            const card = hand.find((c) => c.idx === idx);
            const modifiers = getModifiers(idx);
            const modifiedCard: Card = { ...card!, modifiers };
            return (
              card && (
                <Box key={card.id} mx={{ base: 3, md: 6 }}>
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
