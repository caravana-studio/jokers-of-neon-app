import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGameStore } from "../state/useGameStore";
import { isTutorial } from "../utils/isTutorial";
import { PointBox } from "./MultiPoints";
import { Score } from "./Score";

export const LevelPoints = () => {
  const { level, round, targetScore: gameTargetScore } = useGameStore();
  const targetScore = gameTargetScore ?? 0;
  const { t } = useTranslation(["game"]);
  const inTutorial = isTutorial();

  return (
    <Box className="store-tutorial-step-1">
      <Flex gap={6}>
        <PointBox type="level">
          <Heading size={{ base: "xs", md: "s" }}>
            {t("game.round-points.round")}
          </Heading>
          <Heading size={{ base: "s", md: "m" }} sx={{ color: "white" }}>
            {inTutorial ? (
              t("game.tutorial").toUpperCase()
            ) : (
              <>
                {t("game.round-points.level", { level: level })}
                <span style={{ marginLeft: "10px", marginRight: "10px" }}>
                  |
                </span>
                {round}
              </>
            )}
          </Heading>
        </PointBox>
        <PointBox type="points">
          <Heading size={{ base: "xs", md: "s" }}>
            {t("game.round-points.target-score")}
          </Heading>
          <Heading size={{ base: "s", md: "m" }} px={2}>
            {targetScore}
          </Heading>
        </PointBox>
      </Flex>
      <Text size="s" mt={{ base: 3, md: 5 }} textAlign="center">
        {t("game.round-points.score", { score: targetScore, round })}
      </Text>
    </Box>
  );
};

export const MobileLevelPoints = () => {
  const { round, targetScore: gameTargetScore } = useGameStore();
  const targetScore = gameTargetScore ?? 0;
  const { t } = useTranslation(["game"]);

  return (
    <Flex gap={2.5} alignItems="center" className="store-tutorial-step-1">
      <Flex
        border="1px solid white"
        borderRadius={10}
        px={1.5}
        height={10}
        alignItems="center"
      >
        <Heading fontSize={21}>{round}</Heading>
      </Flex>
      <Flex flexDirection="column" gap={1} justifyContent={"center"}>
        <Text size="m" lineHeight={1} mt={2}>
          {t("game.round-points.score", {
            score: targetScore,
            round,
          })}
        </Text>
        <Score />
      </Flex>
    </Flex>
  );
};
