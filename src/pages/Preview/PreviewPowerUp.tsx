import { Button, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage.tsx";
import { StorePreviewComponent } from "../../components/StorePreviewComponent.tsx";
import { POWER_UPS_CARDS_DATA } from "../../data/powerups.ts";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";

export const PreviewPowerUp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { powerUp } = state || {};

  const [buyDisabled, setBuyDisabled] = useState(false);
  const { t } = useTranslation("store", { keyPrefix: "store.preview-card" });

  const game = useGame();
  const { buyPowerUp, locked } = useStore();
  const cash = game?.cash ?? 0;

  const name = POWER_UPS_CARDS_DATA[powerUp.power_up_id].name;
  const description = POWER_UPS_CARDS_DATA[powerUp.power_up_id].description;

  const notEnoughCash = !powerUp.cost || cash < powerUp.cost;

  const buyButton = (
    <Button
      onClick={() => {
        setBuyDisabled(true);
        buyPowerUp(powerUp);
        navigate(-1);
      }}
      isDisabled={notEnoughCash || locked || buyDisabled}
      variant="outlinePrimaryGlow"
      height={{ base: "40px", sm: "100%" }}
      width={{ base: "50%", sm: "unset" }}
    >
      {t("labels.buy")}
    </Button>
  );

  const tooltipButton = notEnoughCash ? (
    <Tooltip label={t("tooltip.no-coins")}>{buyButton}</Tooltip>
  ) : (
    buyButton
  );

  const image = (
    <CachedImage src={powerUp.img_big} alt={`PowerUp`} borderRadius="10px" />
  );

  return (
    <StorePreviewComponent
      buyButton={tooltipButton}
      image={image}
      title={name}
      description={description}
      price={powerUp.cost}
    />
  );
};
