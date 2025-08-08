import { Box, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";
import { SettingsContent } from "../components/SettingsContent";

export const SettingsPage = () => {
  const { t } = useTranslation(["game"], { keyPrefix: "settings-modal" });

  const title = t("title");
  return (
    <DelayedLoading ms={0}>
      <MobileDecoration />
      <Flex
        h="100%"
        w="100%"
        my="30px"
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
