import { Flex, Box } from "@chakra-ui/react";
import { cardSuitsMap, RowHeader } from "./DeckPreviewTableUtils";

export const PreviewTableRowHeader: React.FC<RowHeader> = ({
  cardSuit,
  quantity,
}) => {
  if (!cardSuit || !quantity) return null;

  const Icon = cardSuitsMap.get(cardSuit);
  if (!Icon) return null;

  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      gap={2}
      mx={2}
      textAlign={"center"}
    >
      {Icon && <Icon width={12} fill={"white"} height={"100%"} />}
      <Box p={2} textAlign={"center"} borderRadius={"15px"}>
        {quantity}
      </Box>
    </Flex>
  );
};
