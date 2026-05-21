import { Box, Button, Divider, Flex, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStreakStatus, StreakStatusApiData } from "../api/profile";
import { validateUsername } from "../api/usernames";
import {
  fetchUsernameByAddress,
  fetchUsernameByUsername,
  UsernameRecord,
} from "../api/usernames";
import { DelayedLoading } from "../components/DelayedLoading";
import { MenuBtn } from "../components/Menu/Buttons/MenuBtn";
import {
  getShopTierUnlockConfig,
  SHOP_TIER_UNLOCK_IDS,
} from "../constants/shopTierUnlock";
import { MobileDecoration } from "../components/MobileDecoration";
import { Icons } from "../constants/icons";
import { useDojo } from "../dojo/DojoContext";
import { useUsername } from "../dojo/utils/useUsername";
import { useCustomToast } from "../hooks/useCustomToast";
import { useGameStore } from "../state/useGameStore";
import { useUsernameStore } from "../state/useUsernameStore";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { formatAddress, normalizeStarknetAddress } from "../utils/starknetAddress";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to save username";
}

type StreakLookupResult = {
  address: string;
  username: string | null;
  status: StreakStatusApiData;
};

function isStarknetAddress(value: string): boolean {
  return /^0x[0-9a-fA-F]+$/.test(value.trim());
}

function getStreakStateLabel(status: StreakStatusApiData): string {
  if (status.currentStreak <= 0) return "Not started";
  if (status.isBroken) return "Broken";
  if (status.isProtected) return "Protected";
  if (status.daysMissed > 0) return "At risk";
  return "Active";
}

