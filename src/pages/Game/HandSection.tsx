import {
  Box,
  GridItem,
  Heading,
  Menu,
  MenuItem,
  MenuList,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { useDndContext } from "@dnd-kit/core";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { AnimatedCard } from "../../components/AnimatedCard";
import { SortBy } from "../../components/SortBy";
import { TiltCard } from "../../components/TiltCard";
import { CARD_WIDTH } from "../../constants/visualProps";
import { useGameContext } from "../../providers/GameProvider";

const TRANSLATE_Y_PX = isMobile ? 3 : 10;

export const HandSection = () => {
  const {
    hand,
    preSelectedCards,
    togglePreselected,
    discardEffectCard,
    preSelectedModifiers,
    roundRewards,
    gameId,
    preSelectionLocked,
    handsLeft,
  } = useGameContext();

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

  return (
    <>
      {!isMobile && (
        <Box sx={{ mr: 4 }}>
          <SortBy />
        </Box>
      )}
      <SimpleGrid
        sx={{
          opacity: !roundRewards && handsLeft > 0 ? 1 : 0.3,
          minWidth: `${CARD_WIDTH * 4}px`,
          maxWidth: `${CARD_WIDTH * 6.5}px`,
        }}
        columns={hand.length}
        className="game-tutorial-step-2"
      >
        {hand.map((card, index) => {
          const isPreselected = cardIsPreselected(card.idx);
          return (
            <GridItem
              key={card.idx}
              w="100%"
              sx={{
                transform: ` rotate(${
                  (index - hand.length / 2 + 0.5) * 3
                }deg) translateY(${Math.abs(index - hand.length / 2 + 0.5) * TRANSLATE_Y_PX}px)`,
              }}
              onContextMenu={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setMenuIdx(card.idx);
                onOpen();
              }}
            >
              {card.isModifier && !isPreselected && (
                <Menu isOpen={isOpen && menuIdx === card.idx} onClose={onClose}>
                  <MenuList textColor="black" minWidth="max-content" zIndex="7">
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        discardEffectCard(card.idx);
                        onClose();
                      }}
                      isDisabled={preSelectionLocked}
                    >
                      Discard
                    </MenuItem>
                  </MenuList>
                </Menu>
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
      </SimpleGrid>
      {handsLeft === 0 && (
        <Heading
          ml={{ base: "25px", md: "100px" }}
          size="m"
          bottom={{ base: "70px", md: "100px" }}
          sx={{ position: "fixed" }}
        >
          you ran out of hands to play
        </Heading>
      )}
    </>
  );
};
