import { Heading } from "@chakra-ui/react";
import { PLAYS } from "../constants/plays";
import { useGameContext } from "../providers/GameProvider";

export const CurrentPlay = () => {
  const { preSelectedPlay } = useGameContext();

  return (
    <Heading variant="neonGreen" size="m" sx={{ my: 2 }}>
      CURRENT PLAY: {PLAYS[preSelectedPlay]}
    </Heading>
  );
};
