import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { InformationIcon } from "../../../components/InformationIcon";
import { PowerUpComponent } from "../../../components/PowerUpComponent";
import { MAX_SPECIAL_CARDS } from "../../../constants/config";
import { useGame } from "../../../dojo/queries/useGame";
import { useStore } from "../../../providers/StoreProvider";
import { GREY_LINE } from "../../../theme/colors";
import theme from "../../../theme/theme";
import { BurnItem } from "../BurnItem";
import { SpecialSlotItem } from "../SpecialSlotItem";
import LevelUpTable from "../StoreElements/LevelUpTable";

export const UtilsTab = () => {
  const { t } = useTranslation(["store"]);
  const { neonGreen } = theme.colors;
  const navigate = useNavigate();

  const { specialSlotItem, burnItem, powerUps, buySpecialSlot } = useStore();

  const game = useGame();
  const cash = game?.cash ?? 0;

  const visible =
    (game?.special_slots ?? 1) < MAX_SPECIAL_CARDS;

  const notEnoughCashSlot =
    !specialSlotItem.cost ||
    (specialSlotItem?.discount_cost
      ? cash < Number(specialSlotItem?.discount_cost ?? 0)
      : cash < Number(specialSlotItem.cost));

  const effectiveCost: number =
    burnItem?.discount_cost && burnItem.discount_cost !== 0
      ? Number(burnItem.discount_cost)
      : Number(burnItem.cost);

  const notEnoughCashBurn = cash < effectiveCost;

  const createBuyButton = (onClick: () => void, isDisable: boolean) => {
    return (
      <Button
        onClick={onClick}
        isDisabled={isDisable}
        width={{ base: "50px", sm: "unset" }}
        size={"xs"}
        fontSize={10}
        borderRadius={6}
        height={5}
      >
        {t("store.preview-card.labels.buy")}
      </Button>
    );
  };

  const buySlotButton = createBuyButton(() => {
    buySpecialSlot();
  }, notEnoughCashSlot || specialSlotItem.purchased);

  const buyBurnButton = createBuyButton(() => {
    if (!burnItem.purchased) {
      navigate("/deck", { state: { inStore: true, burn: true } });
    }
  }, notEnoughCashBurn || burnItem.purchased);

  const tooltipSlotButton = notEnoughCashSlot ? (
    <Text mt={1}>{t("store.preview-card.tooltip.no-coins")}</Text>
  ) : (
    buySlotButton
  );

  const tooltipBurnButton = notEnoughCashBurn ? (
    <Text mt={1}> {t("store.preview-card.tooltip.no-coins")}</Text>
  ) : (
    buyBurnButton
  );

  return (
    <Flex flexDir={"column"} width={"100%"}>
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
          h="140px"
        >
          <LevelUpTable />
        </Flex>
      </Flex>

      <Flex className="PowerUps" mx={4} flexDir={"column"}>
        <Flex gap={2} mb={2} alignItems="center">
          <Heading fontWeight={"400"} fontSize={"xs"}>
            {t("store.titles.powerups").toUpperCase()}
          </Heading>
          <InformationIcon title={"power-ups"} />
        </Flex>
        <Flex
          flexDirection={"column"}
          justifyContent={"space-between"}
          margin={"0 auto"}
          bg="rgba(0, 0, 0, 0.6)"
          borderRadius="10px"
          boxShadow={`0px 0px 6px 0px ${GREY_LINE}`}
          width={"100%"}
          pb={5}
          pt={2}
          h="75px"
        >
          <Flex flexDirection="row" justifyContent={"space-around"}>
            {powerUps.map((powerUp, index) => {
              return (
                <PowerUpComponent
                  powerUp={powerUp}
                  width={60}
                  key={index}
                  inStore
                  onClick={() => {
                    if (!powerUp.purchased) {
                      navigate("/preview/power-up", {
                        state: { powerUp },
                      });
                    }
                  }}
                />
              );
            })}
          </Flex>
        </Flex>
      </Flex>

      <Flex className="Utils" my={3} mx={4} gap={2}>
        <Flex flexDir="column" w="50%" gap={2}>
          <Heading fontWeight={"400"} fontSize="xs">
            {t("store.preview-card.slot-title")}
          </Heading>
          {visible && (
            <Flex
              flexDirection={"column"}
              justifyContent={"space-between"}
              bg="rgba(0, 0, 0, 0.6)"
              borderRadius="10px"
              boxShadow={`0px 0px 6px 0px ${GREY_LINE}`}
              p={3}
              flexGrow={1}
            >
              <Flex gap={4}>
                <SpecialSlotItem />

                <Flex
                  flexDirection={"column"}
                  flex="1"
                  flexGrow={1}
                  justifyContent={"space-between"}
                >
                  <Flex mb={4} flexGrow={1} flexDir={"column"} gap={2}>
                    <Text color={neonGreen} fontSize={"xs"} lineHeight={1.3}>
                      {t("store.preview-card.slot-description")}
                    </Text>
                  </Flex>
                  <Flex justifyContent={"flex-end"}>{tooltipSlotButton}</Flex>
                </Flex>
              </Flex>
            </Flex>
          )}
        </Flex>

        <Flex flexDir="column" w="50%" gap={2}>
          <Heading fontWeight={"400"} fontSize={"xs"}>
            {t("store.burn-item.title")}
          </Heading>
          <Flex
            flexDirection={"column"}
            justifyContent={"space-between"}
            bg="rgba(0, 0, 0, 0.6)"
            borderRadius="10px"
            boxShadow={`0px 0px 6px 0px ${GREY_LINE}`}
            p={3}
            flexGrow={1}
          >
            <Flex gap={4} h="100%">
              <BurnItem />

              <Flex
                flexDirection={"column"}
                flex="1"
                flexGrow={1}
                justifyContent={"space-between"}
              >
                <Flex mb={4} flexGrow={1} flexDir={"column"} gap={2}>
                  <Text color={neonGreen} fontSize={"xs"} lineHeight={1.3}>
                    {t("store.burn-item.tooltip")}
                  </Text>
                </Flex>
                <Flex justifyContent={"flex-end"}>{tooltipBurnButton}</Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
