import { Flex, Tabs, TabList, Tab } from "@chakra-ui/react";
import { t } from "i18next";
import { Powerups } from "./TabContents/Powerups";
import { SpecialCards } from "./TabContents/SpecialCards";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PositionedDiscordLink } from "../../components/DiscordLink";

export const ManagePageContentMobile = ({
  lastIndexTab = 0,
}: {
  lastIndexTab?: number;
}) => {
  const { t } = useTranslation(["store"]);
  const [tabIndex, setTabIndex] = useState(lastIndexTab);
  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <>
      <PositionedDiscordLink />
      <Flex p={2} mt={6} width={"95%"}>
        <Tabs
          index={tabIndex}
          onChange={handleTabChange}
          w="100%"
          isFitted
          color="white"
        >
          <TabList>
            <Tab fontSize={10}>{t("store.labels.cards")}</Tab>
            <Tab fontSize={10}>{t("store.titles.powerups")}</Tab>
          </TabList>
        </Tabs>
      </Flex>
      <Flex w="100%" flexGrow={1}>
        {tabIndex === 0 && <SpecialCards />}
        {tabIndex === 1 && <Powerups />}
      </Flex>
    </>
  );
};
