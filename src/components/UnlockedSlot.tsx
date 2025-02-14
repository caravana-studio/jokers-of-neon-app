import { Box } from "@chakra-ui/react";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";

interface IUnlockedSlotProps {
  scale?: number;
  backgroundColor?: string;
}

export const UnlockedSlot = ({
  scale = 1,
  backgroundColor,
}: IUnlockedSlotProps) => {
  return (
    <Box
      width={`${CARD_WIDTH * scale}`}
      height={`${CARD_HEIGHT * scale}`}
      minWidth={`${CARD_WIDTH * scale}`}
      borderRadius="12%"
      boxShadow={`0px 0px 1px 0px white, 0px 0px 1px 0px white inset`}
      backgroundColor={backgroundColor ?? "transparent"}
    ></Box>
  );
};
