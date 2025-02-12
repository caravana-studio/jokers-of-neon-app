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
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: isVisible ? 1 : 0 }}
    exit={
      fadeOut
        ? {
            opacity: 0,
            transition: { duration: fadeOutDuration, delay: fadeOutDelay },
          }
        : undefined
    }
    transition={{ duration: fadeInDuration, delay: fadeInDelay }}
  >
    <Box>{children}</Box>
  </motion.div>
);
