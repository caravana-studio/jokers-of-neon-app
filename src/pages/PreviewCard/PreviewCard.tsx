import MobilePreviewCardLayout from "./PreviewCardLayout.mobile";
import PreviewCardLayout from "./PreviewCardLayout";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const PreviewCard = () => {
  const { isSmallScreen } = useResponsiveValues();

  return (
    <>{isSmallScreen ? <MobilePreviewCardLayout /> : <PreviewCardLayout />}</>
  );
};
