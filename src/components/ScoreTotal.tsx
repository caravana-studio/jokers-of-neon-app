import { Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGame } from "../dojo/queries/useGame";
import { RollingNumber } from "./RollingNumber";

export const ScoreTotal = () => {
  const game = useGame();
  const { t } = useTranslation(["game"]);

  return (
    <Text
      size="s"
      mt={[1, 0]}
      textAlign={["right", "center"]}
      whiteSpace="nowrap"
    >
      {t("game.score-total")}: <RollingNumber n={game?.player_score ?? 0} />
    </Text>
  );
};
