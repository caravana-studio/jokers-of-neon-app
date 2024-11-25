import { Button, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage.tsx";
import { StorePreviewComponent } from "../../components/StorePreviewComponent.tsx";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
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

  if (!card) {
    return <p>Card not found.</p>;
  }

  const game = useGame();
  const { buyCard, buySpecialCardItem, locked, setLockRedirection } =
    useStore();
  const cash = game?.cash ?? 0;
  const { name, description } = getCardData(card, false);
  const specialMaxLength = game?.len_max_current_special_cards ?? 0;
  const specialLength = game?.len_current_special_cards ?? 0;

  const notEnoughCash = !card.price || cash < card.price;
  const notEnoughCashTemporal =
    !card.temporary_price || cash < card.temporary_price;
  const noSpaceForSpecialCards =
    card.isSpecial && specialLength >= specialMaxLength;

  const BuyButton = ({
    onClick,
    isDisabled,
    notEnoughCash,
    label,
  }: {
    onClick: () => void;
    isDisabled: boolean;
    notEnoughCash: boolean;
    label: string;
  }) =>
    notEnoughCash || noSpaceForSpecialCards ? (
      <Tooltip
        label={
          noSpaceForSpecialCards ? t("tooltip.no-space") : t("tooltip.no-coins")
        }
      >
        <Button
          onClick={onClick}
          isDisabled={isDisabled}
          variant="outlinePrimaryGlow"
          height={{ base: "40px", sm: "100%" }}
          width={{ base: "50%", sm: "unset" }}
        >
          {label}
        </Button>
      </Tooltip>
    ) : (
      <Button
        onClick={onClick}
        isDisabled={isDisabled}
        variant="outlinePrimaryGlow"
        height={{ base: "40px", sm: "100%" }}
        width={{ base: "50%", sm: "unset" }}
      >
        {label}
      </Button>
    );

  const buyButton = (
    <BuyButton
      onClick={() => {
        if (card.isSpecial) {
          buySpecialCardItem(card, false);
        } else {
          buyCard(card);
        }
        navigate(-1);
      }}
      isDisabled={
        notEnoughCash || noSpaceForSpecialCards || locked || buyDisabled
      }
      notEnoughCash={notEnoughCash}
      label={t("labels.buy")}
    />
  );

  const temporalButton = (
    <BuyButton
      onClick={() => {
        if (card.isSpecial) {
          buySpecialCardItem(card, true);
        } else {
          buyCard(card);
        }
        navigate(-1);
      }}
      isDisabled={
        cash < card.temporary_price ||
        noSpaceForSpecialCards ||
        locked ||
        buyDisabled
      }
      notEnoughCash={notEnoughCashTemporal}
      label={t("labels.buy-temporal")}
    />
  );

  const tooltipButton =
    notEnoughCash || noSpaceForSpecialCards ? (
      <Tooltip
        label={
          noSpaceForSpecialCards ? t("tooltip.no-space") : t("tooltip.no-coins")
        }
      >
        {buyButton}
      </Tooltip>
    ) : (
      buyButton
    );

  const tooltipTemporalButton =
    cash < card.temporary_price || noSpaceForSpecialCards ? (
      <Tooltip
        label={
          noSpaceForSpecialCards ? t("tooltip.no-space") : t("tooltip.no-coins")
        }
      >
        {temporalButton}
      </Tooltip>
    ) : (
      temporalButton
    );

  const image = (
    <CachedImage
      src={`/Cards/${card.isSpecial || card.isModifier ? `big/${card?.card_id}.png` : `big/${card?.img}`}`}
      alt={`Card: ${card.name}`}
      borderRadius="10px"
    />
  );

  const cardType = card.isSpecial
    ? t("labels.special")
    : card.isModifier
      ? t("labels.modifier")
      : t("labels.traditional");

  const temporary = card.temporary && " (" + t("labels.temporary") + ")";

  return (
    <StorePreviewComponent
      buyButton={tooltipButton}
      temporalButton={card.isSpecial ? tooltipTemporalButton : undefined}
      image={image}
      title={name}
      cardType={card.temporary ? cardType + temporary : cardType}
      description={description}
      extraDescription={card.isTemporary && getTemporalCardText(card.remaining)}
      price={card.price}
      temporalPrice={card.isSpecial ? card.temporary_price : undefined}
    />
  );
};

export default PreviewCard;
