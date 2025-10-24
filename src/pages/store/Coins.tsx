import { Flex, Heading, Text } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import CoinsIcon from "../../assets/coins.svg?component";
import { CashSymbol, RoundedCashSymbol } from "../../components/CashSymbol";
import { RollingNumber } from "../../components/RollingNumber";
import { useGameStore } from "../../state/useGameStore";

interface ICoinsProps {
  rolling?: boolean;
}

export const Coins = ({ rolling = false }: ICoinsProps) => {
  const { cash } = useGameStore();

  const { t } = useTranslation(["store"]);

  return (
    <Flex alignItems={"center"} className="store-tutorial-step-1">
      <CoinsIcon
        style={{ transform: `translateY(${isMobile ? "4px" : "6px"})` }}
        width={isMobile ? "35px" : "50px"}
        height={"auto"}
      />
      <Heading
        variant={"italic"}
        size={{ base: "s", sm: "s" }}
        textShadow="0 0 3px gold"
        color="gold"
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
        {t("store.labels.coins").toString() + " "}
        {rolling ? <RollingNumber className="italic" n={cash} /> : cash}
        <RoundedCashSymbol />
      </Heading>
    </Flex>
  );
};

interface MobileCoins {
  fontSize?: string | string[];
  iconSize?: number;
}

export const MobileCoins: React.FC<MobileCoins> = ({ fontSize, iconSize }) => {
  const { cash } = useGameStore();

  return (
    <Flex flexDirection="row" alignItems="center" gap={1}>
      {/* <CoinsIcon height={iconSize ?? 25} color="red" /> */}
      <Flex
        gap={1.5}
        alignItems="center"
        justifyContent="center"
        minWidth={{ base: "50px", sm: "70px" }}
        p={{ base: "5px 5px", sm: "15px 6px" }}
      >
        <Text
          textShadow="0 0 3px gold"
          color="gold"
          fontSize={fontSize ?? "18px"}
          mt={1}
        >
          {cash} <RoundedCashSymbol />
        </Text>
      </Flex>
    </Flex>
  );
};
