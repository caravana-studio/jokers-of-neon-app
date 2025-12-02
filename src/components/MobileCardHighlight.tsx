import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RARITY, RarityLabels } from "../constants/rarity";
import { CardTypes } from "../enums/cardTypes";
import { Duration } from "../enums/duration";
import { useCardData } from "../providers/CardDataProvider";
import { useGameContext } from "../providers/GameProvider";
import { useCardHighlight } from "../providers/HighlightProvider/CardHighlightProvider";
import { Card } from "../types/Card";
import { colorizeText } from "../utils/getTooltip";
import { CardImage3D } from "./CardImage3D";
import { CashSymbol } from "./CashSymbol";
import { ConfirmationModal } from "./ConfirmationModal";
import { DurationSwitcher } from "./DurationSwitcher";
import { LootBoxRateInfo } from "./Info/LootBoxRateInfo";
import { LootBox } from "./LootBox";
import { PriceBox } from "./PriceBox";

interface MobileCardHighlightProps {
  card: Card;
  confirmationBtn?: boolean;
  customBtn?: ReactNode;
  showExtraInfo?: boolean;
  isPack?: boolean;
  hidePrice?: boolean;
}

export const MobileCardHighlight = ({
  card,
  confirmationBtn = false,
  showExtraInfo = false,
  isPack = false,
  customBtn,
  hidePrice = false,
}: MobileCardHighlightProps) => {
  const { onClose } = useCardHighlight();

  const { getCardData, getLootBoxData } = useCardData();

  const getDataFn = isPack ? getLootBoxData : getCardData;
  const {
    name,
    description,
    type,
    animation,
    price,
    rarity,
    temporaryPrice,
    details,
  } = getDataFn(card.card_id ?? 0);

  const { changeModifierCard, sellSpecialCard } = useGameContext();
  const [loading, setLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const { t } = useTranslation(["game", "docs"]);
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

  const [isVisible, setIsVisible] = useState(false);
  const [enableTilt, setEnableTilt] = useState(false);

  useEffect(() => {
    // Use double requestAnimationFrame to ensure layout is fully calculated and painted
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });
    // Enable tilt after the component is fully visible (500ms)
    const timer = setTimeout(() => {
      setEnableTilt(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Flex
      position={"absolute"}
      top={0}
      left={0}
      width={"100%"}
      height={"100%"}
      zIndex={1100}
      visibility={isVisible ? "visible" : "hidden"}
      opacity={isVisible ? 1 : 0}
      flexDirection={"column"}
      transition="opacity 0.3s ease"
      justifyContent={"center"}
      alignItems={"center"}
      backdropFilter="blur(5px)"
      backgroundColor=" rgba(0, 0, 0, 0.5)"
      gap={temporaryPrice ? 4 : 6}
      onClick={() => {
        onClose();
      }}
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
      <Flex flexDirection="column" textAlign="center">
        <Heading
          fontWeight={500}
          size="l"
          letterSpacing={1.3}
          textTransform="unset"
        >
          {name}
        </Heading>
        <Text size="l" textTransform="lowercase" fontWeight={600}>
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
      >
        {!animation ? (
          <CardImage3D card={card} hideTooltip small={false} disableTilt={!enableTilt} />
        ) : (
          <LootBox boxId={card.card_id ?? 0} />
        )}
      </Flex>
      <Text textAlign="center" size="xl" fontSize={"17px"} width={"65%"}>
        {colorizeText(description)}
      </Text>
      {showExtraInfo && (
        <>
          {rarity && (
            <Text textAlign="center" size="l" fontSize={"14px"} width={"65%"}>
              {t(`rarity.${RarityLabels[rarity as RARITY]}`, { ns: "docs" })}
            </Text>
          )}
          {isPack && <LootBoxRateInfo name={name} details={details} />}
          {(price && !hidePrice) &&
            (temporaryPrice ? (
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
