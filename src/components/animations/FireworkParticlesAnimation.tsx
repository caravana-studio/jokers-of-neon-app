import { Box, Flex, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FireworkParticlesAnimationProps {
  children: ReactNode;
  spriteSrc: string;
  particleSize?: number;
  amount?: number;
  radius?: number;
  speed?: number;
  fadeSpeed?: number;
  active?: boolean;
}

export const FireworkParticlesAnimation = ({
  children,
  spriteSrc,
  particleSize = 8,
  amount = 30,
  radius = 400,
  speed = 2,
  fadeSpeed = 2,
  active = true,
}: FireworkParticlesAnimationProps) => {
  if (!active) return <>{children}</>;

  return (
    <Flex
      position="relative"
      w={"100%"}
      h={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        position="absolute"
        top={`calc(50% - ${radius}px)`}
        left={`calc(50% - ${radius}px)`}
        w={`${radius * 2}px`}
        h={`${radius * 2}px`}
        pointerEvents="none"
        overflow="visible"
      >
        {[...Array(amount)].map((_, i) => {
          const angle = (i / amount) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          const randomX = x + (Math.random() - 0.5) * radius * 0.3;
          const randomY = y + (Math.random() - 0.5) * radius * 0.3;

          return (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                x: [0, randomX],
                y: [0, randomY],
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{
                duration: speed,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: Math.random() * fadeSpeed + 0.5,
              }}
            >
              <Image
                src={spriteSrc}
                width={particleSize}
                height={particleSize}
              />
            </motion.div>
          );
        })}
      </Box>

      {children}
    </Flex>
  );
};
