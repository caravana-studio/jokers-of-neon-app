import { Flex } from "@chakra-ui/react";
import { useResponsiveValues } from "../../../../theme/responsiveSettings";
import { MenuSection } from "./MenuSection";
import { RerollSection } from "./RerollSection";
import { MobileCoins } from "../../../store/Coins";

interface StoreTopBarProps {
  hideReroll?: boolean;
}

export const StoreTopBar: React.FC<StoreTopBarProps> = ({ hideReroll }) => {
  const { isSmallScreen } = useResponsiveValues();

  return (
    <Flex
      flexDirection="column"
      p={1}
      px={"16px"}
      width={"100%"}
      backgroundColor={"black"}
      justifyContent={"center"}
    >
      <Flex gap={4}>
        <Flex flexDirection={"column"} flexGrow={1} justifyContent={"center"}>
          {isSmallScreen && <MenuSection />}
          <RerollSection hideReroll={hideReroll} />
        </Flex>
        <Flex>
          <Flex>
            <MobileCoins
              fontSize={isSmallScreen ? ["18px", "24px"] : undefined}
              iconSize={isSmallScreen ? 26 : undefined}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
