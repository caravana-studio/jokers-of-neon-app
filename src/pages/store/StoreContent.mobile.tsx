import { Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MobileBottomBar } from "../../components/MobileBottomBar.tsx";
import { MobileDecoration } from "../../components/MobileDecoration.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import { LootBoxesMobile } from "./LootBoxes.mobile.tsx";
import NextLevelButton from "./StoreElements/NextLevelButton.tsx";
import SpecialsButton from "./StoreElements/SpecialsButton.tsx";
import { StoreTopBar } from "./StoreElements/StoreTopBar.tsx";
import { StoreCards } from "./StoreTabContents/StoreCards.tsx";

export const StoreContentMobile = () => {
  const { setRun } = useStore();

  const { t } = useTranslation(["store"]);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <>
      <MobileDecoration />

      <Flex
        width="100%"
        height="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
      >
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
              <Tab fontSize={10}>{t("store.labels.loot-boxes")}</Tab>
              <Tab fontSize={10}>{t("store.labels.utilities")}</Tab>
            </TabList>
          </Tabs>
        </Flex>
        <StoreTopBar isSmallScreen={true}></StoreTopBar>
        {tabIndex === 0 && <StoreCards></StoreCards>}

        {tabIndex === 1 && (
          <Flex width="100%" h={"70%"}>
            <LootBoxesMobile />
          </Flex>
        )}
        <MobileBottomBar
          setRun={setRun}
          firstButton={<SpecialsButton isSmallScreen={true} />}
          secondButton={<NextLevelButton isSmallScreen={true} />}
          navigateState={{ state: { inStore: true } }}
        />
      </Flex>
    </>
  );
};
