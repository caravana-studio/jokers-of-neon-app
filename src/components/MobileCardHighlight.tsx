import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useEffect } from "react";
import { RARITY, RarityLabels } from "../constants/rarity";
import { animationsData } from "../constants/spineAnimations";
import { CardTypes } from "../enums/cardTypes";
import { Duration } from "../enums/duration";
import { useCardHighlight } from "../providers/CardHighlightProvider";
import { useGameContext } from "../providers/GameProvider";
import { Card } from "../types/Card";
import { getCardData } from "../utils/getCardData";
import { colorizeText } from "../utils/getTooltip";
import { CardImage3D } from "./CardImage3D";
import { CashSymbol } from "./CashSymbol";
import { ConfirmationModal } from "./ConfirmationModal";
import { DurationSwitcher } from "./DurationSwitcher";
import { LootBoxRateInfo } from "./Info/LootBoxRateInfo";
import { PriceBox } from "./PriceBox";
import SpineAnimation, { SpineAnimationRef } from "./SpineAnimation";

interface MobileCardHighlightProps {
  card: Card;
  confirmationBtn?: boolean;
  showExtraInfo?: boolean;
  isPack?: boolean;
}

export const MobileCardHighlight = ({
  card,
  confirmationBtn = false,
  showExtraInfo = false,
  isPack = false,
}: MobileCardHighlightProps) => {
  const { onClose } = useCardHighlight();

  const {
    name,
    description,
    type,
    animation,
    price,
    rarity,
    temporaryPrice,
    details,
  } = getCardData(card, isPack);
  const { changeModifierCard, sellSpecialCard } = useGameContext();
  const [loading, setLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const { t } = useTranslation(["game", "docs"]);
  const spineAnimationRef = useRef<SpineAnimationRef>(null);
  const [duration, setDuration] = useState(Duration.PERMANENT);

  const discard =
    type === CardTypes.MODIFIER ? changeModifierCard : sellSpecialCard;

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
    discard(card.idx).then((response) => {
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

  useEffect(() => {
    setOpacity(1);
    setScale(1);
  }, []);

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
        transform={`scale(${scale})`}
        transition="all 0.5s ease"
      >
        {!animation ? (
          <CardImage3D card={card} hideTooltip small={false} />
        ) : (
          <SpineAnimation
            ref={spineAnimationRef}
            jsonUrl={animation.jsonUrl}
            atlasUrl={animation.atlasUrl}
            initialAnimation={animationsData.loopAnimation}
            loopAnimation={animationsData.loopAnimation}
            openBoxAnimation={animationsData.openBoxAnimation}
            width={1200}
            height={1500}
            xOffset={-650}
            scale={1}
          />
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
          {price &&
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
    </Flex>
  );
};
