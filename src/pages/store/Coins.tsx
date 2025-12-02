import { Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { CashSymbol } from "../../components/CashSymbol";
import { RollingNumber } from "../../components/RollingNumber";
import { useGameStore } from "../../state/useGameStore";
import { DIAMONDS } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";

interface ICoinsProps {
  rolling?: boolean;
}

export const Coins = ({ rolling = false }: ICoinsProps) => {
  const { cash } = useGameStore();

  const { t } = useTranslation(["store"]);

  return (
    <Flex alignItems={"center"} className="store-tutorial-step-1">
      <CashSymbol />
      <Heading
        variant={"italic"}
        size={{ base: "s", sm: "s" }}
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
      </Heading>
    </Flex>
  );
};

interface MobileCoins {
  fontSize?: string | string[];
  iconSize?: number;
}

export const MobileCoins: React.FC<MobileCoins> = ({ fontSize: providedFontSize, iconSize: providedIconSize }) => {
  const { cash } = useGameStore();
  
  const { isSmallScreen } = useResponsiveValues();
  
  const fontSize = providedFontSize ? providedFontSize : isSmallScreen ? "17px" : "25px";
  const iconSize = providedIconSize ? providedIconSize : isSmallScreen ? 19 : 27;

  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent={"center"}
      gap={1.5}
    >
      <CashSymbol size={iconSize} />
      <Text
      textShadow={`0 0 10px ${DIAMONDS}`}
        fontFamily={"Orbitron"}
        fontWeight={800}
        color={DIAMONDS}
        fontSize={fontSize ?? "18px"}
      >
        {cash}
      </Text>
    </Flex>
  );
};
