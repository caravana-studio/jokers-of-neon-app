import { Box, Flex, Heading, Text, type BoxProps } from "@chakra-ui/react";
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
interface CompactRoundDataProps {
  showPointsAndMulti?: boolean;
  showFooter?: boolean;
  showTutorialTargets?: boolean;
  levelBoxFullWidth?: boolean;
  desktopTypographyBoost?: boolean;
  levelBottomSpacing?: BoxProps["mb"];
  maxW?: BoxProps["maxW"];
  px?: BoxProps["px"];
}

export const CompactRoundData = ({
  showPointsAndMulti = true,
  showFooter = true,
  showTutorialTargets = true,
  levelBoxFullWidth = false,
  desktopTypographyBoost = false,
  levelBottomSpacing = 0.5,
  maxW = "600px",
  px = 4,
}: CompactRoundDataProps) => {
  const { t } = useTranslation("game", {
    keyPrefix: "game.compact-round-data",
  });

  const { points, multi, currentScore, targetScore } = useGameStore();

  const { sfxVolume } = useSettings();
  const { play } = useAudio(looseSfx, sfxVolume);
  const labelFontSize = desktopTypographyBoost
    ? { base: "10px", md: "15px" }
    : "10px";
  const valueFontSize = desktopTypographyBoost
    ? { base: "md", md: "2xl" }
    : "md";
  const numberGap = desktopTypographyBoost ? { base: 1, md: 2 } : 1;
  const xFontSize = desktopTypographyBoost ? { base: "md", md: "xl" } : "md";
  const levelHeadingFontSize = desktopTypographyBoost
    ? { base: "11px", md: "17px" }
    : "11px";
  const progressBarHeight = desktopTypographyBoost
    ? { base: "14px", md: "18px" }
    : "14px";
  const footerMarginTop = desktopTypographyBoost ? "25px" : 1.5;
  const metricSectionWidth = desktopTypographyBoost
    ? { base: "50px", md: "140px" }
    : "50px";
  const scoreTextAlign = desktopTypographyBoost ? "left" : "right";
  const targetTextAlign = desktopTypographyBoost ? "right" : "left";
  const rowJustify = desktopTypographyBoost ? "space-between" : "center";

  return (
    <Flex
      justifyContent="center"
      className="store-tutorial-step-1"
      sx={{
        zIndex: 1,
      }}
    >
      <Box px={px} mb={1} borderRadius="md" width="100%" maxW={maxW}>
        <LevelBox
          fullWidth={levelBoxFullWidth}
          headingFontSize={levelHeadingFontSize}
          marginBottom={levelBottomSpacing}
        />
        <Box
          className={
            showTutorialTargets ? "game-tutorial-step-score-panel" : undefined
          }
        >
          <Flex justify={rowJustify} gap={showPointsAndMulti ? 1 : 3} align="center">
            <Box width={metricSectionWidth}>
              <Text
                textAlign={scoreTextAlign}
                fontSize={labelFontSize}
                textTransform="uppercase"
                fontWeight="500"
                whiteSpace="nowrap"
                wordBreak="keep-all"
                overflow="visible"
              >
                {t("my-score")}
              </Text>
              <Heading
                textAlign={scoreTextAlign}
                fontSize={valueFontSize}
                mr={desktopTypographyBoost ? 0 : 0.5}
                mt={-1}
                variant="italic"
                width={metricSectionWidth}
              >
                <RollingNumber n={currentScore} sound />
              </Heading>
            </Box>

            {showPointsAndMulti && (
              <Flex
                align="center"
                gap={numberGap}
                className={
                  showTutorialTargets ? "game-tutorial-step-6" : undefined
                }
              >
                <NumberBox
                  number={points}
                  color={BLUE_LIGHT}
                  large={desktopTypographyBoost}
                />
                <Text fontSize={xFontSize} fontWeight="bold">
                  x
                </Text>
                <NumberBox
                  number={multi}
                  color={VIOLET}
                  spreadIncrease={5}
                  large={desktopTypographyBoost}
                />
              </Flex>
            )}

            <Box
              width={metricSectionWidth}
              className={showTutorialTargets ? "game-tutorial-step-7" : undefined}
            >
              <Text
                textAlign={targetTextAlign}
                fontSize={labelFontSize}
                textTransform="uppercase"
                fontWeight="500"
                whiteSpace="nowrap"
                wordBreak="keep-all"
                overflow="visible"
              >
                {t("target")}
              </Text>
              <Heading
                textAlign={targetTextAlign}
                width={metricSectionWidth}
                fontSize={valueFontSize}
                ml={desktopTypographyBoost ? 0 : 0.5}
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
            animated
            height={progressBarHeight}
          />
        </Box>
        {showFooter && (
          <Flex
            w="100%"
            flexDir={desktopTypographyBoost ? "column" : "row"}
            justifyContent={desktopTypographyBoost ? "flex-start" : "space-between"}
            alignItems={desktopTypographyBoost ? "stretch" : "center"}
            gap={5}
            mt={footerMarginTop}
          >
            <ScoreTotal plainDesktop={desktopTypographyBoost} />
            <Coins rolling plainDesktop={desktopTypographyBoost} />
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default CompactRoundData;
