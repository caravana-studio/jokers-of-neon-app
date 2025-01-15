import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useEffect } from "react";
import { CardTypes } from "../enums/cardTypes";
import { useCardHighlight } from "../providers/CardHighlightProvider";
import { useGameContext } from "../providers/GameProvider";
import { Card } from "../types/Card";
import { getCardData } from "../utils/getCardData";
import { colorizeText } from "../utils/getTooltip";
import { CardImage3D } from "./CardImage3D";
import { ConfirmationModal } from "./ConfirmationModal";
import SpineAnimation, { SpineAnimationRef } from "./SpineAnimation";
import { animationsData } from "../constants/spineAnimations";

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
  const { name, description, type, animation } = getCardData(card, isPack);
  const { discardEffectCard, discardSpecialCard } = useGameContext();
  const [loading, setLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const { t } = useTranslation(["game"]);
  const spineAnimationRef = useRef<SpineAnimationRef>(null);

  const discard =
    type === CardTypes.MODIFIER ? discardEffectCard : discardSpecialCard;

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
      return loading
        ? t("game.card-highlight.buttons.removing")
        : t("game.card-highlight.buttons.remove");
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
      transition="opacity 0.5s ease"
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      backdropFilter="blur(5px)"
      backgroundColor=" rgba(0, 0, 0, 0.5)"
      gap={6}
      onClick={() => {
        onClose();
      }}
    >
      {confirmationModalOpen && (
        <ConfirmationModal
          close={() => setConfirmationModalOpen(false)}
          title={t("game.special-cards.confirmation-modal.title")}
          description={t("game.special-cards.confirmation-modal.description")}
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
      <Box
        width={animation ? "100%" : "60%"}
        height={animation ? "50vh" : "auto"}
        position={"relative"}
        transform={`scale(${scale})`}
        transition="all 0.5s ease"
      >
        {!animation ? (
          <CardImage3D card={card} />
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
            xOffset={-750}
            scale={1}
          />
        )}
      </Box>
      <Text textAlign="center" size="xl" fontSize={"17px"} width={"65%"}>
        {colorizeText(description)}
      </Text>
      {showExtraInfo && (
        <>
          {card.rarity && (
            <Text textAlign="center" size="l" fontSize={"14px"} width={"65%"}>
              Rarity: {card.rarity}
            </Text>
          )}
          {card.price && (
            <Text textAlign="center" size="l" fontSize={"14px"} width={"65%"}>
              Price: {card.price}
            </Text>
          )}
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
