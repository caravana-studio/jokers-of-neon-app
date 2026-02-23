import { chakra } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { LogoPresentation } from "./LogoPresentation";

const MotionBox = chakra(motion.div);

interface OpeningScreenAnimationProps {
  onAnimationEnd: () => void;
}

const OpeningScreenAnimation: React.FC<OpeningScreenAnimationProps> = ({
  onAnimationEnd,
}) => {
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasFinishedRef.current) return;
      hasFinishedRef.current = true;
      onAnimationEnd();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <MotionBox
      display="flex"
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
      <LogoPresentation />
    </MotionBox>
  );
};

export default OpeningScreenAnimation;
