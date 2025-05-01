import { Box } from "@chakra-ui/react";
import React from "react";
import CachedImage from "../CachedImage";

interface FlipCardProps {
  children: React.ReactNode;
  flipped?: boolean;
  width: number;
  height: number;
  flipSpeed: number;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  children,
  flipped = false,
  width,
  height,
  flipSpeed,
}) => {
  const backImage = "/Cards/Backs/back.png";

  const front = (
    <Box
      position="absolute"
      top={0}
      left={0}
      w="100%"
      h="100%"
      sx={{ backfaceVisibility: "hidden" }}
    >
      {children}
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
      <CachedImage
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
        w={`${width}px`}
        h={`${height}px`}
        position="relative"
        sx={{
          transformStyle: "preserve-3d",
          transition: `transform ${flipSpeed}s`,
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <Box visibility="hidden" position="absolute">
          {children}
        </Box>
        {front}
        {back}
      </Box>
    </Box>
  );
};
