import { Box, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TiltCard } from "../../components/TiltCard";
import { BlisterPackItem } from "../../dojo/generated/typescript/models.gen";
import { useShopItems } from "../../dojo/queries/useShopItems";
import { useStore } from "../../providers/StoreProvider";
import { ShowCardModal } from "./ShowCardModal";

export const Packs = () => {
  const { packs } = useShopItems();
  const [selectedPack, setSelectedPack] = useState<
    BlisterPackItem | undefined
  >();
  const { buyPack } = useStore();

  const navigate = useNavigate();

  return (
    <Box m={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size={"s"} mb={[1, 1, 1, 2, 2]}>
          Packs
        </Heading>
      </Flex>
      <Flex flexDirection="row" justifyContent="flex-start" gap={[2, 4, 6]}>
        {packs.map((pack) => {
          return (
            <Flex key={`pack-${pack.blister_pack_id}`} justifyContent="center">
              <TiltCard
                cursor="pointer"
                card={{
                  id: pack.blister_pack_id.toString(),
                  card_id: Number(pack.blister_pack_id),
                  img: `packs/${pack.blister_pack_id}.png`,
                  idx: Number(pack.blister_pack_id),
                  purchased: Boolean(pack.purchased),
                  price: Number(pack.cost),
                }}
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
            buyPack(selectedPack).then((response) => {
              if (response) {
                navigate("/open-pack");
              }
            });
          }}
          card={{
            id: selectedPack.blister_pack_id.toString(),
            img: `packs/${selectedPack.blister_pack_id}`,
            idx: Number(selectedPack.blister_pack_id),
            price: Number(selectedPack.cost),
          }}
          close={() => setSelectedPack(undefined)}
        />
      )}
    </Box>
  );
};
