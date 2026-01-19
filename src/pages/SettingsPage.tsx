import { Box, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DelayedLoading } from "../components/DelayedLoading";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { MobileDecoration } from "../components/MobileDecoration";
import { SettingsContent } from "../components/SettingsContent";
import { useResponsiveValues } from "../theme/responsiveSettings";

export const SettingsPage = () => {
  const { t } = useTranslation(["game"], { keyPrefix: "settings-modal" });
  const { isSmallScreen } = useResponsiveValues();
  const title = t("title");
  return (
    <DelayedLoading ms={0}>
      <PositionedDiscordLink />
      <MobileDecoration />
      <Flex
        h="100%"
        w="100%"
        pt={isSmallScreen ? "30px" : "80px"}
        flexDir="column"
        justifyContent="flex-start"
        alignItems="center"
        minH={0}
        gap={4}
      >
        <Heading variant={"italic"}>{title}</Heading>
        <Flex
          w="100%"
          flex="1"
          overflowY="auto"
          minH={0}
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          px={isSmallScreen ? 4 : 8}
        >
          <SettingsContent />
        </Flex>
        <Box h="50px" />
      </Flex>
    </DelayedLoading>
  );
};
