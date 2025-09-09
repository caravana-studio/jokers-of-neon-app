import { Button, Text, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import CachedImage from "../../components/CachedImage.tsx";
import { StorePreviewComponent } from "../../components/StorePreviewComponent.tsx";
import { StorePreviewPowerUpComponentMobile } from "../../components/StorePreviewPowerUpComponent.mobile.tsx";
import { getPowerUpData } from "../../data/powerups.ts";
import { GameStateEnum } from "../../dojo/typescript/custom.ts";
import { useCustomNavigate } from "../../hooks/useCustomNavigate.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import { useGameStore } from "../../state/useGameStore.ts";
import { useShopStore } from "../../state/useShopStore.ts";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";

export const PreviewPowerUp = () => {
  const { state } = useLocation();
  const navigate = useCustomNavigate();

  const { isSmallScreen } = useResponsiveValues();

  const { powerUp } = state || {};

  const [buyDisabled, setBuyDisabled] = useState(false);
  const { t } = useTranslation("store", { keyPrefix: "store.preview-card" });

  const { buyPowerUp } = useStore();
  const { locked, powerUps } = useShopStore();
  const { cash, maxPowerUpSlots } = useGameStore();

  const powerUpData = getPowerUpData(powerUp.power_up_id);

  const name = powerUpData?.name;
  const description = powerUpData?.description;

  const notEnoughCash =
    !powerUp.cost ||
    (powerUp?.discount_cost
      ? cash < Number(powerUp?.discount_cost ?? 0)
      : cash < Number(powerUp.cost));

  const noSpace = powerUps.filter((p) => !!p).length >= maxPowerUpSlots;

  const onBuyButtonClick = () => {
    setBuyDisabled(true);
    navigate(GameStateEnum.Store)
    buyPowerUp(powerUp);
  };
  const buyButton = isSmallScreen ? (
    <Button
      size={"xs"}
      onClick={onBuyButtonClick}
      lineHeight={1.6}
      variant="solid"
      fontSize={10}
      minWidth={"100px"}
      height={["30px", "32px"]}
    >
      {t("labels.buy").toUpperCase()}
    </Button>
  ) : (
    <Button
      onClick={onBuyButtonClick}
      isDisabled={notEnoughCash || locked || buyDisabled || noSpace}
      variant="outlinePrimaryGlow"
      height={{ base: "40px", sm: "100%" }}
      width={{ base: "50%", sm: "unset" }}
    >
      {t("labels.buy")}
    </Button>
  );

  const buttonMessage = t(
    notEnoughCash ? "tooltip.no-coins" : "tooltip.no-space-power-ups"
  );

  const tooltipButton =
    notEnoughCash || noSpace ? (
      isSmallScreen ? (
        <Text fontSize={10}>{buttonMessage}</Text>
      ) : (
        <Tooltip label={buttonMessage}>{buyButton}</Tooltip>
      )
    ) : (
      buyButton
    );

  const image = (
    <CachedImage src={powerUp.img} alt={`PowerUp`} borderRadius="10px" />
  );

  const props = {
    image: image,
    title: name,
    description: description,
    price: powerUp.cost,
    discountPrice: powerUp.discount_cost,
    tab: 2,
  };

  return isSmallScreen ? (
    <StorePreviewPowerUpComponentMobile
      {...props}
      buyButton={{
        onClick: onBuyButtonClick,
        label: t("labels.buy").toUpperCase(),
        disabled: notEnoughCash || noSpace,
        disabledText: buttonMessage,
      }}
      cardType={t("labels.power-up")}
    />
  ) : (
    <StorePreviewComponent {...props} buyButton={tooltipButton} />
  );
};
