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
  const burn = location.state?.burn ?? false;

  console.log("burn: " + burn);
  console.log("store: " + inStore);

  return (
    <DeckFilterProvider>
      <Background type="store">
        {isSmallScreen ? (
          <DeckPageContentMobile inStore={inStore} burn={burn} />
        ) : (
          <DeckPageContent inStore={inStore} burn={burn} />
        )}
      </Background>
    </DeckFilterProvider>
  );
};
