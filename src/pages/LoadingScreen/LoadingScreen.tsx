import { Button, Flex } from "@chakra-ui/react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { RemoveScroll } from "react-remove-scroll";
import "../../App.scss";
import { FadeInOut } from "../../components/animations/FadeInOut";
import { PreThemeLoadingPage } from "../PreThemeLoadingPage";
import OpeningScreenAnimation from "./OpeningScreenAnimation";
import { isMobile } from "react-device-detect";
import {
  LoadingProgress,
  LoadingScreenHandle,
} from "../../types/LoadingProgress";
import {
  RealLoadingBar,
  RealLoadingBarRef,
} from "../../components/LoadingProgressBar/RealLoadingBar";

interface LoadingScreenProps {
  error?: boolean;
  showPresentation?: boolean;
  onPresentationEnd?: () => void;
  canFadeOut?: boolean;
  steps?: LoadingProgress[];
}

export const LoadingScreen = forwardRef<
  LoadingScreenHandle,
  LoadingScreenProps
>(
  (
    {
      error = false,
      showPresentation = false,
      onPresentationEnd = () => {},
      canFadeOut = false,
      steps = [],
    },
    ref
  ) => {
    const [visibleSpinner, setVisibleSpinner] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [skipAnimation, setSkipAnimation] = useState(false);

    const progressBarRef = useRef<RealLoadingBarRef>(null);

    useImperativeHandle(ref, () => ({
      nextStep: () => progressBarRef.current?.nextStep(),
      resetProgress: () => progressBarRef.current?.reset(),
    }));

    useEffect(() => {
      if (canFadeOut) {
        setTimeout(() => setIsFadingOut(true), 500);
      }
    }, [canFadeOut]);

    useEffect(() => {
      if (!showPresentation) {
        onPresentationEnd();
      }
    }, []);

    const handleAnimationEnd = () => {
      setSkipAnimation(true);
      setVisibleSpinner(true);
      onPresentationEnd();
    };

    return (
      <Flex
        width={"100%"}
        height={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <FadeInOut isVisible={!isFadingOut} fadeOut fadeOutDelay={0.7}>
          <PreThemeLoadingPage>
            {error ? (
              <div>error loading game</div>
            ) : (
              <Flex
                width={"80%"}
                flexDirection={"column"}
                gap={4}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {showPresentation && (
                  <OpeningScreenAnimation
                    skipAnimation={skipAnimation}
                    onAnimationEnd={handleAnimationEnd}
                  />
                )}

                {(visibleSpinner || !showPresentation) && (
                  <RealLoadingBar ref={progressBarRef} steps={steps} />
                )}

                {!skipAnimation && !isMobile && (
                  <Button
                    onClick={handleAnimationEnd}
                    position="absolute"
                    bottom="20px"
                    right="20px"
                    variant={"ghost"}
                  >
                    Skip
                  </Button>
                )}
              </Flex>
            )}
          </PreThemeLoadingPage>
          <RemoveScroll>
            <></>
          </RemoveScroll>
          {!skipAnimation && isMobile && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              onClick={handleAnimationEnd}
            />
          )}
        </FadeInOut>
      </Flex>
    );
  }
);
