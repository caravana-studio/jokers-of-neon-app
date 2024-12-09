import {
  Box,
  Flex,
  Heading,
  Tooltip,
  Text,
  Button,
  keyframes,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SpineAnimation, {
  SpineAnimationRef,
} from "../../components/SpineAnimation";
import { animationsData } from "../../constants/spineAnimations";
import { useStore } from "../../providers/StoreProvider";
import { getCardData } from "../../utils/getCardData";
import theme from "../../theme/theme";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { useGame } from "../../dojo/queries/useGame";
import { PriceBox } from "../../components/PriceBox";

export const LootBoxesMobile = () => {
  const navigate = useNavigate();

  const { packs, setRun, buyPack, locked } = useStore();
  const [buyDisabled, setBuyDisabled] = useState(false);
  const game = useGame();
  const cash = game?.cash ?? 0;
  const { neonGreen, white } = theme.colors;
  const { t } = useTranslation(["store"]);
  const spineAnimationRef = useRef<SpineAnimationRef>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const openAnimationCallBack = () => {
    setTimeout(() => {
      setShowOverlay(true);
    }, 500);
    // setTimeout(() => {
    //   navigate("/redirect/open-loot-box");
    // }, 1000);
  };

  const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }`;

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
      {packs.map((pack) => {
        const card = {
          id: pack.blister_pack_id.toString(),
          img: `packs/${pack.blister_pack_id}`,
          idx: Number(pack.blister_pack_id),
          price: Number(pack.cost),
          card_id: Number(pack.blister_pack_id),
        };

        const notEnoughCash =
          !card.price ||
          (pack.discount_cost ? cash < pack.discount_cost : cash < card.price);

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
              ref={spineAnimationRef}
              jsonUrl={`/spine-animations/loot_box_${pack.blister_pack_id}.json`}
              atlasUrl={`/spine-animations/loot_box_${pack.blister_pack_id}.atlas`}
              initialAnimation={animationsData.loopAnimation}
              loopAnimation={animationsData.loopAnimation}
              openBoxAnimation={animationsData.openBoxAnimation}
              isPurchased={pack.purchased.valueOf()}
              xOffset={-270}
              onOpenAnimationStart={openAnimationCallBack}
            />
          </Flex>
        );

        const buyButton = (
          <Button
            mr={3}
            onClick={() => {
              setBuyDisabled(true);
              buyPack(pack)
                .then((response) => {
                  if (response) {
                    spineAnimationRef.current?.playOpenBoxAnimation();
                  } else {
                    setBuyDisabled(false);
                  }
                })
                .catch(() => {
                  setBuyDisabled(false);
                });
            }}
            isDisabled={
              notEnoughCash || locked || buyDisabled || pack.purchased
            }
            height={{ base: "35px", sm: "100%" }}
            width={{ base: "45%", sm: "unset" }}
            size={"xs"}
          >
            {t("store.preview-card.labels.buy")}
          </Button>
        );

        const tooltipButton = notEnoughCash ? (
          <Tooltip label={t("store.preview-card.tooltip.no-coins")}>
            {buyButton}
          </Tooltip>
        ) : (
          buyButton
        );

        return (
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

                <Flex alignItems={"baseline"} justifyContent={"space-between"}>
                  {card.price && (
                    <PriceBox
                      price={card.price}
                      purchased={pack.purchased}
                      discountPrice={pack.discount_cost}
                      absolutePosition={false}
                    />
                  )}
                  {tooltipButton}
                </Flex>
              </Flex>
            </Flex>
            {showOverlay && (
              <Box
                position="fixed"
                top="0"
                left="0"
                right="0"
                bottom="0"
                backgroundColor="white"
                zIndex="9999"
                animation={`${fadeIn} 0.5s ease-out`}
              />
            )}
          </Flex>
        );
      })}
    </Flex>
  );
};
