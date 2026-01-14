import { Box, Collapse, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProgressBar } from "../../components/CompactRoundData/ProgressBar";
import { VIOLET } from "../../theme/colors";
import { ProfilePicture } from "./ProfilePicture";
import { ProfilePicturePicker } from "./ProfilePicturePicker";
import { ProfileStat } from "./ProfileStat";

export interface ProfileStatsProps {
  profilePicture: string | number;
  username: string | null;
  level: number;
  streak: number;
  games: number;
  victories: number;
  currentXp: number;
  totalXp: number;
  xpLine: {
    prevLevelXp: number;
    nextLevelXp: number;
  };
}

export const ProfileStats: React.FC<
  ProfileStatsProps & {
    onUpdateAvatar?: (avatarId: number) => void;
  }
> = ({
  onUpdateAvatar,
  profilePicture,
  username,
  level,
  streak,
  games,
  victories,
  currentXp,
  totalXp,
  xpLine,
}) => {
  const [profilePickerVisible, setProfilePickerVisible] = useState(false);
  const [profilePictureId, setProfilePictureId] = useState<number | string>(
    profilePicture
  );
  const [tempProfilePictureId, setTempProfilePictureId] = useState<number | string>(
    profilePicture
  );
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setProfilePictureId(profilePicture);
    setTempProfilePictureId(profilePicture);
  }, [profilePicture]);

  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "profile-menu",
  });

  const prevLevelXp = Math.max(0, xpLine.prevLevelXp);
  const nextLevelXp = Math.max(prevLevelXp, xpLine.nextLevelXp);
  const levelRange = nextLevelXp - prevLevelXp;
  const normalizedCurrentXp = Math.max(currentXp, prevLevelXp);
  const progress =
    levelRange > 0
      ? ((Math.min(normalizedCurrentXp, nextLevelXp) - prevLevelXp) /
          levelRange) *
        100
      : 0;

  const handleApplyChanges = () => {
    if (hasChanges) {
      setProfilePictureId(tempProfilePictureId);
      onUpdateAvatar?.(Number(tempProfilePictureId));
      setHasChanges(false);
    }
    setProfilePickerVisible(false);
  };

  const handleCancelChanges = () => {
    setTempProfilePictureId(profilePictureId);
    setHasChanges(false);
    setProfilePickerVisible(false);
  };

  return (
    <Flex
      flexDirection={"column"}
      gap={2}
      w={"100%"}
      color={"white"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box padding={4}>
        <ProfilePicture
          profilePictureId={profilePickerVisible ? tempProfilePictureId : profilePictureId}
          onClick={() => setProfilePickerVisible(true)}
          editMode={profilePickerVisible}
          border={profilePickerVisible}
          hover={{
            border: `1px solid rgba(255, 255, 255, 0.6)`,
            boxShadow: `0px 0px 14px 1px rgba(255, 255, 255, 0.6)`,
            transform: "scale(1.05)",
            transition: "all 0.2s ease-in-out",
          }}
        />
      </Box>
      <Heading fontSize={"sm"}>{username}</Heading>
      <Flex
        border={"1px"}
        borderColor={"white"}
        borderRadius={"full"}
        px={8}
        mb={2}
        fontSize={"xs"}
      >
        {t("level")} {level}
      </Flex>
      <Collapse
        in={profilePickerVisible}
        animateOpacity
        style={{ padding: 12 }}
      >
        <ProfilePicturePicker
          onClose={handleCancelChanges}
          onSelect={(id) => {
            setTempProfilePictureId(id);
            setHasChanges(true);
          }}
          onApply={handleApplyChanges}
          hasChanges={hasChanges}
        />
      </Collapse>
      <Flex
        gap={4}
        alignItems={"center"}
        justifyContent={"center"}
      >
        {/* <ProfileStat title={t("streaks")} value={streak} suffix={t("days")} /> */}
        <ProfileStat title={t("games")} value={games} />
        <ProfileStat title={t("victories")} value={victories} />
        <ProfileStat title={t("total-xp")} value={totalXp} />
      </Flex>
      <Box my={2} borderRadius="md" width="100%" maxW="600px">
        <Flex justify="space-between" gap={1} align="center">
          <Box>
            <Text
              fontSize="10px"
              textTransform="uppercase"
              fontWeight="500"
              width={"auto"}
            >
              {t("my-xp")}
            </Text>
            <Heading
              textAlign="right"
              fontSize="sm"
              mr={0.5}
              mt={-1}
              variant="italic"
              width={"auto"}
            >
              {currentXp}
            </Heading>
          </Box>

          <Box>
            <Text
              textAlign={"right"}
              fontSize="10px"
              textTransform="uppercase"
              fontWeight="500"
              width={"auto"}
            >
              {t("next-level")}
            </Text>
            <Heading
              width={"auto"}
              fontSize="sm"
              ml={0.5}
              mt={-1}
              variant="italic"
            >
              {nextLevelXp}
            </Heading>
          </Box>
        </Flex>
        <ProgressBar progress={progress} color={VIOLET} />
      </Box>
    </Flex>
  );
};
