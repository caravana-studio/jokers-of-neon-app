import { Divider, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UsernameModal } from "../../components/UsernameModal";
import { Icons } from "../../constants/icons";
import { TESTERS } from "../../constants/testers";
import { useDojo } from "../../dojo/DojoContext";
import { useUsername } from "../../dojo/utils/useUsername";
import { useGameLoopBurnerSession } from "../../hooks/useGameLoopBurnerSession";
import { AppType, useAppContext } from "../../providers/AppContextProvider";
import { ProfileStore, useProfileStore } from "../../state/useProfileStore";
import { useUsernameStore } from "../../state/useUsernameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DelayedLoading } from "../../components/DelayedLoading";
import { PositionedDiscordLink } from "../../components/DiscordLink";
import { DeleteAccBtn } from "../../components/Menu/Buttons/DeleteAccBtn";
import { LogoutMenuBtn } from "../../components/Menu/Buttons/Logout/LogoutMenuBtn";
import { MenuBtn } from "../../components/Menu/Buttons/MenuBtn";
import { MobileDecoration } from "../../components/MobileDecoration";
import { ProfileStats } from "./ProfileStats";

export const ProfileContent = ({
  data,
  onUpdateAvatar,
}: {
  data: ProfileData;
  onUpdateAvatar: ProfileStore["updateAvatar"];
}) => {
  const { playerStats, profile, xpLine, currentBadges, totalBadges } = data;

  const btnWidth = "18px";
  const appType = useAppContext();
  const isMiniApp = appType === AppType.MINIAPP;
  const { setup } = useDojo();
  const gameLoopBurnerSession = useGameLoopBurnerSession();
  const { isSmallScreen } = useResponsiveValues();
  const username = useUsername();
  const navigate = useNavigate();
  const { t } = useTranslation("game");
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);
  const [usernameSaving, setUsernameSaving] = useState(false);
  const updateUsernameForAddress = useUsernameStore(
    (store) => store.updateUsernameForAddress
  );
  const setProfileUsername = useProfileStore((store) => store.setProfileUsername);
  const profileAddress = isMiniApp
    ? gameLoopBurnerSession?.userAddress ?? setup.account.account.address
    : setup.account.account.address;

  const handleUpdateUsername = async (nextUsername: string) => {
    setUsernameSaving(true);
    try {
      const record = await updateUsernameForAddress(
        profileAddress,
        nextUsername
      );
      setProfileUsername(record.username);
      setUsernameModalOpen(false);
    } finally {
      setUsernameSaving(false);
    }
  };

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
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <ProfileStats
            username={profile.username}
            level={profile.level}
            streak={profile.streak}
            games={playerStats.games}
            victories={playerStats.victories}
            currentXp={profile.currentXp}
            totalXp={profile.totalXp}
            xpLine={xpLine}
            hideXpProgress={isMiniApp}
            hideTotalXp={isMiniApp}
            profilePicture={profile.avatarId}
            onUpdateAvatar={(avatarId) =>
              onUpdateAvatar(
                setup.client,
                setup.account.account,
                profileAddress,
                avatarId
              )
            }
            onEditUsername={() => setUsernameModalOpen(true)}
          />

          <UsernameModal
            isOpen={usernameModalOpen}
            title={t("username-modal.title.edit")}
            initialUsername={profile.username}
            currentUsername={profile.username}
            isSaving={usernameSaving}
            onClose={() => setUsernameModalOpen(false)}
            onSave={handleUpdateUsername}
          />

          {/* <UserBadges currentBadges={currentBadges} totalBadges={totalBadges} /> */}

          {!isMiniApp && (
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
              <MenuBtn
                icon={Icons.SETTINGS}
                description={t("game.game-menu.settings-btn")}
                label={t("game.game-menu.settings-btn")}
                onClick={() => navigate("/settings")}
                arrowRight
                width={btnWidth}
              />
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
          )}
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
