import { GridItem, Heading, Menu, MenuItem, MenuList, SimpleGrid, useDisclosure } from "@chakra-ui/react"
import { TiltCard } from "../../components/TiltCard";
import { CARD_WIDTH } from "../../constants/visualProps";
import { useGameContext } from "../../providers/GameProvider";

export const HandSection = () => {
  const { round, hand, preSelectedCards, togglePreselected, discardEffectCard } = useGameContext();
  const handsLeft = round.hands;

  const cardIsPreselected = (cardIndex: number) => {
    return preSelectedCards.filter((idx) => idx === cardIndex).length > 0;
  };

  return (
    <>
      <SimpleGrid
        sx={{
          opacity: handsLeft > 0 ? 1 : 0.3,
          minWidth: `${CARD_WIDTH * 4}px`,
          maxWidth: `${CARD_WIDTH * 6.5}px`,
        }}
        columns={8}
      >
        {hand.map((card, index) => {
          const { isOpen, onOpen, onClose } = useDisclosure();
          const isPreselected = cardIsPreselected(card.idx);
          return (
            <GridItem
            key={card.idx}
            w="100%"
            sx={{
              transform: ` rotate(${
                (index - 3.5) * 3
              }deg) translateY(${Math.abs(index - 3.5) * 10}px)`,
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onOpen();
            }}>
              {(card.isModifier && !isPreselected) &&
                <Menu isOpen={isOpen} onClose={onClose}>
                <MenuList
                  textColor='black'
                  minWidth='max-content'
                  borderRadius='0'
                  zIndex='7'
                >
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      discardEffectCard(card.idx);
                      onClose();
                    }}
                    borderRadius='0'
                  >
                  Discard
                  </MenuItem>
                </MenuList>
              </Menu>}
              {!isPreselected && (
                <TiltCard
                  card={card}
                  onClick={() => {
                    if (!card.isModifier) {
                      togglePreselected(card.idx);
                    }
                  }}
                />
              )}
            </GridItem>
          );
        })}
      </SimpleGrid>
      {handsLeft === 0 && (
        <Heading
          variant="neonGreen"
          sx={{ position: "fixed", bottom: "100px", fontSize: 30 }}
        >
          you ran out of hands to play
        </Heading>
      )}
    </>
  );
};
