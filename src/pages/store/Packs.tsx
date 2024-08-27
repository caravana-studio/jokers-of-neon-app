import { Box, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { TiltCard } from "../../components/TiltCard";
import { useShopItems } from "../../dojo/queries/useShopItems";
import { Pack } from "../../types/Pack";
import { ShowCardModal } from "./ShowCardModal";

export const Packs = () => {
  const shopItems = useShopItems();
  const [selectedPack, setSelectedPack] = useState<Pack | undefined>();

  return (
    <Box m={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size={"s"} mb={[1, 1, 1, 2, 2]}>
          Packs
        </Heading>
      </Flex>
      <Flex flexDirection="row" justifyContent="flex-start" gap={[2, 4, 6]}>
        {shopItems.packs.map((pack) => {
          return (
            <Flex key={`pack-${pack.card_id}`} justifyContent="center">
              <TiltCard
                cursor="pointer"
                card={pack}
                isPack
                scale={1.2}
                onClick={() => {
                  !pack.purchased && setSelectedPack(pack);
                }}
                isHolographic
              />
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
