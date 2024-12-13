import {
  Box,
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Coins } from "../pages/Game/Coins";
import { Card } from "../types/Card";
import { colorizeText } from "../utils/getTooltip";
import { Background } from "./Background";
import { CardImage3D } from "./CardImage3D";
import { CashSymbol } from "./CashSymbol";
import { MobileBottomBar } from "./MobileBottomBar";
import { MobileDecoration } from "./MobileDecoration";
import { PriceBox } from "./PriceBox";

interface StorePreviewCardComponentMobileProps {
  card: Card;
  title: string;
  description: string;
  cardType: string;
  buyButton: ReactNode
}

export const StorePreviewCardComponentMobile = ({
  title,
  description,
  cardType,
  card,
  buyButton,
}: StorePreviewCardComponentMobileProps) => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(Duration.PERMANENT);

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
          <Coins rolling={false} />
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
          <Text textAlign="center" size="xl" fontSize={"17px"} width={"65%"}>
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
        {card?.isSpecial ? (
          <DurationSwitcher
            price={card.price}
            discountPrice={card.discount_cost}
            temporalDiscountPrice={card.temporary_discount_cost}
            temporalPrice={card.temporary_price}
            duration={duration}
            onDurationChange={() =>
              setDuration(
                duration === Duration.TEMPORAL
                  ? Duration.PERMANENT
                  : Duration.TEMPORAL
              )
            }
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
                navigate(-1);
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
          secondButton={
            buyButton
          }
        />
      </Flex>
    </Background>
  );
};

enum Duration {
  PERMANENT = 0,
  TEMPORAL = 1,
}

interface DurationSwitcherProps {
  price?: number;
  temporalPrice?: number;
  discountPrice?: number;
  temporalDiscountPrice?: number;
  duration: Duration;
  onDurationChange: (duration: Duration) => void;
}

const DurationSwitcher = ({
  price,
  temporalPrice,
  discountPrice,
  temporalDiscountPrice,
  duration,
  onDurationChange,
}: DurationSwitcherProps) => {
  const { t } = useTranslation("store", { keyPrefix: "store.preview-card" });

  return (
    <Flex gap={0} alignItems="center" mt={3} flexDir="column">
      <Text size="md">
        {duration === Duration.TEMPORAL ? t("temporal") : t("permanent")}
      </Text>
      <Tabs
        index={duration}
        onChange={onDurationChange}
        w="100%"
        isFitted
        color="white"
        mt={2}
        variant="secondary"
      >
        <TabList>
          <Tab fontSize={12}>
            <Flex flexDir="column">
              <Text
                sx={{
                  textDecoration: discountPrice ? "line-through" : "none",
                  fontSize: discountPrice ? 8 : 12,
                  lineHeight: discountPrice ? 0.5 : 1,
                }}
              >
                {price}
                <CashSymbol />
              </Text>
              {discountPrice && discountPrice > 0 ? (
                <Text size="sm" lineHeight={1}>
                  {discountPrice}
                  <CashSymbol />
                </Text>
              ) : (
                <></>
              )}
            </Flex>
          </Tab>
          <Tab fontSize={12}>
            <Flex flexDir="column">
              <Text
                sx={{
                  textDecoration: temporalDiscountPrice
                    ? "line-through"
                    : "none",
                  fontSize: temporalDiscountPrice ? 8 : 12,
                  lineHeight: temporalDiscountPrice ? 0.5 : 1,
                }}
              >
                {temporalPrice}
                <CashSymbol />
              </Text>
              {temporalDiscountPrice && temporalDiscountPrice > 0 ? (
                <Text size="sm" lineHeight={1}>
                  {temporalDiscountPrice}
                  <CashSymbol />
                </Text>
              ) : (
                <></>
              )}
            </Flex>
          </Tab>
        </TabList>
      </Tabs>
    </Flex>
  );
};
