import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { STORE_LAST_TAB_INDEX } from "../constants/localStorage";
import { Duration } from "../enums/duration";
import { MobileCoins } from "../pages/store/Coins";
import { Card } from "../types/Card";
import { colorizeText } from "../utils/getTooltip";
import { CardImage3D } from "./CardImage3D";
import { DurationSwitcher } from "./DurationSwitcher";
import { BarButtonProps, MobileBottomBar } from "./MobileBottomBar";
import { MobileDecoration } from "./MobileDecoration";
import { PriceBox } from "./PriceBox";
import { DelayedLoading } from "./DelayedLoading";

interface StorePreviewCardComponentMobileProps {
  card: Card;
  title: string;
  description: string;
  cardType: string;
  buyButton: BarButtonProps;
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
    <DelayedLoading ms={100}>
      <MobileDecoration />
      <Flex
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        pt={5}
        w="100%"
        h="100%"
        textAlign="center"
      >
        <Flex justifyContent="flex-end" mr={8} w="100%" zIndex={2}>
          <MobileCoins />
        </Flex>
        <Flex
          gap={1}
          flexDir="column"
          w="100%"
          justifyContent="center"
          alignItems="center"
          sx={{
            zIndex: 1,
          }}
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
        <Flex
          w={"50vw"}
          justifyContent={"center"}
          alignItems={"center"}
          alignSelf={"center"}
        >
          <CardImage3D
            hideTooltip
            card={{
              ...card,
              temporary: duration === Duration.TEMPORAL,
              remaining: 3,
            }}
          />
        </Flex>
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
          firstButton={{
            onClick: () => {
              sessionStorage.setItem(STORE_LAST_TAB_INDEX, String(tab));
              navigate("/store");
            },
            label: t("store.preview-card.labels.close").toUpperCase(),
          }}
          secondButton={buyButton}
        />
      </Flex>
    </DelayedLoading>
  );
};
