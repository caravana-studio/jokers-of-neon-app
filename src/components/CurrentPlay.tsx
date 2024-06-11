import { Box, Heading } from "@chakra-ui/react";
import { PLAYS } from "../constants/plays";
import { useGameContext } from "../providers/GameProvider";
import { Plays } from "../enums/plays";

export const CurrentPlay = () => {
  const { preSelectedPlay } = useGameContext();

  return preSelectedPlay === Plays.NONE ? <Box height='37px' /> : (
    <Heading variant="neonGreen" size="m" >
      CURRENT PLAY: {PLAYS[preSelectedPlay]}
    </Heading>
  );
};
