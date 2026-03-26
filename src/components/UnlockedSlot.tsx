import { Box } from "@chakra-ui/react";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import CachedImage from "./CachedImage.tsx";

interface IUnlockedSlotProps {
  scale?: number;
  backgroundColor?: string;
}

export const UnlockedSlot = ({
  scale,
  backgroundColor,
}: IUnlockedSlotProps) => {
  const { isSmallScreen } = useResponsiveValues();

  if (!scale) {
    return <Box width={0} height={0} minWidth={0} />;
  }

  return (
    <CachedImage
      src="/store/unlocked-slot.png"
      alt="unlocked-slot"
      width={`${CARD_WIDTH * scale}`}
      height={`${CARD_HEIGHT * scale}`}
      minWidth={`${CARD_WIDTH * scale}`}
      backgroundColor={backgroundColor ?? "transparent"}
      borderRadius={isSmallScreen ? "7%" : "5%"}
      opacity={0.5}
    />
  );
};
