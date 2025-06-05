import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MobileBottomBar } from "../../components/MobileBottomBar.tsx";
import { Tab, TabPattern } from "../../patterns/tabs/TabPattern.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import { StoreTopBar } from "../DynamicStore/storeComponents/TopBar/StoreTopBar.tsx";
import { RerollingAnimation } from "./StoreElements/RerollingAnimation.tsx";
import { LootBoxesMobile } from "./StoreTabContents/LootBoxes.mobile.tsx";
import { StoreCards } from "./StoreTabContents/StoreCards.tsx";
import { UtilsTab } from "./StoreTabContents/UtilsTab.tsx";
import { useNextLevelButton } from "./StoreElements/useNextLevelButton.tsx";

export const StoreContentMobile = ({
  lastIndexTab = 0,
}: {
  lastIndexTab: number;
}) => {
  const { setRun } = useStore();
  const navigate = useNavigate();

  const { t } = useTranslation(["store"]);

  const { nextLevelButtonProps } = useNextLevelButton();

  return (
    <TabPattern
      lastIndexTab={lastIndexTab}
      topBar={<StoreTopBar />}
      bottomBar={
        <MobileBottomBar
          setRun={setRun}
          firstButton={{
            onClick: () => {
              navigate("/manage");
            },
            label: t("store.labels.manage").toUpperCase(),
          }}
          secondButton={nextLevelButtonProps}
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
