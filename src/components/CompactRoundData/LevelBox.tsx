import { Box, Center, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGameContext } from "../../providers/GameProvider";
import { useGameStore } from "../../state/useGameStore";
import { BLUE_LIGHT, VIOLET } from "../../theme/colors";

export const LevelBox = () => {
  const { t } = useTranslation("game", {
    keyPrefix: "game.compact-round-data",
  });
  const { nodeRound } = useGameContext();
  const { isRageRound } = useGameStore();
  const { level } = useGameStore();
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
            {t("level-round", { level: level, round: nodeRound })}
          </Heading>
        </Box>
      </Box>
    </Center>
  );
};
