import { Box, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { TiltCard } from "../../components/TiltCard";
import { useShopItems } from "../../dojo/queries/useShopItems";
import { Pack } from "../../types/Pack";
import { ShowCardModal } from "./ShowCardModal";
import OpenAnimation from "../../components/OpenAnimation";
import { useNavigate } from "react-router-dom";

export const Packs = () => {
  const shopItems = useShopItems();
  const [selectedPack, setSelectedPack] = useState<Pack | undefined>();
  const [animationState, setAnimationState] = useState<{ [key: string]: boolean }>({});
  const [pendingPackOpening, setPendingPackOpening] = useState<Pack | undefined>();
  const navigate = useNavigate();

  const handleAnimationEnd = (cardId: string) => {
    if (pendingPackOpening && pendingPackOpening.card_id?.toString() === cardId)
    {
      setAnimationState((prev) => ({ ...prev, [cardId]: false }));
      setPendingPackOpening(undefined);    
      navigate("/open-pack");
    }
  };

  const handlePackBuy = (pack: Pack) => {
      setAnimationState((prev) => ({ ...prev, [pack.card_id!.toString()]: true }));
      setPendingPackOpening(pack);
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
                    if (!pack.purchased && !pendingPackOpening) {
                      setSelectedPack(pack);
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
              handlePackBuy(selectedPack);
          }}
          card={selectedPack}
          close={() => setSelectedPack(undefined)}
        />
      )}
    </Box>
  );
};
