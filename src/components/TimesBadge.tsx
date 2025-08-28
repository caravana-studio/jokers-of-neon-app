import { Text } from "@chakra-ui/react";
import { BLUE } from "../theme/colors";
import { BaseBadge, FONT_SIZE } from "./BaseBadge";

type TimesBadgeProps = {
  count: number;
  size?: "sm" | "md" | "lg";
};

export const TimesBadge: React.FC<TimesBadgeProps> = ({ count, size = "sm" }) => {
  return (
    <BaseBadge size={size} background={BLUE}>
      <Text color="white" fontSize={FONT_SIZE[size]}>
        x {count}
      </Text>
    </BaseBadge>
  );
};
