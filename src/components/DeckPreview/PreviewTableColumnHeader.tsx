import { Flex, Text, Box } from "@chakra-ui/react";
import { cardValuesMap, ColumnHeader } from "./DeckPreviewTableUtils";
import { GREY_LINE, GREY_MEDIUM } from "../../theme/colors";

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
      rowGap={1}
      px={2}
      py={1}
      textAlign={"center"}
      backgroundColor={"black"}
      border={"1px"}
      borderRadius={"15px"}
      borderColor={"white"}
    >
      <Text>{cardValuesMap.get(cardValue)}</Text>
      <Box
        px={2}
        textAlign={"center"}
        borderRadius={"15px"}
        border={"1px"}
        borderColor={GREY_LINE}
        color={GREY_LINE}
        backgroundColor={GREY_MEDIUM}
      >
        {quantity}
      </Box>
    </Flex>
  );
};
