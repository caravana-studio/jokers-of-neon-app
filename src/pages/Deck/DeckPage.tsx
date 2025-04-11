import { useLocation } from "react-router-dom";
import { DelayedLoading } from "../../components/DelayedLoading";
import { DeckFilterProvider } from "../../providers/DeckFilterProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DeckPageContent } from "./DeckPageContent";
import { DeckPageContentMobile } from "./DeckPageContent.mobile";
import { useGame } from "../../dojo/queries/useGame";

export const DeckPage = () => {
  const { isSmallScreen } = useResponsiveValues();

  const location = useLocation();
  const game = useGame();
  const inStore = game?.state === "AT_SHOP";
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
