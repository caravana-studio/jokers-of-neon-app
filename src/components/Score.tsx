import { Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGameStore } from "../state/useGameStore";
import { RollingNumber } from "./RollingNumber";

export const Score = () => {
  const { t } = useTranslation(["game"]);
  const { currentScore } = useGameStore();

  return (
    <Heading
      variant="italic"
      fontSize={{ base: "0.85rem", md: "1.2rem" }}
      mb={{ base: 1, md: 4 }}
      textShadow="0 0 10px white"
      whiteSpace="nowrap"
      className="game-tutorial-step-7"
    >
      {t("game.score")} <RollingNumber className="italic" n={currentScore} />
    </Heading>
  );
};
