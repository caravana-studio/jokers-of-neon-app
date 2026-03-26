import {
  Box,
  Center,
  Heading,
  Skeleton,
  type BoxProps,
  type HeadingProps,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGameStore } from "../../state/useGameStore";
import { BLUE_LIGHT, VIOLET } from "../../theme/colors";
import { isTutorial } from "../../utils/isTutorial";

interface LevelBoxProps {
  fullWidth?: boolean;
  headingFontSize?: HeadingProps["fontSize"];
  marginBottom?: BoxProps["mb"];
}

export const LevelBox = ({
  fullWidth = false,
  headingFontSize = "11px",
  marginBottom = 0.5,
}: LevelBoxProps) => {
  const { t } = useTranslation("game");
  const { isRageRound, level, round, gameLoading } = useGameStore();
  const inTutorial = isTutorial();
  const showRoundLoadingSkeleton = !inTutorial && (gameLoading || round <= 0);

  const Wrapper = fullWidth ? Box : Center;

  return (
    <Wrapper width={fullWidth ? "100%" : undefined}>
      <Box
        bg={`linear-gradient(to right, ${BLUE_LIGHT} 50%, ${VIOLET} 50%) `}
        p="2px"
        borderRadius="11px"
        mb={marginBottom}
        width={fullWidth ? "100%" : undefined}
      >
        <Box
          backgroundColor={isRageRound ? "black" : "backgroundBlue"}
          borderRadius="9px"
          px={5}
          py={0.25}
          width={fullWidth ? "100%" : undefined}
        >
          <Heading
            fontSize={headingFontSize}
            textTransform="uppercase"
            variant="italic"
            color="white"
            fontWeight="bold"
            textAlign={fullWidth ? "center" : undefined}
          >
            {inTutorial
              ? t("game.tutorial").toUpperCase()
              : showRoundLoadingSkeleton
                ? (
                  <Skeleton
                    as="span"
                    display="inline-block"
                    width="105px"
                    height="1em"
                    borderRadius="4px"
                    startColor="whiteAlpha.300"
                    endColor="whiteAlpha.500"
                    verticalAlign="middle"
                  />
                )
                : t("game.compact-round-data.level-round", {
                    level: level,
                    round,
                  })}
          </Heading>
        </Box>
      </Box>
    </Wrapper>
  );
};
