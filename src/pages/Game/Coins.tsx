import { Flex } from "@chakra-ui/react";
import { CashSymbol } from "../../components/CashSymbol";
import { RollingNumber } from "../../components/RollingNumber";
import { useGameStore } from "../../state/useGameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";

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

  const { cash } = useGameStore();

  return (
    <Flex
      flexDirection={isSmallScreen ? "row" : "column"}
      alignItems="flex-end"
      gap={1}
    >
      <Flex
        gap={1.5}
        alignItems="center"
        justifyContent="center"
        border={isSmallScreen ? "none" : "1px solid white"}
        borderRadius="8px"
        color="white"
        minWidth={{ base: 0, sm: "70px" }}
        width={isSmallScreen ? "unset" : getPxBasedOnDigits(cash)}
        p={{ base: 0, sm: "15px 6px" }}
        fontSize={isSmallScreen ? "9px": "13px"}
      >
        <CashSymbol size={isSmallScreen ? 2 : undefined} />
        {rolling ? <RollingNumber n={cash} /> : <span>{cash}</span>}
      </Flex>
    </Flex>
  );
};
