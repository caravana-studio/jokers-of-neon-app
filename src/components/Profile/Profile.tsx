import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Icons } from "../../constants/icons";
import { useDojo } from "../../dojo/useDojo";
import { useUsername } from "../../dojo/utils/useUsername";
import { useProfileStore } from "../../state/useProfileStore";
import { Loading } from "../Loading";
import { ProfileContent } from "./ProfileContent";

export const Profile = () => {
  const {
    setup: { useBurnerAcc, account, client },
    switchToController,
  } = useDojo();

  const loggedInUser = useUsername();

  const { profileData, fetchProfileData, loading, updateAvatar } =
    useProfileStore();

  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "profile-menu",
  });

  const { t: tCommon } = useTranslation("intermediate-screens", {
    keyPrefix: "common",
  });

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

  return useBurnerAcc ? (
    <Flex
      w="100%"
      h="100%"
      flexDir="column"
      gap={5}
      justifyContent="center"
      alignItems="center"
    >
      <Text size="lg">{t("no-profile")}</Text>
      <Button
        size={["md", "sm"]}
        onClick={() =>
          switchToController((newUsername) => {
            fetchProfileData(
              client,
              newUsername.account.address,
              newUsername.account,
              newUsername.username
            );
          })
        }
      >
        {tCommon("login")}
        <img
          src={Icons.CARTRIDGE}
          width={"16px"}
          style={{ marginLeft: "8px" }}
        />
      </Button>
    </Flex>
  ) : profileData !== null ? (
    <ProfileContent data={profileData} onUpdateAvatar={updateAvatar} />
  ) : (
    <Loading />
  );
};
