import { Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSwipeable } from "react-swipeable";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { ManagePageContentProps } from "./ManagePageContent";
import { Powerups } from "./TabContents/Powerups";
import { SpecialCards } from "./TabContents/SpecialCards";

export const ManagePageContentMobile = ({
  lastIndexTab = 0,
  discardedCards,
  preselectedCard,
  onCardClick,
  sellButton,
  goBackButton,
}: ManagePageContentProps) => {
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
    <Flex flexDir="column" w="100%" h="100%" alignItems="center" justifyContent="space-between">
      <MobileDecoration />
      <Flex p={2} mt={6} width={"100%"}>
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
      <Flex
        w="90%"
        flexGrow={1}
        justifyContent={"center"}
        alignItems="center"
        flexDir="column"
        {...handlers}
      >
        {tabIndex === 0 && (
          <SpecialCards
            discardedCards={discardedCards}
            preselectedCard={preselectedCard}
            onCardClick={onCardClick}
            containerSx={{
              padding: "0",
            }}
          />
        )}
        {tabIndex === 1 && <Powerups />}
      </Flex>
      <MobileBottomBar
        firstButton={goBackButton}
        secondButton={tabIndex === 0 && sellButton}
        hideDeckButton
      />
    </Flex>
  );
};
