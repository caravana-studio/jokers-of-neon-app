import {
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useDndContext } from "@dnd-kit/core";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { AnimatedCard } from "../../components/AnimatedCard";
import { ShowPlays } from "../../components/ShowPlays";
import { SortBy } from "../../components/SortBy";
import { TiltCard } from "../../components/TiltCard";
import { CARD_HEIGHT_PX, CARD_WIDTH } from "../../constants/visualProps";
import { useRound } from "../../dojo/queries/useRound";
import { useGameContext } from "../../providers/GameProvider";
import { Coins } from "./Coins";
import {
  useTutorialGameContext,
  handsLeftTutorial,
} from "../../providers/TutorialGameProvider";
import { isTutorial } from "../../utils/isTutorial";

export const HandSection = () => {
  const {
    hand,
    preSelectedCards,
    togglePreselected,
    discardEffectCard,
    preSelectedModifiers,
    roundRewards,
  } = !isTutorial() ? useGameContext() : useTutorialGameContext();

  const [discarding, setDiscarding] = useState(false);

  const round = useRound();
  const handsLeft = !isTutorial() ? round?.hands ?? 0 : handsLeftTutorial;

  const { activeNode } = useDndContext();

  const cardIsPreselected = (cardIndex: number) => {
    return (
      preSelectedCards.filter((idx) => idx === cardIndex).length > 0 ||
      Object.values(preSelectedModifiers).some((array) =>
        array.includes(cardIndex)
      )
    );
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [menuIdx, setMenuIdx] = useState<number | undefined>();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);
  const { t } = useTranslation(["game"]);

  return (
    <>
      {!isMobile && (
        <Flex
          flexDirection="column"
          justifyContent="space-between"
          height={CARD_HEIGHT_PX}
          sx={{ mr: 4 }}
          pb={1}
        >
          <SortBy />
          <Coins />
        </Flex>
      )}
      <Box
        pr={!isMobile ? 12 : 10}
        pl={!isMobile ? 4 : 2}
        pt={!isMobile ? 8 : 0}
        className="game-tutorial-step-2 tutorial-modifiers-step-1"
      >
        <SimpleGrid
          sx={{
            opacity: !roundRewards && handsLeft > 0 ? 1 : 0.3,
            minWidth: `${CARD_WIDTH * 4}px`,
            maxWidth: `${CARD_WIDTH * 6.5}px`,
          }}
          columns={hand.length}
          position="relative"
        >
          {hand.map((card, index) => {
            const isPreselected = cardIsPreselected(card.idx);
            return (
              <GridItem
                key={card.idx + "-" + index}
                sx={{ pointerEvents: isPreselected ? "none" : "auto" }}
                w="100%"
                onContextMenu={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setMenuIdx(card.idx);
                  onOpen();
                }}
                className={
                  card.isModifier ? "tutorial-modifiers-step-2" : undefined
                }
                onMouseEnter={() => setHoveredCard(card.idx)}
                onMouseLeave={() => {
                  setHoveredCard(null);
                  setHoveredButton(null);
                }}
                position="relative"
              >
                {card.isModifier && !isPreselected && (
                  <Flex
                    position={"absolute"}
                    zIndex={7}
                    bottom={"5px"}
                    left={"5px"}
                    borderRadius={"10px"}
                    background={"violet"}
                  >
                    {hoveredCard === card.idx && (
                      <Button
                        height={8}
                        fontSize="8px"
                        px={"16px"}
                        borderRadius={"10px"}
                        size={isMobile ? "xs" : "md"}
                        variant={"discardSecondarySolid"}
                        onMouseEnter={() => setHoveredButton(card.idx)}
                        display="flex"
                        gap={4}
                        isDisabled={discarding}
                        onClick={(e) => {
                          setDiscarding(true);
                          e.stopPropagation();
                          setHoveredButton(null);
                          discardEffectCard(card.idx).then((_) => {
                            setDiscarding(false);
                          });
                          onClose();
                        }}
                      >
                        <Text fontSize="10px">X</Text>
                        {hoveredButton === card.idx && (
                          <Text fontSize="10px">
                            {t("game.hand-section.modifier-change")}
                          </Text>
                        )}
                      </Button>
                    )}
                  </Flex>
                )}
                {!isPreselected && (
                  <AnimatedCard idx={card.idx} discarded={card.discarded}>
                    <TiltCard
                      card={card}
                      cursor={
                        card.isModifier
                          ? activeNode
                            ? "grabbing"
                            : "grab"
                          : "pointer"
                      }
                      onClick={() => {
                        if (!card.isModifier) {
                          togglePreselected(card.idx);
                        }
                      }}
                    />
                  </AnimatedCard>
                )}
              </GridItem>
            );
          })}
          {!isMobile && (
            <Flex
              bottom={"-35px"}
              width="calc(100% + 30px)"
              justifyContent={"flex-end"}
              alignItems="flex-end"
              position="absolute"
            >
              <ShowPlays />
            </Flex>
          )}
        </SimpleGrid>
      </Box>
      {handsLeft === 0 && (
        <Heading
          ml={{ base: "0", md: "100px" }}
          size={{ base: "sm", md: "md" }}
          variant="italic"
          textAlign="center"
          bottom={{ base: "70px", md: "100px" }}
          sx={{ position: "fixed" }}
        >
          {t("game.hand-section.no-cards-label")}
        </Heading>
      )}
    </>
  );
};
