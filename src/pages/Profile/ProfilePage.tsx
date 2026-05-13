import { useEffect } from "react";
import { Loading } from "../../components/Loading";
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
  const loggedInUser = useUsername();
  const usernameStatus = useUsernameStore((store) => store.status);
  const { profileData, fetchProfileData, loading, updateAvatar } = useProfileStore();

  useEffect(() => {
    if (client && account && loggedInUser && usernameStatus === "ready" && !loading) {
      void fetchProfileData(
        client,
        account.account.address,
        account.account,
        loggedInUser,
        accountType
      );
    }
  }, [client, account, loggedInUser, usernameStatus, profileData?.profile.username, accountType]);

  return profileData !== null ? (
    <ProfileContent data={profileData} onUpdateAvatar={updateAvatar} />
  ) : (
    <Loading />
  );
};
