import { Heading } from "@chakra-ui/react";
import { PLAYS } from "../constants/plays";
import { useGameContext } from "../providers/GameProvider";

export const CurrentPlay = () => {
  const { preSelectedPlay } = useGameContext();

  return (
    <Heading variant="neonGreen" size="m" sx={{ mb: 2 }}>
      CURRENT PLAY: {PLAYS[preSelectedPlay]}
    </Heading>
  );
};
