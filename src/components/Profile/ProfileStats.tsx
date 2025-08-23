import { Box, Collapse, Flex, Heading, Text } from "@chakra-ui/react";
import { ProfileStat } from "./ProfileStat";
import { ProgressBar } from "../CompactRoundData/ProgressBar";
import { VIOLET } from "../../theme/colors";
import { useTranslation } from "react-i18next";
import { ProfilePicture } from "./ProfilePicture";
import { ProfilePicturePicker } from "./ProfilePicturePicker";
import { useState } from "react";

export interface ProfileStatsProps {
  profilePictureUrl?: string;
  username: string | null;
  level: number;
  streak: number;
  games: number;
  victories: number;
  currentXp: number;
  levelXp: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  profilePictureUrl,
  username,
  level,
  streak,
  games,
  victories,
  currentXp,
  levelXp,
}) => {
  const { t } = useTranslation("game");
  const [profilePickerVisible, setProfilePickerVisible] = useState(false);
  const [profilePictureId, setProfilePictureId] = useState<number | string>(7);

  return (
    <Flex
      flexDirection={"column"}
      gap={2}
      w={"100%"}
      color={"white"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <ProfilePicture
        profilePictureId={profilePictureId}
        onClick={() => setProfilePickerVisible(true)}
        editMode={profilePickerVisible}
        hover={{
          border: `1px solid rgba(255, 255, 255, 0.6)`,
          boxShadow: `0px 0px 14px 1px rgba(255, 255, 255, 0.6)`,
          transform: "scale(1.05)",
          transition: "all 0.2s ease-in-out",
        }}
      />
      <Heading fontSize={"sm"}>{username}</Heading>
      <Flex
        border={"1px"}
        borderColor={"white"}
        borderRadius={"full"}
        px={8}
        mb={2}
        fontSize={"xs"}
      >
        {t("game.profile-menu.level")} {level}
      </Flex>
      <Collapse
        in={profilePickerVisible}
        animateOpacity
        style={{ padding: 12 }}
      >
        <ProfilePicturePicker
          onClose={() => setProfilePickerVisible(false)}
          onSelect={(id) => setProfilePictureId(id)}
        />
      </Collapse>
      <Flex
        gap={4}
        alignItems={"center"}
        justifyContent={"center"}
        width={"100%"}
      >
        <ProfileStat
          title={t("game.profile-menu.streaks")}
          value={streak}
          suffix={t("game.profile-menu.days")}
        />
        <ProfileStat title={t("game.profile-menu.games")} value={games} />
        <ProfileStat
          title={t("game.profile-menu.victories")}
          value={victories}
        />
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
              {t("game.profile-menu.my-xp")}
            </Text>
            <Heading
              textAlign="right"
              fontSize="sm"
              mr={0.5}
              mt={-1}
              variant="italic"
              width={"auto"}
            >
              {levelXp}
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
              {t("game.profile-menu.next-level")}
            </Text>
            <Heading
              width={"auto"}
              fontSize="sm"
              ml={0.5}
              mt={-1}
              variant="italic"
            >
              {currentXp}
            </Heading>
          </Box>
        </Flex>
        <ProgressBar progress={(currentXp / levelXp) * 100} color={VIOLET} />
      </Box>
    </Flex>
  );
};
