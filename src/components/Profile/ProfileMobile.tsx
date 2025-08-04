import { Flex } from "@chakra-ui/react";
import { ProfileStats } from "./ProfileStats";
import { UserBadges } from "./UserBadges";
import { LogoutMenuBtn } from "../Menu/Buttons/Logout/LogoutMenuBtn";
import { DeleteAccBtn } from "../Menu/Buttons/DeleteAccBtn";
import { ControllerIcon } from "../../icons/ControllerIcon";

export const ProfileMobile = () => {
  return (
    <Flex flexDirection={"column"} gap={1} w={"100%"} h={"100%"}>
      <ProfileStats
        username={""}
        level={0}
        streak={0}
        games={0}
        victories={0}
        currentXp={0}
        levelXp={0}
      />
      <UserBadges currentBadges={0} totalBadges={0} />

      <Flex flexDirection={"column"} gap={2} w={"100%"} color={"white"}>
        <LogoutMenuBtn width={"24px"} />
        <DeleteAccBtn width={"24px"} />
        <ControllerIcon width={"24px"} />
      </Flex>
    </Flex>
  );
};
