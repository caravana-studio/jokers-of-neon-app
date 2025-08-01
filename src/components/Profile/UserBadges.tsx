import { Flex, Heading, Text } from "@chakra-ui/react";
import { UserBadge } from "./UserBadge";

interface UserBadgesProps {
  currentBadges: number;
  totalBadges: number;
}

export const UserBadges: React.FC<UserBadgesProps> = ({
  currentBadges,
  totalBadges,
}) => {
  return (
    <Flex>
      <Heading py={4}>
        My Badges{" "}
        <Text as="span">
          ({currentBadges}/{totalBadges})
        </Text>
      </Heading>
      <Flex gap={4} justifyContent={"center"} alignItems={"center"}>
        <UserBadge />
        <UserBadge />
        <UserBadge />
      </Flex>
    </Flex>
  );
};
