import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { MobileDecoration } from "../../components/MobileDecoration";
import { Box, Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DocsCardsRow } from "./DocsCardsRow";
import { SPECIAL_CARDS_DATA } from "../../data/specialCards";
import { RAGE_CARDS_DATA } from "../../data/rageCards";
import { MODIFIER_CARDS_DATA } from "../../data/modifiers";

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
    <Box overflow={"hidden"}>
      <MobileDecoration />

      <Flex
        width="100vw"
        height={"100vh"}
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
            <TabList width={"100%"} height={"100%"}>
              <Tab fontSize={10}>{t("labels.special-cards")}</Tab>
              <Tab fontSize={10}>{t("labels.modifier-cards")}</Tab>
              <Tab fontSize={10}>{t("labels.rage-cards")}</Tab>
              <Tab fontSize={10}>{t("labels.loot-boxes")}</Tab>
            </TabList>
          </Tabs>
        </Flex>
        <Flex w="100%" flexGrow={1} height={"70%"} mb={8} alignItems={"center"}>
          {tabIndex === 0 && <DocsCardsRow cardDataMap={SPECIAL_CARDS_DATA} />}
          {tabIndex === 1 && <DocsCardsRow cardDataMap={MODIFIER_CARDS_DATA} />}
          {tabIndex === 2 && <DocsCardsRow cardDataMap={RAGE_CARDS_DATA} />}
          {tabIndex === 3 && <></>}
        </Flex>
      </Flex>
    </Box>
  );
};
