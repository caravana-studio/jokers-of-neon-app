import { Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Background } from "../components/Background";
import { SPECIAL_CARDS_DATA } from "../data/specialCards";

export const CardInfoPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "card-info-page",
  });

  // Handle tab change
  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };
  return (
    <Background type="game">
      <Flex w="100%" h="100%" p={6}>
        <Tabs
          index={tabIndex}
          onChange={handleTabChange}
          w="100%"
          isFitted
          color="white"
          mb={4}
        >
          <TabList>
            <Tab fontSize={12}>{t("tabs.modifiers")}</Tab>
            <Tab fontSize={12}>{t("tabs.special")}</Tab>
            <Tab fontSize={12}>{t("tabs.rage")}</Tab>
          </TabList>
        </Tabs>
        <Flex w="100%" flexDir="column" gap={4}>
          {tabIndex === 0 && <></>}
          {tabIndex === 1 &&
            Object.keys(SPECIAL_CARDS_DATA).map((key: number) => {
              return <p key={key}>{SPECIAL_CARDS_DATA[key].name}</p>;
            })}
        </Flex>
      </Flex>
    </Background>
  );
};
