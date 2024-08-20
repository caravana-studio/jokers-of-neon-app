import { Box, Flex, Heading } from "@chakra-ui/react";
import { TiltCard } from "../../components/TiltCard";
import { useShopItems } from "../../dojo/queries/useShopItems";

export const Packs = () => {
  const shopItems = useShopItems();

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
                  // !card.purchased && setSelectedCard(card);
                }}
              />
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};
