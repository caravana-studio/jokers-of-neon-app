import { Box, Button, Flex, Heading, Text, Tooltip } from "@chakra-ui/react";
import LevelUpTable from "./StoreElements/LevelUpTable";
import { useTranslation } from "react-i18next";
import { GREY_LINE } from "../../theme/colors";
import theme from "../../theme/theme";
import CachedImage from "../../components/CachedImage";
import { useStore } from "../../providers/StoreProvider";
import { PriceBox } from "../../components/PriceBox";
import BurnIcon from "../../assets/burn.svg?component";
import { useGame } from "../../dojo/queries/useGame";
import { useNavigate } from "react-router-dom";

export const UtilsTab = () => {
  const { t } = useTranslation(["store"]);
  const { neonGreen } = theme.colors;
  const navigate = useNavigate();

  const { specialSlotItem, burnItem } = useStore();

  const purchasedSlot = specialSlotItem?.purchased ?? false;
  const purchasedBurnItem = burnItem?.purchased ?? false;

  const { buySpecialSlot, locked } = useStore();
  const game = useGame();
  const cash = game?.cash ?? 0;

  const notEnoughCashSlot =
    !specialSlotItem.cost ||
    (specialSlotItem?.discount_cost
      ? cash < Number(specialSlotItem?.discount_cost ?? 0)
      : cash < Number(specialSlotItem.cost)) ||
    specialSlotItem.purchased;

  const effectiveCost: number =
    burnItem?.discount_cost && burnItem.discount_cost !== 0
      ? Number(burnItem.discount_cost)
      : Number(burnItem.cost);

  const notEnoughCashBurn = cash < effectiveCost || burnItem.purchased;

  const slotImage = (
    <CachedImage
      opacity={purchasedSlot ? 0.3 : 1}
      src="/store/slot-icon.png"
      alt="slot-icon"
    />
  );

  const createBuyButton = (onClick: () => void, isDisable: boolean) => {
    return (
      <Button
        onClick={onClick}
        isDisabled={isDisable}
        width={{ base: "35%", sm: "unset" }}
        size={"xs"}
      >
        {t("store.preview-card.labels.buy")}
      </Button>
    );
  };

  const buySlotButton = createBuyButton(() => {
    buySpecialSlot();
  }, notEnoughCashSlot);

  const buyBurnButton = createBuyButton(() => {
    if (!burnItem.purchased) {
      navigate("/deck", { state: { inStore: true, burn: true } });
    }
  }, notEnoughCashBurn);

  const tooltipSlotButton = notEnoughCashSlot ? (
    <Tooltip label={t("store.preview-card.tooltip.no-coins")}>
      {buySlotButton}
    </Tooltip>
  ) : (
    buySlotButton
  );

  const tooltipBurnButton = notEnoughCashSlot ? (
    <Tooltip label={t("store.preview-card.tooltip.no-coins")}>
      {buyBurnButton}
    </Tooltip>
  ) : (
    buyBurnButton
  );

  return (
    <Flex flexDir={"column"} width={"100%"} overflow={"scroll"}>
      <Flex my={3} mx={4} flexDir={"column"}>
        <Flex justifyContent="space-between" mb={2} alignItems="center">
          <Heading fontWeight={"400"} fontSize={"xs"}>
            {t("store.titles.improve-plays").toUpperCase()}
          </Heading>
        </Flex>
        <Flex
          flexDirection={"column"}
          justifyContent={"space-between"}
          margin={"0 auto"}
          bg="rgba(0, 0, 0, 0.6)"
          borderRadius="10px"
          boxShadow={`0px 0px 6px 0px ${GREY_LINE}`}
          width={"100%"}
        >
          <LevelUpTable isSmallScreen={true} />
        </Flex>
      </Flex>

      <Flex className="PowerUps"></Flex>

      <Flex className="Utils" my={3} mx={4} flexDir={"column"} gap={5}>
        <Flex
          flexDirection={"row"}
          justifyContent={"space-between"}
          margin={"0 auto"}
          bg="rgba(0, 0, 0, 0.6)"
          borderRadius="10px"
          boxShadow={`0px 0px 6px 0px ${GREY_LINE}`}
          p={5}
          width={"100%"}
        >
          <Flex position="relative" width={"30%"} mr={5}>
            {slotImage}

            <PriceBox
              price={Number(specialSlotItem.cost)}
              purchased={Boolean(purchasedSlot)}
              discountPrice={Number(specialSlotItem?.discount_cost ?? 0)}
            />

            {purchasedSlot && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: `50%`,
                  left: `65%`,
                  transform: "translate(-65%)",
                  zIndex: 10,
                }}
              >
                <Heading variant="italic" fontSize={10}>
                  {t("store.labels.purchased").toLocaleUpperCase()}
                </Heading>
              </Box>
            )}
          </Flex>

          <Flex
            flexDirection={"column"}
            flex="1"
            justifyContent={"space-between"}
            width={"10%"}
          >
            <Flex justifyContent="space-between" mb={2} alignItems="center">
              <Heading fontWeight={"400"} fontSize={"xs"}>
                {t("store.preview-card.slot-title")}
              </Heading>
            </Flex>

            <Flex mb={4} flexGrow={1} flexDir={"column"} gap={2}>
              <Text
                color="white"
                fontSize={{ base: "md", sm: "lg" }}
                mb={2}
                sx={{
                  position: "relative",
                  _before: {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    width: "95%",
                    height: "2px",
                    backgroundColor: "white",
                    boxShadow:
                      "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                  },
                }}
              >
                {t("store.preview-card.title.description")}
              </Text>
              <Text color={neonGreen} fontSize={{ base: "md", sm: "xl" }}>
                {t("store.preview-card.slot-description")}
              </Text>
            </Flex>

            <Flex justifyContent={"flex-end"}>{tooltipSlotButton}</Flex>
          </Flex>
        </Flex>

        <Flex
          flexDirection={"row"}
          justifyContent={"space-between"}
          margin={"0 auto"}
          bg="rgba(0, 0, 0, 0.6)"
          borderRadius="10px"
          boxShadow={`0px 0px 6px 0px ${GREY_LINE}`}
          p={5}
          width={"100%"}
        >
          <Flex position="relative" width={"30%"} mr={5}>
            <BurnIcon opacity={purchasedBurnItem ? 0.3 : 1} />

            <PriceBox
              price={Number(burnItem.cost)}
              purchased={Boolean(purchasedBurnItem)}
              discountPrice={Number(burnItem?.discount_cost ?? 0)}
            />

            {purchasedBurnItem && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: `50%`,
                  left: `65%`,
                  transform: "translate(-65%)",
                  zIndex: 10,
                }}
              >
                <Heading variant="italic" fontSize={10}>
                  {t("store.labels.purchased").toLocaleUpperCase()}
                </Heading>
              </Box>
            )}
          </Flex>

          <Flex
            flexDirection={"column"}
            flex="1"
            justifyContent={"space-between"}
            width={"10%"}
          >
            <Flex justifyContent="space-between" mb={2} alignItems="center">
              <Heading fontWeight={"400"} fontSize={"xs"}>
                {t("store.burn-item.title")}
              </Heading>
            </Flex>

            <Flex mb={4} flexGrow={1} flexDir={"column"} gap={2}>
              <Text
                color="white"
                fontSize={{ base: "md", sm: "lg" }}
                mb={2}
                sx={{
                  position: "relative",
                  _before: {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    width: "95%",
                    height: "2px",
                    backgroundColor: "white",
                    boxShadow:
                      "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                  },
                }}
              >
                {t("store.preview-card.title.description")}
              </Text>
              <Text color={neonGreen} fontSize={{ base: "md", sm: "xl" }}>
                {t("store.burn-item.tooltip")}
              </Text>

              <Flex justifyContent={"flex-end"}>{tooltipBurnButton}</Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
