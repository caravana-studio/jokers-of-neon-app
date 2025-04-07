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
  backward?: boolean;
  cornerRadius?: number;
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
  backward = false,
  cornerRadius = 10,
}: ParticlesAnimationProps) => {
  if (!active) return <>{children}</>;

  const getPointOnRoundedRect = (
    progress: number,
    rx: number,
    ry: number,
    radius: number
  ) => {
    const w = rx * 2;
    const h = ry * 2;
    const r = Math.min(radius, rx, ry);
    const straightX = w - 2 * r;
    const straightY = h - 2 * r;
    const arcLen = (Math.PI / 2) * r;
    const perimeter = 2 * (straightX + straightY) + 4 * arcLen;

    let d = progress * perimeter;

    if (d < straightX) {
      return { x: -rx + r + d, y: -ry }; // top edge
    }
    d -= straightX;

    if (d < arcLen) {
      const angle = (d / arcLen) * (Math.PI / 2);
      return {
        x: rx - r + Math.cos(angle) * r,
        y: -ry + r + Math.sin(angle) * r,
      }; // top-right corner
    }
    d -= arcLen;

    if (d < straightY) {
      return { x: rx, y: -ry + r + d }; // right edge
    }
    d -= straightY;

    if (d < arcLen) {
      const angle = (d / arcLen) * (Math.PI / 2);
      return {
        x: rx - Math.sin(angle) * r,
        y: ry - r + Math.cos(angle) * r,
      }; // bottom-right corner
    }
    d -= arcLen;

    if (d < straightX) {
      return { x: rx - r - d, y: ry }; // bottom edge
    }
    d -= straightX;

    if (d < arcLen) {
      const angle = (d / arcLen) * (Math.PI / 2);
      return {
        x: -rx + r - Math.cos(angle) * r,
        y: ry - r + Math.sin(angle) * r,
      }; // bottom-left corner
    }
    d -= arcLen;

    if (d < straightY) {
      return { x: -rx, y: ry - r - d }; // left edge
    }
    d -= straightY;

    // top-left corner
    const angle = (d / arcLen) * (Math.PI / 2);
    return {
      x: -rx + Math.sin(angle) * r,
      y: -ry + r - Math.cos(angle) * r,
    };
  };

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
          const t = Math.random();

          const minRX = (width / 2) * minRadiusX;
          const maxRX = (width / 2) * maxRadiusX;
          const minRY = (height / 2) * minRadiusY;
          const maxRY = (height / 2) * maxRadiusY;

          const minPos = getPointOnRoundedRect(t, minRX, minRY, cornerRadius);
          const maxPos = getPointOnRoundedRect(t, maxRX, maxRY, cornerRadius);

          return (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`,
                zIndex: backward ? -1 : 10,
              }}
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [minSize / maxSize, 1, minSize / maxSize],
                x: [minPos.x + offsetX, maxPos.x + offsetX, minPos.x + offsetX],
                y: [minPos.y + offsetY, maxPos.y + offsetY, minPos.y + offsetY],
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
