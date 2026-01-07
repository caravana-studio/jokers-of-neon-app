import { Flex, Box } from "@chakra-ui/react";
import { cardSuitsMap, RowHeader } from "./DeckPreviewTableUtils";
import { GREY_LINE, GREY_MEDIUM, CLUBS, DIAMONDS, HEARTS, SPADES } from "../../theme/colors";
import { IconComponent } from "../IconComponent";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Suits } from "../../enums/suits";

const suitColorMap: Record<Suits, string> = {
  [Suits.CLUBS]: CLUBS,
  [Suits.DIAMONDS]: DIAMONDS,
  [Suits.HEARTS]: HEARTS,
  [Suits.SPADES]: SPADES,
  [Suits.JOKER]: "#FFD700",
  [Suits.WILDCARD]: "#FFFFFF",
};

export const PreviewTableRowHeader: React.FC<RowHeader> = ({
  cardSuit,
  quantity,
}) => {
  if (!cardSuit) return null;

  const Icon = cardSuitsMap.get(cardSuit);
  if (!Icon) return null;

  const { isSmallScreen } = useResponsiveValues();
  const iconSize = isSmallScreen ? "9px" : "14px";

  return (
    <Flex
      alignItems={"center"}
      justifyContent={"space-evenly"}
      px={isSmallScreen ? "0px" : 1}
      paddingLeft={isSmallScreen ? "2px" : 2}
      py={isSmallScreen ? "1px" : 1}
      columnGap={isSmallScreen ? "2px" : 2}
      textAlign={"center"}
      backgroundColor={"black"}
      border={"1px"}
      borderRadius={"15px"}
      borderColor={"white"}
      width={isSmallScreen ? "100%" : "80px"}
    >
      {Icon && <IconComponent icon={Icon} width={iconSize} height={iconSize} color={suitColorMap[cardSuit]} />}
      <Box
        px={isSmallScreen ? 1 : 2}
        textAlign="center"
        borderRadius={isSmallScreen ? "8px" : "15px"}
        border="1px"
        color={GREY_LINE}
        backgroundColor={GREY_MEDIUM}
        width={isSmallScreen ? "50%" : "fit-content"}
        minWidth={isSmallScreen ? "30px" : "50%"}
        whiteSpace="normal"
        display={"flex"}
        justifyContent={"center"}
      >
        {quantity}
      </Box>
    </Flex>
  );
};
