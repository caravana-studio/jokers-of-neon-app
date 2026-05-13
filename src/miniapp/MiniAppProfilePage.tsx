import { Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { UsernameModal } from "../components/UsernameModal";
import { Loading } from "../components/Loading";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { useDojo } from "../dojo/useDojo";
import { useGameLoopBurnerSession } from "../hooks/useGameLoopBurnerSession";
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
  const session = useGameLoopBurnerSession();
  const profileAddress = session?.userAddress ?? "";
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
      accountType
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
            games={profileData.playerStats.games}
            victories={profileData.playerStats.victories}
            currentXp={profileData.profile.currentXp}
            totalXp={profileData.profile.totalXp}
            xpLine={profileData.xpLine}
            hideXpProgress
            hideTotalXp
            hideLevel
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
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
