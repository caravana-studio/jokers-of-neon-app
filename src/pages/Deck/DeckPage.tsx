import { DeckPageContentMobile } from "./DeckPageContent.mobile";
import { DeckPageContent } from "./DeckPageContent";
import { Background } from "../../components/Background";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DeckFilterProvider } from "../../providers/DeckFilterProvider";
import { useLocation } from "react-router-dom";

export const DeckPage = () => {
  const { isSmallScreen } = useResponsiveValues();

  const location = useLocation();
  const inStore = location.state?.inStore ?? false;

  return (
    <DeckFilterProvider>
      <Background type="store">
        {isSmallScreen ? (
          <DeckPageContentMobile inStore={inStore} />
        ) : (
          <DeckPageContent inStore={inStore} />
        )}
      </Background>
    </DeckFilterProvider>
  );
};
