import { Flex, Box } from "@chakra-ui/react";
import { cardValuesMap, ColumnHeader } from "./DeckPreviewTableUtils";
import { GREY_LINE, GREY_MEDIUM } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const PreviewTableColumnHeader: React.FC<ColumnHeader> = ({
  cardValue,
  quantity,
}) => {
  const { isSmallScreen } = useResponsiveValues();

  if (!cardValue) return null;

  const cardValueContent = cardValuesMap.get(cardValue);

  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      rowGap={isSmallScreen ? 0 : 1}
      p={isSmallScreen ? 0 : 1}
      textAlign={"center"}
      backgroundColor={"black"}
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
