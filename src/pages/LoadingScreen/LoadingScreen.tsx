import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "../../App.scss";
import { FadeInOut } from "../../components/animations/FadeInOut";
import { PreThemeLoadingPage } from "../PreThemeLoadingPage";
import OpeningScreenAnimation from "./OpeningScreenAnimation";

interface LoadingScreenProps {
  error?: boolean;
  showPresentation?: boolean;
  onPresentationEnd?: () => void;
  canFadeOut?: boolean;
}

export const LoadingScreen = ({
  error = false,
  showPresentation = false,
  onPresentationEnd = () => {},
  canFadeOut = false,
}: LoadingScreenProps) => {
  const [visibleSpinner, setVisibleSpinner] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (canFadeOut) {
      setTimeout(() => setIsFadingOut(true), 500);
    }
  }, [canFadeOut]);

  return (
    <FadeInOut isVisible={!isFadingOut} fadeOut fadeOutDelay={0.7}>
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
