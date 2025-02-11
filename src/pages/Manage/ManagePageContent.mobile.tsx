import { Button, Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Powerups } from "./TabContents/Powerups";
import { SpecialCards } from "./TabContents/SpecialCards";
import { MobileDecoration } from "../../components/MobileDecoration";
import { MobileBottomBar } from "../../components/MobileBottomBar";

interface managePageContentMobileProps {
  lastIndexTab?: number;
  goBackBtn: JSX.Element;
}
import { useSwipeable } from "react-swipeable";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const ManagePageContentMobile = ({
  lastIndexTab = 0,
  goBackBtn,
}: managePageContentMobileProps) => {
  const { t } = useTranslation("intermediate-screens");
  const [tabIndex, setTabIndex] = useState(lastIndexTab);
  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  const [hasSellCardButton, setHasSellCardButton] = useState(false);
  const [sellCardPrice, setSellCardPrice] = useState<number | null>(null);
  const [sellCard, setSellCard] = useState<(() => void) | null>(null);

  const { isSmallScreen } = useResponsiveValues();

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

  const sellCardBtn = (
    <Button
      isDisabled={!hasSellCardButton}
      variant={!hasSellCardButton ? "defaultOutline" : "secondarySolid"}
      fontSize={12}
      onClick={() => {
        if (sellCard) sellCard();
      }}
      width={isSmallScreen ? "100%" : "unset"}
    >
      {sellCardPrice
        ? t("special-cards.sell-for", { price: sellCardPrice })
        : t("special-cards.sell")}
    </Button>
  );

  console.log(sellCardPrice);

  return (
    <>
      <MobileDecoration />
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
            setSellCardInfo={(hasButton, price, sellAction) => {
              setHasSellCardButton(hasButton);
              setSellCardPrice(price);
              setSellCard(() => sellAction);
            }}
          />
        )}
        {tabIndex === 1 && <Powerups />}
      </Flex>

      <MobileBottomBar
        firstButton={sellCardBtn}
        secondButton={goBackBtn}
        navigateState={{ state: { inStore: true } }}
      />
    </>
  );
};
