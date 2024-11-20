import { DeckPageContentMobile } from "./DeckPageContent.mobile";
import { DeckPageContent } from "./DeckPageContent";
import { Background } from "../../components/Background";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DeckFilterProvider } from "../../providers/DeckFilterProvider";

export const DeckPage = () => {
  const { isSmallScreen } = useResponsiveValues();
  return (
    <DeckFilterProvider>
      <Background type="store">
        {isSmallScreen ? <DeckPageContentMobile /> : <DeckPageContent />}
      </Background>
    </DeckFilterProvider>
  );
};
