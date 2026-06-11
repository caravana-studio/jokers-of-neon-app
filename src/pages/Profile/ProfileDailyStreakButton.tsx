import { Box, Flex, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { DailyStreakFireAnimation } from "../../components/DailyStreakFireAnimation";
import { StreakProtectorSlots } from "../../components/StreakProtectorSlots";
import { DIAMONDS } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";

interface ProfileDailyStreakButtonProps {
  streak: number;
  streakProtectors?: number;
  onClick: () => void;
}

export const ProfileDailyStreakButton = ({
  streak,
  streakProtectors = 0,
  onClick,
}: ProfileDailyStreakButtonProps) => {
  const { t } = useTranslation("intermediate-screens");
  const normalizedStreak = Number.isFinite(streak)
    ? Math.max(0, Math.floor(streak))
    : 0;
  const isZeroStreak = normalizedStreak === 0;

  const { isSmallScreen } = useResponsiveValues();

  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      w="100%"
      display="block"
      my={2}
      p={0}
      border="none"
      bg="transparent"
      cursor="pointer"
      textAlign="initial"
    >
      <Flex
        w="100%"
        position="relative"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        px={2}
        py={1}
        borderRadius="20px"
        bg="rgba(0, 0, 0, 0.5)"
        boxShadow="0px 0px 8px rgba(255, 255, 255, 0.45), inset 0 0 5px rgba(255, 255, 255, 0.4)"
      >
        <Flex position="absolute" top={4} right={3}>
          <StreakProtectorSlots
            protectors={streakProtectors}
            iconSize={isSmallScreen ? 7 : 9}
          />
        </Flex>

        <Flex alignItems="center" gap={1} minW={0}>
          <Box flexShrink={0}>
            <DailyStreakFireAnimation size={88} grayscale={isZeroStreak} />
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
              color={isZeroStreak ? "grey" : DIAMONDS}
              textShadow={isZeroStreak ? "none" : `0 0 12px ${DIAMONDS}`}
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
    </Box>
  );
};
