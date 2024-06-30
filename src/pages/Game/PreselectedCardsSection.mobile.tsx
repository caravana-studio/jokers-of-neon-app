import { Box } from "@chakra-ui/react";
import { AnimatedCard } from "../../components/AnimatedCard.tsx";
import { CurrentPlay } from "../../components/CurrentPlay.tsx";
import { ModifiableCard } from "../../components/ModifiableCard.tsx";
import { RewardsDetail } from "../../components/RewardsDetail.tsx";
import { TiltCard } from "../../components/TiltCard.tsx";
import {
  CARD_HEIGHT
} from "../../constants/visualProps.ts";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useGetRound } from "../../queries/useGetRound.ts";
import { Card } from "../../types/Card.ts";

export const MobilePreselectedCardsSection = () => {
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

  const { data: round } = useGetRound(gameId);
  const handsLeft = round?.hands;
  const discardsLeft = round?.discards;

  return roundRewards ? (
    <RewardsDetail roundRewards={roundRewards} />
  ) : (
    <>
      <Box
        gap={2}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: `${CARD_HEIGHT * 2 + 15}px`,
            flexWrap: "wrap",
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
