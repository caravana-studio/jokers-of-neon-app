import { isMobile } from "react-device-detect";
import { Background } from "../../components/Background";
import { StoreContent } from "./StoreContent";
import { StoreContentMobile } from "./StoreContent.mobile";

export const Store = () => {
  return (
    <Background type="store" scrollOnMobile>
      {isMobile ? <StoreContentMobile/> : <StoreContent/>}
    </Background>
  );
};
