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
  showCumulativeProgress?: boolean;
}

export const CardTooltip = ({
  card,
  children,
  showCumulativeProgress = false,
}: ICardTooltipProps) => {
  const { getCardData } = useCardData();

  const modifiedCard = useTransformedCard(card);

  const { name, description, rarity, creator } = getCardData(
    modifiedCard.card_id ?? 0,
    { showCumulativeProgress }
  );
  const originalEffectCardId = card.specialEffectOverrideOriginalEffectCardId;
  const hasOriginalEffectTitle =
    card.isSpecial && typeof originalEffectCardId === "number";
  const originalEffectData = hasOriginalEffectTitle
    ? getCardData(originalEffectCardId)
    : undefined;
  const originalEffectTitle = originalEffectData?.name ?? "";
  const rarityToDisplay = originalEffectData?.rarity ?? rarity;
  const { t } = useTranslation("cards");
  const descriptionWithCurrentEffect = hasOriginalEffectTitle
    ? `^violet(${t("current-effect")})^ ${description}`
    : description;

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
              <Flex direction="column" gap={0.5}>
                <Text fontSize="18px" lineHeight={"20px"} textAlign="left">
                  {name}
                </Text>
                {hasOriginalEffectTitle && (
                  <Text
                    fontSize="12px"
                    lineHeight={"14px"}
                    textAlign="left"
                    color="whiteAlpha.900"
                  >
                    ({originalEffectTitle})
                  </Text>
                )}
              </Flex>
            </Flex>
            <Flex width="20px" justifyContent={"center"}>
              <Heading
                color="blueLight"
                lineHeight={"20px"}
                fontSize="20px"
                textAlign="right"
              >
                {rarityToDisplay}
              </Heading>
            </Flex>
          </Flex>
          <Divider />
          <Flex my={2}>
            <Flex direction="column" gap={1}>
              {card.silenced && (
                <Text
                  fontSize="15px"
                  color="red.400"
                  fontWeight={700}
                  textTransform="uppercase"
                >
                  {t("silenced")}
                </Text>
              )}
              <Text fontSize="15px" textAlign="justify">
                {colorizeText(descriptionWithCurrentEffect)}
              </Text>
            </Flex>
          </Flex>
          {creator && inDocs && (
            <>
              <Divider />
              <Flex gap={2} height={"30px"} alignItems={"center"}>
                <Text fontSize="15px" lineHeight={2} height={"22px"}>
                  {t("by")}
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
