import { Flex, Tooltip } from "@chakra-ui/react";
import { useRef } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import SpineAnimation from "../../../components/SpineAnimation";
import { animationsData } from "../../../constants/spineAnimations";
import { useStore } from "../../../providers/StoreProvider";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { getTooltip } from "../../../utils/getTooltip";
import { RerollingAnimation } from "../../store/StoreElements/RerollingAnimation";

export const LootBoxComponent = () => {
  const { packs } = useStore();
  const flexRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();

  return (
    <RerollingAnimation>
      <Flex
        ref={flexRef}
        h="100%"
        w="100%"
        justifyContent={{ base: "center" }}
        alignItems="top"
        gap={{ base: 3, sm: 4 }}
      >
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
                h={isSmallScreen ? "85%" : "100%"}
                w={`${(isSmallScreen ? 90 : 80) / packs.length}%`}
                position="relative"
              >
                <SpineContainer>
                  <RerollingAnimation>
                    <SpineAnimation
                      jsonUrl={`/spine-animations/loot_box_${pack.blister_pack_id}.json`}
                      atlasUrl={`/spine-animations/loot_box_${pack.blister_pack_id}.atlas`}
                      initialAnimation={
                        isMobile
                          ? animationsData.loopAnimation
                          : animationsData.initialAnimation
                      }
                      xOffset={-250}
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
                </SpineContainer>
              </Flex>
            </Tooltip>
          );
        })}
      </Flex>
    </RerollingAnimation>
  );
};

const SpineContainer = ({ children }: { children: JSX.Element }) => {
  const { isSmallScreen } = useResponsiveValues();
  return isSmallScreen ? (
    <>{children}</>
  ) : (
    <Flex position="absolute" w="100%" h="200%" bottom={0}>
      {children}
    </Flex>
  );
};
