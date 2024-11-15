import { Box, Flex, Tooltip } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import SpineAnimation from "../../components/SpineAnimation";
import { animationsData } from "../../constants/spineAnimations";
import { useShopItems } from "../../dojo/queries/useShopItems";
import { getTooltip } from "../../utils/getTooltip";

export const Packs = () => {
  const { packs } = useShopItems();
  const navigate = useNavigate();

  return (
    <Flex className="game-tutorial-step-packs" m={isMobile ? 4 : 0} h="60%">
      <Flex flexDirection="row" justifyContent="space-between">
        {packs.map((pack) => {
          const card = {
            id: pack.blister_pack_id.toString(),
            img: `packs/${pack.blister_pack_id}`,
            idx: Number(pack.blister_pack_id),
            price: Number(pack.cost),
            card_id: Number(pack.blister_pack_id),
          };
          return (
            <Tooltip
              hasArrow
              label={getTooltip(card, true)}
              closeOnPointerDown
              key={`pack-${pack.blister_pack_id}`}
            >
              <Flex
                key={`pack-${pack.blister_pack_id}`}
                justifyContent="center"
                w="50%"
              >
                <SpineAnimation
                  jsonUrl={`/spine-animations/loot_box_${pack.blister_pack_id}.json`}
                  atlasUrl={`/spine-animations/loot_box_${pack.blister_pack_id}.atlas`}
                  initialAnimation={
                    isMobile
                      ? animationsData.loopAnimation
                      : animationsData.initialAnimation
                  }
                  hoverAnimation={animationsData.hoverAnimation}
                  loopAnimation={animationsData.loopAnimation}
                  isPurchased={pack.purchased.valueOf()}
                  price={card.price}
                  onClick={() => {
                    if (!pack.purchased) {
                      navigate("/preview/loot-box", {
                        state: {
                          card: card,
                          isPack: true,
                          pack: pack,
                        },
                      });
                    }
                  }}
                />
              </Flex>
            </Tooltip>
          );
        })}
      </Flex>
    </Flex>
  );
};
