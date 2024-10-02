import { Background } from "../../components/Background";
import { StoreContent } from "./StoreContent";
import { StoreContentMobile } from "./StoreContent.mobile";
import { useBreakpointValue } from "@chakra-ui/react";

export const Store = () => {
  const isSmallScreen = useBreakpointValue(
    { base: true, md: false }
  );

  return (
    <Background type="store" scrollOnMobile>
      {isSmallScreen ? <StoreContentMobile/> : <StoreContent/>}
    </Background>
  );
};
