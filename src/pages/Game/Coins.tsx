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
  plainDesktop?: boolean;
}

export const Coins = ({ rolling = false, plainDesktop = false }: CoinsProps) => {
  const { isSmallScreen } = useResponsiveValues();

  const { cash } = useGameStore();
  const usePlainDesktopStyles = plainDesktop && !isSmallScreen;

  return (
    <Flex
      flexDirection={isSmallScreen ? "row" : "column"}
      alignItems="center"
      gap={1}
    >
      <Flex
        gap={1.5}
        alignItems="center"
        justifyContent="center"
        border={isSmallScreen || usePlainDesktopStyles ? "none" : "1px solid white"}
        borderRadius="8px"
        color="white"
        minWidth={usePlainDesktopStyles ? 0 : { base: 0, sm: "70px" }}
        width={isSmallScreen || usePlainDesktopStyles ? "unset" : getPxBasedOnDigits(cash)}
        p={usePlainDesktopStyles ? 0 : { base: 0, sm: "15px 6px" }}
        fontSize={
          usePlainDesktopStyles
            ? { base: "9px", md: "15px", lg: "17px" }
            : isSmallScreen
              ? "9px"
              : "13px"
        }
      >
        <CashSymbol size={isSmallScreen ? 2 : undefined} />
        {rolling ? <RollingNumber n={cash} /> : <span>{cash}</span>}
      </Flex>
    </Flex>
  );
};
