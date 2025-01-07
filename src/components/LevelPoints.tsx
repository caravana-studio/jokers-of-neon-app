import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useGame } from "../dojo/queries/useGame";
import { useRound } from "../dojo/queries/useRound";
import { PointBox } from "./MultiPoints";
import { Score } from "./Score";
import { useTranslation } from "react-i18next";
import { isTutorial } from "../utils/isTutorial";
import { useGameContext } from "../providers/GameProvider";
import { RollingNumber } from "./RollingNumber";

export const LevelPoints = () => {
  const inTutorial = isTutorial();
  const game = useGame();
  const gameContext = useGameContext();
  const round = useRound();
  const level = inTutorial ? 1 : game?.level ?? 0;
  const levelScore = inTutorial ? 300 : gameContext.levelScore;
  const lifeSaverEvent = gameContext.lifeSaverSpecialCardEvent;
  const { t } = useTranslation(["game"]);

  return (
    <Box className="game-tutorial-step-1">
      <Flex gap={6}>
        <PointBox type="level">
          <Heading size={{ base: "xs", md: "s" }}>
            {t("game.level-points.level")}
          </Heading>
          <Heading size={{ base: "s", md: "m" }} sx={{ color: "white" }}>
            {level}
          </Heading>
        </PointBox>
        <PointBox type="points">
          <Heading size={{ base: "xs", md: "s" }}>
            {t("game.level-points.target-score")}
          </Heading>
          <Heading size={{ base: "s", md: "m" }} px={2}>
            {lifeSaverEvent &&
            lifeSaverEvent.new_level_score &&
            lifeSaverEvent.old_level_score ? (
              <RollingNumber
                className="italic"
                from={lifeSaverEvent.old_level_score}
                n={
                  lifeSaverEvent.old_level_score -
                  lifeSaverEvent.new_level_score
                }
                delay={1000}
              />
            ) : (
              levelScore
            )}
          </Heading>
        </PointBox>
      </Flex>
      <Text size="s" mt={{ base: 3, md: 5 }} textAlign="center">
        {t("game.level-points.score", { score: levelScore, level: level })}
      </Text>
    </Box>
  );
};

export const MobileLevelPoints = () => {
  const game = useGame();
  const gameContext = useGameContext();
  const round = useRound();
  const level = game?.level ?? 0;
  const levelScore = gameContext.levelScore;
  const { t } = useTranslation(["game"]);

  return (
    <Flex gap={2.5} alignItems="center" className="game-tutorial-step-1">
      <Flex
        border="1px solid white"
        borderRadius={10}
        px={1.5}
        height={10}
        alignItems="center"
      >
        <Heading fontSize={21}>{level}</Heading>
      </Flex>
      <Flex flexDirection="column" gap={1} justifyContent={"center"}>
        <Text size="m" lineHeight={1} mt={2}>
          {t("game.level-points.score", {
            score: levelScore,
            level: level,
          })}
        </Text>
        <Score />
      </Flex>
    </Flex>
  );
};
