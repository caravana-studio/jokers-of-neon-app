import { Box, Button, Divider, Flex, Input, Select, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateUsername } from "../api/usernames";
import { DelayedLoading } from "../components/DelayedLoading";
import { MenuBtn } from "../components/Menu/Buttons/MenuBtn";
import {
  isMissionTemplateAvailableForDifficulty,
  MISSION_TEMPLATE_IDS,
  renderMissionTemplatePlaceholder,
} from "../data/dailyMissions";
import { encodeString } from "../dojo/utils/decodeString";
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
    setup: { client },
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
  const [missionPeriod, setMissionPeriod] = useState<"daily" | "weekly">("daily");
  const [missionDifficulty, setMissionDifficulty] = useState(1);
  const [selectedMissionTemplate, setSelectedMissionTemplate] = useState("daily-play-hand");
  const [usernameInput, setUsernameInput] = useState("");
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [isSettingMission, setIsSettingMission] = useState(false);
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

  const missionTemplates = MISSION_TEMPLATE_IDS.filter(
    (templateId) =>
      templateId.startsWith(`${missionPeriod}-`) &&
      isMissionTemplateAvailableForDifficulty(templateId, missionDifficulty),
  );
  const dailyMissionTemplateCount = MISSION_TEMPLATE_IDS.filter(
    (templateId) =>
      templateId.startsWith("daily-") &&
      isMissionTemplateAvailableForDifficulty(templateId, missionDifficulty),
  ).length;
  const weeklyMissionTemplateCount = MISSION_TEMPLATE_IDS.filter(
    (templateId) =>
      templateId.startsWith("weekly-") &&
      isMissionTemplateAvailableForDifficulty(templateId, missionDifficulty),
  ).length;

  useEffect(() => {
    const selectedMissionAvailable = missionTemplates.some(
      (templateId) => templateId === selectedMissionTemplate,
    );
    if (!selectedMissionAvailable) {
      setSelectedMissionTemplate(missionTemplates[0] ?? "");
    }
  }, [missionTemplates, selectedMissionTemplate]);

  const setMissionSlot = async () => {
    if (!account) {
      showErrorToast("No connected wallet");
      return;
    }
    if (!selectedMissionTemplate) {
      showErrorToast("Select a mission template");
      return;
    }

    setIsSettingMission(true);
    try {
      const templateFelt = encodeString(selectedMissionTemplate);
      if (missionPeriod === "weekly") {
        await client.daily_missions_system.setThisWeekMission(
          account,
          missionDifficulty,
          templateFelt
        );
      } else {
        await client.daily_missions_system.setTodayMission(
          account,
          missionDifficulty,
          templateFelt
        );
      }
      showSuccessToast("Mission slot updated");
    } catch (error) {
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsSettingMission(false);
    }
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
          description="Set daily and weekly mission slots"
          label={showMissionTools ? "Mission slots (hide)" : "Mission slots"}
          onClick={() => setShowMissionTools((prev) => !prev)}
          arrowRight
          width="18px"
        />
        {showMissionTools && (
          <Box pl={8} pt={1}>
            <Flex flexDirection="column" gap={2}>
              <Text fontSize="xs" color="whiteAlpha.700">
                Choose a mission template and write it to the active daily or
                weekly slot for this environment.
              </Text>
              <Flex gap={2}>
                <Select
                  value={missionPeriod}
                  onChange={(event) =>
                    setMissionPeriod(event.target.value as "daily" | "weekly")
                  }
                >
                  <option value="daily">Daily ({dailyMissionTemplateCount})</option>
                  <option value="weekly">Weekly ({weeklyMissionTemplateCount})</option>
                </Select>
                <Select
                  value={missionDifficulty}
                  onChange={(event) =>
                    setMissionDifficulty(Number(event.target.value))
                  }
                >
                  <option value={1}>Easy</option>
                  <option value={2}>Medium</option>
                  <option value={3}>Hard</option>
                </Select>
              </Flex>
              <Select
                value={selectedMissionTemplate}
                onChange={(event) => setSelectedMissionTemplate(event.target.value)}
              >
                {missionTemplates.map((templateId) => (
                  <option key={templateId} value={templateId}>
                    {renderMissionTemplatePlaceholder(templateId, missionDifficulty)} · {templateId}
                  </option>
                ))}
              </Select>
              <Button
                variant="secondarySolid"
                size="sm"
                isLoading={isSettingMission}
                isDisabled={!account || !selectedMissionTemplate}
                onClick={setMissionSlot}
              >
                Set mission
              </Button>
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
