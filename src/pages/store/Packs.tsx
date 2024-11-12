import { Box, Flex, Heading, Tooltip } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useShopItems } from "../../dojo/queries/useShopItems";
import { useTranslation } from "react-i18next";
import SpineAnimation from "../../components/SpineAnimation";
import { animationsData } from "../../constants/spineAnimations";
import { getTooltip } from "../../utils/getTooltip";
import { isMobile } from "react-device-detect";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const Packs = () => {
  const { packs } = useShopItems();
  const navigate = useNavigate();
  const { t } = useTranslation(["store"]);
  const { cardScale, isCardScaleCalculated } = useResponsiveValues();

  if (!isCardScaleCalculated) {
    return null;
  }

  return (
    <Box
      className="game-tutorial-step-packs"
      width={isMobile ? "100%" : "50%"}
      m={isMobile ? 4 : 0}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size={"s"} mb={[1, 1, 1, 2, 2]} fontWeight={"400"}>
          {t("store.titles.packs")}
        </Heading>
      </Flex>
      <Flex flexDirection="row" justifyContent="flex-start" gap={[2, 4, 6]}>
        {packs.map((pack) => {
          const card = {
            id: pack.blister_pack_id.toString(),
            img: `packs/${pack.blister_pack_id}`,
            idx: Number(pack.blister_pack_id),
            price: Number(pack.cost),
            card_id: Number(pack.blister_pack_id),
          };
          return (
            <Tooltip hasArrow label={getTooltip(card, true)} closeOnPointerDown>
              <Flex
                key={`pack-${pack.blister_pack_id}`}
                justifyContent="center"
              >
                <SpineAnimation
                  // jsonUrl={`/spine-animations/${pack.blister_pack_id}.json`}
                  // atlasUrl={`/spine-animations/${pack.blister_pack_id}.atlas`}
                  jsonUrl={`/spine-animations/basicPack.json`}
                  atlasUrl={`/spine-animations/basicPack.atlas`}
                  initialAnimation={
                    isMobile
                      ? animationsData.loopAnimation
                      : animationsData.initialAnimation
                  }
                  hoverAnimation={animationsData.hoverAnimation}
                  loopAnimation={animationsData.loopAnimation}
                  isPurchased={pack.purchased.valueOf()}
                  onClick={() => {
                    if (!pack.purchased) {
                      navigate("/preview/pack", {
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
    </Box>
  );
};
