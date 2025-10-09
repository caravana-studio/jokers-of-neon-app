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
  active?: boolean;
}

export const FireworkParticlesAnimation = ({
  children,
  spriteSrc,
  particleSize = 8,
  amount = 30,
  radius = 400,
  speed = 2,
  active = true,
}: FireworkParticlesAnimationProps) => {
  if (!active) return <>{children}</>;

  return (
    <Flex
      position="relative"
      w="100%"
      h="100%"
      justifyContent="center"
      alignItems="center"
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
          const angle = Math.random() * Math.PI * 2;
          const x = Math.cos(angle) * (radius * (0.5 + Math.random() * 0.5));
          const y = Math.sin(angle) * (radius * (0.5 + Math.random() * 0.5));

          const duration = speed * (0.5 + Math.random());

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
                x: [0, x],
                y: [0, y],
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{
                duration,
                ease: "easeOut",
                repeat: Infinity,
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
