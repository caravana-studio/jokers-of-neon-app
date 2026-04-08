import { Button, Flex, Heading } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Joyride from "react-joyride";
import { useNavigate } from "react-router-dom";
import { DelayedLoading } from "../../components/DelayedLoading";
import { DefaultInfo } from "../../components/Info/DefaultInfo";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { PositionedGameDeck } from "../../components/PositionedGameDeck";
import { PriceBox } from "../../components/PriceBox";
import {
  TUTORIAL_FLOATER_PROPS,
  TUTORIAL_STYLE,
} from "../../constants/gameTutorial";
import { GameStateEnum } from "../../dojo/typescript/custom";
import { useShopActions } from "../../dojo/useShopActions";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { useProgressiveShopTutorial } from "../../hooks/useProgressiveShopTutorial";
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
  const {
    specialSlotItem,
    loadedItems,
    commonCards,
    modifierCards,
    specialCards,
    packs,
    pokerHandItems,
    powerUps,
    burnItem,
  } = useShopStore();
  const { shopId } = useGameStore();
  const store = storesConfig.find(
    (s) => s.id === SHOP_ID_MAP[shopId as keyof typeof SHOP_ID_MAP]
  );

  useEffect(() => {
    logEvent("open_dynamic_store_page", { shop_id: shopId });
  }, [shopId]);

  const { isSmallScreen } = useResponsiveValues();
  const {
    run: runShopTutorial,
    steps: shopTutorialSteps,
    locale: shopTutorialLocale,
    handleCallback: onShopTutorialCallback,
  } = useProgressiveShopTutorial({
    canStart: loadedItems,
  });

  const distribution =
    store?.distribution[isSmallScreen ? "mobile" : "desktop"];
  const sectionAvailability = useMemo(
    () => ({
      traditionals: commonCards.length > 0,
      modifiers: modifierCards.length > 0,
      specials: specialCards.length > 0,
      "loot-boxes": packs.length > 0,
      "level-up-table": pokerHandItems.length > 0,
      "power-ups": powerUps.length > 0,
      burn: Boolean(burnItem && Number(burnItem.cost) > 0),
    }),
    [
      burnItem,
      commonCards.length,
      modifierCards.length,
      packs.length,
      pokerHandItems.length,
      powerUps.length,
      specialCards.length,
    ]
  );

  const resolvedDistribution = useMemo(() => {
    if (!distribution) return undefined;
    if (!loadedItems) return distribution;

    const isColumnAvailable = (id: string) =>
      sectionAvailability[id as keyof typeof sectionAvailability] ?? true;

    const availableColumns = distribution.rows
      .flatMap((row) => row.columns)
      .filter((col) => isColumnAvailable(col.id))
      .filter(
        (col, index, self) => self.findIndex((c) => c.id === col.id) === index
      );

    if (!availableColumns.length) {
      return distribution;
    }

    if (availableColumns.length === 1) {
      return {
        rows: [
          {
            height: 100,
            columns: [
              {
                id: availableColumns[0].id,
                width: 100,
              },
            ],
          },
        ],
      };
    }

    if (
      (store?.id === "deck" || store?.id === "mix") &&
      availableColumns.length === 2
    ) {
      return {
        rows: availableColumns.map((col) => ({
          height: 50,
          columns: [
            {
              id: col.id,
              width: 100,
            },
          ],
        })),
      };
    }

    const filteredRows = distribution.rows
      .map((row) => ({
        ...row,
        columns: row.columns.filter((col) => isColumnAvailable(col.id)),
      }))
      .filter((row) => row.columns.length > 0);

    if (!filteredRows.length) {
      return distribution;
    }

    const totalHeight = filteredRows.reduce((sum, row) => sum + row.height, 0);

    return {
      rows: filteredRows.map((row) => {
        const totalWidth = row.columns.reduce((sum, col) => sum + col.width, 0);
        return {
          ...row,
          height: totalHeight > 0 ? (row.height / totalHeight) * 100 : row.height,
          columns: row.columns.map((col) => ({
            ...col,
            width: totalWidth > 0 ? (col.width / totalWidth) * 100 : col.width,
          })),
        };
      }),
    };
  }, [distribution, loadedItems, sectionAvailability, store?.id]);
  const navigate = useNavigate();
  const customNavigate = useCustomNavigate();
  const { onShopSkip } = useGameContext();
  const { specialSlots, maxSpecialCards, id: gameId } = useGameStore();
  const slotsLen = specialSlots;

  const { skipShop } = useShopActions();

  const { nextLevelButtonProps } = useNextLevelButton();

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
      className="progressive-shop-next-button"
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
      <Joyride
        steps={shopTutorialSteps}
        run={runShopTutorial}
        continuous
        showProgress={false}
        callback={onShopTutorialCallback}
        styles={TUTORIAL_STYLE}
        floaterProps={TUTORIAL_FLOATER_PROPS}
        locale={shopTutorialLocale}
        disableCloseOnEsc
        disableOverlayClose
        hideCloseButton
        spotlightClicks={false}
        disableScrolling
      />
      <Flex
        className="shop-tutorial-root"
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
            {resolvedDistribution?.rows.map((row, rowIndex) => (
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
            secondButton={{
              ...nextLevelButtonProps,
              className: "progressive-shop-next-button",
            }}
          />
        )}
        {!isSmallScreen && <PositionedGameDeck inStore />}
      </Flex>
    </DelayedLoading>
  );
};
