import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CardTypes } from "../enums/cardTypes";
import { Duration } from "../enums/duration";
import { useCardData } from "../providers/CardDataProvider";
import { useGameContext } from "../providers/GameProvider";
import { useCardHighlight } from "../providers/HighlightProvider/CardHighlightProvider";
import { Card } from "../types/Card";
import { colorizeText } from "../utils/getTooltip";
import { hasPriceValue } from "../utils/pricing";
import { CardImage3D } from "./CardImage3D";
import { CashSymbol } from "./CashSymbol";
import { ConfirmationModal } from "./ConfirmationModal";
import { DurationSwitcher } from "./DurationSwitcher";
import { LootBoxRateInfo } from "./Info/LootBoxRateInfo";
import { LootBox } from "./LootBox";
import { PriceBox } from "./PriceBox";
import { useResponsiveValues } from "../theme/responsiveSettings";

interface MobileCardHighlightProps {
  card: Card;
  confirmationBtn?: boolean;
  customBtn?: ReactNode;
  showExtraInfo?: boolean;
  isPack?: boolean;
  hidePrice?: boolean;
  showCumulativeProgress?: boolean;
}

export const MobileCardHighlight = ({
  card,
  confirmationBtn = false,
  showExtraInfo = false,
  isPack = false,
  customBtn,
  hidePrice = false,
  showCumulativeProgress = false,
}: MobileCardHighlightProps) => {
  const { onClose } = useCardHighlight();

  const { getCardData, getLootBoxData } = useCardData();

  const getDataFn = isPack
    ? () => getLootBoxData(card.card_id ?? 0)
    : () =>
        getCardData(card.card_id ?? 0, {
          showCumulativeProgress,
        });
  const {
    name,
    description,
    type,
    animation,
    price,
    rarity,
    temporaryPrice,
    details,
  } = getDataFn();
  const originalEffectCardId = card.specialEffectOverrideOriginalEffectCardId;
  const hasOriginalEffectTitle =
    card.isSpecial &&
    typeof originalEffectCardId === "number" &&
    originalEffectCardId > 0;
  const originalEffectTitle = hasOriginalEffectTitle
    ? getCardData(originalEffectCardId).name
    : "";

  const { isSmallScreen } = useResponsiveValues();

  const { changeModifierCard, sellSpecialCard } = useGameContext();
  const [loading, setLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const { t } = useTranslation(["game", "docs", "cards"]);
  const descriptionWithCurrentEffect = hasOriginalEffectTitle
    ? `^violet(${t("current-effect", { ns: "cards" })})^ ${description}`
    : description;
  const [duration, setDuration] = useState(Duration.PERMANENT);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (type === CardTypes.MODIFIER) {
      handleDiscard();
    } else if (type === CardTypes.SPECIAL) {
      setConfirmationModalOpen(true);
    }
  };

  const handleDiscard = () => {
    setLoading(true);
    const discardPromise =
      type === CardTypes.MODIFIER
        ? changeModifierCard(card.idx)
        : sellSpecialCard(card);
    discardPromise.then((response) => {
      if (response) {
        onClose();
      }
      setLoading(false);
    });
  };

  const getLabel = () => {
    if (type === CardTypes.MODIFIER) {
      return loading
        ? t("game.card-highlight.buttons.changing")
        : t("game.card-highlight.buttons.change");
    } else if (type === CardTypes.SPECIAL) {
      return loading ? (
        t("game.card-highlight.buttons.selling")
      ) : (
        <>
          {t("game.card-highlight.buttons.sell-for")}
          <Box ml={1} />
          <CashSymbol />
          <Box ml={1} />
          {card.selling_price}
        </>
      );
    }
  };

  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.8);
  const [isOpening, setIsOpening] = useState(true);

  useEffect(() => {
    setOpacity(1);
    setScale(1);

    const timer = setTimeout(() => {
      setIsOpening(false);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  const handleBackdropClick = () => {
    if (!isOpening) {
      onClose();
    }
  };

  const contentMaxWidth = isSmallScreen ? undefined : "520px";

  return (
    <Flex
      position={"absolute"}
      top={0}
      left={0}
      width={"100%"}
      height={"100%"}
      zIndex={1100}
      opacity={opacity}
      flexDirection={"column"}
      transition="opacity 0.5s ease"
      justifyContent={"center"}
      alignItems={"center"}
      backdropFilter="blur(5px)"
      backgroundColor=" rgba(0, 0, 0, 0.5)"
      gap={hasPriceValue(temporaryPrice) ? 2 : 4}
      onClick={handleBackdropClick}
    >
      {confirmationModalOpen && (
        <ConfirmationModal
          close={() => setConfirmationModalOpen(false)}
          title={t("game.special-cards.confirmation-modal.title")}
          description={t("game.special-cards.confirmation-modal.description", {
            price: card.selling_price,
          })}
          onConfirm={() => {
            setConfirmationModalOpen(false);
            handleDiscard();
          }}
        />
      )}
      <Flex
        width={"65%"}
        maxW={contentMaxWidth}
        direction="column"
        alignItems="center"
        gap={1}
      >
        {type === CardTypes.SPECIAL ? (
          <Flex
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            gap={3}
          >
            <Flex flexDirection="column" textAlign="left" flex={1} minWidth={0}>
              <Heading
                fontWeight={500}
                size="l"
                lineHeight="1.2"
                letterSpacing={1.3}
                textTransform="unset"
              >
                {name}
              </Heading>
              {hasOriginalEffectTitle && (
                <Text
                  fontSize={isSmallScreen ? "12px" : "13px"}
                  color="whiteAlpha.900"
                  fontWeight={600}
                  textTransform="unset"
                >
                  ({originalEffectTitle})
                </Text>
              )}
            </Flex>
            {rarity && (
              <Flex width="28px" justifyContent="center" flexShrink={0}>
                <Heading
                  color="blueLight"
                  fontSize={isSmallScreen ? "28px" : "32px"}
                  textAlign="right"
                >
                  {rarity}
                </Heading>
              </Flex>
            )}
          </Flex>
        ) : (
          <Flex flexDirection="column" textAlign="center" alignItems="center">
            <Heading
              fontWeight={500}
              size="l"
              lineHeight="1.2"
              letterSpacing={1.3}
              textTransform="unset"
            >
              {name}
            </Heading>
            {hasOriginalEffectTitle && (
              <Text
                fontSize={isSmallScreen ? "12px" : "13px"}
                color="whiteAlpha.900"
                fontWeight={600}
                textTransform="unset"
              >
                ({originalEffectTitle})
              </Text>
            )}
          </Flex>
        )}
        <Text size="l" textTransform="lowercase" fontWeight={600} textAlign="center">
          - {t(`game.card-types.${type}`)} -
        </Text>
      </Flex>
      <Flex
        width={
          animation ? "100%" : showExtraInfo && temporaryPrice ? "45%" : "60%"
        }
        height={isPack ? "45vh" : "auto"}
        justifyContent={"center"}
        position={"relative"}
        transform={`scale(${scale})`}
        transition="all 0.5s ease"
        onClick={(e) => {
          if (e.target !== e.currentTarget) {
            e.stopPropagation();
          }
        }}
      >
        {!animation ? (
          <CardImage3D card={card} hideTooltip small={false} />
        ) : (
          <LootBox boxId={card.card_id ?? 0} />
        )}
      </Flex>
      <Flex
        textAlign="center"
        direction="column"
        alignItems="center"
        gap={1}
        width={"65%"}
        maxW={contentMaxWidth}
      >
        {card.silenced && (
          <Text
            size="xl"
            fontSize={isSmallScreen ? "14px" : "17px"}
            color="red.400"
            fontWeight={700}
            textTransform="uppercase"
          >
            {t("silenced", { ns: "cards" })}
          </Text>
        )}
        <Text
          textAlign="center"
          size="xl"
          fontSize={isSmallScreen ? "14px" : "17px"}
        >
          {colorizeText(descriptionWithCurrentEffect)}
        </Text>
      </Flex>
      {showExtraInfo && (
        <>
          {isPack && <LootBoxRateInfo name={name} details={details} />}
          {hasPriceValue(price) && !hidePrice &&
            (hasPriceValue(temporaryPrice) ? (
              <DurationSwitcher
                flexDir="column"
                price={price}
                temporalPrice={temporaryPrice}
                duration={duration}
                onDurationChange={(newDuration) => {
                  setDuration(newDuration);
                }}
              />
            ) : (
              <PriceBox
                price={price}
                purchased={false}
                absolutePosition={false}
              />
            ))}
        </>
      )}
      {(type === CardTypes.MODIFIER || type === CardTypes.SPECIAL) &&
        confirmationBtn && (
          <Button
            isDisabled={loading}
            onClick={handleClick}
            width="40%"
            variant={loading ? "defaultOutline" : "secondarySolid"}
          >
            {getLabel()}
          </Button>
        )}
      <Box py={4}>{customBtn}</Box>
    </Flex>
  );
};
