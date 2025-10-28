import { Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileDecoration } from "../../components/MobileDecoration";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { SeasonPassRow } from "./SeasonPassRow";

export const ShopPage = () => {
  const { isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop",
  });
  return (
    <DelayedLoading ms={200}>
      <MobileDecoration />
      <Flex flexDir={"column"} w="100%" h="100%" overflowY={"auto"}>
        <Flex
          w="100%"
          borderBottom={`1px solid ${BLUE}`}
          height={isSmallScreen ? "60px" : "140px"}
          pt={isSmallScreen ? "25px" : "70px"}
          px={isSmallScreen ? "15px" : "30px"}
          pb={3}
        >
          <Heading fontSize={isSmallScreen ? "sm" : "lg"} variant="italic">
            {t("title")}
          </Heading>
        </Flex>
        <Flex flexDir={"column"} gap={2} my={2}>
          <SeasonPassRow />
          <Flex h="500px" w="100%" bgColor="red" />
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
