import { useEffect } from "react";
import { Loading } from "../../components/Loading";
import { useDojo } from "../../dojo/useDojo";
import { useUsername } from "../../dojo/utils/useUsername";
import { useProfileStore } from "../../state/useProfileStore";
import { ProfileContent } from "./ProfileContent";

export const ProfilePage = () => {
  const {
    setup: { account, client },
  } = useDojo();

  const loggedInUser = useUsername();

  const { profileData, fetchProfileData, loading, updateAvatar } =
    useProfileStore();

  useEffect(() => {
    if (client && account && loggedInUser && !loading) {
      fetchProfileData(
        client,
        account.account.address,
        account.account,
        loggedInUser
      );
    }
  }, [client, account, loggedInUser, profileData?.profile.username]);

  return profileData !== null ? (
    <ProfileContent data={profileData} onUpdateAvatar={updateAvatar} />
  ) : (
    <Loading />
  );
};
