import { Button, Text, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { CardImage3D } from "../../components/CardImage3D.tsx";
import { StorePreviewCardComponentMobile } from "../../components/StorePreviewCardComponent.mobile.tsx";
import { StorePreviewComponent } from "../../components/StorePreviewComponent.tsx";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { Duration } from "../../enums/duration.ts";
import { useStore } from "../../providers/StoreProvider.tsx";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import { getCardData } from "../../utils/getCardData.ts";
import { getTemporalCardText } from "../../utils/getTemporalCardText.ts";

const PreviewCard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { card } = state || {};

  const [buyDisabled, setBuyDisabled] = useState(false);
  const { t } = useTranslation("store", {
    keyPrefix: "store.preview-card",
  });

  const { isSmallScreen } = useResponsiveValues();
  const game = useGame();
  const [duration, setDuration] = useState(Duration.PERMANENT);

  if (!card) {
    return <p>Card not found.</p>;
  }

  const { buyCard, buySpecialCardItem, locked, setLockRedirection } =
    useStore();
  const cash = game?.cash ?? 0;
  const { name, description } = getCardData(card, false);
  const specialMaxLength = game?.len_max_current_special_cards ?? 0;
  const specialLength = game?.len_current_special_cards ?? 0;

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
    card.isSpecial && specialLength >= specialMaxLength;

  const onBuyClick = () => {
    if (card.isSpecial) {
      buySpecialCardItem(card, duration === Duration.TEMPORAL).then(() =>
        navigate("/redirect/store", { state: { lastTabIndex: 0 } })
      );
    } else {
      buyCard(card).then(() =>
        navigate("/redirect/store", { state: { lastTabIndex: 0 } })
      );
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
      buyButton={tooltipButton}
      duration={duration}
      onDurationChange={onDurationChange}
      tab={0}
    />
  ) : (
    <StorePreviewComponent {...props} />
  );
};

export default PreviewCard;
