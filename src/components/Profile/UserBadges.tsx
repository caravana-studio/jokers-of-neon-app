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
      <Heading py={1}>
        My Badges{" "}
        <Text as="span" ml={1}>
          ({currentBadges}/{totalBadges})
        </Text>
      </Heading>
      <Flex position={"relative"}>
        <Flex gap={4} justifyContent={"center"} alignItems={"center"}>
          <UserBadge />
          <UserBadge />
          <UserBadge />
        </Flex>
        <Heading position={"absolute"}>Coming soon</Heading>
      </Flex>
    </Flex>
  );
};
