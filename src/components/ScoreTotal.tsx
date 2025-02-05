import { Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGame } from "../dojo/queries/useGame";
import { PointBox } from "./MultiPoints";
import { RollingNumber } from "./RollingNumber";

export const ScoreTotal = () => {
  const { player_score } = useGame();
  const { t } = useTranslation(["game"]);

  return (
    <PointBox type="level" height="auto">
      <Heading size={"xs"}>{t("game.score-total")}</Heading>
      <Heading size={"xs"} sx={{ color: "white" }}>
        <RollingNumber n={player_score} />
      </Heading>
    </PointBox>
  );
};