export const TestPage = () => {
  const { isSmallScreen } = useResponsiveValues();
  const navigate = useNavigate();
  const {
    account: { account },
  } = useDojo();
  const username = useUsername();
  const usernameStatus = useUsernameStore((store) => store.status);
  const usernameError = useUsernameStore((store) => store.error);
  const createUsernameForAddress = useUsernameStore(
    (store) => store.createUsernameForAddress
  );
  const updateUsernameForAddress = useUsernameStore(
    (store) => store.updateUsernameForAddress
  );
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const { id: currentGameId, setShopTierUnlockedEvent } = useGameStore();
  const [showUsernameTools, setShowUsernameTools] = useState(false);
  const [showUnlockablesList, setShowUnlockablesList] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [showStreakTools, setShowStreakTools] = useState(false);
  const [streakLookupInput, setStreakLookupInput] = useState("");
  const [streakLookupResult, setStreakLookupResult] =
    useState<StreakLookupResult | null>(null);
  const [streakLookupError, setStreakLookupError] = useState<string | null>(null);
  const [isLoadingStreak, setIsLoadingStreak] = useState(false);
  const address = account?.address ?? "";

  useEffect(() => {
    setUsernameInput(username ?? "");
  }, [username]);

  useEffect(() => {
    setStreakLookupInput((current) => current || username || address);
  }, [address, username]);

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

  const handleSaveUsername = async () => {
    if (!address) {
      showErrorToast("No connected wallet");
      return;
    }

    setIsSavingUsername(true);
    try {
      const nextUsername = validateUsername(usernameInput);
      const record = username
        ? await updateUsernameForAddress(address, nextUsername)
        : await createUsernameForAddress(address, nextUsername);
      setUsernameInput(record.username);
      showSuccessToast("Username saved");
    } catch (error) {
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsSavingUsername(false);
    }
  };

  const resolveStreakLookupTarget = async (
    value: string
  ): Promise<{ address: string; username: string | null }> => {
    const input = value.trim();
    if (!input) {
      throw new Error("Enter a username or wallet address");
    }

    if (isStarknetAddress(input)) {
      const normalizedAddress = normalizeStarknetAddress(input);
      let record: UsernameRecord | null = null;
      try {
        record = await fetchUsernameByAddress(normalizedAddress);
      } catch {
        record = null;
      }

      return {
        address: normalizedAddress,
        username: record?.username ?? null,
      };
    }

    const record = await fetchUsernameByUsername(input);
    if (!record) {
      throw new Error(`Username "${input}" was not found`);
    }

    return {
      address: normalizeStarknetAddress(record.address),
      username: record.username,
    };
  };

  const handleLookupStreak = async () => {
    setIsLoadingStreak(true);
    setStreakLookupError(null);

    try {
      const target = await resolveStreakLookupTarget(streakLookupInput);
      const status = await fetchStreakStatus(target.address);
      setStreakLookupResult({
        ...target,
        status,
      });
    } catch (error) {
      setStreakLookupResult(null);
      setStreakLookupError(getErrorMessage(error));
    } finally {
      setIsLoadingStreak(false);
    }
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
          icon={Icons.LIST}
          description="View and set username"
          label={showUsernameTools ? "Username (hide)" : "Username"}
          onClick={() => setShowUsernameTools((prev) => !prev)}
          arrowRight
          width="18px"
        />
        {showUsernameTools && (
          <Box pl={8} pt={1}>
            <Flex flexDirection="column" gap={2}>
              <Flex justifyContent="space-between" gap={3}>
                <Text fontSize="sm" color="whiteAlpha.700">
                  Address
                </Text>
                <Text fontSize="sm" textAlign="right">
                  {address ? formatAddress(address, 6) : "Not connected"}
                </Text>
              </Flex>
              <Flex justifyContent="space-between" gap={3}>
                <Text fontSize="sm" color="whiteAlpha.700">
                  Username
                </Text>
                <Text fontSize="sm" textAlign="right">
                  {username ?? "Missing"}
                </Text>
              </Flex>
              <Flex justifyContent="space-between" gap={3}>
                <Text fontSize="sm" color="whiteAlpha.700">
                  Status
                </Text>
                <Text fontSize="sm" textAlign="right">
                  {usernameStatus}
                </Text>
              </Flex>
              {usernameError && (
                <Text fontSize="xs" color="red.300">
                  {usernameError}
                </Text>
              )}
              <Flex gap={2}>
                <Input
                  value={usernameInput}
                  maxLength={15}
                  placeholder="Username"
                  onChange={(event) =>
                    setUsernameInput(event.target.value.trim())
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void handleSaveUsername();
                    }
                  }}
                />
                <Button
                  variant="secondarySolid"
                  minW="92px"
                  isLoading={isSavingUsername}
                  isDisabled={!address}
                  onClick={handleSaveUsername}
                >
                  {username ? "Update" : "Create"}
                </Button>
              </Flex>
            </Flex>
          </Box>
        )}
        {isSmallScreen && <Divider borderColor="white" borderWidth="1px" my={2} />}
        <MenuBtn
          icon={Icons.LIST}
          description="View a player's daily streak"
          label={showStreakTools ? "Streak lookup (hide)" : "Streak lookup"}
          onClick={() => setShowStreakTools((prev) => !prev)}
          arrowRight
          width="18px"
        />
        {showStreakTools && (
          <Box pl={8} pt={1}>
            <Flex flexDirection="column" gap={2}>
              <Text fontSize="xs" color="whiteAlpha.700">
                Search by username or Starknet address. This reads confirmed profile data.
              </Text>
              <Flex gap={2}>
                <Input
                  value={streakLookupInput}
                  placeholder="Username or address"
                  onChange={(event) => setStreakLookupInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void handleLookupStreak();
                    }
                  }}
                />
                <Button
                  variant="secondarySolid"
                  minW="92px"
                  isLoading={isLoadingStreak}
                  onClick={handleLookupStreak}
                >
                  View
                </Button>
              </Flex>
              {streakLookupError && (
                <Text fontSize="xs" color="red.300">
                  {streakLookupError}
                </Text>
              )}
              {streakLookupResult && (
                <Box
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  borderRadius="8px"
                  p={3}
                >
                  <Flex flexDirection="column" gap={1.5}>
                    <Flex justifyContent="space-between" gap={3}>
                      <Text fontSize="sm" color="whiteAlpha.700">
                        User
                      </Text>
                      <Text fontSize="sm" textAlign="right">
                        {streakLookupResult.username ?? "No username"}
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between" gap={3}>
                      <Text fontSize="sm" color="whiteAlpha.700">
                        Address
                      </Text>
                      <Text fontSize="sm" textAlign="right">
                        {formatAddress(streakLookupResult.address, 6)}
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between" gap={3}>
                      <Text fontSize="sm" color="whiteAlpha.700">
                        Current streak
                      </Text>
                      <Text fontSize="sm" textAlign="right">
                        {streakLookupResult.status.currentStreak} days
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between" gap={3}>
                      <Text fontSize="sm" color="whiteAlpha.700">
                        Effective streak
                      </Text>
                      <Text fontSize="sm" textAlign="right">
                        {streakLookupResult.status.effectiveStreak} days
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between" gap={3}>
                      <Text fontSize="sm" color="whiteAlpha.700">
                        Longest streak
                      </Text>
                      <Text fontSize="sm" textAlign="right">
                        {streakLookupResult.status.longestStreak} days
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between" gap={3}>
                      <Text fontSize="sm" color="whiteAlpha.700">
                        Protectors
                      </Text>
                      <Text fontSize="sm" textAlign="right">
                        {streakLookupResult.status.protectorsAvailable}
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between" gap={3}>
                      <Text fontSize="sm" color="whiteAlpha.700">
                        Missed days
                      </Text>
                      <Text fontSize="sm" textAlign="right">
                        {streakLookupResult.status.daysMissed}
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between" gap={3}>
                      <Text fontSize="sm" color="whiteAlpha.700">
                        Last completed day
                      </Text>
                      <Text fontSize="sm" textAlign="right">
                        {streakLookupResult.status.lastCompletedDay || "None"}
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between" gap={3}>
                      <Text fontSize="sm" color="whiteAlpha.700">
                        State
                      </Text>
                      <Text fontSize="sm" textAlign="right">
                        {getStreakStateLabel(streakLookupResult.status)}
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between" gap={3}>
                      <Text fontSize="sm" color="whiteAlpha.700">
                        Sync
                      </Text>
                      <Text fontSize="sm" textAlign="right">
                        {streakLookupResult.status.syncStatus} · {streakLookupResult.status.source}
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              )}
            </Flex>
          </Box>
        )}
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
