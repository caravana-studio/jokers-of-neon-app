import { useBreakpointValue } from "@chakra-ui/react";
import MobilePreviewCardLayout from "./PreviewCardLayout.mobile";
import PreviewCardLayout from "./PreviewCardLayout";

export const PreviewCard = () => {
  const isSmallScreen = useBreakpointValue(
    { base: true, sm: false }
  );

  return (
    <>
      {isSmallScreen ? <MobilePreviewCardLayout/> : <PreviewCardLayout/>}
    </>
  );
};
