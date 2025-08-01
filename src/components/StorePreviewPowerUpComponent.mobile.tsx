import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MobileCoins } from "../pages/store/Coins";
import { colorizeText } from "../utils/getTooltip";
import { BarButtonProps, MobileBottomBar } from "./MobileBottomBar";
import { MobileDecoration } from "./MobileDecoration";
import { PriceBox } from "./PriceBox";
import { IStorePreviewComponent } from "./StorePreviewComponent";
import { STORE_LAST_TAB_INDEX } from "../constants/localStorage";
import { DelayedLoading } from "./DelayedLoading";

interface IStorePreviewComponentMobile extends IStorePreviewComponent {
  buyButton: BarButtonProps;
}

export const StorePreviewPowerUpComponentMobile = ({
  image,
  title,
  description,
  cardType,
  price,
  discountPrice,
  buyButton,
  tab,
}: IStorePreviewComponentMobile) => {
  const navigate = useNavigate();

  const { t } = useTranslation(["store"]);
  return (
    <DelayedLoading ms={100}>
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
          <Text textAlign="center" size="xl" fontSize={"17px"} width={"65%"}>
            {colorizeText(description)}
          </Text>
        </Flex>
        <Box
          w={"60%"}
          sx={{
            zIndex: 1,
          }}
        >
          {image}
        </Box>

        <PriceBox
          absolutePosition={false}
          price={price}
          discountPrice={discountPrice}
          purchased={false}
          fontSize={18}
          discountFontSize={12}
        />

        <MobileBottomBar
          hideDeckButton
          firstButton={
            {
              onClick: () => {
                sessionStorage.setItem(STORE_LAST_TAB_INDEX, String(tab));
                navigate("/store");
              },
              label: t("store.preview-card.labels.close").toUpperCase(),
            }
          }
          secondButton={buyButton}
        />
      </Flex>
    </DelayedLoading>
  );
};
