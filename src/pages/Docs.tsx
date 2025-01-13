import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { MobileDecoration } from "../components/MobileDecoration";
import { Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const DocsContentMobile = ({
  lastIndexTab = 0,
}: {
  lastIndexTab: number;
}) => {
  const { t } = useTranslation(["docs"]);
  const [tabIndex, setTabIndex] = useState(lastIndexTab);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (tabIndex < 2) setTabIndex(tabIndex + 1);
    },
    onSwipedRight: () => {
      if (tabIndex > 0) {
        setTabIndex(tabIndex - 1);
      }
    },
    trackTouch: true,
  });

  return (
    <>
      <MobileDecoration />

      <Flex
        width="100%"
        height="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        {...handlers}
      >
        <Flex p={2} mt={6} width={"100%"}>
          <Tabs
            index={tabIndex}
            onChange={handleTabChange}
            w="100%"
            isFitted
            color="white"
          >
            <TabList width={"100%"}>
              <Tab fontSize={10}>{t("labels.special-cards")}</Tab>
              <Tab fontSize={10}>{t("labels.modifier-cards")}</Tab>
              <Tab fontSize={10}>{t("labels.rage-cards")}</Tab>
              <Tab fontSize={10}>{t("labels.loot-boxes")}</Tab>
            </TabList>
          </Tabs>
        </Flex>
        <Flex w="100%" flexGrow={1}>
          {tabIndex === 0 && <></>}
          {tabIndex === 1 && <></>}
          {tabIndex === 2 && <></>}
          {tabIndex === 3 && <></>}
        </Flex>
      </Flex>
    </>
  );
};
