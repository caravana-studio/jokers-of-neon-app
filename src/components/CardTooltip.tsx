import { Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react/tooltip";
import { PropsWithChildren } from "react";
import { useCardData } from "../providers/CardDataProvider";
import { Card } from "../types/Card";
import { useTransformedCard } from "../utils/cardTransformation/cardTransformation";
import { colorizeText } from "../utils/getTooltip";

interface ICardTooltipProps extends PropsWithChildren {
  card: Card;
}

export const CardTooltip = ({ card, children }: ICardTooltipProps) => {
  const { getCardData } = useCardData();

  const modifiedCard = useTransformedCard(card);

  const { name, description, rarity } = getCardData(modifiedCard.card_id ?? 0);

  return (
    <Tooltip
      hasArrow
      w={"250px"}
      label={
        <Flex flexDir={"column"} gap={1} p={1}>
          <Flex>
            <Flex width="230px">
              <Text fontSize="18px" lineHeight={'20px'} textAlign="left">
                {name}
              </Text>
            </Flex>
            <Flex width="20px" justifyContent={"center"}>
              <Heading color="blueLight" lineHeight={'20px'} fontSize="20px" textAlign="right">
                {rarity}
              </Heading>
            </Flex>
          </Flex>
          <Divider />
          <Flex my={2}>
            <Text fontSize="15px" textAlign="justify">
              {colorizeText(description)}
            </Text>
          </Flex>
        </Flex>
      }
      closeOnPointerDown
    >
      {children}
    </Tooltip>
  );
};
