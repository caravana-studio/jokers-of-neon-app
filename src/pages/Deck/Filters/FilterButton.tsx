import { Card } from "../../../types/Card";
import { useDeck } from "../../../dojo/queries/useDeck";
import { Button, Flex, Text } from "@chakra-ui/react";
import { ReactSVGElement, SVGProps } from "react";

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  filterFn: (card: Card) => boolean;
  inStore?: boolean;
  icon?: React.FC<SVGProps<ReactSVGElement>>;
  iconColor?: string;
}

export const FilterButton = ({
  label,
  isActive,
  onClick,
  filterFn,
  inStore = false,
  icon: Icon,
  iconColor = "white",
}: FilterButtonProps) => {
  const deck = useDeck();
  const deckLength = deck?.fullDeckCards.filter(filterFn)?.length ?? 0;
  const usedCardsLength = inStore
    ? 0
    : deck?.usedCards.filter(filterFn)?.length ?? 0;
  const unusedCardsLength = deckLength - usedCardsLength;

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
        {Icon && <Icon width={12} fill={iconColor} />}
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
