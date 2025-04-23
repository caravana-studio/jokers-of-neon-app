import { Box, Button, Flex, Heading, Text, Tooltip } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage.tsx";
import { LootBoxRateInfo } from "../../components/Info/LootBoxRateInfo.tsx";
import { MobileBottomBar } from "../../components/MobileBottomBar.tsx";
import { MobileDecoration } from "../../components/MobileDecoration.tsx";
import { PriceBox } from "../../components/PriceBox.tsx";
import SpineAnimation, {
  SpineAnimationRef,
} from "../../components/SpineAnimation.tsx";
import { StorePreviewComponent } from "../../components/StorePreviewComponent.tsx";
import { animationsData } from "../../constants/spineAnimations.ts";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useCardData } from "../../providers/CardDataProvider.tsx";
import { usePageTransitions } from "../../providers/PageTransitionsProvider.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import { colorizeText } from "../../utils/getTooltip.tsx";
import { MobileCoins } from "../store/Coins.tsx";
import { LootBox } from "../../components/LootBox.tsx";

export const PreviewLootBox = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { card, pack } = state || {};

  const { isSmallScreen } = useResponsiveValues();

  const [buyDisabled, setBuyDisabled] = useState(false);
  const { t } = useTranslation("store", { keyPrefix: "store.preview-card" });

  if (!card) {
    return <p>Card not found.</p>;
  }

  const game = useGame();
  const { buyPack, locked } = useStore();
  const { getLootBoxData } = useCardData();

  const cash = game?.cash ?? 0;
  const { name, description, details } = getLootBoxData(card.card_id ?? 0);
  const spineAnimationRef = useRef<SpineAnimationRef>(null);

  const notEnoughCash =
    !card.price ||
    (pack.discount_cost ? cash < pack.discount_cost : cash < card.price);

  const { transitionTo } = usePageTransitions();

  const openAnimationCallBack = () => {
    setTimeout(() => {
      transitionTo("/open-loot-box", {
        state: { pack: pack },
      });
    }, 200);
  };

  const buyButton = (
    <Button
      onClick={() => {
        setBuyDisabled(true);
        spineAnimationRef.current?.playOpenBoxAnimation();
        buyPack(pack)
          .then((response) => {
            if (response) {
              // setLockRedirection(true);
            } else {
              setBuyDisabled(false);
            }
          })
          .catch(() => {
            setBuyDisabled(false);
          });
      }}
      isDisabled={notEnoughCash || locked || buyDisabled}
      variant={{ base: "solid", sm: "outlinePrimaryGlow" }}
      height={{ base: "30px", sm: "100%" }}
      minWidth={"100px"}
      fontSize={{ base: 10, sm: "unset" }}
      lineHeight={{ base: 1.6, sm: "unset" }}
    >
      {t("labels.buy")}
    </Button>
  );

  const tooltipButton = notEnoughCash ? (
    isSmallScreen ? (
      <Text fontSize={10}>{t("tooltip.no-coins")}</Text>
    ) : (
      <Tooltip label={t("tooltip.no-coins")}>{buyButton}</Tooltip>
    )
  ) : (
    buyButton
  );

  const image = (
    <CachedImage
      src={`/Cards/${card.img}.png`}
      alt={`Pack`}
      borderRadius="10px"
    />
  );

  const spineAnim = (
    <LootBox
      ref={spineAnimationRef}
      pack={pack}
      onOpenAnimationStart={openAnimationCallBack}
    />
  );

  return isSmallScreen ? (
    <>
      <MobileDecoration />
      <Flex
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        pt={4}
        w="100%"
        h="100%"
        textAlign="center"
      >
        <Flex justifyContent="flex-end" mr={3} w="100%" zIndex={2}>
          <MobileCoins />
        </Flex>
        <Flex
          gap={1}
          flexDir="column"
          w="100%"
          justifyContent="center"
          alignItems="center"
          sx={{
            zIndex: 1,
          }}
        >
          <Box>
            <Heading
              fontWeight={500}
              size="l"
              letterSpacing={1.3}
              textTransform="unset"
            >
              {name}
            </Heading>
          </Box>
          <Text textAlign="center" size="xl" fontSize={"15px"} width={"90%"}>
            {colorizeText(description)}
          </Text>
          {details && (
            <Flex zIndex={2} mt={2} gap={2}>
              <LootBoxRateInfo name={name} details={details} />
            </Flex>
          )}
        </Flex>
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          alignSelf={"center"}
          flexGrow={1}
          flexDirection="column"
        >
          <Flex w="100%" h="100%">
            {spineAnim}
          </Flex>
          <Flex mt={-6}>
            <PriceBox
              absolutePosition={false}
              price={card.price ?? 0}
              discountPrice={card.discount_cost}
              purchased={false}
              fontSize={18}
              discountFontSize={12}
            />
          </Flex>
        </Flex>

        <MobileBottomBar
          hideDeckButton
          firstButton={
            <Button
              size={"xs"}
              onClick={() => {
                navigate("/redirect/store");
              }}
              lineHeight={1.6}
              variant={{ base: "secondarySolid", sm: "outlinePrimaryGlow" }}
              fontSize={10}
              minWidth={"100px"}
              height={["30px", "32px"]}
            >
              {t("labels.close").toUpperCase()}
            </Button>
          }
          secondButton={tooltipButton}
        />
      </Flex>
    </>
  ) : (
    <StorePreviewComponent
      buyButton={tooltipButton}
      image={image}
      title={name}
      description={description}
      price={card.price}
      details={details}
      isPack
      spine={spineAnim}
      showOverlay={false}
      discountPrice={pack.discount_cost}
    />
  );
};
