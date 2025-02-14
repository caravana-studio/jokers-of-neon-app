import { useTranslation } from "react-i18next";
import { MobileBottomBar } from "../../components/MobileBottomBar.tsx";
import { Tab, TabPattern } from "../../patterns/tabs/TabPattern.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import SpecialsButton from "./StoreElements/ManageButton.tsx";
import NextLevelButton from "./StoreElements/NextLevelButton.tsx";
import { StoreTopBar } from "./StoreElements/StoreTopBar.tsx";
import { LootBoxesMobile } from "./StoreTabContents/LootBoxes.mobile.tsx";
import { StoreCards } from "./StoreTabContents/StoreCards.tsx";
import { UtilsTab } from "./StoreTabContents/UtilsTab.tsx";

export const StoreContentMobile = ({
  lastIndexTab = 0,
}: {
  lastIndexTab: number;
}) => {
  const { setRun } = useStore();

  const { t } = useTranslation(["store"]);

  return (
    <TabPattern
      lastIndexTab={lastIndexTab}
      topBar={<StoreTopBar />}
      bottomBar={
        <MobileBottomBar
          setRun={setRun}
          firstButton={<SpecialsButton isSmallScreen={true} />}
          secondButton={<NextLevelButton isSmallScreen={true} />}
          navigateState={{ state: { inStore: true } }}
        />
      }
      disableGoBack
    >
      <Tab title={t("store.labels.cards")}>
        <StoreCards />
      </Tab>
      <Tab title={t("store.labels.loot-boxes")}>
        <LootBoxesMobile />
      </Tab>
      <Tab title={t("store.labels.utilities")}>
        <UtilsTab />
      </Tab>
    </TabPattern>
  );
};
