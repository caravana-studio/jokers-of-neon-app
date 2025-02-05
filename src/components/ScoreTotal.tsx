import { Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGame } from "../dojo/queries/useGame";
import { PointBox } from "./MultiPoints";
import { RollingNumber } from "./RollingNumber";
import { useResponsiveValues } from "../theme/responsiveSettings";

export const ScoreTotal = () => {
  const game = useGame();
  const { t } = useTranslation(["game"]);
  const { isSmallScreen } = useResponsiveValues();

  return !isSmallScreen ? (
    <PointBox type="level" height="auto">
      <Heading size={"xs"}>{t("game.score-total")}</Heading>
      <Heading size={"xs"} sx={{ color: "white" }}>
        <RollingNumber n={game?.player_score ?? 0} />
      </Heading>
    </PointBox>
  ) : (
    <Heading
      variant="italic"
      fontSize={"0.5rem"}
      mt={1}
      textShadow="0 0 10px white"
      whiteSpace="nowrap"
      className="game-tutorial-step-7"
      textAlign="center"
    >
      {t("game.score-total")}{" "}
      <RollingNumber className="italic" n={game?.player_score ?? 0} />
    </Heading>
  );
};
