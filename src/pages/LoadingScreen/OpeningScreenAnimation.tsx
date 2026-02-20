import { chakra } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LogoPresentation } from "./LogoPresentation";

const MotionBox = chakra(motion.div);

interface OpeningScreenAnimationProps {
  onAnimationEnd: () => void;
  skipAnimation?: boolean;
}

const OpeningScreenAnimation: React.FC<OpeningScreenAnimationProps> = ({
  onAnimationEnd,
  skipAnimation,
}) => {
  const [stage, setStage] = useState<"logo" | "end">("logo");
  const [logoVisibility, setLogoVisibility] = useState({
    text: false,
    logo: false,
  });

  useEffect(() => {
    if (skipAnimation) {
      setStage("end");
      onAnimationEnd();
      return;
    }

    if (stage === "logo") {
      setTimeout(
        () => setLogoVisibility((prev) => ({ ...prev, logo: true })),
        500
      );
      setTimeout(
        () => setLogoVisibility((prev) => ({ ...prev, text: true })),
        2000
      );
      setTimeout(() => {
        setLogoVisibility({
          text: false,
          logo: false,
        });
      }, 4000);

      setTimeout(() => {
        setStage("end");
        onAnimationEnd();
      }, 6500);
    }
  }, [stage, onAnimationEnd, skipAnimation]);

  return (
    <MotionBox
      display={stage === "end" ? "none" : "flex"}
      alignItems="center"
      justifyContent="center"
      h="100vh"
      w="100vw"
      position="fixed"
      top={0}
      left={0}
      zIndex={20}
      pointerEvents="none"
      overflow="hidden"
    >
      {stage === "logo" && (
        <LogoPresentation visibleElements={logoVisibility} />
      )}
    </MotionBox>
  );
};

export default OpeningScreenAnimation;
