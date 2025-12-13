import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlipCard } from "../../components/animations/FlipCardAnimation";
import { TiltCard } from "../../components/TiltCard";
import { FullScreenCardContainer } from "../FullScreenCardContainer";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps";
import { BLUE, BLUE_LIGHT } from "../../theme/colors";
import { Card } from "../../types/Card";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { getFlipSpeed } from "../../constants/flipCardAnimation";
import { useSettings } from "../../providers/SettingsProvider";
import { CardTypes } from "../../enums/cardTypes";

interface FlipCardGridProps {
  cards: Card[];
  cardsToKeep: Card[];
  flippedStates: boolean[];
  animationRunning: boolean;
  onCardToggle: (card: Card) => void;
  onGridClick: () => void;
  onCardLongPress?: (card: Card) => void;
}

export const FlipCardGrid = ({
  cards,
  cardsToKeep,
  flippedStates,
  animationRunning,
  onCardToggle,
  onGridClick,
  onCardLongPress,
}: FlipCardGridProps) => {
  const { cardScale, isSmallScreen } = useResponsiveValues();
  const adjustedCardScale = cardScale * 1.2;
  const { animationSpeed } = useSettings();
  const flipSpeed = getFlipSpeed(animationSpeed) / 1000;
  const { t } = useTranslation(["store"]);

  // Track touch start time to differentiate between tap and long press
  const touchStartTimeRef = React.useRef<number>(0);
  const wasLongPressRef = React.useRef<boolean>(false);

  return (
    <FullScreenCardContainer>
      <Flex
        width="100%"
        height="100%"
        onClick={onGridClick}
        flexWrap={"wrap"}
        justifyContent={"center"}
      >
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
                position="relative"
              >
                <FlipCard
                  flipped={flippedStates[index]}
                  width={CARD_WIDTH * adjustedCardScale}
                  height={CARD_HEIGHT * adjustedCardScale}
                  flipSpeed={flipSpeed}
                >
                  <TiltCard
                    key={index}
                    scale={adjustedCardScale}
                    card={card}
                    onClick={() => {
                      if (!animationRunning && !wasLongPressRef.current) {
                        onCardToggle(card);
                      } else {
                      }
                      // Reset flag after onClick
                      wasLongPressRef.current = false;
                    }}
                    onHold={
                      onCardLongPress
                        ? () => {
                            console.log('[FlipCardGrid] onHold triggered', {
                              cardId: card.card_id,
                              cardType: card.type,
                            });
                            wasLongPressRef.current = true;
                            onCardLongPress(card);
                          }
                        : undefined
                    }
                  />
                </FlipCard>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
      {isSmallScreen && onCardLongPress && (
        <Text
          position="absolute"
          bottom="100px"
          left="50%"
          transform="translateX(-50%)"
          fontSize="sm"
          color="whiteAlpha.700"
          textAlign="center"
          opacity={animationRunning ? 0 : 1}
          transition="opacity 0.3s ease"
          pointerEvents="none"
          whiteSpace="nowrap"
        >
          {t("store.packs.press-for-detail")}
        </Text>
      )}
    </FullScreenCardContainer>
  );
};
