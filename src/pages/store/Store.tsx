import { isMobile } from "react-device-detect";
import { Background } from "../../components/Background";
import { StoreContent } from "./StoreContent";
import { StoreContentMobile } from "./StoreContent.mobile";
import { useBreakpointValue } from "@chakra-ui/react";
import { useEffect } from "react";

export const Store = () => {
  const isSmallScreen = useBreakpointValue(
    { base: true, md: false }
  );
  

  useEffect(() => {
    console.log("Is Small Screen:", isSmallScreen);  // Debugging to check the value
  }, [isSmallScreen]);
  
  return (
    <Background type="store" scrollOnMobile>
      {isSmallScreen ? <StoreContentMobile/> : <StoreContent/>}
    </Background>
  );
};
