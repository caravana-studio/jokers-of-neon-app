import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useRound } from "../../dojo/queries/useRound";
import { useGameContext } from "../../providers/GameProvider";
import { BLUE_LIGHT, VIOLET } from "../../theme/colors";
import { RollingNumber } from "../RollingNumber";
import { LevelBox } from "./LevelBox";
import { NumberBox } from "./NumberBox";
import { ProgressBar } from "./ProgressBar";
import { isTutorial } from "../../utils/isTutorial";
import { useGame } from "../../dojo/queries/useGame";

export const CompactRoundData = () => {
  const { t } = useTranslation("game");
  const { t: tCompactRoundData } = useTranslation("game", {
    keyPrefix: "game.compact-round-data",
  });

  const inTutorial = isTutorial();

  const { score, points, multi } = useGameContext();

  const round = useRound();
  const target = round?.level_score ?? 0;
  const { player_score } = useGame();

  return (
    <Flex justifyContent="center" className="game-tutorial-step-1">
      <Box px={4} mb={4} borderRadius="md" width="100%" maxW="600px">
        <LevelBox />
        <Flex justify="center" gap={1} align="center">
          <Box>
            <Text
              textAlign="right"
              fontSize="10px"
              textTransform="uppercase"
              fontWeight="500"
            >
              {tCompactRoundData("my-score")}
            </Text>
            <Heading
              textAlign="right"
              fontSize="md"
              mr={0.5}
              mt={-1}
              variant="italic"
              width="50px"
            >
              <RollingNumber n={score} />
            </Heading>
          </Box>

          <Flex align="center" className="game-tutorial-step-6">
            <NumberBox number={points} color={BLUE_LIGHT} />
            <Text fontSize="md" fontWeight="bold">
              x
            </Text>
            <NumberBox number={multi} color={VIOLET} spreadIncrease={5} />
          </Flex>

          <Box className="game-tutorial-step-7">
            <Text fontSize="10px" textTransform="uppercase" fontWeight="500">
              {tCompactRoundData("target")}
            </Text>
            <Heading
              width="50px"
              fontSize="md"
              ml={0.5}
              mt={-1}
              variant="italic"
            >
              <RollingNumber n={target} />
            </Heading>
          </Box>
        </Flex>
        <ProgressBar progress={(score / target) * 100} />
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
          <RollingNumber className="italic" n={player_score} />
        </Heading>
      </Box>
    </Flex>
  );
};

export default CompactRoundData;
