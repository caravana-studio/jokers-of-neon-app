import { Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { RollingNumber } from "./RollingNumber";
import { useGameContext } from "../providers/GameProvider";

export const ScoreTotal = () => {
  const game = useGameContext();
  const { t } = useTranslation(["game"]);

  return (
    <Text
      size="s"
      mt={[1, 0]}
      textAlign={["right", "center"]}
      whiteSpace="nowrap"
    >
      {t("game.score-total")}: <RollingNumber n={game.playerScore} />
    </Text>
  );
};
