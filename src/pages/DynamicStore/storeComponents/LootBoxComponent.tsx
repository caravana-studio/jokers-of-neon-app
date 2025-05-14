import { Flex, Tooltip } from "@chakra-ui/react";
import { useRef } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { animationsData } from "../../../constants/spineAnimations";
import { useCardData } from "../../../providers/CardDataProvider";
import { useStore } from "../../../providers/StoreProvider";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { getTooltip } from "../../../utils/getTooltip";
import { RerollingAnimation } from "../../store/StoreElements/RerollingAnimation";
import { LootBox } from "../../../components/LootBox";

export const LootBoxComponent = () => {
  const { packs } = useStore();
  const flexRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();
  const { getLootBoxData } = useCardData();

  return (
    <RerollingAnimation>
      <Flex
        ref={flexRef}
        h="100%"
        w="100%"
        justifyContent={{ base: "center" }}
        alignItems={{ base: "top", sm: "flex-end" }}
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
          const { name, description } = getLootBoxData(card.card_id ?? 0);
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
                h={isSmallScreen ? "85%" : "100%"}
                w={`${(isSmallScreen ? 90 : 80) / packs.length}%`}
                maxW={isSmallScreen ? "unset" : "250px"}
                maxH={isSmallScreen ? "unset" : "200px"}
                position="relative"
              >
                <SpineContainer>
                  <RerollingAnimation>
                    <LootBox
                      boxId={pack.blister_pack_id}
                      width={500}
                      height={1500}
                      xOffset={-250}
                      initialAnimation={
                        isMobile
                          ? animationsData.loopAnimation
                          : animationsData.initialAnimation
                      }
                      hoverAnimation={animationsData.hoverAnimation}
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
