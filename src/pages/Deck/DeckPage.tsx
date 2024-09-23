
import { isMobile } from "react-device-detect";
import { DeckPageContentMobile } from "./DeckPageContent.mobile";
import { DeckPageContent } from "./DeckPageContent";
import { Background } from "../../components/Background";

export const DeckPage = () => 
    {   
        return(
            <Background type="store">
                {isMobile ? (
                    <DeckPageContentMobile />
                ) : (
                    <DeckPageContent />
                )}
            </Background> 
        );
    }