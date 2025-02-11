import { Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Powerups } from "./TabContents/Powerups";
import { SpecialCards } from "./TabContents/SpecialCards";
import { useSwipeable } from "react-swipeable";

export const ManagePageContentMobile = ({
  lastIndexTab = 0,
}: {
  lastIndexTab?: number;
}) => {
  const { t } = useTranslation("intermediate-screens");
  const [tabIndex, setTabIndex] = useState(lastIndexTab);
  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (tabIndex < 1) setTabIndex(tabIndex + 1);
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
      <Flex p={2} mt={6} width={"95%"}>
        <Tabs
          index={tabIndex}
          onChange={handleTabChange}
          w="100%"
          isFitted
          color="white"
        >
          <TabList width={["100%", "80%"]} margin={"0 auto"}>
            <Tab fontSize={10}>{t("special-cards.title")}</Tab>
            <Tab fontSize={10}>{t("power-ups.title")}</Tab>
          </TabList>
        </Tabs>
      </Flex>
      <Flex w="95%" flexGrow={1} {...handlers}>
        {tabIndex === 0 && (
          <SpecialCards
            containerSx={{
              padding: "0",
            }}
          />
        )}
        {tabIndex === 1 && <Powerups />}
      </Flex>
    </>
  );
};
