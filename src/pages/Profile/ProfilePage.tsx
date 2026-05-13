import { useEffect, useRef } from "react";
import { Loading } from "../../components/Loading";
import { useGameLoopBurnerSession } from "../../hooks/useGameLoopBurnerSession";
import { AppType, useAppContext } from "../../providers/AppContextProvider";
import { addressKey } from "../../utils/starknetAddress";
import { useDojo } from "../../dojo/useDojo";
import { useUsername } from "../../dojo/utils/useUsername";
import { useProfileStore } from "../../state/useProfileStore";
import { useUsernameStore } from "../../state/useUsernameStore";
import { ProfileContent } from "./ProfileContent";

export const ProfilePage = () => {
  const {
    setup: { account, client },
    accountType,
  } = useDojo();
  const appType = useAppContext();
  const isMiniApp = appType === AppType.MINIAPP;
  const gameLoopBurnerSession = useGameLoopBurnerSession();

  const loggedInUser = useUsername();
  const usernameStatus = useUsernameStore((store) => store.status);
  const storedUsernameAddress = useUsernameStore((store) => store.address);
  const storedUsername = useUsernameStore((store) => store.username);
  const loadUsername = useUsernameStore((store) => store.loadUsername);

  const { profileData, fetchProfileData, updateAvatar } =
    useProfileStore();
  const lastProfileRequestKeyRef = useRef<string | null>(null);

  const profileAddress = isMiniApp
    ? gameLoopBurnerSession?.userAddress ?? ""
    : account?.account.address ?? "";
  const hasMatchingStoredUsername =
    addressKey(storedUsernameAddress) === addressKey(profileAddress);
  const resolvedUsername = isMiniApp
    ? hasMatchingStoredUsername
      ? storedUsername
      : null
    : loggedInUser;
  const isUsernameReady = isMiniApp
    ? hasMatchingStoredUsername && usernameStatus === "ready"
    : usernameStatus === "ready";
  const profileRequestKey =
    client &&
    account &&
    profileAddress &&
    resolvedUsername &&
    isUsernameReady
      ? `${addressKey(profileAddress)}:${resolvedUsername}:${accountType ?? ""}`
      : null;

  useEffect(() => {
    if (!isMiniApp || !profileAddress) return;

    if (hasMatchingStoredUsername && usernameStatus !== "error") {
      return;
    }

    void loadUsername(profileAddress);
  }, [
    hasMatchingStoredUsername,
    isMiniApp,
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
    client,
    account,
    profileAddress,
    resolvedUsername,
    isUsernameReady,
    accountType,
    fetchProfileData,
    profileRequestKey,
  ]);

  return profileData !== null ? (
    <ProfileContent data={profileData} onUpdateAvatar={updateAvatar} />
  ) : (
    <Loading />
  );
};
