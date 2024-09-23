import { Flex, Text } from "@chakra-ui/react";
import { PLAYS } from "../constants/plays";
import { Plays } from "../enums/plays";
import { useGameContext } from "../providers/GameProvider";

export const CurrentPlay = () => {
  const { preSelectedPlay, playIsNeon } = useGameContext();

  return (
    <Flex gap={{base: 2, md: 4}} alignItems={"center"} justifyContent={"flex-start"}
    >
      <Text size="l">
        {preSelectedPlay === Plays.NONE
          ? "Select some cards to play"
          : `Current Play: ${playIsNeon ? "NEON " : ""} ${PLAYS[preSelectedPlay]}`}
      </Text>
    </Flex>
  );
};
