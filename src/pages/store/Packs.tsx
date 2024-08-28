import { Box, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { TiltCard } from "../../components/TiltCard";
import { useShopItems } from "../../dojo/queries/useShopItems";
import { Pack } from "../../types/Pack";
import { ShowCardModal } from "./ShowCardModal";
import OpenAnimation from "../../components/OpenAnimation";

export const Packs = () => {
  const shopItems = useShopItems();
  const [selectedPack, setSelectedPack] = useState<Pack | undefined>();
  const [animationState, setAnimationState] = useState<{ [key: string]: boolean }>({});
  const [pendingPack, setPendingPack] = useState<Pack | undefined>();

  const handleAnimationEnd = (cardId: string) => {
    setAnimationState((prev) => ({ ...prev, [cardId]: false }));
    if (pendingPack && pendingPack.card_id?.toString() === cardId) {
      setSelectedPack(pendingPack);
      setPendingPack(undefined);
    }
  };

  const handleCardClick = (pack: Pack) => {
    if (!pack.purchased) {
      setPendingPack(pack);
      setAnimationState((prev) => ({ ...prev, [pack.card_id!.toString()]: true }));
    }
  };

  return (
    <Box m={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size={"s"} mb={[1, 1, 1, 2, 2]}>
          Packs
        </Heading>
      </Flex>
      <Flex flexDirection="row" justifyContent="flex-start" gap={[2, 4, 6]}>
        {shopItems.packs.map((pack) => {
          const cardId = pack.card_id!.toString();
          const isAnimating = animationState[cardId] || false;
          return (
            <Flex key={`pack-${pack.card_id}`} justifyContent="center">
              <OpenAnimation 
                startAnimation={isAnimating}
                onAnimationEnd={() => handleAnimationEnd(cardId)}>
                <TiltCard
                  cursor="pointer"
                  card={pack}
                  isPack
                  scale={1.2}
                  onClick={() => {
                    if (!pendingPack) {
                      handleCardClick(pack);
                    }
                  }}
                />
              </OpenAnimation>
            </Flex>
          );
        })}
      </Flex>
      {selectedPack && (
        <ShowCardModal
          onBuyClick={() => {
            /* buyCard(
              selectedCard.idx,
              getCardType(selectedCard),
              selectedCard.price ?? 0
            ) */
          }}
          card={selectedPack}
          close={() => setSelectedPack(undefined)}
        />
      )}
    </Box>
  );
};
