import { Button, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage.tsx";
import { StorePreviewComponent } from "../../components/StorePreviewComponent.tsx";
import { POWER_UPS_CARDS_DATA } from "../../data/powerups.ts";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";

export const PreviewPowerUp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { powerUp } = state || {};

  const [buyDisabled, setBuyDisabled] = useState(false);
  const { t } = useTranslation("store", { keyPrefix: "store.preview-card" });

  const game = useGame();
  const { buyPowerUp, locked } = useStore();
  const { powerUps } = useGameContext();
  const cash = game?.cash ?? 0;

  const name = `${POWER_UPS_CARDS_DATA[powerUp.power_up_id].name}`;
  const description = POWER_UPS_CARDS_DATA[powerUp.power_up_id].description;

  const notEnoughCash = !powerUp.cost || cash < powerUp.cost;
  const noSpace =
    powerUps.filter((p) => !!p).length >=
    (game?.len_max_current_power_ups ?? 4);

  const buyButton = (
    <Button
      onClick={() => {
        setBuyDisabled(true);
        buyPowerUp(powerUp);
        navigate(-1);
      }}
      isDisabled={notEnoughCash || locked || buyDisabled || noSpace}
      variant="outlinePrimaryGlow"
      height={{ base: "40px", sm: "100%" }}
      width={{ base: "50%", sm: "unset" }}
    >
      {t("labels.buy")}
    </Button>
  );

  const tooltipButton = (notEnoughCash || noSpace) ? (
    <Tooltip label={t(notEnoughCash ? "tooltip.no-coins" : "tooltip.no-space-power-ups")}>{buyButton}</Tooltip>
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
