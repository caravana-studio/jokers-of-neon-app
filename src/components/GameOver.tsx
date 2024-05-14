import { Box, Heading } from "@chakra-ui/react";
import { Button } from "./Button";

interface IGameOverProps {
  score: number;
  onCreateGameClick: () => void;
}
export const GameOver = ({ score, onCreateGameClick }: IGameOverProps) => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Heading className="anim" sx={{ fontSize: 140, color: "lime" }}>
        GAME OVER
      </Heading>
      <Heading sx={{ fontSize: 36, }} className="ui-text">
        your score: {score}
      </Heading>
      <Button
        sx={{
          fontSize: 35,
          px: 90,
          py: 8,
          borderRadius: 0,
          mt: 10,
        }}
        onClick={onCreateGameClick}
      >
        START NEW GAME
      </Button>
    </Box>
  );
};
