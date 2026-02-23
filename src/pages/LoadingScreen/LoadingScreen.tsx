import { Flex } from "@chakra-ui/react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { RemoveScroll } from "react-remove-scroll";
import "../../App.scss";
import { FadeInOut } from "../../components/animations/FadeInOut";
import {
  RealLoadingBar,
  RealLoadingBarRef,
} from "../../components/LoadingProgressBar/RealLoadingBar";
import { LoadingScreenHandle } from "../../types/LoadingProgress";
import { PreThemeLoadingPage } from "../PreThemeLoadingPage";
import OpeningScreenAnimation from "./OpeningScreenAnimation";

interface LoadingScreenProps {
  error?: boolean;
  showPresentation?: boolean;
  onPresentationEnd?: () => void;
  canFadeOut?: boolean;
  initial?: boolean;
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
      initial = false,
    },
    ref
  ) => {
    const [isFadingOut, setIsFadingOut] = useState(false);

    const progressBarRef = useRef<RealLoadingBarRef>(null);

    const { t } = useTranslation("intermediate-screens", {
      keyPrefix: "loading-screen",
    });

    const steps = initial
      ? [
          { text: t("steps.1"), showAt: 0 },
          { text: t("steps.2"), showAt: 1 },
          { text: t("steps.3"), showAt: 2 },
          { text: t("steps.4"), showAt: 3 },
          { text: t("steps.5"), showAt: 4 },
        ]
      : [];

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
    }, [onPresentationEnd, showPresentation]);

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
              <div>{t("error")}</div>
            ) : (
              <Flex
                width={"100%"}
                height={"100%"}
                position={"relative"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {showPresentation && (
                  <OpeningScreenAnimation onAnimationEnd={onPresentationEnd} />
                )}

                <Flex
                  width={showPresentation ? "100%" : "80%"}
                  position={showPresentation ? "absolute" : "relative"}
                  left={0}
                  bottom={showPresentation ? 0 : undefined}
                  px={showPresentation ? 3 : 0}
                  zIndex={showPresentation ? 30 : 1}
                >
                  <RealLoadingBar
                    ref={progressBarRef}
                    steps={steps}
                    showHint={!showPresentation}
                  />
                </Flex>

              </Flex>
            )}
          </PreThemeLoadingPage>
          <RemoveScroll>
            <></>
          </RemoveScroll>
        </FadeInOut>
      </Flex>
    );
  }
);
