import { Flex, Heading, Tooltip, theme } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import SpineAnimation from "../../components/SpineAnimation";
import { animationsData } from "../../constants/spineAnimations";
import { useStore } from "../../providers/StoreProvider";
import { getTooltip } from "../../utils/getTooltip";

export const LootBoxesMobile = () => {
  const navigate = useNavigate();

  const { packs } = useStore();
  const { white, whiteAlpha } = theme.colors;

  return (
    <Flex
      className="game-tutorial-step-packs"
      m={1}
      w="100%"
      gap={2}
      flexDirection={"column"}
      grow={1}
      pt={5}
    >
      {/* <Flex flexDirection="row" justifyContent="space-between"> */}
      {/* <Flex flexDirection={"column"} w={"100%"} justifyContent="space-between"> */}
      {packs.map((pack) => {
        const card = {
          id: pack.blister_pack_id.toString(),
          img: `packs/${pack.blister_pack_id}`,
          idx: Number(pack.blister_pack_id),
          price: Number(pack.cost),
          card_id: Number(pack.blister_pack_id),
        };

        const spineAnim = (
          <Flex key={`pack-${pack.blister_pack_id}`} w="50%">
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
              xOffset={500}
            />
          </Flex>
        );

        return (
          //   <Flex
          //     flexDirection={"column"}
          //     width="100%"
          //     // ml={{ base: "15px", sm: "30px" }}
          //     flex="1"
          //     height="100%"
          //     justifyContent={"space-between"}
          //   >
          <Flex
            flexDirection={"column"}
            justifyContent={"space-between"}
            margin={"0 auto"}
            bg="rgba(0, 0, 0, 0.6)"
            borderRadius="10px"
            pt={3}
            pb={5}
            boxShadow={`0px 0px 10px 1px ${whiteAlpha[500]}`}
          >
            <Flex
              flexDirection="row"
              alignItems="center"
              gap={4}
              flex="1"
              height="100%"
            >
              {spineAnim}

              <Flex justifyContent="space-between" alignItems="center">
                <Heading size="sm" variant="italic">
                  {"title"}
                </Heading>
              </Flex>
            </Flex>
          </Flex>
          //   </Flex>
        );
      })}
      {/* </Flex> */}
    </Flex>
  );
};
