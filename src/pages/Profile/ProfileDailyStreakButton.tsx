import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { DailyStreakFireAnimation } from "../../components/DailyStreakFireAnimation";
import { DIAMONDS } from "../../theme/colors";

interface ProfileDailyStreakButtonProps {
  streak: number;
  onClick: () => void;
}

export const ProfileDailyStreakButton = ({
  streak,
  onClick,
}: ProfileDailyStreakButtonProps) => {
  const { t } = useTranslation("intermediate-screens");
  const normalizedStreak = Number.isFinite(streak)
    ? Math.max(0, Math.floor(streak))
    : 0;

  return (
    <Button
      variant="unstyled"
      onClick={onClick}
      h="auto"
      w="100%"
      my={2}
      minW={0}
    >
      <Flex
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        px={2}
        py={1}
        borderRadius="20px"
        bg="rgba(0, 0, 0, 0.5)"
        boxShadow="0px 0px 8px rgba(255, 255, 255, 0.45), inset 0 0 5px rgba(255, 255, 255, 0.4)"
      >
        <Flex alignItems="center" gap={1} minW={0}>
          <Box flexShrink={0}>
            <DailyStreakFireAnimation size={88} />
          </Box>

          <Flex flexDirection="column" alignItems="flex-start" gap={0.5} minW={0}>
            <Text
              fontSize={{ base: "12px", sm: "14px" }}
              lineHeight={0.95}
              fontFamily="Sonara"
              textTransform="uppercase"
              color="white"
            >
              {t("daily-streak.title")}
            </Text>
            <Text
              fontSize={{ base: "40px", sm: "45px" }}
              lineHeight={1}
              fontFamily="Orbitron"
              fontWeight={700}
              color={DIAMONDS}
              textShadow={`0 0 12px ${DIAMONDS}`}
            >
              {normalizedStreak}
            </Text>
          </Flex>
        </Flex>

        <Flex
          alignSelf="stretch"
          alignItems="flex-end"
          color="white"
          fontSize="14px"
          pb={0.5}
          flexShrink={0}
          m={3}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </Flex>
      </Flex>
    </Button>
  );
};
