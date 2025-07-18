import { Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGameStore } from "../state/useGameStore";
import { RollingNumber } from "./RollingNumber";

export const ScoreTotal = () => {
  const { t } = useTranslation(["game"]);
  const { totalScore } = useGameStore();
  return (
    <Text
      size="s"
      mt={[1, 0]}
      textAlign={["right", "center"]}
      whiteSpace="nowrap"
    >
      {t("game.score-total")}: <RollingNumber n={totalScore} />
    </Text>
  );
};
