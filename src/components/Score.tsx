import { Heading } from "@chakra-ui/react";
import { useGameContext } from "../providers/GameProvider";
import { useGetRound } from "../queries/useGetRound";
import { RollingNumber } from "./RollingNumber";

export const Score = () => {
  const { gameId } = useGameContext();
  const { data: round } = useGetRound(gameId);
  const score = round?.score ?? 0;

  return (
    <Heading variant="neonWhite" size="l" mb={{ base: 1, md: 4 }}>
      SCORE: <RollingNumber n={score} />
    </Heading>
  );
};
