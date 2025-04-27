import { Box, Image } from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";

interface FlipCardProps {
  card: React.ReactNode;
  flipped?: boolean;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  card,
  flipped = false,
}) => {
  const backImage = "/Cards/Backs/back.png";
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    }
  }, [card]);

  const front = (
    <Box
      position="absolute"
      top={0}
      left={0}
      w="100%"
      h="100%"
      sx={{ backfaceVisibility: "hidden" }}
    >
      {card}
    </Box>
  );

  const back = (
    <Box
      position="absolute"
      top={0}
      left={0}
      w="100%"
      h="100%"
      transform="rotateY(180deg)"
      sx={{ backfaceVisibility: "hidden" }}
    >
      <Image
        src={backImage}
        h="100%"
        w="100%"
        objectFit="cover"
        borderRadius="12px"
        alt="Back"
      />
    </Box>
  );

  return (
    <Box p={0} sx={{ perspective: "1000px" }} display="inline-block">
      <Box
        w={`${size.width}px`}
        h={`${size.height}px`}
        position="relative"
        sx={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <Box ref={containerRef} visibility="hidden" position="absolute">
          {card}
        </Box>
        {front}
        {back}
      </Box>
    </Box>
  );
};
