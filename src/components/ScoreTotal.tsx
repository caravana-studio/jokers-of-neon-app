import { Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGame } from "../dojo/queries/useGame";
import { PointBox } from "./MultiPoints";

export const ScoreTotal = () => {
  const { player_score } = useGame();
  const { t } = useTranslation(["game"]);

  return (
    <PointBox type="level" height="auto">
      <Heading size={"xs"}>{t("game.score-total")}</Heading>
      <Heading size={"xs"} sx={{ color: "white" }}>
        {player_score}
      </Heading>
    </PointBox>
  );
};
