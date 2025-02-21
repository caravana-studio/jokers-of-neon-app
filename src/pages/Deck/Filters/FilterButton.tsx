import { Card } from "../../../types/Card";
import { useDeck } from "../../../dojo/queries/useDeck";
import { Button, Flex, Text } from "@chakra-ui/react";
import { IconType, Icons } from "../../../constants/icons";
import { isMobile } from "react-device-detect";

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
  const deck = useDeck();
  const deckLength = deck?.fullDeckCards.filter(filterFn)?.length ?? 0;
  const usedCardsLength = inStore
    ? 0
    : deck?.usedCards.filter(filterFn)?.length ?? 0;
  const unusedCardsLength = deckLength - usedCardsLength;

  const IconComponent = icon ? Icons[icon] : null;
  const iconSize = isMobile ? "12px" : "16px";

  return (
    <Button
      size={"sm"}
      variant={isActive ? "outlineSecondaryGlowActive" : "outlineSecondaryGlow"}
      px={[2, 3]}
      borderRadius={"full"}
      h={["20px", "25px"]}
      onClick={onClick}
    >
      <Flex gap={[1, 2]} alignItems={"center"}>
        {IconComponent &&
          (typeof IconComponent === "string" ? (
            <img
              src={IconComponent}
              alt={label}
              width={iconSize}
              height={iconSize}
            />
          ) : (
            <IconComponent width={iconSize} height={iconSize} fill="white" />
          ))}
        <Text fontSize={[10, 14]}>{label}</Text>
        <Text color="blueLight" fontSize={[10, 14]}>
          {unusedCardsLength !== deckLength
            ? `( ${unusedCardsLength} / ${deckLength} )`
            : `( ${deckLength} )`}
        </Text>
      </Flex>
    </Button>
  );
};
