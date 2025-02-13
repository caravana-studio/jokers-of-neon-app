import { motion } from "framer-motion";
import { Box } from "@chakra-ui/react";

interface FadeInOutProps {
  isVisible?: boolean;
  fadeOut?: boolean;
  fadeInDuration?: number;
  fadeInDelay?: number;
  fadeOutDelay?: number;
  fadeOutDuration?: number;
  children: React.ReactNode;
}

export const FadeInOut: React.FC<FadeInOutProps> = ({
  isVisible = false,
  fadeOut,
  fadeInDuration = 0.5,
  fadeInDelay = 0,
  fadeOutDelay = 1,
  fadeOutDuration = 0.5,
  children,
}) => {
  const shouldAnimate = isVisible || (fadeOut && !isVisible);

  return (
    <motion.div
      initial={{ opacity: 0, visibility: "hidden" }}
      animate={
        shouldAnimate
          ? {
              opacity: isVisible ? 1 : 0,
              visibility: isVisible ? "visible" : "hidden",
            }
          : {}
      }
      exit={
        fadeOut
          ? {
              opacity: 0,
              visibility: "hidden",
              transition: {
                duration: fadeOutDuration,
                delay: fadeOutDelay,
                ease: "easeOut",
              },
            }
          : undefined
      }
      transition={{
        duration: fadeInDuration,
        delay: fadeInDelay,
        ease: "easeIn",
      }}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      <Box width={"100%"}>{children}</Box>
    </motion.div>
  );
};
