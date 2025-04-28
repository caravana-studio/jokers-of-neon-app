import { Flex } from "@chakra-ui/react";
import { FlipCard } from "../../components/animations/FlipCardAnimation";
import { TiltCard } from "../../components/TiltCard";
import { FullScreenCardContainer } from "../FullScreenCardContainer";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps";
import { BLUE, BLUE_LIGHT } from "../../theme/colors";
import { Card } from "../../types/Card";
import { useResponsiveValues } from "../../theme/responsiveSettings";

interface FlipCardGridProps {
  cards: Card[];
  cardsToKeep: Card[];
  flippedStates: boolean[];
  animationRunning: boolean;
  onCardToggle: (card: Card) => void;
  onGridClick: () => void;
}

export const FlipCardGrid = ({
  cards,
  cardsToKeep,
  flippedStates,
  animationRunning,
  onCardToggle,
  onGridClick,
}: FlipCardGridProps) => {
  const { cardScale } = useResponsiveValues();
  const adjustedCardScale = cardScale * 1.2;

  return (
    <FullScreenCardContainer>
      <Flex width="100%" height="100%" onClick={onGridClick}>
        {cards.map((card, index) => {
          const isSelected = cardsToKeep.some((c) => c.idx === card.idx);

          return (
            <Flex
              key={`${card.card_id ?? ""}-${index}`}
              flexDirection="column"
              gap={4}
            >
              <Flex
                m={1.5}
                p={1}
                zIndex={1}
                borderRadius={{ base: "7px", sm: "12px", md: "15px" }}
                opacity={isSelected || cardsToKeep.length === 0 ? 1 : 0.5}
                boxShadow={
                  !animationRunning && isSelected
                    ? `0px 0px 15px 12px ${BLUE}`
                    : "none"
                }
                border={
                  !animationRunning && isSelected
                    ? `2px solid ${BLUE_LIGHT}`
                    : "2px solid transparent"
                }
                cursor="pointer"
              >
                <FlipCard
                  flipped={flippedStates[index]}
                  width={CARD_WIDTH * adjustedCardScale}
                  height={CARD_HEIGHT * adjustedCardScale}
                  flipSpeed={0.6}
                >
                  <TiltCard
                    key={index}
                    scale={adjustedCardScale}
                    card={card}
                    onClick={() => {
                      if (!animationRunning) {
                        onCardToggle(card);
                      }
                    }}
                  />
                </FlipCard>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </FullScreenCardContainer>
  );
};
