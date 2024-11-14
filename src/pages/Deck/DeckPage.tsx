import { DeckPageContentMobile } from "./DeckPageContent.mobile";
import { DeckPageContent } from "./DeckPageContent";
import { Background } from "../../components/Background";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const DeckPage = () => {
  const { isSmallScreen } = useResponsiveValues();
  return (
    <Background type="store">
      {isSmallScreen ? <DeckPageContentMobile /> : <DeckPageContent />}
    </Background>
  );
};
