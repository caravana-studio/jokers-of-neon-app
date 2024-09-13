import { Box, Flex, Heading } from "@chakra-ui/react";
import { RollingNumber } from "../../components/RollingNumber";
import { useGame } from "../../dojo/queries/useGame";
import CoinsIcon from "../../assets/coins.svg?component";

export const Coins = () => {
  const game = useGame();

  const cash = game?.cash ?? 0;

  return (
    <Flex
      sx={{
        p: 4,
        mt: 2,
        mx: 4,
      }}
      alignItems={"center"}
      filter="blur(0.5px)"
    >
      <Box mr={1} border={"1px"} borderColor={"white"} borderRadius={"5px"} py={2} px={4}>
        <CoinsIcon width={"24px"} height={"auto"}/>
      </Box>
      <Heading
        className="game-tutorial-step-1"
        variant={"italic"}
        size={"m"}
        sx={{
          ml: 4,
          position: "relative",
          textShadow: `0 0 10px white`,
          _before: {
            content: '""',
            position: "absolute",
            bottom: "-5px",
            width: "100%",
            height: "2px",               
            backgroundColor: "white",
            boxShadow: "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
          },
        }}
      >
        COINS: <RollingNumber className="italic" n={cash} /> ȼ
      </Heading>
    </Flex>
  );
};
