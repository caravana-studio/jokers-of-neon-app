import { Flex, Tooltip } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import SpineAnimation from "../../components/SpineAnimation";
import { animationsData } from "../../constants/spineAnimations";
import { useCardData } from "../../providers/CardDataProvider";
import { useShopStore } from "../../state/useShopStore";
import { getTooltip } from "../../utils/getTooltip";
import { RerollingAnimation } from "./StoreElements/RerollingAnimation";

export const LootBoxes = () => {
  const navigate = useNavigate();

  const { getLootBoxData } = useCardData();

  const { packs } = useShopStore();
  return (
    <Flex
      className="game-tutorial-step-packs"
      m={isMobile ? 4 : 0}
      h="60%"
      w="100%"
    >
      <Flex flexDirection="row" justifyContent="space-between" w="100%">
        {packs.map((pack) => {
          const card = {
            id: pack.blister_pack_id.toString(),
            img: `packs/${pack.blister_pack_id}`,
            idx: Number(pack.blister_pack_id),
            price: Number(pack.cost),
            card_id: Number(pack.blister_pack_id),
          };
          const { name, description } = getLootBoxData(pack.blister_pack_id);
          return (
            <Tooltip
              hasArrow
              label={getTooltip(name, description)}
              closeOnPointerDown
              key={`pack-${pack.blister_pack_id}`}
            >
              <Flex
                key={`pack-${pack.blister_pack_id}`}
                justifyContent="center"
                w="50%"
              >
                <RerollingAnimation>
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
                    discountPrice={pack.discount_cost.valueOf()}
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
                </RerollingAnimation>
              </Flex>
            </Tooltip>
          );
        })}
      </Flex>
    </Flex>
  );
};
