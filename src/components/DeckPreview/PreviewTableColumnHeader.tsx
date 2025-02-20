import { Flex, Text, Box } from "@chakra-ui/react";
import { cardValuesMap, ColumnHeader } from "./DeckPreviewTableUtils";
import { GREY_LINE, GREY_MEDIUM } from "../../theme/colors";
import { FC, ReactSVGElement, SVGProps } from "react";

export const PreviewTableColumnHeader: React.FC<ColumnHeader> = ({
  cardValue,
  quantity,
}) => {
  if (!cardValue || !quantity) return null;

  const cardValueContent = cardValuesMap.get(cardValue);
  const useIcon = typeof cardValueContent === "function";
  const Icon = useIcon
    ? (cardValueContent as FC<SVGProps<ReactSVGElement>>)
    : null;

  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      rowGap={1}
      px={1}
      py={1}
      textAlign={"center"}
      backgroundColor={"black"}
      border={"1px"}
      borderRadius={"12px"}
    >
      {useIcon ? (
        Icon && <Icon width={15} fill={"white"} height={"100%"} />
      ) : (
        <Text>{cardValueContent}</Text>
      )}
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
