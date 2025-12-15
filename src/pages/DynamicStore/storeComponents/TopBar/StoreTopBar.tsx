import { Flex } from "@chakra-ui/react";
import { useResponsiveValues } from "../../../../theme/responsiveSettings";
import { MobileCoins } from "../../../store/Coins";
import { MenuSection } from "./MenuSection";
import { RerollSection } from "./RerollSection";

interface StoreTopBarProps {
  hideReroll?: boolean;
}

export const StoreTopBar: React.FC<StoreTopBarProps> = ({ hideReroll }) => {
  const { isSmallScreen } = useResponsiveValues();

  return (
    <Flex
      flexDirection="column"
      p={1}
      px={isSmallScreen ? "16px" : "20px"}
      width={"100%"}
      backgroundColor={"black"}
      justifyContent={"center"}
      py={isSmallScreen ? 0 : 4}
      borderRadius={isSmallScreen ? 0 : "25px"}
      boxShadow={
        isSmallScreen ? "none" : "0 0 10px 3px rgba(255, 255, 255, 0.2)"
      }
    >
      <Flex gap={4}>
        <Flex flexDirection={"column"} flexGrow={1} justifyContent={"center"}>
          {isSmallScreen && <MenuSection />}
          <RerollSection hideReroll={hideReroll} />
        </Flex>
        <Flex>
          <Flex>
            <MobileCoins />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
