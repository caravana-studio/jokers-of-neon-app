import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Tilt from "react-parallax-tilt";
import { TILT_OPTIONS } from "../constants/visualProps";
import { CardTypes } from "../enums/cardTypes";
import { useCardHighlight } from "../providers/CardHighlightProvider";
import { useGameContext } from "../providers/GameProvider";
import { Card } from "../types/Card";
import { getCardData } from "../utils/getCardData";
import { colorizeText } from "../utils/getTooltip";
import CachedImage from "./CachedImage";
import { ConfirmationModal } from "./ConfirmationModal";
import { TemporalBadge } from "./TiltCard";

interface MobileCardHighlightProps {
  card: Card;
}

export const MobileCardHighlight = ({ card }: MobileCardHighlightProps) => {
  const { onClose } = useCardHighlight();
  const { name, description, type } = getCardData({...card, card_id: 310, isSpecial: true}, false);
  const { discardEffectCard, discardSpecialCard } = useGameContext();
  const [loading, setLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const { t } = useTranslation(["game"]);

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

  return (
    <Flex
      position={"absolute"}
      top={0}
      left={0}
      width={"100%"}
      height={"100%"}
      zIndex={1100}
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
      <Box width={"60%"} position={"relative"}>
        <Tilt
          {...TILT_OPTIONS}
          style={{ transformStyle: "preserve-3d" }}
          glareMaxOpacity={0.2}
        >
          <CachedImage
            position={"absolute"}
            borderRadius={"20px"}
            src={`Cards/big/${310}-back.png`}
            alt={`Card: ${name}`}
            width={"100%"}
            zIndex={-1}
          />
          <CachedImage
            position={"absolute"}
            borderRadius={"20px"}
            src={`Cards/big/${310}-mid.png`}
            alt={`Card: ${name}`}
            width={"100%"}
            transform="translateZ(60px)"
          />          
          <CachedImage
            position={"absolute"}
            borderRadius={"20px"}
            src={`Cards/big/${310}-front.png`}
            alt={`Card: ${name}`}
            width={"100%"}
            transform="translateZ(80px)"
          />
          <CachedImage
            src={`Cards/big/empty.png`}
            alt={`empty`}
            width={"100%"}
          />
        </Tilt>
        {card.temporary && card.remaining && (
          <TemporalBadge remaining={card.remaining} scale={1.6} />
        )}
      </Box>
      <Text textAlign="center" size="xl" fontSize={"17px"} width={"65%"}>
        {colorizeText(description)}
      </Text>
      {(type === CardTypes.MODIFIER || type === CardTypes.SPECIAL) && (
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
