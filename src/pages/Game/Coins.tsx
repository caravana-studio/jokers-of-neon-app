import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CoinIcon from "../../assets/coins.svg?component";
import { CashSymbol } from "../../components/CashSymbol";
import { RollingNumber } from "../../components/RollingNumber";
import { useGameContext } from "../../providers/GameProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const Coins = () => {
  const { cash } = useGameContext();
  const { t } = useTranslation(["game"]);
  const { isSmallScreen } = useResponsiveValues();

  return (
    <Flex
      flexDirection={isSmallScreen ? "row" : "column"}
      alignItems="center"
      gap={2}
    >
      <CoinIcon height={isSmallScreen ? 25 : 30} />
      <Flex
        gap={1.5}
        alignItems="center"
        justifyContent="center"
        border={isSmallScreen ? "none" : "1px solid white"}
        borderRadius="8px"
        color="white"
        minWidth={{ base: "50px", sm: "70px" }}
        p={{ base: "5px 5px", sm: "15px 6px" }}
        fontSize="13px"
      >
        <RollingNumber n={cash} />
        <CashSymbol />
      </Flex>
    </Flex>
  );
};
