import { Button, Flex, Text } from "@chakra-ui/react";
import { useDojo } from "../../dojo/useDojo";
import { useUsername } from "../../dojo/utils/useUsername";
import { profileMock } from "../../utils/mocks/profileMocks";
import { Icons } from "../../constants/icons";
import { useTranslation } from "react-i18next";
import { ProfileContent } from "./ProfileContent";

export const Profile = () => {
  const profileData: ProfileData = {
    username: useUsername() ?? profileMock.username,
    level: profileMock.level,
    streak: profileMock.streak,
    games: profileMock.games,
    victories: profileMock.victories,
    currentXp: profileMock.currentXp,
    levelXp: profileMock.levelXp,
    currentBadges: profileMock.currentBadges,
    totalBadges: profileMock.totalBadges,
    profilePicture: profileMock.profilePicture,
  };

  const {
    setup: { useBurnerAcc },
    switchToController,
  } = useDojo();

  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "profile-menu",
  });

  const { t: tCommon } = useTranslation("intermediate-screens", {
    keyPrefix: "common",
  });

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
      <Button size={["md", "sm"]} onClick={() => switchToController()}>
        {tCommon("login")}
        <img
          src={Icons.CARTRIDGE}
          width={"16px"}
          style={{ marginLeft: "8px" }}
        />
      </Button>
    </Flex>
  ) : (
    <ProfileContent data={profileData} />
  );
};
