import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { useNavigate } from "react-router-dom";
import { AnimatedCard } from "../../components/AnimatedCard";
import { CurrentPlay } from "../../components/CurrentPlay.tsx";
import { ModifiableCard } from "../../components/ModifiableCard";
import { TiltCard } from "../../components/TiltCard";
import { useGameContext } from "../../providers/GameProvider";
import { Card } from "../../types/Card";

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
    handsLeft,
    discardsLeft,
    preSelectionLocked,
  } = useGameContext();

  const { setNodeRef } = useDroppable({
    id: "play-discard",
  });
  const navigate = useNavigate();

  if (roundRewards) {
    navigate("/rewards");
  }

  return (
    <>
      <Flex flexDirection="column" alignItems="center" gap={4}>
        <Button
          width="160px"
          onClick={(e) => {
            e.stopPropagation();
            play();
          }}
          isDisabled={
            preSelectionLocked ||
            preSelectedCards?.length === 0 ||
            !handsLeft ||
            handsLeft === 0
          }
        >
          PLAY HAND
        </Button>
        <Text size="l">{handsLeft} left</Text>
      </Flex>

      <Box
        gap={{ base: 2, md: 8 }}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Flex
          justifyContent="center"
          alignItems={"center"}
          height="230px"
          background={"url(grid.png)"}
          width="100%"
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
        </Flex>
        <CurrentPlay />
      </Box>
      <Flex flexDirection="column" alignItems="center" gap={4}>
        <Button
          ref={setNodeRef}
          width="160px"
          onClick={(e) => {
            e.stopPropagation();
            discard();
          }}
          variant="secondarySolid"
          isDisabled={
            preSelectionLocked ||
            preSelectedCards?.length === 0 ||
            !discardsLeft ||
            discardsLeft === 0
          }
        >
          DISCARD
        </Button>
        <Text size="l">{discardsLeft} left</Text>
      </Flex>
    </>
  );
};
