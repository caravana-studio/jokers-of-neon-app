import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { looseSfx } from "../../constants/sfx";
import { useAudio } from "../../hooks/useAudio";
import { Coins } from "../../pages/Game/Coins";
import { useSettings } from "../../providers/SettingsProvider";
import { useGameStore } from "../../state/useGameStore";
import { BLUE_LIGHT, VIOLET } from "../../theme/colors";
import { RollingNumber } from "../RollingNumber";
import { ScoreTotal } from "../ScoreTotal";
import { LevelBox } from "./LevelBox";
import { NumberBox } from "./NumberBox";
import { ProgressBar } from "./ProgressBar";

export const CompactRoundData = () => {
  const { t } = useTranslation("game", {
    keyPrefix: "game.compact-round-data",
  });

  const { points, multi, currentScore, targetScore } = useGameStore();

  const { sfxVolume } = useSettings();
  const { play } = useAudio(looseSfx, sfxVolume);

  return (
    <Flex
      justifyContent="center"
      className="store-tutorial-step-1"
      sx={{
        zIndex: 1,
      }}
    >
      <Box px={4} mb={1} borderRadius="md" width="100%" maxW="600px">
        <LevelBox />
        <Flex justify="center" gap={1} align="center">
          <Box>
            <Text
              textAlign="right"
              fontSize="10px"
              textTransform="uppercase"
              fontWeight="500"
            >
              {t("my-score")}
            </Text>
            <Heading
              textAlign="right"
              fontSize="md"
              mr={0.5}
              mt={-1}
              variant="italic"
              width="50px"
            >
              <RollingNumber n={currentScore} sound />
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
              {t("target")}
            </Text>
            <Heading
              width="50px"
              fontSize="md"
              ml={0.5}
              mt={-1}
              variant="italic"
            >
              <RollingNumber n={targetScore} />
            </Heading>
          </Box>
        </Flex>
        <ProgressBar
          progress={(currentScore / targetScore) * 100}
          playSound={play}
        />
        <Flex w="100%" justify="space-between">
          <Coins rolling />
          <ScoreTotal />
        </Flex>
      </Box>
    </Flex>
  );
};

export default CompactRoundData;
