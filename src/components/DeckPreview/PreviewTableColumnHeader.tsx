import { Flex, Box } from "@chakra-ui/react";
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
      color={"white"}
    >
      {cardValueContent}
      <Flex
        justifyContent={"center"}
        px={isSmallScreen ? 1 : 4}
        textAlign={"center"}
        borderRadius={"15px"}
        border={"1px"}
        color={GREY_LINE}
        backgroundColor={GREY_MEDIUM}
        width={"80%"}
      >
        {quantity}
      </Flex>
    </Flex>
  );
};
