import { Box, Button, Heading } from "@chakra-ui/react";

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
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Heading sx={{ fontSize: 100 }}>GAME OVER</Heading>
      <Heading sx={{ fontSize: 30}}>your score: {score}</Heading>
      <Button sx={{
        fontSize: 30,
        px: 90,
        py: 7,
        borderRadius: 0,
        mt: 10
      }} onClick={onCreateGameClick}>START NEW GAME</Button>
    </Box>
  );
};
