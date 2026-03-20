import { Flex, Heading, Image, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { BackgroundDecoration } from "../../components/Background";
import { GalaxyBackground } from "../../components/backgrounds/galaxy/GalaxyBackground";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { getShopTierUnlockConfig } from "../../constants/shopTierUnlock";
import { useDojo } from "../../dojo/useDojo";
import { useGameContext } from "../../providers/GameProvider";
import { getPlayerLives } from "../../queries/getPlayerLives";
import { useGameStore } from "../../state/useGameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const ShopTierUnlockedPage = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop-tier-unlocked",
  });
  const { isSmallScreen } = useResponsiveValues();
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { shopTierUnlockedEvent, clearShopTierUnlockedEvent } = useGameStore();
  const [availableLives, setAvailableLives] = useState<number>(0);
  const [skipIntroAnimation, setSkipIntroAnimation] = useState(false);
  const { prepareNewGame, executeCreateGame } = useGameContext();
  const {
    setup: { client },
    account: { account },
  } = useDojo();

  const resolvedGameId = useMemo(
    () => Number(gameId ?? shopTierUnlockedEvent?.game_id ?? 0),
    [gameId, shopTierUnlockedEvent?.game_id]
  );

  const unlockedTierId = shopTierUnlockedEvent?.unlock_id ?? "";
  const unlockConfig = getShopTierUnlockConfig(unlockedTierId);
  const shouldShowRarity = Boolean(unlockConfig?.showRarity && unlockConfig?.rarity);
  const shouldShowNextRunHint = Boolean(
    unlockConfig &&
      !(
        unlockConfig.unlockableId.startsWith("slot_") ||
        unlockConfig.unlockableId.startsWith("play_") ||
        unlockConfig.unlockableId.startsWith("discard_")
      )
  );
  const hasLives = availableLives > 0;

  useEffect(() => {
    if (!unlockConfig && resolvedGameId > 0) {
      console.warn("[unlock-debug] missing unlock config, redirecting to gameover", {
        resolvedGameId,
        unlockedTierId,
        shopTierUnlockedEvent,
      });
      navigate(`/gameover/${resolvedGameId}`, { replace: true });
    }
  }, [navigate, resolvedGameId, unlockConfig, unlockedTierId, shopTierUnlockedEvent]);

  useEffect(() => {
    console.log("[unlock-debug] ShopTierUnlockedPage state", {
      resolvedGameId,
      unlockedTierId,
      hasUnlockConfig: Boolean(unlockConfig),
      unlockConfig,
      shopTierUnlockedEvent,
    });
  }, [resolvedGameId, unlockedTierId, unlockConfig, shopTierUnlockedEvent]);

  useEffect(() => {
    let active = true;

    if (!account?.address) {
      return;
    }

    getPlayerLives(client, { playerAddress: account.address }).then(
      (response) => {
        if (!active || !response.success || !response.data) return;
        setAvailableLives(response.data.available_lives);
      }
    );

    return () => {
      active = false;
    };
  }, [account?.address, client]);

  if (!unlockConfig) return null;

  const unlockedItem = t(`items.${unlockConfig.itemType}`);
  const unlockedRarity = unlockConfig.rarity
    ? t(`rarity.${unlockConfig.rarity}`)
    : "";
  const unlockedDescription = t(
    `unlockable-descriptions.${unlockConfig.unlockableId}`,
    {
    defaultValue: t("description", {
      item: unlockedItem,
      rarity: unlockedRarity,
    }),
  });

  const handleGoHome = () => {
    clearShopTierUnlockedEvent();
    navigate("/my-games", { replace: true });
  };

  const handlePlayAgain = () => {
    clearShopTierUnlockedEvent();
    prepareNewGame();
    executeCreateGame();
    navigate("/entering-tournament", { replace: true });
  };

  const handleSkipIntroAnimation = () => {
    if (!skipIntroAnimation) {
      setSkipIntroAnimation(true);
    }
  };

  const getTransition = (index: number) => ({
    delay: skipIntroAnimation ? 0 : 0.08 + index * 0.2,
    duration: skipIntroAnimation ? 0 : 0.42,
    ease: "easeOut" as const,
  });
  const rarityStep = shouldShowRarity ? 1 : 0;

  return (
    <DelayedLoading ms={0}>
      <BackgroundDecoration hidelogo contentHeight="100%">
        <GalaxyBackground
          opacity={0.8}
          intensity={unlockConfig.intensity}
          filter="saturate(1.2)"
        />
        {isSmallScreen && <MobileDecoration />}

        <Flex
          zIndex={2}
          w="100%"
          h="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          px={{ base: 4, sm: 10, lg: 12 }}
          pt={{ base: 10, sm: 18, lg: 20 }}
          pb={{ base: 2, sm: 4, lg: 4 }}
          textAlign="center"
          onClick={handleSkipIntroAnimation}
        >
          <Flex
            w="100%"
            flexDirection="column"
            alignItems="center"
            flexShrink={0}
            mb={{ base: 3, sm: 6, lg: 8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={getTransition(0)}
            >
              <Text
                fontFamily="Orbitron"
                letterSpacing="0.5em"
                fontSize={{ base: "12px", sm: "26px", lg: "30px" }}
                color="white"
                textTransform="uppercase"
                mb={{ base: 1, sm: 2 }}
              >
                {t("new-item")}
              </Text>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={getTransition(1)}
            >
              <Heading
                fontFamily="Sonara"
                fontSize={{ base: "26px", sm: "52px", lg: "62px" }}
                lineHeight={0.92}
                color="white"
                textTransform="uppercase"
              >
                {t("unlocked")}
              </Heading>
            </motion.div>
          </Flex>

          <Flex
            flex="1"
            minH={0}
            w="100%"
            justifyContent="center"
            alignItems="center"
            py={{ base: 1, sm: 3 }}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
                filter: "drop-shadow(0 0 10px rgba(255,255,255,0.25))",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: [
                  "drop-shadow(0 0 5px rgba(255,255,255,0.25))",
                  "drop-shadow(0 0 20px rgba(255,255,255,0.72))",
                  "drop-shadow(0 0 5px rgba(255,255,255,0.25))",
                ],
              }}
              transition={{
                opacity: getTransition(2),
                y: getTransition(2),
                filter: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: skipIntroAnimation ? 0 : 0.55,
                },
              }}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: skipIntroAnimation ? 0 : 0.65,
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  src={unlockConfig.imagePath}
                  alt={unlockedItem}
                  w="95%"
                  maxW={{ base: "95%", sm: "95%" }}
                  h="100%"
                  maxH="100%"
                  objectFit="contain"
                  filter="none"
                  pointerEvents="none"
                />
              </motion.div>
            </motion.div>
          </Flex>

          <Flex
            w="100%"
            flexDirection="column"
            alignItems="center"
            flexShrink={0}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
                textShadow: "0 0 8px rgba(255,255,255,0.38)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                textShadow: [
                  "0 0 8px rgba(255,255,255,0.38)",
                  "0 0 20px rgba(255,255,255,1)",
                  "0 0 8px rgba(255,255,255,0.38)",
                ],
              }}
              transition={{
                opacity: getTransition(3),
                y: getTransition(3),
                textShadow: {
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: skipIntroAnimation ? 0 : 0.18,
                },
              }}
            >
              <Heading
                fontFamily="Orbitron"
                fontSize={{ base: "34px", sm: "48px", lg: "56px" }}
                lineHeight={1}
                color="white"
                textShadow="inherit"
                textTransform="uppercase"
                mb={1}
              >
                {unlockedItem}
              </Heading>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={getTransition(4)}
            >
              {shouldShowRarity && (
                <Text
                  fontFamily="Oxanium"
                  fontSize={{ base: "13px", sm: "18px", lg: "22px" }}
                  color="whiteAlpha.900"
                  textTransform="uppercase"
                  mb={1}
                >
                  {t("rarity-label", { rarity: unlockedRarity })}
                </Text>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={getTransition(4 + rarityStep)}
            >
              <Text
                maxW={{ base: "300px", sm: "620px" }}
                fontFamily="Oxanium"
                fontSize={{ base: "13px", sm: "18px" }}
                lineHeight={1.2}
                color="white"
                textShadow="0 0 14px rgba(255,255,255,0.2)"
                mb={1}
                mt={3}
              >
                {unlockedDescription}
              </Text>
            </motion.div>

            {shouldShowNextRunHint && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={getTransition(5 + rarityStep)}
              >
                <Text
                  maxW={{ base: "300px", sm: "560px" }}
                  fontFamily="Oxanium"
                  fontSize={{ base: "10px", sm: "13px" }}
                  lineHeight={1.2}
                  color="whiteAlpha.900"
                  textShadow="0 0 12px rgba(255,255,255,0.2)"
                  mb={8}
                >
                  {t("next-run-hint")}
                </Text>
              </motion.div>
            )}
          </Flex>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={getTransition(6 + rarityStep)}
            style={{ width: "100%" }}
          >
            <MobileBottomBar
              firstButton={
                hasLives
                  ? {
                      onClick: handleGoHome,
                      label: t("go-home-btn"),
                      variant: "secondarySolid",
                    }
                  : {
                      onClick: handleGoHome,
                      label: t("continue-btn"),
                    }
              }
              secondButton={
                hasLives
                  ? {
                      onClick: handlePlayAgain,
                      label: t("play-again-btn"),
                      variant: "solid",
                    }
                  : undefined
              }
            />
          </motion.div>
        </Flex>
      </BackgroundDecoration>
    </DelayedLoading>
  );
};
