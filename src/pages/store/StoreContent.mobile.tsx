import { useTranslation } from "react-i18next";
import { MobileBottomBar } from "../../components/MobileBottomBar.tsx";
import { Tab, TabPattern } from "../../patterns/tabs/TabPattern.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import SpecialsButton from "./StoreElements/ManageButton.tsx";
import NextLevelButton from "./StoreElements/NextLevelButton.tsx";
import { RerollingAnimation } from "./StoreElements/RerollingAnimation.tsx";
import { StoreTopBar } from "../DynamicStore/storeComponents/TopBar/StoreTopBar.tsx";
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
        <RerollingAnimation>
          <StoreCards />
        </RerollingAnimation>
      </Tab>
      <Tab title={t("store.labels.loot-boxes")}>
        <RerollingAnimation>
          <LootBoxesMobile />
        </RerollingAnimation>
      </Tab>
      <Tab title={t("store.labels.utilities")}>
        <RerollingAnimation>
          <UtilsTab />
        </RerollingAnimation>
      </Tab>
    </TabPattern>
  );
};
