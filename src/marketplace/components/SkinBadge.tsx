import { Badge, BadgeProps } from "@chakra-ui/react";

const SKIN_INFO: Record<number, { label: string; bg: string }> = {
  2: { label: "Season 1", bg: "#C42B2B" },
  3: { label: "Season 2", bg: "#4A4A4A" },
  4: { label: "Season 3", bg: "#20C6ED" },
};

// Color applied to the card name text when a skin is equipped
export const SKIN_NAME_COLOR: Record<number, string> = {
  2: "#FF3B3B", // Season 1 — red
  3: "#8A8A8A", // Season 2 — gray
  4: "#20C6ED", // Season 3 — cyan
};

interface SkinBadgeProps extends Omit<BadgeProps, "bg" | "color"> {
  skinId: number;
}

export function SkinBadge({ skinId, fontSize = 8, px = 2, ...rest }: SkinBadgeProps) {
  const skin = SKIN_INFO[skinId];
  if (!skin) return null;

  return (
    <Badge
      bg={skin.bg}
      color="white"
      fontSize={fontSize}
      px={px}
      borderRadius="full"
      {...rest}
    >
      {skin.label}
    </Badge>
  );
}
