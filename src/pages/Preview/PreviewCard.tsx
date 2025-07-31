import { Button, Text, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { CardImage3D } from "../../components/CardImage3D.tsx";
import { StorePreviewCardComponentMobile } from "../../components/StorePreviewCardComponent.mobile.tsx";
import { StorePreviewComponent } from "../../components/StorePreviewComponent.tsx";
import { GameStateEnum } from "../../dojo/typescript/custom.ts";
import { Duration } from "../../enums/duration.ts";
import { useCustomNavigate } from "../../hooks/useCustomNavigate.tsx";
import { useCardData } from "../../providers/CardDataProvider.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import { useGameStore } from "../../state/useGameStore.ts";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import { getTemporalCardText } from "../../utils/getTemporalCardText.ts";
import { useShopStore } from "../../state/useShopStore.ts";

const PreviewCard = () => {
  const { state } = useLocation();
  const navigate = useCustomNavigate();

  const { card } = state || {};

  const [buyDisabled, setBuyDisabled] = useState(false);
  const { t } = useTranslation("store", {
    keyPrefix: "store.preview-card",
  });

  const { isSmallScreen } = useResponsiveValues();
  const [duration, setDuration] = useState(Duration.PERMANENT);

  if (!card) {
    return <p>Card not found.</p>;
  }

  const { buyCard, buySpecialCardItem } = useStore();
  const { locked } = useShopStore();

  const { getCardData } = useCardData();

  const { cash, specialSlots, specialsLength } = useGameStore();
  const { name, description } = getCardData(card.card_id ?? 0);

  const notEnoughCash =
    (duration === Duration.PERMANENT &&
      (!card.price ||
        (card.discount_cost
          ? cash < card.discount_cost
          : cash < card.price))) ||
    (duration === Duration.TEMPORAL &&
      (!card.temporary_price ||
        (card.temporary_discount_cost
          ? cash < card.temporary_discount_cost
          : cash < card.temporary_price)));

  const noSpaceForSpecialCards =
    card.isSpecial && specialsLength >= specialSlots;

  const onBuyClick = () => {
    if (card.isSpecial) {
      buySpecialCardItem(card, duration === Duration.TEMPORAL).then(() =>
        navigate(GameStateEnum.Store)
      );
    } else {
      buyCard(card).then(() => navigate(GameStateEnum.Store));
    }
  };

  const buyButton = isSmallScreen ? (
    <Button
      size={"xs"}
      onClick={onBuyClick}
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
      onClick={onBuyClick}
      variant="outlinePrimaryGlow"
      height={{ base: "40px", sm: "100%" }}
      width={{ base: "50%", sm: "unset" }}
      isDisabled={
        notEnoughCash || noSpaceForSpecialCards || locked || buyDisabled
      }
    >
      {t("labels.buy")}
    </Button>
  );
  const label = noSpaceForSpecialCards
    ? t("tooltip.no-space")
    : t("tooltip.no-coins");

  const tooltipButton =
    notEnoughCash || noSpaceForSpecialCards ? (
      isSmallScreen ? (
        <Text fontSize={10}>{label}</Text>
      ) : (
        <Tooltip label={label}>{buyButton}</Tooltip>
      )
    ) : (
      buyButton
    );

  const image = (
    <CardImage3D
      hideTooltip
      card={{
        ...card,
        temporary: duration === Duration.TEMPORAL,
        remaining: 3,
      }}
    />
  );

  const cardType = card.isSpecial
    ? t("labels.special")
    : card.isModifier
      ? t("labels.modifier")
      : t("labels.traditional");

  const temporary = card.temporary && " (" + t("labels.temporary") + ")";

  const onDurationChange = () =>
    setDuration(
      duration === Duration.TEMPORAL ? Duration.PERMANENT : Duration.TEMPORAL
    );

  const props = {
    buyButton: tooltipButton,
    image,
    title: name,
    cardType: card.temporary ? cardType + temporary : cardType,
    description: description,
    extraDescription: card.isTemporary && getTemporalCardText(card.remaining),
    price: card.price,
    temporalPrice: card.isSpecial ? card.temporary_price : undefined,
    discountPrice: card.discount_cost,
    temporalDiscountPrice: card.isSpecial
      ? card.temporary_discount_cost
      : undefined,
    duration: card.isSpecial ? duration : undefined,
    onDurationChange: card.isSpecial ? onDurationChange : undefined,
  };

  return isSmallScreen ? (
    <StorePreviewCardComponentMobile
      card={card}
      title={name}
      description={description}
      cardType={cardType}
      buyButton={{
        onClick: onBuyClick,
        label: t("labels.buy").toUpperCase(),
        disabled: notEnoughCash || noSpaceForSpecialCards,
        disabledText: noSpaceForSpecialCards
          ? t("tooltip.no-space")
          : t("tooltip.no-coins"),
      }}
      duration={duration}
      onDurationChange={onDurationChange}
      tab={0}
    />
  ) : (
    <StorePreviewComponent {...props} />
  );
};

export default PreviewCard;
