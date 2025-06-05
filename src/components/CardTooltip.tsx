import { Divider, Flex, Heading, Img, Text } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react/tooltip";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
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

  const { name, description, rarity, creator } = getCardData(
    modifiedCard.card_id ?? 0
  );
  const { t } = useTranslation("cards");

  const location = useLocation();
  const inDocs = location.pathname.includes("/docs");

  return (
    <Tooltip
      hasArrow
      w={"250px"}
      label={
        <Flex flexDir={"column"} gap={1} p={1}>
          <Flex mb={1}>
            <Flex width="230px">
              <Text fontSize="18px" lineHeight={"20px"} textAlign="left">
                {name}
              </Text>
            </Flex>
            <Flex width="20px" justifyContent={"center"}>
              <Heading
                color="blueLight"
                lineHeight={"20px"}
                fontSize="20px"
                textAlign="right"
              >
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
          {creator && inDocs && (
            <>
              <Divider />
              <Flex gap={2} height={"30px"} alignItems={"center"}>
                <Text fontSize="15px" lineHeight={2} height={"22px"}>
                  {t("by")}:
                </Text>
                <Text
                  fontSize="15px"
                  color="red"
                  lineHeight={2}
                  height={"22px"}
                >
                  {creator}
                </Text>
                <Img
                  src={`https://unavatar.io/twitter/${creator}`}
                  width="25px"
                  height="25px"
                  borderRadius="full"
                />
              </Flex>
            </>
          )}
        </Flex>
      }
      closeOnPointerDown
    >
      {children}
    </Tooltip>
  );
};
