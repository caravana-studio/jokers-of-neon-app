import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { Tab, TabPattern } from "../../patterns/tabs/TabPattern";
import { ManagePageContentProps } from "./ManagePageContent";
import { Powerups } from "./TabContents/Powerups";
import { SpecialCards } from "./TabContents/SpecialCards";

export const ManagePageContentMobile = ({
  lastIndexTab = 0,
  discardedCards,
  preselectedCard,
  onCardClick,
  goBackButton,
  onTabChange,
}: ManagePageContentProps) => {
  const { t } = useTranslation("intermediate-screens");

  return (
    <TabPattern
      lastIndexTab={lastIndexTab}
      onTabChange={onTabChange}
      bottomBar={
        <MobileBottomBar
          firstButton={goBackButton}
          secondButton={null}
          hideDeckButton
        />
      }
    >
      <Tab title={t("special-cards.title")}>
        <Flex h=" 100%" w="100%" flexDir="column" p={6}>
          <SpecialCards
            discardedCards={discardedCards}
            preselectedCard={preselectedCard}
            onCardClick={onCardClick}
            containerSx={{
              padding: "0",
            }}
          />
        </Flex>
      </Tab>
      <Tab title={t("power-ups.title")}>
        <Powerups />
      </Tab>
    </TabPattern>
  );
};
