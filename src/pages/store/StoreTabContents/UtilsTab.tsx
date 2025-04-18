import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DefaultInfo } from "../../../components/Info/DefaultInfo";
import { PowerUpComponent } from "../../../components/PowerUpComponent";
import { useGame } from "../../../dojo/queries/useGame";
import { useGameContext } from "../../../providers/GameProvider";
import { useStore } from "../../../providers/StoreProvider";
import { GREY_LINE } from "../../../theme/colors";
import theme from "../../../theme/theme";
import { BurnComponent } from "../../DynamicStore/storeComponents/ BurnComponent";
import { SpecialSlotItem } from "../SpecialSlotItem";
import LevelUpTable from "../StoreElements/LevelUpTable";

export const UtilsTab = () => {
  const { t } = useTranslation(["store"]);
  const { neonGreen } = theme.colors;
  const navigate = useNavigate();

  const { specialSlotItem, burnItem, powerUps, buySpecialSlot } = useStore();
  const { maxSpecialCards } = useGameContext();

  const game = useGame();
  const cash = game?.cash ?? 0;

  const visible = (game?.special_slots ?? 1) < maxSpecialCards;

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
        fontSize={9}
        borderRadius={6}
        height={4}
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
      navigate("/deck", { state: { burn: true } });
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
    <Flex
      flexDir={"column"}
      width={"100%"}
      justifyContent={"space-between"}
      flexGrow={1}
      sx={{
        zIndex: 1,
      }}
    >
      <Flex my={1.5} mx={4} flexDir={"column"}>
        <Flex justifyContent="space-between" mb={1} alignItems="center">
          <Heading fontWeight={"400"} fontSize={"xs"}>
            {t("store.titles.improve-plays").toUpperCase()}
          </Heading>
        </Flex>
        <Flex
          flexDirection={"column"}
          justifyContent={"space-between"}
          margin={"0 auto"}
          width={"100%"}
          minHeight={"135px"}
        >
          <LevelUpTable />
        </Flex>
      </Flex>

      {powerUps?.length > 0 && (
        <Flex className="PowerUps" mx={4} flexDir={"column"}>
          <Flex gap={2} mb={1} alignItems="center">
            <Heading fontWeight={"400"} fontSize={"xs"}>
              {t("store.titles.powerups").toUpperCase()}
            </Heading>
            <DefaultInfo title={"power-ups"} />
          </Flex>
          <Flex
            flexDirection={"column"}
            justifyContent={"space-between"}
            margin={"0 auto"}
            bg="rgba(0, 0, 0, 0.6)"
            borderRadius="10px"
            boxShadow={`0px 0px 6px 0px ${GREY_LINE}`}
            width={"100%"}
            pb={1}
            pt={1}
            h="67px"
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
      )}

      <Flex className="Utils" my={3} mx={4} gap={2}>
        {visible && (
          <Flex flexDir="column" w="50%" gap={1}>
            <Heading fontWeight={"400"} fontSize="xs">
              {t("store.preview-card.slot-title")}
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
          </Flex>
        )}

        <Flex flexDir="column" w="50%" gap={1}>
          <Heading fontWeight={"400"} fontSize={"xs"}>
            {t("store.burn-item.title")}
          </Heading>
          <Flex
            flexDirection={"column"}
            justifyContent={"space-between"}
            bg="rgba(0, 0, 0, 0.6)"
            borderRadius="10px"
            boxShadow={`0px 0px 6px 0px ${GREY_LINE}`}
            p={2.5}
            flexGrow={1}
          >
            <Flex gap={4} h="100%">
              <BurnComponent />

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
