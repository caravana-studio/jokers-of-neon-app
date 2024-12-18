import { Button, Text, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage.tsx";
import { StorePreviewComponent } from "../../components/StorePreviewComponent.tsx";
import { StorePreviewPowerUpComponentMobile } from "../../components/StorePreviewPowerUpComponent.mobile.tsx";
import { POWER_UPS_CARDS_DATA } from "../../data/powerups.ts";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";

export const PreviewPowerUp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { isSmallScreen } = useResponsiveValues();

  const { powerUp } = state || {};

  const [buyDisabled, setBuyDisabled] = useState(false);
  const { t } = useTranslation("store", { keyPrefix: "store.preview-card" });

  const game = useGame();
  const { buyPowerUp, locked } = useStore();
  const { powerUps } = useGameContext();
  const cash = game?.cash ?? 0;

  const name = `${POWER_UPS_CARDS_DATA[powerUp.power_up_id].name}`;
  const description = POWER_UPS_CARDS_DATA[powerUp.power_up_id].description;

  const notEnoughCash =
    !powerUp.cost ||
    (powerUp?.discount_cost
      ? cash < Number(powerUp?.discount_cost ?? 0)
      : cash < Number(powerUp.cost));

  const noSpace =
    powerUps.filter((p) => !!p).length >=
    (game?.len_max_current_power_ups ?? 4);

  const onBuyButtonClick = () => {
    setBuyDisabled(true);
    buyPowerUp(powerUp).then(() =>
      navigate("/redirect/store", { state: { lastTabIndex: 2 } })
    );
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
    <CachedImage src={powerUp.img_big} alt={`PowerUp`} borderRadius="10px" />
  );

  const props = {
    buyButton: tooltipButton,
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
      cardType={t("labels.power-up")}
    />
  ) : (
    <StorePreviewComponent {...props} />
  );
};
