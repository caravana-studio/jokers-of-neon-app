import { Divider, Flex } from "@chakra-ui/react";
import { RerollSection } from "./RerollSection";
import { MenuSection } from "./MenuSection";
import { useResponsiveValues } from "../../../../theme/responsiveSettings";

export const TopBarStore = () => {
  const { isSmallScreen } = useResponsiveValues();

  return (
    <Flex
      flexDirection="column"
      p={2}
      px={"16px"}
      width={"100%"}
      backgroundColor={"black"}
      justifyContent={"center"}
    >
      {isSmallScreen && (
        <>
          <MenuSection />
          <Divider orientation="horizontal" color="white" />
        </>
      )}
      <RerollSection />
    </Flex>
  );
};
