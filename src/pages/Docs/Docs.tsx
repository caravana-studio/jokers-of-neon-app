import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { MobileDecoration } from "../../components/MobileDecoration";
import { Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DocsCardsRow } from "./DocsCardsRow";
import { MODIFIER_CARDS_DATA } from "../../data/modifiers";
import { useCardHighlight } from "../../providers/CardHighlightProvider";
import { DocsBoxesRow } from "./DocsBoxesRow";
import { Background } from "../../components/Background";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { useGameState } from "../../state/useGameState";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { BackToGameBtn } from "../../components/BackToGameBtn";

export const DocsPage = ({ lastIndexTab = 0 }: { lastIndexTab: number }) => {
  const { t } = useTranslation(["docs"]);
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(lastIndexTab);
  const { highlightedCard } = useCardHighlight();
  const tabFontSize = isMobile ? ["2.6vw", "1.9vw", "1.4vw", "1vw"] : "0.85vw";
  const tabsWidth = isMobile ? ["100vw", "90vw"] : "70%";
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
    trackTouch: !highlightedCard,
  });
  const { modCardsConfig } = useGameState();
  const { isSmallScreen } = useResponsiveValues();

  const goBackBtn = <BackToGameBtn />;

  return (
    <Background type="store">
      <MobileDecoration />

      <Flex
        width={["100vw", "90vw"]}
        height={"100%"}
        margin={"0 auto"}
        py={4}
        pt={[4, 4, 8]}
        pb={isSmallScreen ? 0 : 16}
        flexDirection="column"
        alignItems="center"
        justifyContent="space-around"
        {...handlers}
      >
        <Flex p={2} mt={6} width={"100%"}>
          <Tabs
            index={tabIndex}
            onChange={handleTabChange}
            w="100%"
            isFitted
            color="white"
            width={tabsWidth}
            margin={"0 auto"}
          >
            <TabList width={"100%"} height={"100%"}>
              <Tab fontSize={tabFontSize} px={2}>
                {t("labels.special-cards")}
              </Tab>
              <Tab fontSize={tabFontSize} px={2}>
                {t("labels.modifier-cards")}
              </Tab>
              <Tab fontSize={tabFontSize} px={2}>
                {t("labels.rage-cards")}
              </Tab>
              <Tab fontSize={tabFontSize} px={2}>
                {t("labels.loot-boxes")}
              </Tab>
            </TabList>
          </Tabs>
        </Flex>
        <Flex
          w="100%"
          flexGrow={1}
          minHeight={"50%"}
          maxHeight={isSmallScreen ? "80%" : "60%"}
          alignItems={"center"}
        >
          {tabIndex === 0 && (
            <DocsCardsRow cardIds={modCardsConfig?.specialCardsIds ?? []} />
          )}
          {tabIndex === 1 && (
            <DocsCardsRow
              cardIds={Object.keys(MODIFIER_CARDS_DATA).map(Number)}
            />
          )}
          {tabIndex === 2 && (
            <DocsCardsRow cardIds={modCardsConfig?.rageCardsIds ?? []} />
          )}
          {tabIndex === 3 && <DocsBoxesRow />}
        </Flex>
        {!isSmallScreen ? (
          goBackBtn
        ) : (
          <MobileBottomBar secondButton={goBackBtn} firstButton={undefined} />
        )}
      </Flex>
    </Background>
  );
};
