import { Text, Tooltip } from "@chakra-ui/react";
import ClockIcon from "../assets/clock.svg?component";
import { getTemporalCardText } from "../utils/getTemporalCardText";
import { BaseBadge, FONT_SIZE, ICON_MT, ICON_SIZE } from "./BaseBadge";

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
      <BaseBadge
        size={size}
        opacity={purchased ? 0.5 : 1}
        background="linear-gradient(90deg, rgba(97,97,97,1) 0%, rgba(61,61,61,1) 49%, rgba(35,35,35,1) 100%)"
      >
        <ClockIcon
          color="white"
          width={ICON_SIZE[size]}
          height={ICON_SIZE[size]}
        />
        <Text mt={ICON_MT[size]} color="white" fontSize={FONT_SIZE[size]}>
          {remaining ? remaining : 3}
        </Text>
      </BaseBadge>
    </Tooltip>
  );
};
