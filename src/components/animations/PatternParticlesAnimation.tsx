import { Box, Image } from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { forwardRef, ReactNode, useImperativeHandle, useEffect } from "react";

interface PatternParticleAnimationProps {
  children: ReactNode;
  spriteSrc: string;
  width: number;
  height: number;
  particleSize?: number;
  duration?: number;
  active?: boolean;
  speed?: number;
  bottomOffset?: number;
}

export interface PatternParticleAnimationRef {
  play: () => void;
  stop: () => void;
}

export const PatternParticleAnimation = forwardRef<
  PatternParticleAnimationRef,
  PatternParticleAnimationProps
>(
  (
    {
      children,
      spriteSrc,
      width,
      height,
      particleSize = 6,
      duration = 5,
      active: externallyControlledActive = false,
      speed = 3,
      bottomOffset = 0,
    },
    ref
  ) => {
    const controls = useAnimation();
    const fadeControls = useAnimation();

    const cols = Math.ceil(width / particleSize);
    const gridWidth = cols * particleSize;

    const rows = Math.ceil((height * 3) / particleSize);
    const gridHeight = rows * particleSize;

    const positions: { x: number; y: number }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        positions.push({
          x: col * particleSize,
          y: row * particleSize,
        });
      }
    }

    const horizontalOffset = (width - gridWidth) / 2;

    const startAnimation = async () => {
      fadeControls.set({ opacity: 1 });
      controls.set({ y: 0 });

      controls.start({
        y: -gridHeight,
        transition: {
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        },
      });

      const fadeOutTime = 1;
      const scrollTime = duration - fadeOutTime;
      await new Promise((resolve) => setTimeout(resolve, scrollTime * 1000));

      await fadeControls.start({
        opacity: 0,
        transition: { duration: fadeOutTime },
      });

      controls.stop();
      controls.set({ y: 0 });
    };

    const stopAnimation = () => {
      controls.stop();
      fadeControls.set({ opacity: 0 });
      controls.set({ y: 0 });
    };

    useImperativeHandle(ref, () => ({
      play: () => startAnimation(),
      stop: () => stopAnimation(),
    }));

    useEffect(() => {
      if (externallyControlledActive) {
        startAnimation();
      } else {
        stopAnimation();
      }
    }, [externallyControlledActive]);

    return (
      <Box position="relative" display="inline-block">
        <Box
          position="absolute"
          bottom={bottomOffset}
          left="50%"
          transform="translateX(-50%)"
          width={`${width}px`}
          height={`${height}px`}
          overflow="hidden"
          zIndex={100}
          pointerEvents="none"
        >
          <motion.div
            animate={fadeControls}
            initial={{ opacity: 1 }}
            style={{
              width: `${width}px`,
              height: `${gridHeight}px`,
              position: "relative",
            }}
          >
            <motion.div
              animate={controls}
              initial={{ y: 0 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${width}px`,
                height: `${gridHeight * 2}px`,
              }}
            >
              <GridParticles
                positions={positions}
                spriteSrc={spriteSrc}
                particleSize={particleSize}
                offsetX={horizontalOffset}
                offsetY={0}
              />
              <GridParticles
                positions={positions}
                spriteSrc={spriteSrc}
                particleSize={particleSize}
                offsetX={horizontalOffset}
                offsetY={gridHeight}
              />
            </motion.div>
          </motion.div>
        </Box>

        <Box position="relative" zIndex={0}>
          {children}
        </Box>
      </Box>
    );
  }
);

PatternParticleAnimation.displayName = "PatternParticleAnimation";

interface GridParticlesProps {
  positions: { x: number; y: number }[];
  spriteSrc: string;
  particleSize: number;
  offsetX?: number;
  offsetY?: number;
}

const GridParticles = ({
  positions,
  spriteSrc,
  particleSize,
  offsetX = 0,
  offsetY = 0,
}: GridParticlesProps) => {
  return (
    <>
      {positions.map(({ x, y }, i) => (
        <Box
          key={i}
          position="absolute"
          top={`${y + offsetY}px`}
          left={`${x + offsetX}px`}
          width={`${particleSize}px`}
          height={`${particleSize}px`}
          overflow="hidden"
        >
          <Image
            src={spriteSrc}
            width="100%"
            height="auto"
            maxHeight="100%"
            opacity={0.7}
            userSelect="none"
            pointerEvents="none"
            draggable={false}
            objectFit="contain"
          />
        </Box>
      ))}
    </>
  );
};
