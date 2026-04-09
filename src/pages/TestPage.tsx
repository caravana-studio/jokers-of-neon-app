import { Box, Divider, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DelayedLoading } from "../components/DelayedLoading";
import { MenuBtn } from "../components/Menu/Buttons/MenuBtn";
import {
  getShopTierUnlockConfig,
  SHOP_TIER_UNLOCK_IDS,
} from "../constants/shopTierUnlock";
import { MobileDecoration } from "../components/MobileDecoration";
import { Icons } from "../constants/icons";
import { useGameStore } from "../state/useGameStore";
import { useResponsiveValues } from "../theme/responsiveSettings";

export const TestPage = () => {
  const { isSmallScreen } = useResponsiveValues();
  const navigate = useNavigate();
  const { id: currentGameId, setShopTierUnlockedEvent } = useGameStore();
  const [showUnlockablesList, setShowUnlockablesList] = useState(false);

  const triggerShopTierUnlockedScreen = (unlockableId: string) => {
    const testGameId = currentGameId > 0 ? currentGameId : 999999;
    setShopTierUnlockedEvent({
      game_id: testGameId,
      unlock_id: unlockableId,
    });
    navigate(`/shop-tier-unlocked/${testGameId}`);
  };

  const getUnlockableTestLabel = (unlockableId: string) => {
    const config = getShopTierUnlockConfig(unlockableId);
    if (!config) return unlockableId;

    const itemName = config.itemType.replaceAll("-", " ");
    const rarityLabel = config.rarity ? ` (${config.rarity.toUpperCase()})` : "";
    return `${config.unlockableId} · ${itemName}${rarityLabel}`;
  };

  return (
    <DelayedLoading ms={0}>
      <MobileDecoration />
      <Flex
        m={4}
        flexDirection="column"
        gap={2}
        w="100%"
        color="white"
        h="100%"
        minH={0}
        overflowY="auto"
        pr={2}
      >
        {isSmallScreen && <Divider borderColor="white" borderWidth="1px" my={2} />}
        <MenuBtn
          icon={Icons.STORE}
          description="Simulate pack opening (API)"
          label="Simulate Packs"
          onClick={() => navigate("/test/simulate-packs")}
          arrowRight
          width="18px"
        />
        {isSmallScreen && <Divider borderColor="white" borderWidth="1px" my={2} />}
        <MenuBtn
          icon={Icons.ROUND}
          description="Practice play simulation"
          label="Practice"
          onClick={() => navigate("/practice")}
          arrowRight
          width="18px"
        />
        {isSmallScreen && <Divider borderColor="white" borderWidth="1px" my={2} />}
        <MenuBtn
          icon={Icons.LIST}
          description="Vibration"
          label="Vibration"
          onClick={() => navigate("/vibration")}
          arrowRight
          width="18px"
        />
        {isSmallScreen && <Divider borderColor="white" borderWidth="1px" my={2} />}
        <MenuBtn
          icon={Icons.LIST}
          description="Season progression"
          label="Season progression"
          onClick={() => navigate("/season")}
          arrowRight
          width="18px"
        />
        {isSmallScreen && <Divider borderColor="white" borderWidth="1px" my={2} />}
        <MenuBtn
          icon={Icons.LIST}
          description="Shop"
          label="Shop"
          onClick={() => navigate("/shop")}
          arrowRight
          width="18px"
        />
        {isSmallScreen && <Divider borderColor="white" borderWidth="1px" my={2} />}
        <MenuBtn
          icon={Icons.LIST}
          description="Referral"
          label="Referral"
          onClick={() => navigate("/referral")}
          arrowRight
          width="18px"
        />
        {isSmallScreen && <Divider borderColor="white" borderWidth="1px" my={2} />}
        <MenuBtn
          icon={Icons.TOURNAMENT}
          description="Tournament"
          label="Tournament"
          onClick={() => navigate("/tournament")}
          arrowRight
          width="18px"
        />
        {isSmallScreen && <Divider borderColor="white" borderWidth="1px" my={2} />}
        <MenuBtn
          icon={Icons.SHOP}
          description="Toggle shop unlockables list"
          label={
            showUnlockablesList
              ? "Shop unlockables (hide)"
              : "Shop unlockables (show)"
          }
          onClick={() => setShowUnlockablesList((prev) => !prev)}
          arrowRight
          width="18px"
        />
        {showUnlockablesList && (
          <Box pl={8} pt={1}>
            <Flex flexDirection="column" gap={1.5}>
              {SHOP_TIER_UNLOCK_IDS.map((unlockableId) => (
                <MenuBtn
                  key={unlockableId}
                  icon={Icons.SHOP}
                  description={`Trigger unlockable ${unlockableId}`}
                  label={getUnlockableTestLabel(unlockableId)}
                  onClick={() => triggerShopTierUnlockedScreen(unlockableId)}
                  arrowRight
                  width="14px"
                />
              ))}
            </Flex>
          </Box>
        )}
        {isSmallScreen && <Divider borderColor="white" borderWidth="1px" my={2} />}
      </Flex>
    </DelayedLoading>
  );
};
