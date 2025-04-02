import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { BackToGameBtn } from "../../components/BackToGameBtn";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { Tab, TabPattern } from "../../patterns/tabs/TabPattern";
import { useGameState } from "../../state/useGameState";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DocsBoxesRow } from "./DocsBoxesRow";
import { DocsCardsRow } from "./DocsCardsRow";
import { MODIFIERS_KEYS } from "../../data/modifiers";

interface DocsProps {
  lastIndexTab: number;
}

export const DocsPage: React.FC<DocsProps> = ({ lastIndexTab = 0 }) => {
  const { t } = useTranslation(["docs"]);

  const { modCardsConfig } = useGameState();
  const { isSmallScreen } = useResponsiveValues();
  const goBackBtn = <BackToGameBtn />;

  return (
    <DelayedLoading>
      <TabPattern
        lastIndexTab={lastIndexTab}
        bottomBar={
          !isSmallScreen ? (
            <Flex mb={"80px"}>{goBackBtn}</Flex>
          ) : (
            <MobileBottomBar
              secondButton={goBackBtn}
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
          <DocsCardsRow cardIds={Object.keys(MODIFIERS_KEYS).map(Number)} />
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
