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
      px={4}
      py={1}
      columnGap={2}
      textAlign={"center"}
      backgroundColor={"black"}
      border={"1px"}
      borderRadius={"15px"}
      borderColor={"white"}
    >
      {Icon && <Icon width={12} fill={colors[cardSuit]} height={"100%"} />}
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
