import { Flex, Heading, Text } from "@chakra-ui/react";
import { useCardHighlight } from "../providers/CardHighlightProvider";
import { Card } from "../types/Card";
import { getCardData } from "../utils/getCardData";
import { colorizeText } from "../utils/getTooltip";
import CachedImage from "./CachedImage";

interface MobileCardHighlightProps {
  card: Card;
}

export const MobileCardHighlight = ({ card }: MobileCardHighlightProps) => {
  const { onClose } = useCardHighlight();
  const { name, description, type } = getCardData(card, false);
  return (
    <Flex
      position={"absolute"}
      top={0}
      left={0}
      width={"100%"}
      height={"100%"}
      zIndex={1000}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      backdropFilter="blur(5px)"
      backgroundColor=" rgba(0, 0, 0, 0.5)"
      gap={6}
      onClick={() => {
        onClose();
      }}
    >
      <Flex flexDirection="column" textAlign="center">
        <Heading
          fontWeight={500}
          size="l"
          letterSpacing={1.3}
          textTransform="unset"
        >
          {name}
        </Heading>
        <Text size="l" textTransform="lowercase" fontWeight={600}>
          - {type} -
        </Text>
      </Flex>
      <CachedImage
        borderRadius={"20px"}
        boxShadow={"0px 0px 20px 2px white, inset 0px 0px 20px 5px white"}
        src={`Cards/big/${card.img}`}
        alt={`Card: ${name}`}
        width={"60%"}
      />
      <Text size="xl" fontSize={"17px"}>
        {colorizeText(description)}
      </Text>
    </Flex>
  );
};
