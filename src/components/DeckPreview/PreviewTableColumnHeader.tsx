import { Flex, Text, Box } from "@chakra-ui/react";
import { cardValuesMap, ColumnHeader } from "./DeckPreviewTableUtils";

export const PreviewTableColumnHeader: React.FC<ColumnHeader> = ({
  cardValue,
  quantity,
}) => {
  if (!cardValue || !quantity) return null;

  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={2}
      mx={2}
      textAlign={"center"}
    >
      <Text>{cardValuesMap.get(cardValue)}</Text>
      <Box p={2} textAlign={"center"} borderRadius={"15px"}>
        {quantity}
      </Box>
    </Flex>
  );
};
