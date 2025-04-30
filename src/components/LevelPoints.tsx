import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getNode } from "../dojo/queries/getNode";
import { useGame } from "../dojo/queries/useGame";
import { useRound } from "../dojo/queries/useRound";
import { useDojo } from "../dojo/useDojo";
import { isTutorial } from "../utils/isTutorial";
import { PointBox } from "./MultiPoints";
import { Score } from "./Score";
import { useGameContext } from "../providers/GameProvider";

export const LevelPoints = () => {
  const inTutorial = isTutorial();
  const round = useRound();
  const targetScore = inTutorial ? 300 : round?.target_score ?? 0;
  const { t } = useTranslation(["game"]);

  const { nodeRound } = useGameContext();

  return (
    <Box className="store-tutorial-step-1">
      <Flex gap={6}>
        <PointBox type="level">
          <Heading size={{ base: "xs", md: "s" }}>
            {t("game.round-points.round")}
          </Heading>
          <Heading size={{ base: "s", md: "m" }} sx={{ color: "white" }}>
            {nodeRound}
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
        {t("game.round-points.score", { score: targetScore, round: nodeRound })}
      </Text>
    </Box>
  );
};

export const MobileLevelPoints = () => {
  const game = useGame();
  const round = useRound();
  const { nodeRound } = useGameContext();
  const targetScore = round?.target_score ?? 0;
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
        <Heading fontSize={21}>{nodeRound}</Heading>
      </Flex>
      <Flex flexDirection="column" gap={1} justifyContent={"center"}>
        <Text size="m" lineHeight={1} mt={2}>
          {t("game.round-points.score", { score: targetScore, round: nodeRound })}
        </Text>
        <Score />
      </Flex>
    </Flex>
  );
};
