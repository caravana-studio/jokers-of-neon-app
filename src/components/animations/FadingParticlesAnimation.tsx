import { Box, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadingParticleAnimationProps {
  children: ReactNode;
  spriteSrc: string;
  width: number;
  height: number;
  amount?: number;
  particleSize?: number;
  duration?: number;
  delayRange?: number;
  backward?: boolean;
  minHeight?: number;
  active?: boolean;
  spreadOffset?: number;
}

export const FadingParticleAnimation = ({
  children,
  spriteSrc,
  width,
  height,
  amount = 20,
  particleSize = 6,
  duration = 3,
  delayRange = 2,
  backward = false,
  minHeight = height * 0.3,
  active = false,
  spreadOffset = 0.6,
}: FadingParticleAnimationProps) => {
  return (
    <Box
      position="relative"
      display="inline-block"
      width="auto"
      height="auto"
      overflow={"visible"}
    >
      <Box
        position="absolute"
        bottom={0}
        left={"50%"}
        transform={"translateX(-50%)"}
        width={`${width}px`}
        height={`${height}px`}
        pointerEvents="none"
        zIndex={backward ? -1 : 10}
        opacity={active ? 1 : 0}
      >
        {[...Array(amount)].map((_, i) => {
          const center = width / 2;
          const spreadFactor = spreadOffset + Math.random() * spreadOffset;
          const spread = width * spreadFactor;
          const startX = center + (Math.random() - 0.5) * spread;
          const startYOffset = Math.random() * 10;
          const delay = Math.random() * delayRange;
          const maxY = -height - 10;
          const minY = -minHeight;
          const endY = Math.random() * (minY - maxY) + maxY;
          const repeatDelay = Math.random() * delayRange;

          return (
            <motion.div
              key={i}
              style={{
                position: "absolute",

                bottom: `${startYOffset}px`,
                left: `${startX}px`,
              }}
              animate={
                active
                  ? {
                      y: [-height * 0.1, endY],
                      x: [0, (Math.random() - 0.5) * 20],
                      opacity: [0, 0.5, 1, 0.5, 0],
                    }
                  : {
                      opacity: 0,
                    }
              }
              transition={{
                duration,
                repeat: Infinity,
                repeatDelay,
                ease: "easeInOut",
                delay,
              }}
            >
              <Image
                src={spriteSrc}
                width={`${particleSize}px`}
                height={`${particleSize}px`}
                opacity={0.7}
              />
            </motion.div>
          );
        })}
      </Box>

      {children}
    </Box>
  );
};
