import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { AnimatedCard } from "../../components/AnimatedCard";
import { CurrentPlay } from "../../components/CurrentPlay";
import { ModifiableCard } from "../../components/ModifiableCard";
import { TiltCard } from "../../components/TiltCard";
import { PRESELECTED_CARD_SECTION_ID } from "../../constants/general";
import { useCurrentHandStore } from "../../state/useCurrentHandStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Card } from "../../types/Card";
import { PlayButton } from "../Game/PlayButton";
import { useAnimationStore } from "../../state/useAnimationStore";

interface PracticePreselectedCardsSectionProps {
  onBackToSetup?: () => void;
}

export const PracticePreselectedCardsSection = ({
  onBackToSetup,
}: PracticePreselectedCardsSectionProps) => {
  const { discardAnimation, playAnimation } = useAnimationStore();
  const { preSelectedCards, togglePreselected, hand, getModifiers } =
    useCurrentHandStore();
  const { setNodeRef } = useDroppable({
    id: PRESELECTED_CARD_SECTION_ID,
  });
  const { cardScale } = useResponsiveValues();

  return (
    <Flex
      flexDirection={"column"}
      justifyContent={"space-around"}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
      sx={{
        zIndex: 1,
      }}
    >
      <Box height="60px"></Box>
      <Flex
        flexDirection={"row"}
        width={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box width="200px">
          {onBackToSetup ? (
            <Flex flexDir="column" w="100%" gap={[3, 4]}>
              <Button
                width={"100%"}
                variant="defaultOutline"
                onClick={onBackToSetup}
                height={["30px", "32px"]}
                borderRadius="12px"
              >
                <Text fontFamily="Orbitron" fontSize={[14, 16]}>
                  Edit setup
                </Text>
              </Button>
            </Flex>
          ) : null}
        </Box>
        <Box
          ref={setNodeRef}
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
            height="188px"
            background={"url(grid.png)"}
            width="90%"
            backgroundRepeat="space"
            backgroundSize="52px auto"
          >
            {preSelectedCards.map((idx) => {
              const card = hand.find((c) => c.idx === idx);
              const modifiers = getModifiers(idx);
              const modifiedCard: Card = { ...card!, modifiers };
              return (
                card && (
                  <Box key={card.idx} mx={{ base: 3, md: 6 }}>
                    <ModifiableCard id={card.id}>
                      <AnimatedCard
                        idx={card.idx}
                        discarded={discardAnimation}
                        played={playAnimation}
                      >
                        <TiltCard
                          cursor="pointer"
                          card={modifiedCard}
                          scale={cardScale}
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
        </Box>
        <Box width="200px">
          <PlayButton />
        </Box>
      </Flex>
      <CurrentPlay />
    </Flex>
  );
};
