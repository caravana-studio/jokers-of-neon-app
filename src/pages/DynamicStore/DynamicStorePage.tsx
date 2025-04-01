import { Button, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DefaultInfo } from "../../components/Info/DefaultInfo";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { PositionedGameDeck } from "../../components/PositionedGameDeck";
import { useShopActions } from "../../dojo/useShopActions";
import { useGameContext } from "../../providers/GameProvider";
import { useStore } from "../../providers/StoreProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { PowerUp } from "../../types/PowerUp";
import { getComponent } from "./storeComponents/getComponent";
import { storesConfig } from "./storesConfig";
import { StoreTopBar } from "./storeComponents/TopBar/StoreTopBar";

export const DynamicStorePage = () => {
  const { t } = useTranslation("store", { keyPrefix: "store.dynamic" });
  const store = storesConfig.find((s) => s.id === "deck");
  const { isSmallScreen } = useResponsiveValues();

  const distribution =
    store?.distribution[isSmallScreen ? "mobile" : "desktop"];
  const navigate = useNavigate();
  const {
    setDestroyedSpecialCardId,
    onShopSkip,
    setHand,
    gameId,
    setPowerUps,
    maxPowerUpSlots,
  } = useGameContext();
  const { skipShop } = useShopActions();

  const { locked, setLoading } = useStore();

  const handleNextLevelClick = () => {
    setLoading(true);
    onShopSkip();
    skipShop(gameId).then((response): void => {
      if (response.success) {
        setHand(response.cards);

        const powerUps: (PowerUp | null)[] = response.powerUps;
        while (powerUps.length < maxPowerUpSlots) {
          powerUps.push(null);
        }
        setPowerUps(powerUps);

        response.destroyedSpecialCard &&
          setDestroyedSpecialCardId(response.destroyedSpecialCard);
        navigate("/redirect/demo");
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
          gap={{ base: 1.5, sm: 8 }}
          px={{ base: 2, sm: 0 }}
        >
          {distribution?.rows.map((row, rowIndex) => (
            <Flex
              key={rowIndex}
              h={`${row.height}%`}
              w="100%"
              gap={{ base: 1.5, sm: 8 }}
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
                    justifyContent={{ base: "center", sm: "flex-start" }}
                  >
                    <Heading fontSize={{ base: "xs", sm: "sm" }}>
                      {t(`titles.${col.id}`)}
                    </Heading>
                    <DefaultInfo title={col.id} />
                  </Flex>
                  {getComponent(col.id)}
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
          firstButton={manageItemsButton}
          secondButton={nextButton}
        />
      )}
      {!isSmallScreen && <PositionedGameDeck inStore />}
    </Flex>
  );
};
