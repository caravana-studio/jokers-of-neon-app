import { Button, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage.tsx";
import { StorePreviewComponent } from "../../components/StorePreviewComponent.tsx";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";

export const PreviewSlot = () => {
  const navigate = useNavigate();
  const { specialSlotItem } = useStore();
  const { isSmallScreen } = useResponsiveValues();

  const price = specialSlotItem?.cost ?? 0;
  const [buyDisabled, setBuyDisabled] = useState(false);
  const { t } = useTranslation("store", { keyPrefix: "store.preview-card" });

  const game = useGame();
  const { buySpecialSlot, locked } = useStore();
  const cash = game?.cash ?? 0;

  const imgSize = isSmallScreen ? "120px" : "auto";

  const notEnoughCash =
    !price ||
    (specialSlotItem?.discount_cost
      ? cash < Number(specialSlotItem?.discount_cost ?? 0)
      : cash < Number(price));

  const buyButton = (
    <Button
      onClick={() => {
        buySpecialSlot();
        navigate("/store");
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
    <CachedImage
      src={`/store/slot-image.png`}
      alt={`special card slot`}
      pl={4}
      pt={4}
      width={imgSize}
    />
  );
  return (
    <StorePreviewComponent
      buyButton={tooltipButton}
      image={image}
      title={t("slot-title")}
      description={t("slot-description")}
      price={Number(price)}
      discountPrice={Number(specialSlotItem?.discount_cost ?? 0)}
    />
  );
};
