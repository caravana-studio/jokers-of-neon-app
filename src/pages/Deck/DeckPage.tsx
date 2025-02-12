import { useLocation } from "react-router-dom";
import { DelayedLoading } from "../../components/DelayedLoading";
import { DeckFilterProvider } from "../../providers/DeckFilterProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DeckPageContent } from "./DeckPageContent";
import { DeckPageContentMobile } from "./DeckPageContent.mobile";

export const DeckPage = () => {
  const { isSmallScreen } = useResponsiveValues();

  const location = useLocation();
  const inStore = location.state?.inStore ?? false;
  const burn = location.state?.burn ?? false;

  return (
    <DelayedLoading ms={1000}>
      <DeckFilterProvider>
        <>
          {isSmallScreen ? (
            <DeckPageContentMobile inStore={inStore} burn={burn} />
          ) : (
            <DeckPageContent inStore={inStore} burn={burn} />
          )}
        </>
      </DeckFilterProvider>
    </DelayedLoading>
  );
};
