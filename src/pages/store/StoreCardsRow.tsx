import { Button, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DefaultInfo } from "../../components/Info/DefaultInfo";
import { TiltCard } from "../../components/TiltCard";
import { GREY_LINE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Card } from "../../types/Card";
import { getCardUniqueId } from "../../utils/getCardUniqueId";

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

  const { t } = useTranslation(["store"]);

  const { isSmallScreen, cardScale, isCardScaleCalculated } =
    useResponsiveValues();

  const adjustedScale = isSmallScreen
    ? cardScale - (cardScale * 15) / 100
    : cardScale - (cardScale * 25) / 100;

  if (!isCardScaleCalculated) {
    return null;
  }

  return (
    <>
      <Flex flexDir="column" gap={1.5} width={"100%"}>
        <Flex
          justifyContent={isSmallScreen ? "space-between" : "flex-start"}
          alignItems="center"
        >
          <Flex alignItems={"center"} gap={2}>
            <Heading fontWeight={"400"} fontSize={["12px", "16px"]}>
              {t("store.titles." + title)}
            </Heading>
            <DefaultInfo title={title} />
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
      </Flex>
    </>
  );
};
