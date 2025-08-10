import { Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { UserBadge } from "./UserBadge";
import { useTranslation } from "react-i18next";

interface UserBadgesProps {
  currentBadges: number;
  totalBadges: number;
}

export const UserBadges: React.FC<UserBadgesProps> = ({
  currentBadges,
  totalBadges,
}) => {
  const { t } = useTranslation("game");

  return (
    <Flex
      flexDirection={"column"}
      gap={1}
      my={2}
      opacity={0.7}
      justifyContent={"center"}
    >
      <Heading py={1} fontSize="xs" mr={0.5} mt={-1} variant="italic">
        {t("game.profile-menu.my-badges")}{" "}
        <Text as="span" ml={1}>
          ({currentBadges}/{totalBadges})
        </Text>
      </Heading>
      <Divider borderColor="white" borderWidth="1px" mb={4} />
      <Flex
        position={"relative"}
        width={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Flex gap={4} justifyContent={"center"} alignItems={"center"}>
          <UserBadge />
          <UserBadge />
          <UserBadge />
        </Flex>
        <Heading
          position={"absolute"}
          textAlign={"center"}
          width={"100%"}
          top={"50%"}
          left={"50%"}
          transform={"translate(-50%, -50%)"}
          variant={"italic"}
        >
          {t("game.profile-menu.coming-soon")}
        </Heading>
      </Flex>
    </Flex>
  );
};
