import { Box, Center, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGameStore } from "../../state/useGameStore";
import { BLUE_LIGHT, VIOLET } from "../../theme/colors";
import { isTutorial } from "../../utils/isTutorial";

export const LevelBox = () => {
  const { t } = useTranslation("game");
  const { isRageRound } = useGameStore();
  const { level, round } = useGameStore();
  const inTutorial = isTutorial();

  return (
    <Center>
      <Box
        bg={`linear-gradient(to right, ${BLUE_LIGHT} 50%, ${VIOLET} 50%) `}
        p="2px"
        borderRadius="11px"
        mb={0.5}
      >
        <Box
          backgroundColor={isRageRound ? "black" : "backgroundBlue"}
          borderRadius="9px"
          px={5}
          py={0.25}
        >
          <Heading
            fontSize="11px"
            textTransform="uppercase"
            variant="italic"
            color="white"
            fontWeight="bold"
          >
            {inTutorial
              ? t("game.tutorial").toUpperCase()
              : t("game.compact-round-data.level-round", {
                  level: level,
                  round,
                })}
          </Heading>
        </Box>
      </Box>
    </Center>
  );
};
