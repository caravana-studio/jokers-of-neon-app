import { Button, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CachedImage from "../../components/CachedImage.tsx";
import { StorePreviewComponent } from "../../components/StorePreviewComponent.tsx";
import { StorePreviewSlotComponentMobile } from "../../components/StorePreviewSlotComponent.mobile.tsx";
import { GameStateEnum } from "../../dojo/typescript/custom.ts";
import { useCustomNavigate } from "../../hooks/useCustomNavigate.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import { useGameStore } from "../../state/useGameStore.ts";
import { useShopStore } from "../../state/useShopStore.ts";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import { useNavigate } from "react-router-dom";

export const PreviewSlot = () => {
  const navigate = useNavigate();
  const { specialSlotItem, locked } = useShopStore();
  const { isSmallScreen } = useResponsiveValues();

  const price = specialSlotItem?.cost ?? 0;
  const [buyDisabled, setBuyDisabled] = useState(false);
  const { t } = useTranslation("store", { keyPrefix: "store.preview-card" });

  const { buySpecialSlot } = useStore();
  const { cash } = useGameStore();

  const imgSize = isSmallScreen ? "120px" : "auto";

  const notEnoughCash =
    !price ||
    (specialSlotItem?.discount_cost
      ? cash < Number(specialSlotItem?.discount_cost ?? 0)
      : cash < Number(price));

  const handleBuyClick = () => {
    buySpecialSlot();
    navigate("/store");
  };

  const buyButton = (
    <Button
      onClick={handleBuyClick}
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

  const props = {
    image: image,
    title: t("slot-title"),
    description: t("slot-description"),
    price: Number(price),
    discountPrice: Number(specialSlotItem?.discount_cost ?? 0),
  };

  return isSmallScreen ? (
    <StorePreviewSlotComponentMobile
      {...props}
      buyButton={{
        onClick: handleBuyClick,
        label: t("labels.buy").toUpperCase(),
        disabled: notEnoughCash || locked || buyDisabled,
        disabledText: notEnoughCash ? t("tooltip.no-coins") : "",
      }}
      image={image}
      title={t("slot-title")}
      description={t("slot-description")}
      price={Number(price)}
      discountPrice={Number(specialSlotItem?.discount_cost ?? 0)}
    />
  ) : (
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
