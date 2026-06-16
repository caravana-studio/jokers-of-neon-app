import { Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BLUE, DIAMONDS } from "../theme/colors";
import CachedImage from "./CachedImage";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { useEffect } from "react";
import { useProfileStore } from "../state/useProfileStore";
import { useUsernameStore } from "../state/useUsernameStore";
import { useDojo } from "../dojo/useDojo";
import { useUsername } from "../dojo/utils/useUsername";
import { useTranslation } from "react-i18next";
import { DailyStreakFireAnimation } from "./DailyStreakFireAnimation";
import { HIDE_STREAK } from "../config/featureFlags";

export const ProfileTile = () => {
  const { t } = useTranslation("home", {
    keyPrefix: "home",
  });
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();
  const PROFILE_IMG_SIZE = isSmallScreen ? 70 : 150;

  const loggedInUser = useUsername();

  const {
    setup: { account, client },
    accountType,
  } = useDojo();
  const { profileData, fetchProfileData, loading } = useProfileStore();
  const usernameStatus = useUsernameStore((store) => store.status);
  const streak = profileData?.profile.streak ?? 0;
  const isZeroStreak = streak === 0;

  useEffect(() => {
    if (client && account && loggedInUser && usernameStatus === "ready" && !loading) {
      fetchProfileData(
        client,
        account.account.address,
        account.account,
        loggedInUser,
        accountType
      );
    }
  }, [client, account, loggedInUser, usernameStatus, profileData?.profile.username, accountType]);

  return (
    <Flex position="relative">
      <Flex
        p="3px"
        border={`1px solid ${BLUE}`}
        borderRadius="full"
        onClick={() => navigate("/profile")}
        cursor="pointer"
      >
        <Flex p="5px" border={`1px solid ${BLUE}`} borderRadius="full">
          <Flex
            borderRadius="full"
            backgroundImage={`url('/profile-pics/${profileData?.profile.avatarId}.png')`}
            backgroundSize="cover"
            backgroundPosition="center"
            height={`${PROFILE_IMG_SIZE}px`}
            width={`${PROFILE_IMG_SIZE}px`}
            justifyContent="center"
            alignItems="center"
          ></Flex>
        </Flex>
      </Flex>
      <Flex
        position="absolute"
        bottom={-1}
        w={`${PROFILE_IMG_SIZE + 15}px`}
        alignItems="center"
        flexDir={"column"}
      >
        <Flex
          backgroundColor="black"
          py={0.5}
          width={`${PROFILE_IMG_SIZE + 30}px`}
          borderRadius="full"
          border={`1px solid ${BLUE}`}
          justifyContent="center"
          alignItems="center"
          gap={HIDE_STREAK ? 0 : isSmallScreen ? 1.5 : 4}
          px={isSmallScreen ? 2.5 : 3}
        >
          <Heading fontSize={isSmallScreen ? 8 : 11} textAlign="center">
            {t("level-short")}{" "}
            <span style={{ fontFamily: "Orbitron" }}>
              {profileData?.profile.level ?? 0}
            </span>
          </Heading>
          {!HIDE_STREAK && (
            <Flex alignItems="center" gap={0}>
              <DailyStreakFireAnimation
                size={isSmallScreen ? 16 : 20}
                grayscale={isZeroStreak}
              />
              <Heading
                fontSize={isSmallScreen ? 10 : 13}
                textAlign="center"
                fontFamily="Orbitron"
                color={isZeroStreak ? "grey" : DIAMONDS}
                lineHeight={1}
                ml={-0.5}
              >
                {streak}
              </Heading>
            </Flex>
          )}
        </Flex>
        <Flex width="75px" justifyContent={"flex-end"}>
          <CachedImage
            width={isSmallScreen ? "50px" : "70px"}
            src="/borders/profile-level.png"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
