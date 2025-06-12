import { Flex } from "@chakra-ui/react";
import CoinIcon from "../../assets/coins.svg?component";
import { CashSymbol } from "../../components/CashSymbol";
import { RollingNumber } from "../../components/RollingNumber";
import { useGameView } from "../../dojo/queries/useGameView";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { useGame } from "../../dojo/queries/useGame";

const getPxBasedOnDigits = (num: number) => {
  const basePx = 100;
  const baseDigits = 5;
  const extraPxPerDigit = 10;
  const numDigits = num.toString().length;
  const pxValue =
    numDigits <= baseDigits
      ? basePx
      : basePx + (numDigits - baseDigits) * extraPxPerDigit;

  return `${pxValue}px`;
};

interface CoinsProps {
  rolling?: boolean;
}

export const Coins = ({ rolling = false }: CoinsProps) => {
  const { isSmallScreen } = useResponsiveValues();

  const game = useGame()
  const cash = game.cash;

  return (
    <Flex
      flexDirection={isSmallScreen ? "row" : "column"}
      alignItems="center"
      gap={1}
    >
      <CoinIcon height={isSmallScreen ? 25 : 27} />
      <Flex
        gap={1.5}
        alignItems="center"
        justifyContent="center"
        border={isSmallScreen ? "none" : "1px solid white"}
        borderRadius="8px"
        color="white"
        minWidth={{ base: "50px", sm: "70px" }}
        width={getPxBasedOnDigits(cash)}
        p={{ base: "5px 5px", sm: "15px 6px" }}
        fontSize="13px"
      >
        {rolling ? <RollingNumber n={cash} /> : <span>{cash}</span>}
        <CashSymbol />
      </Flex>
    </Flex>
  );
};
