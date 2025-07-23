import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { useBackToGameButton } from "../../components/useBackToGameButton";
import { MODIFIERS_RARITY } from "../../data/modifiers";
import { Tab, TabPattern } from "../../patterns/tabs/TabPattern";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DocsBoxesRow } from "./DocsBoxesRow";
import { DocsCardsRow } from "./DocsCardsRow";
import { useGameStore } from "../../state/useGameStore";

interface DocsProps {
  lastIndexTab: number;
}

export const DocsPage: React.FC<DocsProps> = ({ lastIndexTab = 0 }) => {
  const { t } = useTranslation(["docs"]);

  const { modCardsConfig } = useGameStore();
  const { isSmallScreen } = useResponsiveValues();
  const { backToGameButtonProps, backToGameButton } = useBackToGameButton();

  return (
    <DelayedLoading>
      <TabPattern
        lastIndexTab={lastIndexTab}
        bottomBar={
          !isSmallScreen ? (
            <Flex mb={"80px"}>{backToGameButton}</Flex>
          ) : (
            <MobileBottomBar
              secondButton={backToGameButtonProps}
              firstButton={undefined}
              hideDeckButton
            />
          )
        }
      >
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
