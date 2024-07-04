import { Heading } from "@chakra-ui/react";
import { useGameContext } from "../providers/GameProvider";
import { RollingNumber } from "./RollingNumber";

export const Score = () => {
  const { score } = useGameContext();

  return (
    <Heading
      variant="italic"
      size="m"
      mb={{ base: 1, md: 4 }}
      textShadow="0 0 10px white"
    >
      SCORE: <RollingNumber className="italic" n={score} />
    </Heading>
  );
};
