import { Box, BoxProps } from "@chakra-ui/react";
import { forwardRef, useState } from "react";
import { keyframes } from "@emotion/react";
import { RARITY_COLORS } from "../types/marketplace";

// sk2 = season 1 skin (red), sk3 = season 2 skin (gray)
const SKIN_GLOW: Record<number, string> = {
  2: "#FF3B3B",
  3: "#8A8A8A",
};

const pulse = keyframes`
  0%   { opacity: 0.35; }
  50%  { opacity: 0.65; }
  100% { opacity: 0.35; }
`;

interface CardImageProps extends Omit<BoxProps, "overflow"> {
  imageUrl: string;
  rarity: number;
  skinId?: number;
  size?: string;
  isSpecial?: boolean;
}

export const CardImage = forwardRef<HTMLDivElement, CardImageProps>(
  function CardImage({ imageUrl, rarity, skinId = 0, size = "200px", isSpecial = false, ...rest }, ref) {
    const [isLoaded, setIsLoaded] = useState(false);
    const borderColor = SKIN_GLOW[skinId] ?? RARITY_COLORS[rarity] ?? "#555";
    // Special cards: dark violet bg; regular: dark blue bg
    const placeholderBg = isSpecial
      ? "linear-gradient(135deg, #1a0525 0%, #2d0a3d 50%, #1a0525 100%)"
      : "linear-gradient(135deg, #061828 0%, #0a2840 50%, #061828 100%)";

    return (
      <Box
        ref={ref}
        w={size}
        // Cards are 276×420 px
        aspectRatio="276/420"
        position="relative"
        borderRadius="12px"
        overflow="hidden"
        border={`1px solid ${borderColor}`}
        flexShrink={0}
        {...rest}
      >
        {/* Shimmer placeholder */}
        {!isLoaded && (
          <Box
            position="absolute"
            inset={0}
            background={placeholderBg}
            animation={`${pulse} 1.6s ease-in-out infinite`}
            borderRadius="12px"
          />
        )}

        <Box
          as="img"
          src={imageUrl}
          alt="Card"
          w="100%"
          h="100%"
          // @ts-ignore
          style={{ objectFit: "cover", display: "block" }}
          opacity={isLoaded ? 1 : 0}
          transition="opacity 0.35s ease"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
        />
      </Box>
    );
  }
);
