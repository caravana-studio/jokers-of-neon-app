import { Box } from "@chakra-ui/react";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";

interface IUnlockedSlotProps {
  scale?: number;
  backgroundColor?: string;
}

export const UnlockedSlot = ({
  scale,
  backgroundColor,
}: IUnlockedSlotProps) => {
  return (
    <Box
      width={scale ? `${CARD_WIDTH * scale}` : 0}
      height={scale ? `${CARD_HEIGHT * scale}` : 0}
      minWidth={scale ? `${CARD_WIDTH * scale}` : 0}
      borderRadius="12%"
      boxShadow={`0px 0px 1px 0px white, 0px 0px 1px 0px white inset`}
      backgroundColor={backgroundColor ?? "transparent"}
    ></Box>
  );
};
