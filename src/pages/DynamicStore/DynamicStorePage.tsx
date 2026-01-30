import { Button, Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DelayedLoading } from "../../components/DelayedLoading";
import { DefaultInfo } from "../../components/Info/DefaultInfo";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { PositionedGameDeck } from "../../components/PositionedGameDeck";
import { PriceBox } from "../../components/PriceBox";
import { GameStateEnum } from "../../dojo/typescript/custom";
import { useShopActions } from "../../dojo/useShopActions";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { useRedirectByGameState } from "../../hooks/useRedirectByGameState";
import { useGameContext } from "../../providers/GameProvider";
import { useStore } from "../../providers/StoreProvider";
import { useGameStore } from "../../state/useGameStore";
import { useShopStore } from "../../state/useShopStore";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { logEvent } from "../../utils/analytics";
import { useNextLevelButton } from "../store/StoreElements/useNextLevelButton";
import { getComponent } from "./storeComponents/getComponent";
import { StoreTopBar } from "./storeComponents/TopBar/StoreTopBar";
import { storesConfig } from "./storesConfig";

const DECK_SHOP_CONFIG_ID = 1;
const GLOBAL_SHOP_CONFIG_ID = 2;
const SPECIALS_SHOP_CONFIG_ID = 3;
const LEVEL_UPS_SHOP_CONFIG_ID = 4;
const MODIFIERS_SHOP_CONFIG_ID = 5;
const MIX_SHOP_CONFIG_ID = 6;

export const SHOP_ID_MAP = {
  [DECK_SHOP_CONFIG_ID]: "deck",
  [GLOBAL_SHOP_CONFIG_ID]: "global",
  [SPECIALS_SHOP_CONFIG_ID]: "specials",
  [LEVEL_UPS_SHOP_CONFIG_ID]: "level-ups",
  [MODIFIERS_SHOP_CONFIG_ID]: "modifiers",
  [MIX_SHOP_CONFIG_ID]: "mix",
};
export const DynamicStorePage = () => {
  const { t } = useTranslation("store", { keyPrefix: "store.dynamic" });

  const { setLoading } = useStore();
  const { specialSlotItem } = useShopStore();
  const { shopId } = useGameStore();
  const store = storesConfig.find(
    (s) => s.id === SHOP_ID_MAP[shopId as keyof typeof SHOP_ID_MAP]
  );

  useEffect(() => {
    logEvent("open_dynamic_store_page", { shop_id: shopId });
  }, [shopId]);

  const { isSmallScreen } = useResponsiveValues();

  const distribution =
    store?.distribution[isSmallScreen ? "mobile" : "desktop"];
  const navigate = useNavigate();
  const customNavigate = useCustomNavigate();
  const { onShopSkip } = useGameContext();
  const { specialSlots, maxSpecialCards, id: gameId } = useGameStore();
  const slotsLen = specialSlots;

  const { skipShop } = useShopActions();

  const { nextLevelButton, nextLevelButtonProps } = useNextLevelButton();

  useRedirectByGameState();

  const handleNextLevelClick = () => {
    setLoading(true);
    onShopSkip();
    skipShop(gameId).then((response): void => {
      if (response.success) {
        customNavigate(GameStateEnum.Map);
      } else {
        setLoading(false);
      }
    });
  };

  const manageItemsButton = (
    <Button
      w={{ base: "100%", sm: "280px" }}
      h={{ base: "28px", sm: "unset" }}
      fontSize={{ base: "10px", sm: "md" }}
      onClick={() => {
        navigate("/manage");
      }}
    >
      {t("manage-items")}
    </Button>
  );

  const nextButton = (
    <Button
      onClick={handleNextLevelClick}
      h={{ base: "28px", sm: "unset" }}
      w={{ base: "100%", sm: "280px" }}
      fontSize={{ base: "10px", sm: "md" }}
      variant="secondarySolid"
    >
      {t("next")}
    </Button>
  );

  return (
    <DelayedLoading>
      <Flex
        height="100%"
        width="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        zIndex={2}
      >
        {isSmallScreen && <MobileDecoration />}
        <Flex
          flexDirection="column"
          minW={{ base: "1px", sm: "800px" }}
          maxW="1000px"
          w="100%"
          height="100%"
          pb={{ base: "0px", sm: "65px" }}
          pt={{ base: "25px", sm: "65px" }}
          zIndex={2}
          px={{ base: 0, sm: 6 }}
        >
          <Flex h={{ base: "55px", sm: "70px" }} w="100%">
            <StoreTopBar />
          </Flex>

          <Flex
            flexGrow={1}
            my={{ base: 0, sm: 6 }}
            pt={{ base: 3, sm: 0 }}
            w="100%"
            flexDirection="column"
            gap={{ base: 1.5, sm: 6 }}
            px={{ base: 2, sm: 0 }}
          >
            {distribution?.rows.map((row, rowIndex) => (
              <Flex
                key={rowIndex}
                h={`${row.height}%`}
                w="100%"
                gap={{ base: 1.5, sm: 6 }}
              >
                {row.columns.map((col, colIndex) => (
                  <Flex
                    key={colIndex}
                    w={`${col.width}%`}
                    backgroundColor="rgba(0,0,0,0.5)"
                    boxShadow={{
                      base: "0px 0px 5px rgba(255,255,255,0.5)",
                      sm: "0px 0px 15px rgba(255,255,255,0.5)",
                    }}
                    borderRadius={{ base: "10px", sm: "20px" }}
                    py={{ base: 2, sm: 6 }}
                    px={{ base: 4, sm: 8 }}
                    flexDir={"column"}
                    gap={{ base: 1, sm: 4 }}
                  >
                    <Flex
                      gap={2}
                      alignItems="center"
                      justifyContent={{
                        base:
                          col.id === "specials" ? "space-between" : "center",
                        sm: "space-between",
                      }}
                    >
                      <Flex gap={2} alignItems="center">
                        <Heading fontSize={{ base: "xs", sm: "sm" }}>
                          {t(`titles.${col.id}`)}
                        </Heading>
                        <DefaultInfo title={col.id} />
                      </Flex>
                      {col.id === "specials" && slotsLen != maxSpecialCards && (
                        <Flex gap={isSmallScreen ? 2 : 8} alignItems="center">
                          <PriceBox
                            price={specialSlotItem?.cost ?? 0}
                            purchased={false}
                            discountPrice={specialSlotItem?.discount_cost}
                            absolutePosition={false}
                          />
                          <Button
                            size="xs"
                            fontSize={{ base: "9px", sm: "12px" }}
                            px={{ base: 3, sm: 6 }}
                            borderRadius={7}
                            boxShadow={`0 0 10px 5px ${BLUE}`}
                            onClick={() => {
                              navigate("/preview/slot");
                            }}
                          >
                            {t("unlock-slot")}
                          </Button>
                        </Flex>
                      )}
                    </Flex>
                    {getComponent(col.id, col.doubleRow ?? false)}
                  </Flex>
                ))}
              </Flex>
            ))}
          </Flex>
          {!isSmallScreen && (
            <Flex
              h="60px"
              w="100%"
              justifyContent="center"
              alignItems="center"
              gap={20}
            >
              {manageItemsButton}
              {nextButton}
            </Flex>
          )}
        </Flex>
        {isSmallScreen && (
          <MobileBottomBar
            firstButton={{
              onClick: () => {
                navigate("/manage");
              },
              label: t("manage-items"),
            }}
            secondButton={nextLevelButtonProps}
          />
        )}
        {!isSmallScreen && <PositionedGameDeck inStore />}
      </Flex>
    </DelayedLoading>
  );
};
