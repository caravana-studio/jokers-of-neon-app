import { Divider, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../constants/icons";
import { TESTERS } from "../../constants/testers";
import { useDojo } from "../../dojo/DojoContext";
import { useUsername } from "../../dojo/utils/useUsername";
import { ProfileStore } from "../../state/useProfileStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DelayedLoading } from "../DelayedLoading";
import { PositionedDiscordLink } from "../DiscordLink";
import { DeleteAccBtn } from "../Menu/Buttons/DeleteAccBtn";
import { LogoutMenuBtn } from "../Menu/Buttons/Logout/LogoutMenuBtn";
import { MenuBtn } from "../Menu/Buttons/MenuBtn";
import { MobileDecoration } from "../MobileDecoration";
import { ProfileStats } from "./ProfileStats";

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
  const username = useUsername();
  const navigate = useNavigate();

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

          {/* <UserBadges currentBadges={currentBadges} totalBadges={totalBadges} /> */}

          <Flex flexDirection={"column"} gap={2} w={"100%"} color={"white"}>
            {username && TESTERS.includes(username) && (
              <>
                {isSmallScreen && (
                  <Divider borderColor="white" borderWidth="1px" my={2} />
                )}
                <MenuBtn
                  icon={Icons.LIST}
                  description={"Test new features"}
                  label={"Test new features"}
                  onClick={() => navigate("/test")}
                  arrowRight
                  width={btnWidth}
                />
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
                <LogoutMenuBtn width={btnWidth} label={true} arrowRight />
              </>
            )}
            {isSmallScreen && (
              <Divider borderColor="white" borderWidth="1px" my={2} />
            )}
            {/* 
            {!setup.useBurnerAcc && (
              <>
                {isSmallScreen && (
                  <Divider borderColor="white" borderWidth="1px" my={2} />
                )}
                <ControllerIcon width={btnWidth} label={true} arrowRight />
              </>
            )} */}
          </Flex>
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
