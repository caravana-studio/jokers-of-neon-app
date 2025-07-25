import { Box, Button, Flex, Heading, Text, Tooltip } from "@chakra-ui/react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage.tsx";
import { LootBoxRateInfo } from "../../components/Info/LootBoxRateInfo.tsx";
import { LootBox, LootBoxRef } from "../../components/LootBox.tsx";
import { MobileBottomBar } from "../../components/MobileBottomBar.tsx";
import { MobileDecoration } from "../../components/MobileDecoration.tsx";
import { PriceBox } from "../../components/PriceBox.tsx";
import { StorePreviewComponent } from "../../components/StorePreviewComponent.tsx";
import { useRedirectByGameState } from "../../hooks/useRedirectByGameState.ts";
import { useCardData } from "../../providers/CardDataProvider.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import { useGameStore } from "../../state/useGameStore.ts";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import { colorizeText } from "../../utils/getTooltip.tsx";
import { MobileCoins } from "../store/Coins.tsx";
import { GameStateEnum } from "../../dojo/typescript/custom.ts";
import { DelayedLoading } from "../../components/DelayedLoading.tsx";

export const PreviewLootBox = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { card, pack } = state || {};
  const { isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("store", { keyPrefix: "store.preview-card" });

  if (!card) {
    return <p>Card not found.</p>;
  }

  const { locked } = useStore();
  const { getLootBoxData } = useCardData();

  const { cash, setState } = useGameStore();
  const { name, description, details } = getLootBoxData(card.card_id ?? 0);
  const lootBoxRef = useRef<LootBoxRef>(null);

  const notEnoughCash =
    !card.price ||
    (pack.discount_cost ? cash < pack.discount_cost : cash < card.price);

  const onBuyClick = () => {
    navigate("/open-loot-box", {
      state: { pack: pack },
    });
    setState(GameStateEnum.Lootbox)
  };
  const buyButton = (
    <Button
      onClick={onBuyClick}
      isDisabled={notEnoughCash || locked}
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

  const spineAnim = <LootBox ref={lootBoxRef} boxId={pack.blister_pack_id} />;

  return isSmallScreen ? (
    <>
      <DelayedLoading>
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
            minH={0}
            flexDirection="column"
          >
            <Flex flexGrow={1} flexShrink={1} minH={0} minW={0}>
              {spineAnim}
            </Flex>
            <Flex transform="translateY(-40px)">
              <PriceBox
                absolutePosition={false}
                price={card.price ?? 0}
                discountPrice={pack.discount_cost}
                purchased={false}
                fontSize={18}
                discountFontSize={12}
              />
            </Flex>
          </Flex>

          <MobileBottomBar
            hideDeckButton
            firstButton={{
              onClick: () => {
                navigate("/store");
              },
              label: t("labels.close").toUpperCase(),
            }}
            secondButton={{
              onClick: onBuyClick,
              label: t("labels.buy"),
              disabled: notEnoughCash || locked,
              disabledText: t("tooltip.no-coins"),
            }}
          />
        </Flex>
      </DelayedLoading>
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
