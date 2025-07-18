import { useLocation } from "react-router-dom";
import { DelayedLoading } from "../../components/DelayedLoading";
import { GameStateEnum } from "../../dojo/typescript/custom";
import { DeckFilterProvider } from "../../providers/DeckFilterProvider";
import { useGameStore } from "../../state/useGameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DeckPageContent } from "./DeckPageContent";
import { DeckPageContentMobile } from "./DeckPageContent.mobile";

export const DeckPage = () => {
  const { isSmallScreen } = useResponsiveValues();

  const location = useLocation();
  const { state } = useGameStore();
  const inStore = state == GameStateEnum.Store;
  const burn = location.state?.burn ?? false;

  return (
    <DelayedLoading ms={1000}>
      <DeckFilterProvider>
        <>
          {isSmallScreen ? (
            <DeckPageContentMobile state={{ inStore, burn }} />
          ) : (
            <DeckPageContent state={{ inStore, burn }} />
          )}
        </>
      </DeckFilterProvider>
    </DelayedLoading>
  );
};
