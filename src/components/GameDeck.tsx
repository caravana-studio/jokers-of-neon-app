import { Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import { CARD_WIDTH_PX } from "../constants/visualProps.ts";
import { useDeck } from "../dojo/queries/useDeck.tsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGameContext } from "../providers/GameProvider.tsx";

export const GameDeck = () => {
  const deck = useDeck();
  const navigate = useNavigate();
  const { t } = useTranslation(["game"]);
  const { togglePreselectedAll } = useGameContext();

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
          src={`Cards/Backs/back.png`}
          alt={`Ccard back`}
          width={CARD_WIDTH_PX}
          onClick={() => {
            togglePreselectedAll();
            navigate("/deck");
          }}
          cursor={"pointer"}
        />
      </Flex>
    </Tooltip>
  );
};
