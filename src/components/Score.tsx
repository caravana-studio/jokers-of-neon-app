import { Heading } from "@chakra-ui/react";
import { useGameContext } from "../providers/GameProvider";
import { RollingNumber } from "./RollingNumber";
import { useTranslation } from "react-i18next";

export const Score = () => {
  const { score } = useGameContext();
  const { t } = useTranslation();

  return (
    <Heading
      variant="italic"
      size="m"
      mb={{ base: 1, md: 4 }}
      textShadow="0 0 10px white"
      whiteSpace="nowrap"
      className="game-tutorial-step-7"
    >
      {t('game.score')} <RollingNumber className="italic" n={score} />
    </Heading>
  );
};
