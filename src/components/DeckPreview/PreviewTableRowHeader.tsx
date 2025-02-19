import { Flex, Box, useTheme } from "@chakra-ui/react";
import { cardSuitsMap, RowHeader } from "./DeckPreviewTableUtils";
import { GREY_LINE, GREY_MEDIUM } from "../../theme/colors";

export const PreviewTableRowHeader: React.FC<RowHeader> = ({
  cardSuit,
  quantity,
}) => {
  if (!cardSuit || !quantity) return null;

  const Icon = cardSuitsMap.get(cardSuit);
  if (!Icon) return null;

  const { colors } = useTheme();

  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      px={1}
      paddingLeft={2}
      py={1}
      columnGap={2}
      textAlign={"center"}
      backgroundColor={"black"}
      border={"1px"}
      borderRadius={"15px"}
    >
      {Icon && <Icon width={12} fill={colors[cardSuit]} height={"100%"} />}
      <Box
        px={4}
        textAlign={"center"}
        borderRadius={"15px"}
        border={"1px"}
        color={GREY_LINE}
        backgroundColor={GREY_MEDIUM}
      >
        {quantity}
      </Box>
    </Flex>
  );
};
