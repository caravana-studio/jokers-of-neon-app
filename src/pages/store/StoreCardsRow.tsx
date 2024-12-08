import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TiltCard } from "../../components/TiltCard";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Card } from "../../types/Card";
import { getCardUniqueId } from "../../utils/getCardUniqueId";
import { preloadImages } from "../../utils/preloadImages";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { GREY_LINE } from "../../theme/colors";

interface CardsRowProps {
  title: string;
  cards: Card[];
  button?: {
    onClick: () => void;
    label: string;
  };
}

export const StoreCardsRow = ({ title, cards, button }: CardsRowProps) => {
  const navigate = useNavigate();
  const imageUrls = useMemo(() => {
    return cards.map((card) => {
      return card.isSpecial || card.isModifier
        ? `Cards/${card.card_id}.png`
        : `Cards/big/${card.img}`;
    });
  }, [cards]);

  const { isSmallScreen, cardScale, isCardScaleCalculated } =
    useResponsiveValues();

  const adjustedScale = isSmallScreen
    ? cardScale
    : cardScale - (cardScale * 25) / 100;

  useEffect(() => {
    preloadImages(imageUrls)
      .then(() => {})
      .catch((error) => {
        console.error("Error preloading card images:", error);
      });
  }, [imageUrls]);

  if (!isCardScaleCalculated) {
    return null;
  }

  return (
    <>
      <Box width={"100%"}>
        <Flex
          justifyContent={isSmallScreen ? "space-between" : "flex-start"}
          alignItems="center"
        >
          <Flex alignItems={"center"} gap={2}>
            <Heading fontWeight={"400"} fontSize={["12px", "16px"]}>
              {title}
            </Heading>
            <IoIosInformationCircleOutline color="white" size={"18px"} />
          </Flex>

          {button && (
            <Button
              variant="outline"
              sx={{ width: 300 }}
              onClick={button.onClick}
            >
              {button.label}
            </Button>
          )}
        </Flex>

        <Flex
          flexDirection="row"
          justifyContent={isSmallScreen ? "space-around" : "initial"}
          wrap={"nowrap"}
          width={"100%"}
          gap={[2, 4, 6]}
          rowGap={4}
          backgroundColor={isSmallScreen ? "rgba(0,0,0,0.45)" : "transparent"}
          p={isSmallScreen ? 4 : 0}
          py={isSmallScreen ? 4 : 2}
          borderRadius={"10px"}
          boxShadow={isSmallScreen ? `0px 0px 6px 0px ${GREY_LINE}` : "0px"}
        >
          {cards.map((card) => {
            return (
              <Flex key={getCardUniqueId(card)} justifyContent="center">
                <TiltCard
                  cursor="pointer"
                  scale={adjustedScale}
                  card={card}
                  onClick={() => {
                    if (!card.purchased) {
                      navigate("/preview/card", {
                        state: { card: card },
                      });
                    }
                  }}
                />
              </Flex>
            );
          })}
        </Flex>
      </Box>
    </>
  );
};
