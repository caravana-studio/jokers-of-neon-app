import { Divider, Flex } from "@chakra-ui/react";
import { ProfileStats } from "./ProfileStats";
import { UserBadges } from "./UserBadges";
import { LogoutMenuBtn } from "../Menu/Buttons/Logout/LogoutMenuBtn";
import { DeleteAccBtn } from "../Menu/Buttons/DeleteAccBtn";
import { ControllerIcon } from "../../icons/ControllerIcon";
import { MobileDecoration } from "../MobileDecoration";
import { useDojo } from "../../dojo/DojoContext";
import { DelayedLoading } from "../DelayedLoading";

export const ProfileMobile = ({ data }: { data: ProfileData }) => {
  const {
    username,
    level,
    streak,
    games,
    victories,
    currentXp,
    levelXp,
    currentBadges,
    totalBadges,
    profilePicture,
  } = data;

  const btnWidth = "18px";

  const { setup } = useDojo();

  return (
    <DelayedLoading ms={100}>
      <MobileDecoration />
      <Flex
        flexDirection={"column"}
        gap={1}
        w={{ base: "100%", sm: "70%" }}
        mx={"auto"}
        height={"100%"}
        py={8}
        justifyContent={"space-evenly"}
      >
        <Flex
          flexDirection={"column"}
          py={16}
          px={8}
          height={"auto"}
          overflowY={"auto"}
          overflowX={"hidden"}
        >
          <ProfileStats
            username={username}
            level={level}
            streak={streak}
            games={games}
            victories={victories}
            currentXp={currentXp}
            levelXp={levelXp}
            profilePicture={profilePicture}
          />

          <UserBadges currentBadges={currentBadges} totalBadges={totalBadges} />

          <Flex flexDirection={"column"} gap={2} w={"100%"} color={"white"}>
            {!setup.useBurnerAcc && (
              <>
                <Divider borderColor="white" borderWidth="1px" my={2} />
                <LogoutMenuBtn width={btnWidth} label={true} arrowRight />
              </>
            )}

            <Divider borderColor="white" borderWidth="1px" my={2} />
            <DeleteAccBtn width={btnWidth} label={true} arrowRight />

            {!setup.useBurnerAcc && (
              <>
                <Divider borderColor="white" borderWidth="1px" my={2} />
                <ControllerIcon width={btnWidth} label={true} arrowRight />
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
