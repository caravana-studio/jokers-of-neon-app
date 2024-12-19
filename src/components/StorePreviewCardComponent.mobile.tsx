import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Duration } from "../enums/duration";
import { MobileCoins } from "../pages/store/Coins";
import { Card } from "../types/Card";
import { colorizeText } from "../utils/getTooltip";
import { Background } from "./Background";
import { CardImage3D } from "./CardImage3D";
import { DurationSwitcher } from "./DurationSwitcher";
import { MobileBottomBar } from "./MobileBottomBar";
import { MobileDecoration } from "./MobileDecoration";
import { PriceBox } from "./PriceBox";

interface StorePreviewCardComponentMobileProps {
  card: Card;
  title: string;
  description: string;
  cardType: string;
  buyButton: ReactNode;
  duration?: Duration;
  onDurationChange?: (duration: Duration) => void;
  tab?: number;
}

export const StorePreviewCardComponentMobile = ({
  title,
  description,
  cardType,
  card,
  buyButton,
  duration,
  onDurationChange,
  tab,
}: StorePreviewCardComponentMobileProps) => {
  const navigate = useNavigate();

  const { t } = useTranslation(["store"]);
  return (
    <Background type="home" dark scrollOnMobile>
      <MobileDecoration />
      <Flex
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        pt={4}
        w="100%"
        h="100%"
        textAlign="center"
      >
        <Flex justifyContent="flex-end" mr={3} w="100%">
          <MobileCoins />
        </Flex>
        <Flex
          gap={1}
          flexDir="column"
          w="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Box>
            <Heading
              fontWeight={500}
              size="l"
              letterSpacing={1.3}
              textTransform="unset"
            >
              {title}
            </Heading>
            {cardType && (
              <Text size="l" textTransform="lowercase" fontWeight={600}>
                - {cardType} -
              </Text>
            )}
          </Box>
          <Text textAlign="center" size="xl" fontSize={"15px"} width={"90%"}>
            {colorizeText(description)}
          </Text>
        </Flex>
        <Box w={card?.isSpecial ? "55%" : "60%"}>
          <CardImage3D
            card={{
              ...card,
              temporary: duration === Duration.TEMPORAL,
              remaining: 3,
            }}
          />
        </Box>
        {card?.isSpecial && duration !== undefined && onDurationChange ? (
          <DurationSwitcher
            price={card.price}
            discountPrice={card.discount_cost}
            temporalDiscountPrice={card.temporary_discount_cost}
            temporalPrice={card.temporary_price}
            duration={duration}
            onDurationChange={onDurationChange}
          />
        ) : (
          <PriceBox
            absolutePosition={false}
            price={card.price ?? 0}
            discountPrice={card.discount_cost}
            purchased={false}
            fontSize={18}
            discountFontSize={12}
          />
        )}
        <MobileBottomBar
          hideDeckButton
          firstButton={
            <Button
              size={"xs"}
              onClick={() => {
                navigate("/redirect/store", { state: { lastTabIndex: tab } });
              }}
              lineHeight={1.6}
              variant="outlinePrimaryGlow"
              fontSize={10}
              minWidth={"100px"}
              height={["30px", "32px"]}
            >
              {t("store.preview-card.labels.close").toUpperCase()}
            </Button>
          }
          secondButton={buyButton}
        />
      </Flex>
    </Background>
  );
};
