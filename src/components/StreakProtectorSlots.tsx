import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CachedImage from "./CachedImage";

interface StreakProtectorSlotsProps {
  protectors: number;
  slots?: number;
  iconSize?: string | number;
  gap?: string | number;
}

export const StreakProtectorSlots = ({
  protectors,
  slots = 2,
  iconSize = 10,
  gap = 0,
}: StreakProtectorSlotsProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "season-progression",
  });

  const totalSlots = Number.isFinite(slots) ? Math.max(0, Math.floor(slots)) : 0;
  const filledSlots = Number.isFinite(protectors)
    ? Math.min(totalSlots, Math.max(0, Math.floor(protectors)))
    : 0;
  const protectorLabel = t("streak-protector");

  return (
    <Flex
      alignItems="center"
      gap={gap}
      aria-label={`${protectorLabel} ${filledSlots}/${totalSlots}`}
    >
      {Array.from({ length: totalSlots }, (_, index) => {
        const isFilled = index < filledSlots;
        const src = isFilled ? "/streak-protector.png" : "/streak-slot.png";

        return (
          <Flex
            key={`${src}-${index}`}
            w={iconSize}
            h={iconSize}
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <CachedImage
              src={src}
              alt={isFilled ? protectorLabel : `${protectorLabel} slot`}
              h={iconSize}
              maxW={iconSize}
              objectFit="contain"
              pointerEvents="none"
            />
          </Flex>
        );
      })}
    </Flex>
  );
};
