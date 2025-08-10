import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { ProfileStat } from "./ProfileStat";
import { ProgressBar } from "../CompactRoundData/ProgressBar";
import { VIOLET } from "../../theme/colors";

export interface ProfileStatsProps {
  profilePictureUrl?: string;
  username: string;
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
  return (
    <Flex
      flexDirection={"column"}
      gap={2}
      w={"100%"}
      color={"white"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Flex
        w={"140px"}
        height={"140px"}
        rounded={"full"}
        backgroundColor={"gray"}
        backgroundImage={{ profilePictureUrl }}
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
        Level {level}
      </Flex>
      <Flex
        gap={4}
        alignItems={"center"}
        justifyContent={"center"}
        width={"100%"}
      >
        <ProfileStat title={"Streak"} value={streak} suffix="days" />
        <ProfileStat title={"Games"} value={games} />
        <ProfileStat title={"Victories"} value={victories} />
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
              My xp
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
              Next lvl
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
