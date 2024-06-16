import { Heading } from "@chakra-ui/react";
import { useRound } from "../dojo/queries/useRound";
import { RollingNumber } from "./RollingNumber";

export const Score = () => {
  const round = useRound();
  const score = round.player_score;
  
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
