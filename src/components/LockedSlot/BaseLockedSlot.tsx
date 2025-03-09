import { Box, Tooltip } from "@chakra-ui/react";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps.ts";
import CachedImage from "../CachedImage.tsx";

interface IBaseLockedSlotProps {
  scale?: number;
  backgroundColor?: string;
  borderRadius?: string;
  tooltipText: string;
  hoverEffect?: object;
}

export const BaseLockedSlot = ({
  scale = 1,
  backgroundColor,
  borderRadius,
  tooltipText,
  hoverEffect = {},
}: IBaseLockedSlotProps) => {
  return (
    <Tooltip label={tooltipText}>
      <Box _hover={hoverEffect}>
        <CachedImage
          src="/store/locked-slot.png"
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
