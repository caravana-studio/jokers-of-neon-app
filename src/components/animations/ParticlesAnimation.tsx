import { motion } from "framer-motion";
import { Box, Image } from "@chakra-ui/react";
import { ReactNode } from "react";

interface ParticlesAnimationProps {
  children: ReactNode;
  spriteSrc: string;
  minSize?: number;
  maxSize?: number;
  amount?: number;
  width?: number;
  height?: number;
  speed?: number;
  expansionSpeed?: number;
  minRadiusX?: number;
  maxRadiusX?: number;
  minRadiusY?: number;
  maxRadiusY?: number;
  offsetX?: number;
  offsetY?: number;
  active?: boolean;
}

export const ParticlesAnimation = ({
  children,
  spriteSrc,
  minSize = 0,
  maxSize = 4,
  amount = 30,
  width = 90,
  height = 65,
  speed = 3,
  expansionSpeed = 2,
  minRadiusX = 1,
  maxRadiusX = 1.1,
  minRadiusY = 0.8,
  maxRadiusY = 1.1,
  offsetX = 0,
  offsetY = 0,
  active = true,
}: ParticlesAnimationProps) => {
  if (!active) return <>{children}</>;

  return (
    <Box position="relative" display="inline-block">
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        pointerEvents="none"
      >
        {[...Array(amount)].map((_, i) => {
          const randomDelay = Math.random() * speed;
          const startAngle = Math.random() * Math.PI * 2;

          const minRX = (width / 2) * minRadiusX;
          const maxRX = (width / 2) * maxRadiusX;
          const minRY = (height / 2) * minRadiusY;
          const maxRY = (height / 2) * maxRadiusY;

          return (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`,
                zIndex: -1,
              }}
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [minSize / maxSize, 1, minSize / maxSize],
                x: [
                  offsetX + minRX * Math.cos(startAngle),
                  offsetX + maxRX * Math.cos(startAngle),
                  offsetX + minRX * Math.cos(startAngle),
                ],
                y: [
                  offsetY + minRY * Math.sin(startAngle),
                  offsetY + maxRY * Math.sin(startAngle),
                  offsetY + minRY * Math.sin(startAngle),
                ],
              }}
              transition={{
                duration: expansionSpeed,
                repeat: Infinity,
                ease: "easeInOut",
                delay: randomDelay,
              }}
            >
              <Image src={spriteSrc} width={maxSize} height={maxSize} />
            </motion.div>
          );
        })}
      </Box>

      {children}
    </Box>
  );
};
