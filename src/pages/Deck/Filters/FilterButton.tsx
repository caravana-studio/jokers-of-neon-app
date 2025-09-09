import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { IconComponent } from "../../../components/IconComponent";
import { IconType, Icons } from "../../../constants/icons";
import { useDeckStore } from "../../../state/useDeckStore";
import { Card } from "../../../types/Card";

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  filterFn: (card: Card) => boolean;
  inStore?: boolean;
  icon?: IconType;
}

export const FilterButton = ({
  label,
  isActive,
  onClick,
  filterFn,
  inStore = false,
  icon,
}: FilterButtonProps) => {
  const deck = useDeckStore();
  const deckLength = deck?.fullDeckCards.filter(filterFn)?.length ?? 0;
  const usedCardsLength = inStore
    ? 0
    : deck?.usedCards.filter(filterFn)?.length ?? 0;
  const unusedCardsLength = deckLength - usedCardsLength;

  const iconSource = icon ? Icons[icon] : null;
  const iconSize = isMobile ? "12px" : "16px";

  return (
    <Button
      size={"sm"}
      variant={isActive ? "outlineSecondaryGlowActive" : "outlineSecondaryGlow"}
      px={[2, 3]}
      borderRadius={"full"}
      h={["20px", "25px"]}
      onClick={onClick}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Flex gap={[1, 2]} alignItems={"center"} justifyContent={"center"}>
        {iconSource && (
          <Box display="flex" alignItems="center">
            <IconComponent
              icon={iconSource}
              width={iconSize}
              height={iconSize}
            />
          </Box>
        )}
        <Text
          fontSize={[10, 14]}
          lineHeight="1"
          display="flex"
          alignItems="center"
        >
          {label}
        </Text>
        <Text
          color="blueLight"
          fontSize={[10, 14]}
          lineHeight="1"
          display="flex"
          alignItems="center"
        >
          {unusedCardsLength !== deckLength
            ? `( ${unusedCardsLength} / ${deckLength} )`
            : `( ${deckLength} )`}
        </Text>
      </Flex>
    </Button>
  );
};
