import { Box, Text, Tooltip } from "@chakra-ui/react";
import ClockIcon from "../assets/clock.svg?component";
import { getTemporalCardText } from "../utils/getTemporalCardText";

const ICON_SIZE = {
  sm: 10,
  md: 16,
  lg: 22,
};
const FONT_SIZE = {
  sm: 12,
  md: 18,
  lg: 26,
};
const GAP = {
  sm: 1,
  md: 1.5,
  lg: 2,
};
const PADDING = {
  sm: "0 3px",
  md: "1px 8px",
  lg: "1px 10px",
};
const ICON_MT = {
  sm: 0.5,
  md: 0.5,
  lg: 1,
};
const MARGIN = {
  sm: 0.5,
  md: 1,
  lg: 2,
};

interface TemporalBadgeProps {
  remaining: number;
  purchased?: boolean;
  size?: "sm" | "md" | "lg";
}

export const TemporalBadge = ({
  remaining,
  purchased,
  size = "md",
}: TemporalBadgeProps) => {
  return (
    <Tooltip hasArrow label={getTemporalCardText(remaining)} closeOnPointerDown>
      <Box
        sx={{
          position: "absolute",
          top: MARGIN[size],
          right: MARGIN[size],
          zIndex: 10,
          opacity: purchased ? 0.5 : 1,
          padding: PADDING[size],
          background:
            "linear-gradient(90deg, rgba(97,97,97,1) 0%, rgba(61,61,61,1) 49%, rgba(35,35,35,1) 100%)",
          borderRadius: "20%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          direction: "row",
          gap: GAP[size],
        }}
        transform={"scale(0.8) translateZ(60px);"}
      >
        <ClockIcon
          color="white"
          width={ICON_SIZE[size]}
          height={ICON_SIZE[size]}
        />
        {
          <Text mt={ICON_MT[size]} color="white" fontSize={FONT_SIZE[size]}>
            {remaining ? remaining : 3}
          </Text>
        }
      </Box>
    </Tooltip>
  );
};
