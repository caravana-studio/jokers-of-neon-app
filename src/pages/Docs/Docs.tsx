import { useTranslation } from "react-i18next";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MODIFIERS_RARITY } from "../../data/modifiers";
import { Tab, TabPattern } from "../../patterns/tabs/TabPattern";
import { useGameStore } from "../../state/useGameStore";
import { DocsBoxesRow } from "./DocsBoxesRow";
import { DocsCardsRow } from "./DocsCardsRow";

interface DocsProps {
  lastIndexTab: number;
}

export const DocsPage: React.FC<DocsProps> = ({ lastIndexTab = 0 }) => {
  const { t } = useTranslation(["docs"]);

  const { modCardsConfig } = useGameStore();

  return (
    <DelayedLoading>
      <TabPattern lastIndexTab={lastIndexTab}>
        <Tab title={t("labels.special-cards")}>
          <DocsCardsRow cardIds={modCardsConfig?.specialCardsIds ?? []} />
        </Tab>
        <Tab title={t("labels.modifier-cards")}>
          <DocsCardsRow cardIds={Object.keys(MODIFIERS_RARITY).map(Number)} />
        </Tab>
        <Tab title={t("labels.rage-cards")}>
          <DocsCardsRow cardIds={modCardsConfig?.rageCardsIds ?? []} />
        </Tab>
        <Tab title={t("labels.loot-boxes")}>
          <DocsBoxesRow />
        </Tab>
      </TabPattern>
    </DelayedLoading>
  );
};
