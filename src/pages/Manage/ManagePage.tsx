import { Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { Background } from "../../components/Background";
import { PositionedGameMenu } from "../../components/GameMenu";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { SpecialCards } from "./SpecialCards";
import { PositionedDiscordLink } from "../../components/DiscordLink";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Powerups } from "./Powerups";

export const ManagePage = ({ lastIndexTab = 0 }: { lastIndexTab?: number }) => {
  const { t } = useTranslation(["store"]);
  const [tabIndex, setTabIndex] = useState(lastIndexTab);
  const { isSmallScreen } = useResponsiveValues();

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };
  return (
    <Background bgDecoration dark type="home">
      <PositionedGameMenu decoratedPage />
      <Flex flexDirection={"column"} height={"100%"}>
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
        {!isSmallScreen && <PositionedDiscordLink />}
      </Flex>
    </Background>
  );
};
