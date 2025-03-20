import { Button, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DefaultInfo } from "../../components/Info/DefaultInfo";
import { PositionedGameDeck } from "../../components/PositionedGameDeck";
import { useShopActions } from "../../dojo/useShopActions";
import { useGameContext } from "../../providers/GameProvider";
import { useStore } from "../../providers/StoreProvider";
import { PowerUp } from "../../types/PowerUp";
import { storesConfig } from "./storesConfig";
import { getComponent } from "./storeComponents/getComponent";

export const DynamicStorePage = () => {
  const { t } = useTranslation("store", { keyPrefix: "store.dynamic" });
  const store = storesConfig.find((s) => s.id === "deck");
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

  return (
    <Flex
      height="100%"
      width="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      zIndex={2}
    >
      <Flex
        flexDirection="column"
        minW="800px"
        maxW="1000px"
        w="100%"
        height="100%"
        py="65px"
        zIndex={2}
        px={6}
      >
        <Flex backgroundColor="blue" h="70px" w="100%">
          TopBar
        </Flex>
        <Flex flexGrow={1} my={6} w="100%" flexDirection="column" gap={8}>
          {store?.distribution.rows.map((row, rowIndex) => (
            <Flex key={rowIndex} h={`${row.height}%`} w="100%" gap={8}>
              {row.columns.map((col, colIndex) => (
                <Flex
                  key={colIndex}
                  w={`${col.width}%`}
                  backgroundColor="rgba(0,0,0,0.5)"
                  boxShadow={"0px 0px 15px rgba(255,255,255,0.5)"}
                  borderRadius="20px"
                  py={6}
                  px={8}
                  flexDir={"column"}
                  gap={4}
                >
                  <Flex gap={2} alignItems="center">
                    <Heading size="sm">{t(`titles.${col.id}`)}</Heading>
                    <DefaultInfo title={col.id} />
                  </Flex>
                  {getComponent(col.id)}
                </Flex>
              ))}
            </Flex>
          ))}
        </Flex>
        <Flex
          h="60px"
          w="100%"
          justifyContent="center"
          alignItems="center"
          gap={20}
        >
          <Button
            w="280px"
            onClick={() => {
              navigate("/manage");
            }}
          >
            {t("manage-items")}
          </Button>
          <Button
            onClick={handleNextLevelClick}
            w="280px"
            variant="secondarySolid"
          >
            {t("next")}
          </Button>
        </Flex>
      </Flex>
      <PositionedGameDeck inStore />
    </Flex>
  );
};
