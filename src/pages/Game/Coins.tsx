import { Flex, Text } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import CoinsIcon from "../../assets/coins.svg?component";
import { RollingNumber } from "../../components/RollingNumber";
import { useGame } from "../../dojo/queries/useGame";

export const Coins = () => {
  const game = useGame();

  const cash = game?.cash ?? 0;

  return (
    <Flex
      flexDirection={isMobile ? "row" : "column"}
      alignItems="center"
      gap={0.5}
    >
      <Text size="m" pl={{ base: 1, sm: 0 }}>
        Cash
      </Text>
      <Flex
        gap={2}
        alignItems="center"
        justifyContent="center"
        border={isMobile ? "none" : "1px solid white"}
        borderRadius="8px"
        color="white"
        minWidth={{ base: "50px", sm: "100px" }}
        p={{ base: "5px 5px", sm: "15px 10px" }}
        fontSize='13px'
      >
        <RollingNumber n={cash} />
        <CoinsIcon height={18} />
      </Flex>
    </Flex>
  );
};
