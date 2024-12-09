import { Box, Flex, Heading, Tooltip, Text } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import SpineAnimation from "../../components/SpineAnimation";
import { animationsData } from "../../constants/spineAnimations";
import { useStore } from "../../providers/StoreProvider";
import { getTooltip } from "../../utils/getTooltip";
import { getCardData } from "../../utils/getCardData";
import theme from "../../theme/theme";
import { useTranslation } from "react-i18next";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import SpecialsButton from "./StoreElements/SpecialsButton";
import NextLevelButton from "./StoreElements/NextLevelButton";

export const LootBoxesMobile = () => {
  const navigate = useNavigate();

  const { packs, setRun } = useStore();
  const { neonGreen, white } = theme.colors;
  const { t } = useTranslation(["store"]);

  return (
    <Flex
      className="game-tutorial-step-packs"
      m={1}
      w="100%"
      gap={2}
      flexDirection={"column"}
      grow={1}
      pt={5}
      overflow="scroll"
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

        const { name, description, details } = getCardData(card, true);

        const spineAnim = (
          <Flex
            key={`pack-${pack.blister_pack_id}`}
            w="40%"
            h={"60%"}
            justifyContent={"center"}
            pl={2}
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
              xOffset={-270}
              //   scale={2}
              //   height={2500}
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
            boxShadow={`0px 0px 10px 1px ${white}`}
            width={"95%"}
          >
            <Flex
              flexDirection="row"
              alignItems="center"
              gap={4}
              flex="1"
              height="100%"
            >
              {spineAnim}

              <Flex
                flexDirection={"column"}
                width="100%"
                flex="1"
                height="100%"
                justifyContent={"space-between"}
              >
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading size="sm" variant="italic">
                    {name}
                  </Heading>
                </Flex>

                <Box mb={4}>
                  <Text
                    color="white"
                    fontSize={{ base: "md", sm: "lg" }}
                    mb={2}
                    sx={{
                      position: "relative",
                      _before: {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        width: "95%",
                        height: "2px",
                        backgroundColor: "white",
                        boxShadow:
                          "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                      },
                    }}
                  >
                    {t("store.preview-card.title.description")}
                  </Text>
                  <Text color={neonGreen} fontSize={{ base: "md", sm: "xl" }}>
                    {description}
                  </Text>
                </Box>

                <Box mb={4}>
                  <Text
                    color="white"
                    fontSize={{ base: "md", sm: "lg" }}
                    mb={2}
                    sx={{
                      position: "relative",
                      _before: {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        width: "95%",
                        height: "2px",
                        backgroundColor: "white",
                        boxShadow:
                          "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                      },
                    }}
                  >
                    {t("store.preview-card.title.details")}
                  </Text>
                  <Text color={neonGreen} fontSize={{ base: "md", sm: "xl" }}>
                    {details?.split("\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </Text>
                </Box>
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
