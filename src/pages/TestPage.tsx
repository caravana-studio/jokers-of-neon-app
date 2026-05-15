import { Box, Button, Divider, Flex, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateUsername } from "../api/usernames";
import { DelayedLoading } from "../components/DelayedLoading";
import { MenuBtn } from "../components/Menu/Buttons/MenuBtn";
import {
  getMissionTemplateExamples,
  MISSION_PERIOD,
  renderMissionDescription,
} from "../data/dailyMissions";
import { encodeString } from "../dojo/utils/decodeString";
import { DojoEvents } from "../enums/dojoEvents";
import { getDailyMissionCompleteEvent } from "../utils/playEvents/getDailyMissionCompleteEvent";
import { getEventKey } from "../utils/getEventKey";
import { showDailyMissionToast } from "../utils/transactionNotifications";
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
import { formatAddress } from "../utils/starknetAddress";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to save username";
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
  const [showMissionTools, setShowMissionTools] = useState(false);
  const [showUnlockablesList, setShowUnlockablesList] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const address = account?.address ?? "";

  useEffect(() => {
    setUsernameInput(username ?? "");
  }, [username]);

  const triggerShopTierUnlockedScreen = (unlockableId: string) => {
    const testGameId = currentGameId > 0 ? currentGameId : 999999;
    setShopTierUnlockedEvent({
      game_id: testGameId,
      unlock_id: unlockableId,
    });
    navigate(`/shop-tier-unlocked/${testGameId}`);
  };

  const missionExamples = getMissionTemplateExamples();

  const simulateMissionCompletedEvent = (mission: (typeof missionExamples)[number]) => {
    const isWeekly = mission.templateId.startsWith("weekly-");
    const target = mission.target;
    const missionEvent = {
      from_address: "0x0",
      keys: ["0x0", getEventKey(DojoEvents.DAILY_MISSION_COMPLETE)],
      data: [
        "0x0",
        address || "0x0",
        `0x${(isWeekly ? MISSION_PERIOD.WEEKLY : MISSION_PERIOD.DAILY).toString(16)}`,
        "0x3039",
        "0x0",
        encodeString(isWeekly ? "weekly-medium" : "daily-medium"),
        encodeString(mission.templateId),
        "0x2",
        `0x${target.toString(16)}`,
        `0x${target.toString(16)}`,
        `0x${(isWeekly ? 200 : 20).toString(16)}`,
        isWeekly ? "0x0" : "0x3e7",
        "0x0",
      ],
    };
    const parsed = getDailyMissionCompleteEvent([missionEvent]) ?? [];
    showDailyMissionToast(
      parsed.map((event) => ({
        ...event,
        target,
      }))
    );
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
          description="Simulate unified MissionCompletedV2Event"
          label={showMissionTools ? "Mission events (hide)" : "Mission events"}
          onClick={() => setShowMissionTools((prev) => !prev)}
          arrowRight
          width="18px"
        />
        {showMissionTools && (
          <Box pl={8} pt={1}>
            <Flex flexDirection="column" gap={2}>
              <Text fontSize="xs" color="whiteAlpha.700">
                These buttons build a fake unified MissionCompletedV2Event and run it
                through the same parser/toast path used by live transactions.
              </Text>
              <Flex flexDirection="column" gap={1.5}>
                {missionExamples.map((mission) => (
                  <Button
                    key={mission.templateId}
                    variant="secondarySolid"
                    size="sm"
                    justifyContent="flex-start"
                    whiteSpace="normal"
                    minH="34px"
                    onClick={() => simulateMissionCompletedEvent(mission)}
                  >
                    {renderMissionDescription(mission)}
                  </Button>
                ))}
              </Flex>
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
