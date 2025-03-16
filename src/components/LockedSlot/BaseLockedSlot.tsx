import { Box, Tooltip } from "@chakra-ui/react";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps.ts";
import CachedImage from "../CachedImage.tsx";
import { useState } from "react";

interface IBaseLockedSlotProps {
  scale?: number;
  backgroundColor?: string;
  borderRadius?: string;
  tooltipText: string;
  hoverEffect?: object;
  onClick?: Function;
  hoverBgImage?: string;
}

export const BaseLockedSlot = ({
  scale = 1,
  backgroundColor,
  borderRadius,
  tooltipText,
  hoverEffect = {},
  onClick,
  hoverBgImage,
}: IBaseLockedSlotProps) => {
  const defaultBg = "/store/locked-slot.png";
  const [bgImage, setBgImage] = useState(defaultBg);

  return (
    <Tooltip label={tooltipText}>
      <Box
        _hover={hoverEffect}
        onClick={onClick?.()}
        onMouseEnter={() => hoverBgImage && setBgImage(hoverBgImage)}
        onMouseLeave={() => setBgImage(defaultBg)}
      >
        <CachedImage
          src={bgImage}
          alt="slot-icon"
          width={`${CARD_WIDTH * scale}`}
          height={`${CARD_HEIGHT * scale}`}
          minWidth={`${CARD_WIDTH * scale}`}
          backgroundColor={backgroundColor ?? "transparent"}
          borderRadius={borderRadius ?? "0px"}
        />
      </Box>
    </Tooltip>
  );
};
