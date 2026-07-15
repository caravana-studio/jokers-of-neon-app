import {
  Divider,
  Flex,
  IconButton,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Copy } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UsernameModal } from "../../components/UsernameModal";
import { Icons } from "../../constants/icons";
import { TESTERS } from "../../constants/testers";
import { useDojo } from "../../dojo/DojoContext";
import { useUsername } from "../../dojo/utils/useUsername";
import { ProfileStore, useProfileStore } from "../../state/useProfileStore";
import { useUsernameStore } from "../../state/useUsernameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DelayedLoading } from "../../components/DelayedLoading";
import { PositionedDiscordLink } from "../../components/DiscordLink";
import { DeleteAccBtn } from "../../components/Menu/Buttons/DeleteAccBtn";
import { LogoutMenuBtn } from "../../components/Menu/Buttons/Logout/LogoutMenuBtn";
import { MenuBtn } from "../../components/Menu/Buttons/MenuBtn";
import { MobileDecoration } from "../../components/MobileDecoration";
import { HIDE_STREAK } from "../../config/featureFlags";
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
  const { setup } = useDojo();
  const { isSmallScreen } = useResponsiveValues();
  const username = useUsername();
  const navigate = useNavigate();
  const { t } = useTranslation("game");
  const { t: tProfile } = useTranslation("intermediate-screens", {
    keyPrefix: "profile-menu",
  });
  const toast = useToast();
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);
  const [usernameSaving, setUsernameSaving] = useState(false);
  const updateUsernameForAddress = useUsernameStore(
    (store) => store.updateUsernameForAddress
  );
  const setProfileUsername = useProfileStore(
    (store) => store.setProfileUsername
  );
  const walletAddress = setup.account.account.address;

  const handleUpdateUsername = async (nextUsername: string) => {
    setUsernameSaving(true);
    try {
      const record = await updateUsernameForAddress(
        setup.account.account.address,
        nextUsername
      );
      setProfileUsername(record.username);
      setUsernameModalOpen(false);
    } finally {
      setUsernameSaving(false);
    }
  };

  const handleCopyWalletAddress = async () => {
    if (!walletAddress) {
      return;
    }

    await navigator.clipboard.writeText(walletAddress);
    toast({
      title: tProfile("wallet-address-copied"),
      status: "success",
    });
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
            streakProtectors={profile.streakProtectors ?? 0}
            games={playerStats.games}
            victories={playerStats.victories}
            currentXp={profile.currentXp}
            totalXp={profile.totalXp}
            xpLine={xpLine}
            hideDailyStreak={HIDE_STREAK}
            profilePicture={profile.avatarId}
            onUpdateAvatar={(avatarId) =>
              onUpdateAvatar(
                setup.client,
                setup.account.account,
                setup.account.account.address,
                avatarId
              )
            }
            onEditUsername={() => setUsernameModalOpen(true)}
            onOpenDailyStreak={
              HIDE_STREAK
                ? undefined
                : () =>
                    navigate("/streak-increased", {
                      state: {
                        streak: profile.streak,
                        from: "/profile",
                      },
                    })
            }
          />

          {walletAddress && (
            <Flex
              alignItems="center"
              gap={3}
              w="100%"
              my={4}
              px={4}
              py={3}
              borderRadius="12px"
              bg="rgba(0, 0, 0, 0.5)"
              boxShadow="0px 0px 8px rgba(255, 255, 255, 0.35), inset 0 0 5px rgba(255, 255, 255, 0.25)"
            >
              <Flex direction="column" minW={0} flex={1}>
                <Text
                  fontSize="10px"
                  fontWeight="500"
                  textTransform="uppercase"
                  color="whiteAlpha.800"
                >
                  {tProfile("wallet-address")}
                </Text>
                <Text
                  fontSize="xs"
                  fontFamily="monospace"
                  overflowWrap="anywhere"
                  lineHeight="1.25"
                >
                  {walletAddress}
                </Text>
              </Flex>
              <Tooltip label={tProfile("copy-wallet-address")}>
                <IconButton
                  aria-label={tProfile("copy-wallet-address")}
                  icon={<Copy size={16} />}
                  minW="32px"
                  h="32px"
                  p={0}
                  size="sm"
                  variant="ghost"
                  color="white"
                  _hover={{ color: "white", bg: "whiteAlpha.200" }}
                  onClick={() => void handleCopyWalletAddress()}
                />
              </Tooltip>
            </Flex>
          )}

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
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
