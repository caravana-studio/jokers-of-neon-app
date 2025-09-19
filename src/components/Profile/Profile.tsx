import { Button, Flex, Text } from "@chakra-ui/react";
import { useDojo } from "../../dojo/useDojo";
import { useUsername } from "../../dojo/utils/useUsername";
import { Icons } from "../../constants/icons";
import { useTranslation } from "react-i18next";
import { ProfileContent } from "./ProfileContent";
import { useProfileStore } from "../../state/useProfileStore";
import { useEffect } from "react";
import { Loading } from "../Loading";

export const Profile = () => {
  const {
    setup: { useBurnerAcc, account, client },
    switchToController,
  } = useDojo();

  const loggedInUser = useUsername();

  const { profileData, fetchProfileData, loading } = useProfileStore();

  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "profile-menu",
  });

  const { t: tCommon } = useTranslation("intermediate-screens", {
    keyPrefix: "common",
  });

  useEffect(() => {
    if (client && account && loggedInUser) {
      fetchProfileData(
        client,
        account.account.address,
        account.account,
        loggedInUser
      );
    }
  }, [client, account, loggedInUser]);

  // return useBurnerAcc ? (
  //   <Flex
  //     w="100%"
  //     h="100%"
  //     flexDir="column"
  //     gap={5}
  //     justifyContent="center"
  //     alignItems="center"
  //   >
  //     <Text size="lg">{t("no-profile")}</Text>
  //     <Button size={["md", "sm"]} onClick={() => switchToController()}>
  //       {tCommon("login")}
  //       <img
  //         src={Icons.CARTRIDGE}
  //         width={"16px"}
  //         style={{ marginLeft: "8px" }}
  //       />
  //     </Button>
  //   </Flex>
  // ) : (
  //   <ProfileContent data={profileData} />
  // );
  return profileData !== null ? (
    <ProfileContent data={profileData} />
  ) : (
    <Loading />
  );
};
