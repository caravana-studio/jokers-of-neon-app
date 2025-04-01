import { Divider, Flex } from "@chakra-ui/react";
import { useResponsiveValues } from "../../../../theme/responsiveSettings";
import { MenuSection } from "./MenuSection";
import { RerollSection } from "./RerollSection";

export const StoreTopBar = () => {
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
