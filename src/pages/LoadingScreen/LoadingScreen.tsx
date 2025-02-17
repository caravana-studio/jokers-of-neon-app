import { useState } from "react";
import "../../App.scss";
import OpeningScreenAnimation from "./OpeningScreenAnimation";
import { Flex } from "@chakra-ui/react";
import { PreThemeLoadingPage } from "../PreThemeLoadingPage";
import { FadeInOut } from "../../components/animations/FadeInOut";

interface LoadingScreenProps {
  error?: boolean;
  showPresentation?: boolean;
  onPresentationEnd?: () => void;
}

export const LoadingScreen = ({
  error = false,
  showPresentation = false,
  onPresentationEnd = () => {},
}: LoadingScreenProps) => {
  const [visibleSpinner, setVisibleSpinner] = useState(false);

  return (
    <FadeInOut isVisible fadeOut fadeOutDelay={0.7}>
      <PreThemeLoadingPage>
        {error ? (
          <div>error loading game</div>
        ) : (
          <Flex
            width={"100%"}
            flexDirection={"column"}
            gap={4}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {showPresentation && (
              <OpeningScreenAnimation
                onAnimationEnd={function (): void {
                  setVisibleSpinner(true);
                  onPresentationEnd();
                }}
              />
            )}

            {(visibleSpinner || !showPresentation) && (
              <img src="loader.gif" alt="loader" width="100px" />
            )}
          </Flex>
        )}
      </PreThemeLoadingPage>
    </FadeInOut>
  );
};
