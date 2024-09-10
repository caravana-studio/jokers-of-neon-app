import { Box, Heading } from "@chakra-ui/react";
import { RollingNumber } from "../../components/RollingNumber";
import { useGame } from "../../dojo/queries/useGame";

export const Coins = () => {
  const game = useGame();

  const cash = game?.cash ?? 0;

  return (
    <Box
      sx={{
        background: "rgba(255,255,255,0.2)",
        p: 4,
        mt: 2,
        mx: 4,
        borderRadius: "20px 0",
      }}
    >
      <Heading
        size={"m"}
        sx={{
          ml: 4,
          position: "relative",
          textShadow: `0 0 10px white`,
        }}
      >
        <RollingNumber className="italic" n={cash} /> ȼ
      </Heading>
    </Box>
  );
};
