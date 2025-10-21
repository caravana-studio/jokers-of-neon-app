import { Box, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";
import { SettingsContent } from "../components/SettingsContent";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { PositionedVersion } from "../components/version/PositionedVersion";

export const SettingsPage = () => {
  const { t } = useTranslation(["game"], { keyPrefix: "settings-modal" });
  const { isSmallScreen } = useResponsiveValues();
  const title = t("title");
  return (
    <DelayedLoading ms={0}>
      <MobileDecoration />
      <Flex
        h="100%"
        w="100%"
        pt={isSmallScreen ? "30px" : "80px"}
        flexDir="column"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading variant={"italic"}>{title}</Heading>
        <SettingsContent />
        <Box h="50px" />
      </Flex>
    </DelayedLoading>
  );
};
