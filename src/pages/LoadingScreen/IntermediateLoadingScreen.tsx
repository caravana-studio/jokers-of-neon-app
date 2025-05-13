import { forwardRef, useImperativeHandle, useRef } from "react";
import { Flex } from "@chakra-ui/react";
import {
  RealLoadingBar,
  RealLoadingBarRef,
} from "../../components/LoadingProgressBar/RealLoadingBar";
import { LoadingProgress } from "../../types/LoadingProgress";
import { MobileDecoration } from "../../components/MobileDecoration";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import AudioPlayer from "../../components/AudioPlayer";
import { Background } from "../../components/Background";

export type IntermediateLoadingScreenRef = {
  nextStep: () => void;
};

interface IntermediateLoadingScreenProps {
  steps: LoadingProgress[];
}

export const IntermediateLoadingScreen = forwardRef<
  IntermediateLoadingScreenRef,
  IntermediateLoadingScreenProps
>(({ steps }, ref) => {
  const progressBarRef = useRef<RealLoadingBarRef>(null);

  useImperativeHandle(ref, () => ({
    nextStep: async () => {
      progressBarRef.current?.nextStep();
      await new Promise((r) => setTimeout(r, 300));
    },
  }));

  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      zIndex={9999}
      flexDir="column"
    >
      <Background>
        <MobileDecoration />
        <LanguageSwitcher />
        <AudioPlayer />

        <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
          <Flex
            w={{ base: "90%", sm: "80%", md: "70%" }}
            h="100%"
            justifyContent="center"
            alignItems="center"
            zIndex={2}
          >
            <RealLoadingBar ref={progressBarRef} steps={steps} />
          </Flex>
        </Flex>
      </Background>
    </Flex>
  );
});
