import { Flex, Tabs, TabList, Tab } from "@chakra-ui/react";
import { t } from "i18next";
import { Powerups } from "./TabContents/Powerups";
import { SpecialCards } from "./TabContents/SpecialCards";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PositionedDiscordLink } from "../../components/DiscordLink";

export const ManagePageContent = ({
  lastIndexTab = 0,
}: {
  lastIndexTab?: number;
}) => {
  const { t } = useTranslation(["store"]);
  return (
    <>
      <PositionedDiscordLink />
      <SpecialCards />
      <Powerups />
    </>
  );
};
