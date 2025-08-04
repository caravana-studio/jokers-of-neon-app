import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { ProfileStat } from "./ProfileStat";
import { ProgressBar } from "../CompactRoundData/ProgressBar";

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
        w={"100px"}
        height={"100px"}
        rounded={"full"}
        backgroundImage={{ profilePictureUrl }}
      ></Flex>
      <Text>{username}</Text>
      <Flex border={1} borderColor={"white"} borderRadius={"md"}>
        Level {level}
      </Flex>
      <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
        <ProfileStat title={"Streak"} value={streak} suffix="days" />
        <ProfileStat title={"Games"} value={games} />
        <ProfileStat title={"Victories"} value={victories} />
      </Flex>
      <Box my={2} borderRadius="md" width="100%" maxW="600px">
        <Flex justify="center" gap={1} align="center">
          <Box>
            <Text
              textAlign="right"
              fontSize="10px"
              textTransform="uppercase"
              fontWeight="500"
            >
              My xp
            </Text>
            <Heading
              textAlign="right"
              fontSize="md"
              mr={0.5}
              mt={-1}
              variant="italic"
              width="50px"
            >
              {levelXp}
            </Heading>
          </Box>

          <Box>
            <Text fontSize="10px" textTransform="uppercase" fontWeight="500">
              Next lvl
            </Text>
            <Heading
              width="50px"
              fontSize="md"
              ml={0.5}
              mt={-1}
              variant="italic"
            >
              {currentXp}
            </Heading>
          </Box>
        </Flex>
        <ProgressBar progress={(currentXp / levelXp) * 100} />
      </Box>
    </Flex>
  );
};
