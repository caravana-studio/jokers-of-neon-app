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
  flipped = true,
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
      sx={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
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
    <Box
      sx={{ perspective: "1000px" }}
      display="inline-block"
      overflow="visible"
    >
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
        {front}
        {back}
      </Box>
    </Box>
  );
};
