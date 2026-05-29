import { Box, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DIAMONDS } from "../theme/colors";
import { Intensity } from "../types/intensity";
import { GalaxyBackground } from "./backgrounds/galaxy/GalaxyBackground";
import { DailyStreakFireAnimation } from "./DailyStreakFireAnimation";
import { DailyStreakMilestoneProgress } from "./DailyStreakMilestoneProgress";
import { DailyStreakWeekProgress } from "./DailyStreakWeekProgress";
import { MobileBottomBar } from "./MobileBottomBar";
import { MobileDecoration } from "./MobileDecoration";

export interface DailyStreakSheetProps {
  streak: number;
  onClose: () => void;
  onContinue?: () => void;
  referenceDate?: Date;
}

export const DailyStreakSheet = ({
  streak,
  onClose,
  onContinue,
  referenceDate,
}: DailyStreakSheetProps) => {
  const { t } = useTranslation("intermediate-screens");
  const normalizedStreak = Number.isFinite(streak)
    ? Math.max(0, Math.floor(streak))
    : 0;

  return (
    <Flex
      position="fixed"
      inset={0}
      zIndex={1200}
      flexDirection="column"
      overflow="hidden"
    >
      <GalaxyBackground
        opacity={0.75}
        intensity={Intensity.LOW}
        filter="saturate(1.1)"
      />
      <MobileDecoration />

      <Flex
        position="relative"
        zIndex={2}
        w="100%"
        h="100%"
        flexDirection="column"
        justifyContent="space-between"
        pb={{ base: 2, sm: 4 }}
      >
        <Flex
          flex="1"
          minH={0}
          overflowY="auto"
          px={{ base: 5, sm: 6 }}
          pb={{ base: 4, sm: 6 }}
        >
          <Flex
            flexDirection="column"
            alignItems="center"
            gap={5}
            w="100%"
            maxW="460px"
            mx="auto"
          >
            <Flex h={{ base: 10, sm: 14 }}></Flex>
            <Flex
              w="100%"
              flexDirection="column"
              alignItems="center"
              gap={5}
              borderRadius="28px"
              px={{ base: 5, sm: 6 }}
              py={{ base: 5, sm: 6 }}
              bg="rgba(0, 0, 0, 0.3)"
              boxShadow="0px 0px 8px rgba(255, 255, 255, 0.5), inset 0 0 5px rgba(255, 255, 255, 0.5)"
            >
              <Box
                position="relative"
                borderRadius="full"
                bg="rgba(255, 147, 75, 0.08)"
                p={2}
              >
                <DailyStreakFireAnimation size={112} />
              </Box>

              <Flex flexDirection="column" alignItems="center" gap={2}>
                <Text
                  fontFamily="Orbitron"
                  fontSize={{ base: "15px", sm: "16px" }}
                  letterSpacing="0.24em"
                  textTransform="uppercase"
                  color="white"
                >
                  {t("daily-streak.title")}
                </Text>
                <Text
                  fontFamily="Orbitron"
                  fontSize={{ base: "72px", sm: "88px" }}
                  lineHeight={1}
                  fontWeight={600}
                  color={DIAMONDS}
                  textShadow={`0 0 10px ${DIAMONDS}`}
                >
                  {normalizedStreak}
                </Text>
                <Text
                  textAlign="center"
                  color="rgba(255, 255, 255, 0.72)"
                  fontSize={{ base: "14px", sm: "15px" }}
                  maxW="320px"
                >
                  {t("daily-streak.description")}
                </Text>
              </Flex>
            </Flex>

            <Box
              w="100%"
              borderRadius="24px"
              px={{ base: 4, sm: 5 }}
              py={4}
              bg="rgba(0, 0, 0, 0.3)"
              boxShadow="0px 0px 8px rgba(255, 255, 255, 0.5), inset 0 0 5px rgba(255, 255, 255, 0.5)"
            >
              <DailyStreakWeekProgress
                streak={normalizedStreak}
                referenceDate={referenceDate}
              />
            </Box>

            <DailyStreakMilestoneProgress streak={normalizedStreak} />
          </Flex>
        </Flex>

        <MobileBottomBar
          firstButton={{
            onClick: onContinue ?? onClose,
            label: "Continue",
            variant: "secondarySolid",
          }}
        />
      </Flex>
    </Flex>
  );
};
