import { Heading } from "@chakra-ui/react";
import { useGameContext } from "../providers/GameProvider";
import { RollingNumber } from "./RollingNumber";
import { useTranslation } from "react-i18next";
import { useGameView } from "../dojo/queries/useGameView";
import { useRound } from "../dojo/queries/useRound";

export const Score = () => {
  const { t } = useTranslation(["game"]);
  const round = useRound();

  return (
    <Heading
      variant="italic"
      fontSize={{ base: "0.85rem", md: "1.2rem" }}
      mb={{ base: 1, md: 4 }}
      textShadow="0 0 10px white"
      whiteSpace="nowrap"
      className="game-tutorial-step-7"
    >
      {t("game.score")} <RollingNumber className="italic" n={round.current_score} />
    </Heading>
  );
};
