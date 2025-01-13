import { Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CARD_WIDTH } from "../constants/visualProps.ts";
import { useDeck } from "../dojo/queries/useDeck.tsx";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";

export const GameDeck = () => {
  const deck = useDeck();
  const navigate = useNavigate();
  const { t } = useTranslation(["game"]);

  const { cardScale } = useResponsiveValues();

  const cardWidth = CARD_WIDTH * cardScale;

  const ratio = (deck?.currentLength ?? 1) / (deck?.size ?? 1);

  const deckImg = () => {
    if (ratio > 0.7) {
      return "Cards/Backs/back-full.png";
    } else if (ratio > 0.25) {
      return "Cards/Backs/back-mid.png";
    } else {
      return "Cards/Backs/back-empty.png";
    }
  };

  return (
    <Tooltip label={t("game.deck.tooltip")} placement="left-end" size="sm">
      <Flex
        flexDirection="column"
        alignItems="flex-end"
        gap={2}
        className="game-tutorial-step-8"
      >
        <Text size="s" mr={2}>
          {`${deck?.currentLength}/${deck?.size}`}
        </Text>
        <Image
          sx={{ maxWidth: "unset" }}
          src={deckImg()}
          alt={`Card back`}
          width={`${cardWidth * 1.05}px`}
          onClick={() => navigate("/deck")}
          cursor={"pointer"}
        />
      </Flex>
    </Tooltip>
  );
};
