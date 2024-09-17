import { Flex, Heading } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import CoinsIcon from "../../assets/coins.svg?component";
import { CashSymbol } from "../../components/CashSymbol";
import { useGame } from "../../dojo/queries/useGame";

export const Coins = () => {
  const game = useGame();

  const cash = game?.cash ?? 0;

  return (
    <Flex alignItems={"center"}>
      <CoinsIcon
        style={{ transform: `translateY(${isMobile ? '4px' : '6px' })` }}
        width={isMobile ? "35px" : "50px"}
        height={"auto"}
      />
      <Heading
        className="game-tutorial-step-1"
        variant={"italic"}
        size={"m"}
        sx={{
          ml: 2,
          position: "relative",
          textShadow: `0 0 10px white`,
          _before: {
            content: '""',
            position: "absolute",
            bottom: "-5px",
            width: "100%",
            height: "1px",
            backgroundColor: "white",
            boxShadow:
              "0px 0px 12px 2px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
          },
        }}
      >
        COINS: {cash}
        <CashSymbol />
      </Heading>
    </Flex>
  );
};
