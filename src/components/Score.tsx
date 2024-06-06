import { Heading } from "@chakra-ui/react";
import { useGameContext } from "../providers/GameProvider";
import { RollingNumber } from "./RollingNumber";

export const Score = () => {
  const { round } = useGameContext();
  const score = round.score;
  
  return (
    <Heading
      variant="neonWhite"
      size="l"
      sx={{
        mb: 4,
      }}
    >
      SCORE: <RollingNumber n={score} />
    </Heading>
  );
};
