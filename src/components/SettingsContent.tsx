import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
  Text,
} from "@chakra-ui/react";

import { AppLauncher } from "@capacitor/app-launcher";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdArrowDropDown, MdGraphicEq } from "react-icons/md";
import { languageMap } from "../constants/language";
import {
  animationSpeedLabels,
  lootboxTransitionLabels,
} from "../constants/settingsLabels";
import { useDojo } from "../dojo/DojoContext";
import { Speed } from "../enums/settings";
import { useSettings } from "../providers/SettingsProvider";
import { NEON_PINK } from "../theme/colors";
import { registerPushNotifications } from "../utils/notifications/registerPushNotifications";
import AudioPlayer from "./AudioPlayer";
import { Version } from "./version/Version";

export const SettingsContent = () => {
  const {
    sfxVolume,
    setSfxVolume,
    sfxOn,
    setSfxOn,
    animationSpeed,
    setAnimationSpeed,
    lootboxTransition,
    setLootboxTransition,
    musicVolume,
    setMusicVolume,
    musicOn,
    language,
    setLanguage,
    pushDailyMissionsEnabled,
    setPushDailyMissionsEnabled,
    pushRemindersEnabled,
    setPushRemindersEnabled,
    pushEventsEnabled,
    setPushEventsEnabled,
    pushDailyPacksEnabled,
    setPushDailyPacksEnabled,
    timezone,
    setTimezone,
  } = useSettings();

  const { t } = useTranslation(["game"], { keyPrefix: "settings-modal" });

  const languageLbl = t("language");
  const sfxLbl = t("sfx-volume");
  const musicLbl = t("music-volume");
  const animSpeedLbl = t("anim-speed");
  const lootboxTransitionLbl = t("loot-box-transition");
  const pushNotificationsLbl = t("push-notifications");
  const pushDailyMissionsLbl = t("push-daily-missions");
  const pushRemindersLbl = t("push-reminders");
  const pushEventsLbl = t("push-events");
  const pushDailyPacksLbl = t("push-daily-packs");
  const timezoneLbl = t("timezone");
  const enableNotificationsLbl = t("enable-notifications");
  const androidNotificationsHelpLbl = t("android-notifications-help");

  const changeLanguage = (lng: string) => {
    setLanguage(lng);
  };

  const { setup } = useDojo();

  const selectedLanguage = languageMap[language] ? language : "en";
  const [pushPermission, setPushPermission] = useState<string | null>(null);
  const [pushPermissionLoading, setPushPermissionLoading] = useState(false);
  const isPushSupported =
    !setup.useBurnerAcc &&
    Capacitor.isNativePlatform() &&
    Capacitor.isPluginAvailable("PushNotifications");
  const platform = Capacitor.getPlatform();
  const isIOS = platform === "ios";
  const isAndroid = platform === "android";

  const timezoneOptions = useMemo(() => {
    const hasIntl =
      typeof Intl !== "undefined" &&
      "supportedValuesOf" in Intl &&
      typeof (Intl as any).supportedValuesOf === "function";
    const options = hasIntl
      ? ((Intl as any).supportedValuesOf("timeZone") as string[])
      : ["UTC"];
    const unique = new Set(options);
    if (timezone && !unique.has(timezone)) {
      unique.add(timezone);
    }
    return Array.from(unique);
  }, [timezone]);

  const refreshPushPermission = useCallback(async () => {
    if (!isPushSupported) return;
    try {
      const status = await PushNotifications.checkPermissions();
      setPushPermission(status.receive);
    } catch {
      setPushPermission(null);
    }
  }, [isPushSupported]);

  useEffect(() => {
    refreshPushPermission();
  }, [refreshPushPermission]);

  const openAppSettings = useCallback(async () => {
    try {
      const result = await AppLauncher.openUrl({ url: "app-settings:" });
      return result.completed;
    } catch {
      return false;
    }
  }, []);

  const handleEnableNotifications = useCallback(async () => {
    if (!isPushSupported) return;
    setPushPermissionLoading(true);
    try {
      const status = await PushNotifications.checkPermissions();
      if (status.receive === "denied") {
        const didOpen = await openAppSettings();
        if (!didOpen) {
          await PushNotifications.requestPermissions();
        }
      } else {
        await registerPushNotifications();
      }
    } finally {
      setPushPermissionLoading(false);
      refreshPushPermission();
    }
  }, [isPushSupported, openAppSettings, refreshPushPermission]);

  const shouldShowEnableNotifications =
    isPushSupported && isIOS && pushPermission !== "granted";
  const shouldShowAndroidNotice =
    isPushSupported && isAndroid && pushPermission !== "granted";

  return (
    <Flex gap={4} flexDirection="column" w="85%" alignSelf="center">
      <Flex gap={2} alignItems={"center"}>
        <Text size={"md"} width={"50%"}>
          {languageLbl}
        </Text>
        <Menu variant={"menuSettingsOutline"}>
          <MenuButton width={"100%"}>
            <Flex alignItems="center" gap={2}>
              <MdArrowDropDown /> {languageMap[selectedLanguage]}
            </Flex>
          </MenuButton>
          <MenuList zIndex={10000}>
            {Object.keys(languageMap).map((languageKey) => {
              return (
                <MenuItem onClick={() => changeLanguage(languageKey)}>
                  {languageMap[languageKey]}
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text size="md" width={"50%"}>
          {timezoneLbl}
        </Text>
        <Menu variant={"menuSettingsOutline"}>
          <MenuButton width={"100%"}>
            <Flex alignItems="center" gap={2}>
              <MdArrowDropDown /> {timezone}
            </Flex>
          </MenuButton>
          <MenuList zIndex={10000} maxH="300px" overflowY="auto">
            {timezoneOptions.map((tz) => {
              return (
                <MenuItem key={tz} onClick={() => setTimezone(tz)}>
                  {tz}
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text size="md" width={"50%"}>
          {sfxLbl}
        </Text>
        <AudioPlayer
          sx={{
            position: "relative",
            bottom: "auto",
            left: "auto",
            paddingLeft: "8px",
            paddingRight: "8px",
          }}
          isEnabled={sfxOn}
          onClick={() => setSfxOn(!sfxOn)}
        />
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={sfxVolume}
          onChange={(value) => setSfxVolume(value)}
          isDisabled={!sfxOn}
        >
          <SliderTrack>
            <SliderFilledTrack bg={NEON_PINK} />
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Box color={NEON_PINK} as={MdGraphicEq} />
          </SliderThumb>
        </Slider>
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text size="md" width={"50%"}>
          {musicLbl}
        </Text>
        <AudioPlayer
          sx={{
            position: "relative",
            bottom: "auto",
            left: "auto",
            paddingLeft: "8px",
            paddingRight: "8px",
          }}
        />
        <Slider
          min={0}
          max={0.4}
          step={0.01}
          value={musicVolume}
          isDisabled={!musicOn}
          onChange={(value) => setMusicVolume(value)}
        >
          <SliderTrack>
            <SliderFilledTrack bg={NEON_PINK} />
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Box color={NEON_PINK} as={MdGraphicEq} />
          </SliderThumb>
        </Slider>
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text size="md" width={"50%"}>
          {animSpeedLbl}
        </Text>
        <Menu variant={"menuSettingsOutline"}>
          <MenuButton width={"100%"}>
            <Flex alignItems="center" gap={2}>
              <MdArrowDropDown /> {t(animationSpeedLabels[animationSpeed])}
            </Flex>
          </MenuButton>
          <MenuList zIndex={10000}>
            {Object.entries(animationSpeedLabels).map(([speedKey, label]) => {
              const speed = speedKey as Speed;
              return (
                <MenuItem key={speed} onClick={() => setAnimationSpeed(speed)}>
                  {t(label)}
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text size="md" width={"50%"}>
          {lootboxTransitionLbl}
        </Text>
        <Menu variant={"menuSettingsOutline"}>
          <MenuButton width={"100%"}>
            <Flex alignItems="center" gap={2}>
              <MdArrowDropDown />{" "}
              {t(lootboxTransitionLabels[lootboxTransition])}
            </Flex>
          </MenuButton>
          <MenuList zIndex={10000}>
            {Object.entries(lootboxTransitionLabels).map(([color, label]) => {
              return (
                <MenuItem
                  key={color}
                  onClick={() => setLootboxTransition(color)}
                >
                  {t(label)}
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
      </Flex>
      {isPushSupported && (
        <>
          <Text size="md" fontWeight="bold">
            {pushNotificationsLbl}
          </Text>
          {shouldShowEnableNotifications && (
            <Flex justifyContent="center">
              <Button
                size="sm"
                onClick={handleEnableNotifications}
                isLoading={pushPermissionLoading}
              >
                {enableNotificationsLbl}
              </Button>
            </Flex>
          )}
          {shouldShowAndroidNotice && (
            <Text size="sm" textAlign="center">
              {androidNotificationsHelpLbl}
            </Text>
          )}
          {!shouldShowEnableNotifications && !shouldShowAndroidNotice && (
            <>
              <Flex gap={2} alignItems={"center"}>
                <Text size="md" width={"50%"}>
                  {pushDailyMissionsLbl}
                </Text>
                <Switch
                  ml="auto"
                  isChecked={pushDailyMissionsEnabled}
                  onChange={(e) =>
                    setPushDailyMissionsEnabled(e.target.checked)
                  }
                />
              </Flex>
              <Flex gap={2} alignItems={"center"}>
                <Text size="md" width={"50%"}>
                  {pushRemindersLbl}
                </Text>
                <Switch
                  ml="auto"
                  isChecked={pushRemindersEnabled}
                  onChange={(e) => setPushRemindersEnabled(e.target.checked)}
                />
              </Flex>
              <Flex gap={2} alignItems={"center"}>
                <Text size="md" width={"50%"}>
                  {pushEventsLbl}
                </Text>
                <Switch
                  ml="auto"
                  isChecked={pushEventsEnabled}
                  onChange={(e) => setPushEventsEnabled(e.target.checked)}
                />
              </Flex>
              <Flex gap={2} alignItems={"center"}>
                <Text size="md" width={"50%"}>
                  {pushDailyPacksLbl}
                </Text>
                <Switch
                  ml="auto"
                  isChecked={pushDailyPacksEnabled}
                  onChange={(e) => setPushDailyPacksEnabled(e.target.checked)}
                />
              </Flex>
            </>
          )}
        </>
      )}
      <Version />
    </Flex>
  );
};
