import { Divider, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UsernameModal } from "../components/UsernameModal";
import { Loading } from "../components/Loading";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";
import { MenuBtn } from "../components/Menu/Buttons/MenuBtn";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { Icons } from "../constants/icons";
import { useDojo } from "../dojo/useDojo";
import { useMiniAppIdentity } from "./session/useMiniAppSession";
import { useProfileStore } from "../state/useProfileStore";
import { useUsernameStore } from "../state/useUsernameStore";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { addressKey } from "../utils/starknetAddress";
import { ProfileStats } from "../pages/Profile/ProfileStats";

export const MiniAppProfilePage = () => {
  const {
    setup: { account, client },
    accountType,
  } = useDojo();
  const { isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("game");
  const { t: tMiniAppProfile } = useTranslation("miniapp", {
    keyPrefix: "profile-pages.menu",
  });
  const navigate = useNavigate();
  const { userAddress: profileAddress } = useMiniAppIdentity();
  const usernameStatus = useUsernameStore((store) => store.status);
  const storedUsernameAddress = useUsernameStore((store) => store.address);
  const storedUsername = useUsernameStore((store) => store.username);
  const loadUsername = useUsernameStore((store) => store.loadUsername);
  const updateUsernameForAddress = useUsernameStore(
    (store) => store.updateUsernameForAddress
  );
  const { profileData, fetchProfileData, updateAvatar, setProfileUsername } =
    useProfileStore();
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);
  const [usernameSaving, setUsernameSaving] = useState(false);
  const lastProfileRequestKeyRef = useRef<string | null>(null);
  const btnWidth = "18px";

  const hasMatchingStoredUsername =
    addressKey(storedUsernameAddress) === addressKey(profileAddress);
  const resolvedUsername = hasMatchingStoredUsername ? storedUsername : null;
  const isUsernameReady = hasMatchingStoredUsername && usernameStatus === "ready";
  const profileRequestKey =
    client &&
    account &&
    profileAddress &&
    resolvedUsername &&
    isUsernameReady
      ? `${addressKey(profileAddress)}:${resolvedUsername}:${accountType ?? ""}`
      : null;

  useEffect(() => {
    if (!profileAddress) return;
    if (hasMatchingStoredUsername && usernameStatus !== "error") return;
    void loadUsername(profileAddress);
  }, [
    hasMatchingStoredUsername,
    loadUsername,
    profileAddress,
    usernameStatus,
  ]);

  useEffect(() => {
    if (!profileRequestKey || !client || !account) {
      lastProfileRequestKeyRef.current = null;
      return;
    }

    if (lastProfileRequestKeyRef.current === profileRequestKey) {
      return;
    }

    lastProfileRequestKeyRef.current = profileRequestKey;

    void fetchProfileData(
      client,
      profileAddress,
      account.account,
      resolvedUsername ?? undefined,
      accountType,
      { refreshStreakStatus: true }
    );
  }, [
    account,
    accountType,
    client,
    fetchProfileData,
    profileAddress,
    profileRequestKey,
    resolvedUsername,
  ]);

  const handleUpdateUsername = async (nextUsername: string) => {
    if (!profileAddress) return;

    setUsernameSaving(true);
    try {
      const record = await updateUsernameForAddress(profileAddress, nextUsername);
      setProfileUsername(record.username);
      setUsernameModalOpen(false);
    } finally {
      setUsernameSaving(false);
    }
  };

  if (!profileData) {
    return <Loading />;
  }

  return (
    <DelayedLoading ms={100}>
      <PositionedDiscordLink />
      <MobileDecoration />
      <Flex
        flexDirection={"column"}
        gap={1}
        w={{ base: "100%", sm: "70%", md: "50%" }}
        mx={"auto"}
        height={"100%"}
        py={8}
        justifyContent={"space-evenly"}
      >
        <Flex
          flexDirection={"column"}
          px={isSmallScreen ? 8 : 16}
          height={"auto"}
          overflowY={"auto"}
          overflowX={"hidden"}
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <ProfileStats
            username={profileData.profile.username}
            level={profileData.profile.level}
            streak={profileData.profile.streak}
            streakCompletedToday={profileData.profile.streakCompletedToday}
            streakProtectors={profileData.profile.streakProtectors ?? 0}
            games={profileData.playerStats.games}
            victories={profileData.playerStats.victories}
            currentXp={profileData.profile.currentXp}
            totalXp={profileData.profile.totalXp}
            xpLine={profileData.xpLine}
            hideXpProgress
            hideTotalXp
            hideLevel
            hideDailyStreak
            profilePicture={profileData.profile.avatarId}
            onUpdateAvatar={(avatarId) =>
              updateAvatar(
                client,
                account.account,
                profileAddress,
                avatarId
              )
            }
            onEditUsername={() => setUsernameModalOpen(true)}
          />

          <UsernameModal
            isOpen={usernameModalOpen}
            title={t("username-modal.title.edit")}
            initialUsername={profileData.profile.username}
            currentUsername={profileData.profile.username}
            isSaving={usernameSaving}
            onClose={() => setUsernameModalOpen(false)}
            onSave={handleUpdateUsername}
          />

          <Flex flexDirection="column" gap={2} mt={6} w="100%" color="white">
            <MenuBtn
              icon={Icons.DOCS}
              description={tMiniAppProfile("privacy-policy")}
              label={tMiniAppProfile("privacy-policy")}
              onClick={() => navigate("/profile/privacy-policy")}
              arrowRight
              width={btnWidth}
            />
            {isSmallScreen && (
              <Divider borderColor="white" borderWidth="1px" my={2} />
            )}
            <MenuBtn
              icon={Icons.MORE}
              description={tMiniAppProfile("support")}
              label={tMiniAppProfile("support")}
              onClick={() => navigate("/profile/support")}
              arrowRight
              width={btnWidth}
            />
            {isSmallScreen && (
              <Divider borderColor="white" borderWidth="1px" my={2} />
            )}
            <MenuBtn
              icon={Icons.PROFILE}
              description={tMiniAppProfile("about-us")}
              label={tMiniAppProfile("about-us")}
              onClick={() => navigate("/profile/about-us")}
              arrowRight
              width={btnWidth}
            />
            {isSmallScreen && (
              <Divider borderColor="white" borderWidth="1px" my={2} />
            )}
            <MenuBtn
              icon={Icons.TUTORIAL}
              description={tMiniAppProfile("how-to-play")}
              label={tMiniAppProfile("how-to-play")}
              onClick={() => navigate("/profile/how-to-play")}
              arrowRight
              width={btnWidth}
            />
          </Flex>
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
