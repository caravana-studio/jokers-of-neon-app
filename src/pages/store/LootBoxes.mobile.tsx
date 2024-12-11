import {
  Box,
  Button,
  Flex,
  Heading,
  keyframes,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { ReactNode, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { MobileInformationModal } from "../../components/MobileInformationModal";
import { PriceBox } from "../../components/PriceBox";
import SpineAnimation, {
  SpineAnimationRef,
} from "../../components/SpineAnimation";
import { animationsData } from "../../constants/spineAnimations";
import { useGame } from "../../dojo/queries/useGame";
import { useStore } from "../../providers/StoreProvider";
import { GREY_LINE } from "../../theme/colors";
import theme from "../../theme/theme";
import { getCardData } from "../../utils/getCardData";

export const LootBoxesMobile = () => {
  const navigate = useNavigate();

  const { packs, setRun, buyPack, locked, setLockRedirection } = useStore();
  const [buyDisabled, setBuyDisabled] = useState(false);
  const game = useGame();
  const cash = game?.cash ?? 0;
  const { neonGreen, white } = theme.colors;
  const { t } = useTranslation(["store"]);
  const [showOverlay, setShowOverlay] = useState(false);

  const [informationModalContent, setInformationModalContent] = useState<
    ReactNode | undefined
  >(undefined);

  const openAnimationCallBack = () => {
    setTimeout(() => {
      setShowOverlay(true);
    }, 500);
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
      pb={4}
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

        const { name, description, details, size } = getCardData(card, true);
        const spineAnimationRef = useRef<SpineAnimationRef>(null);

        const spineAnim = (
          <Flex
            key={`pack-${pack.blister_pack_id}`}
            w="100%"
            h={"100%"}
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
            onClick={() => {
              setBuyDisabled(true);
              spineAnimationRef.current?.updateAnimationState();
              buyPack(pack)
                .then((response) => {
                  if (response) {
                    spineAnimationRef.current?.playOpenBoxAnimation();
                    setLockRedirection(true);
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
            width={{ base: "35%", sm: "unset" }}
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
            pr={2}
            boxShadow={`0px 0px 6px 0px ${GREY_LINE}`}
            width={"95%"}
            h={"50%"}
            key={`pack-${pack.blister_pack_id}`}
            overflow="hidden"
          >
            <Flex flexDirection="row" alignItems="center" gap={4} height="100%">
              <Flex h="100%" w="40%">
                {spineAnim}
              </Flex>

              <Flex
                flexDirection={"column"}
                width="60%"
                flex="1"
                height="100%"
                justifyContent={"space-between"}
              >
                <Flex justifyContent="space-between" mb={2} alignItems="center">
                  <Heading fontWeight={"400"} fontSize={"xs"}>
                    {name}
                  </Heading>
                </Flex>

                <Flex mb={4} flexGrow={1} flexDir={"column"} gap={2}>
                  <Text color={neonGreen} fontSize={"xs"}>
                    {description}
                  </Text>
                  <Text color={neonGreen} fontSize={"xs"}>
                    {t("store.packs.size", { size })}
                  </Text>
                </Flex>

                <Flex
                  mb={4}
                  gap={2}
                  onClick={() => {
                    setInformationModalContent(
                      <Box>
                        <Heading mb={4} fontWeight={"400"} fontSize={"sm"}>
                          {name}
                        </Heading>
                        <Text color={neonGreen} fontSize={"sm"}>
                          {t("store.packs.offering-rates")}: <br />
                          {details?.split("\n").map((line, index) => (
                            <span key={index}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </Text>
                      </Box>
                    );
                  }}
                >
                  <Text>{t("store.packs.offering-rates")}</Text>
                  <IoIosInformationCircleOutline color="white" size={"14px"} />
                </Flex>

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
      {informationModalContent && (
        <MobileInformationModal
          content={informationModalContent}
          onClose={() => setInformationModalContent(undefined)}
        />
      )}
    </Flex>
  );
};
