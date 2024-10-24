import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useRound } from "../../dojo/queries/useRound";
import { useGameContext } from "../../providers/GameProvider";
import { BLUE_LIGHT, VIOLET } from "../../theme/colors";
import { RollingNumber } from "../RollingNumber";
import { LevelBox } from "./LevelBox";
import { ProgressBar } from "./ProgressBar";
export const CompactRoundData = () => {
  const { t } = useTranslation("game", {
    keyPrefix: "game.compact-round-data",
  });
  const { score, points, multi } = useGameContext();

  const round = useRound(); 
  const target = round?.level_score ?? 0;

  return (
    <Box px={4} mb={4} borderRadius="md" maxW="600px">
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
            <RollingNumber n={score} />
          </Heading>
        </Box>

        <Flex align="center">
          <Center
            border={`2px solid ${BLUE_LIGHT}`}
            boxShadow={`0px 0px 3px 1px ${BLUE_LIGHT}`}
            borderRadius="full"
            width="70px"
            mx={1}
            py={0.5}
          >
            <Heading fontSize="sm">
              <RollingNumber n={points} />
            </Heading>
          </Center>
          <Text fontSize="md" fontWeight="bold">
            x
          </Text>
          <Center
            border={`2px solid ${VIOLET}`}
            boxShadow={`0px 0px 3px 1px ${VIOLET}`}
            borderRadius="full"
            width="70px"
            py={0.5}
            mx={1}
          >
            <Heading fontSize="sm">
              <RollingNumber n={multi} />
            </Heading>
          </Center>
        </Flex>

        <Box>
          <Text fontSize="10px" textTransform="uppercase" fontWeight="500">
            {t("target")}
          </Text>
          <Heading width="50px" fontSize="md" ml={0.5} mt={-1} variant="italic">
            <RollingNumber n={target} />
          </Heading>
        </Box>
      </Flex>
      <ProgressBar progress={(score / target) * 100} />
    </Box>
  );
};

export default CompactRoundData;
