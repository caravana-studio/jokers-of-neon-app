import { Flex, Text, Box } from "@chakra-ui/react";
import { cardValuesMap, ColumnHeader } from "./DeckPreviewTableUtils";
import { GREY_LINE, GREY_MEDIUM } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const PreviewTableColumnHeader: React.FC<ColumnHeader> = ({
  cardValue,
  quantity,
}) => {
  if (!cardValue) return null;

  const cardValueContent = cardValuesMap.get(cardValue);
  const { isSmallScreen } = useResponsiveValues();
  const fontSize = isSmallScreen ? "7px" : "12px";

  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      rowGap={isSmallScreen ? 0 : 1}
      p={isSmallScreen ? 0 : 1}
      textAlign={"center"}
      backgroundColor={"black"}
      border={"1px"}
      borderRadius={"12px"}
      w={"auto"}
      fontSize={fontSize}
    >
      <Text>{cardValueContent}</Text>
      <Box
        px={isSmallScreen ? 1 : 4}
        textAlign={"center"}
        borderRadius={"15px"}
        border={"1px"}
        color={GREY_LINE}
        backgroundColor={GREY_MEDIUM}
        width={"80%"}
      >
        {quantity}
      </Box>
    </Flex>
  );
};
