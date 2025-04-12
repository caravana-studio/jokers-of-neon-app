import { Flex, Box } from "@chakra-ui/react";
import { cardSuitsMap, RowHeader } from "./DeckPreviewTableUtils";
import { GREY_LINE, GREY_MEDIUM } from "../../theme/colors";
import { IconComponent } from "../IconComponent";

export const PreviewTableRowHeader: React.FC<RowHeader> = ({
  cardSuit,
  quantity,
}) => {
  if (!cardSuit) return null;

  const Icon = cardSuitsMap.get(cardSuit);
  if (!Icon) return null;

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
      {Icon && <IconComponent icon={Icon} width={"14px"} height={"14px"} />}
      <Box
        px={4}
        textAlign={"center"}
        borderRadius={"15px"}
        border={"1px"}
        color={GREY_LINE}
        backgroundColor={GREY_MEDIUM}
        width={"60px"}
      >
        {quantity}
      </Box>
    </Flex>
  );
};
