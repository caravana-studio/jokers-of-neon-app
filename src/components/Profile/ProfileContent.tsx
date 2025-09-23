import { Divider, Flex } from "@chakra-ui/react";
import { ProfileStats } from "./ProfileStats";
import { UserBadges } from "./UserBadges";
import { LogoutMenuBtn } from "../Menu/Buttons/Logout/LogoutMenuBtn";
import { DeleteAccBtn } from "../Menu/Buttons/DeleteAccBtn";
import { ControllerIcon } from "../../icons/ControllerIcon";
import { MobileDecoration } from "../MobileDecoration";
import { useDojo } from "../../dojo/DojoContext";
import { DelayedLoading } from "../DelayedLoading";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { ProfileStore } from "../../state/useProfileStore";

export const ProfileContent = ({
  data,
  onUpdateAvatar,
}: {
  data: ProfileData;
  onUpdateAvatar: ProfileStore["updateAvatar"];
}) => {
  const { playerStats, profile, levelXp, currentBadges, totalBadges } = data;

  const btnWidth = "18px";
  const { setup } = useDojo();
  const { isSmallScreen } = useResponsiveValues();

  return (
    <DelayedLoading ms={100}>
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
          py={16}
          px={isSmallScreen ? 8 : 16}
          height={"auto"}
          overflowY={"auto"}
          overflowX={"hidden"}
        >
          <ProfileStats
            username={profile.username}
            level={profile.level}
            streak={profile.streak}
            games={playerStats.games}
            victories={playerStats.victories}
            currentXp={profile.currentXp}
            levelXp={levelXp}
            profilePicture={profile.avatarId}
            onUpdateAvatar={(avatarId) =>
              onUpdateAvatar(
                setup.client,
                setup.account.account,
                setup.account.account.address,
                avatarId
              )
            }
          />

          <UserBadges currentBadges={currentBadges} totalBadges={totalBadges} />

          <Flex flexDirection={"column"} gap={2} w={"100%"} color={"white"}>
            {!setup.useBurnerAcc && (
              <>
                {isSmallScreen && (
                  <Divider borderColor="white" borderWidth="1px" my={2} />
                )}
                <LogoutMenuBtn width={btnWidth} label={true} arrowRight />
              </>
            )}

            {isSmallScreen && (
              <Divider borderColor="white" borderWidth="1px" my={2} />
            )}
            <DeleteAccBtn width={btnWidth} label={true} arrowRight />

            {!setup.useBurnerAcc && (
              <>
                {isSmallScreen && (
                  <Divider borderColor="white" borderWidth="1px" my={2} />
                )}
                <ControllerIcon width={btnWidth} label={true} arrowRight />
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
