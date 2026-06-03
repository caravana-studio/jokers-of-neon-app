import { Haptics } from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";
import { Box, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DIAMONDS } from "../theme/colors";
import { Intensity } from "../types/intensity";
import AudioManager from "../audio/AudioManager";
import { clearLevel, clearRound } from "../constants/sfx";
import { triggerHaptic } from "../haptics";
import { useBackgroundAnimation } from "../providers/BackgroundAnimationProvider";
import { DailyStreakFireAnimation } from "./DailyStreakFireAnimation";
import {
  DailyStreakMilestoneProgress,
  isDailyStreakAtMilestone,
} from "./DailyStreakMilestoneProgress";
import { DailyStreakWeekProgress } from "./DailyStreakWeekProgress";
import { MobileBottomBar } from "./MobileBottomBar";
import { MobileDecoration } from "./MobileDecoration";
import { RollingNumber } from "./RollingNumber";

const CELEBRATION_INTRO_DURATION_MS = 2600;

const triggerEntryVibration = (duration: number) => {
  if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable("Haptics")) {
    return;
  }

  void Haptics.vibrate({ duration }).catch(() => {});
};

export interface DailyStreakSheetProps {
  streak: number;
  onClose: () => void;
  onContinue?: () => void;
  referenceDate?: Date;
  showCelebrationIntroOnEntry?: boolean;
}

export const DailyStreakSheet = ({
  streak,
  onClose,
  onContinue,
  referenceDate,
  showCelebrationIntroOnEntry = true,
}: DailyStreakSheetProps) => {
  const { t } = useTranslation("intermediate-screens");
  const { showLightPillarAnimation, hideLightPillarAnimation } = useBackgroundAnimation();
  const normalizedStreak = Number.isFinite(streak)
    ? Math.max(0, Math.floor(streak))
    : 0;
  const isMilestoneHit = isDailyStreakAtMilestone(normalizedStreak);
  const [showCelebrationIntro, setShowCelebrationIntro] = useState(
    showCelebrationIntroOnEntry
  );

  useEffect(() => {
    if (!showCelebrationIntroOnEntry) {
      setShowCelebrationIntro(false);
      return;
    }

    setShowCelebrationIntro(true);

    const timeoutId = window.setTimeout(() => {
      setShowCelebrationIntro(false);
    }, CELEBRATION_INTRO_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isMilestoneHit, normalizedStreak, showCelebrationIntroOnEntry]);

  useEffect(() => {
    AudioManager.getInstance().play(isMilestoneHit ? clearLevel : clearRound);
    triggerEntryVibration(isMilestoneHit ? 800 : 400);

    showLightPillarAnimation({
      intensityLevel: isMilestoneHit ? Intensity.MEDIUM : Intensity.LOW,
      persist: true,
    });

    return () => {
      hideLightPillarAnimation();
    };
  }, [
    hideLightPillarAnimation,
    isMilestoneHit,
    normalizedStreak,
    showLightPillarAnimation,
  ]);

  const getEntryTransition = (index: number) => ({
    delay: 0.12 + index * 0.28,
    duration: 0.46,
    ease: "easeOut" as const,
  });
  const getAnimationStartDelayMs = (index: number) =>
    Math.round((getEntryTransition(index).delay + getEntryTransition(index).duration) * 1000);

  return (
    <Flex
      position="fixed"
      inset={0}
      zIndex={1200}
      flexDirection="column"
      overflow="hidden"
    >
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
          overflowX="hidden"
          px={{ base: 5, sm: 6 }}
          pb={{ base: 4, sm: 6 }}
        >
          <Flex
            flexDirection="column"
            alignItems="center"
            gap={5}
            w="100%"
            maxW={{base: "460px", sm: "600px"}}
            mx="auto"
          >
            <Flex h={{ base: 5, sm: 14 }}></Flex>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={getEntryTransition(0)}
              style={{ width: "100%" }}
            >
              <Flex flexDirection="column" alignItems="center" gap={2}>
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
                    <motion.div
                      animate={
                        isMilestoneHit
                          ? {
                              scale: [1, 1.04, 1],
                              filter: [
                                `drop-shadow(0 0 6px ${DIAMONDS})`,
                                `drop-shadow(0 0 14px ${DIAMONDS})`,
                                `drop-shadow(0 0 6px ${DIAMONDS})`,
                              ],
                            }
                          : {
                              scale: 1,
                              filter: `drop-shadow(0 0 6px ${DIAMONDS})`,
                            }
                      }
                      transition={
                        isMilestoneHit
                          ? {
                              duration: 1.8,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.45,
                            }
                          : undefined
                      }
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transformOrigin: "center center",
                        willChange: "transform, filter",
                      }}
                    >
                      <Box
                        fontFamily="Orbitron"
                        fontSize={{ base: "72px", sm: "88px" }}
                        lineHeight={1}
                        fontWeight={600}
                        color={DIAMONDS}
                        display="block"
                        sx={{
                          "& span": {
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            lineHeight: "inherit",
                            fontWeight: "inherit",
                            color: "inherit",
                          },
                        }}
                      >
                        <RollingNumber
                          n={normalizedStreak}
                          className=""
                          delay={420}
                        />
                      </Box>
                    </motion.div>
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
              </Flex>
            </motion.div>

            {showCelebrationIntro ? (
              <Flex
                w="100%"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
                 flexGrow={1} minH={0}
              >
                <Flex
                  w="100%"
                  maxW="320px"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  gap={4}
                  px={2}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.42, ease: "easeOut" }}
                  >
                    <Text
                      fontFamily="Sonara"
                      fontSize={{ base: "22px", sm: "42px" }}
                      lineHeight={0.96}
                      textTransform="uppercase"
                      color="white"
                      textShadow="0 0 18px rgba(255,255,255,0.28)"
                      whiteSpace="nowrap"
                    >
                      {t("daily-streak.celebration-title")}
                    </Text>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.42, ease: "easeOut" }}
                  >
                    <Text
                      fontSize={{ base: "16px", sm: "22px" }}
                      lineHeight={1.2}
                      color="rgba(255,255,255,0.9)"
                    >
                      {t(
                        isMilestoneHit
                          ? "daily-streak.celebration-description"
                          : "daily-streak.celebration-description-extended"
                      )}
                    </Text>
                  </motion.div>
                </Flex>
              </Flex>
            ) : (
              <Flex flexDir="column" w="100%" gap={3} flexGrow={1} minH={0}>
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={getEntryTransition(1)}
                  style={{ width: "100%" }}
                >
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
                      animationStartDelayMs={getAnimationStartDelayMs(1)}
                      onStepActivated={() => triggerHaptic("interaction")}
                    />
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={getEntryTransition(2)}
                  style={{ width: "100%" }}
                >
                  <DailyStreakMilestoneProgress
                    streak={normalizedStreak}
                    animationStartDelayMs={getAnimationStartDelayMs(2) + 280}
                    onStepActivated={() => triggerHaptic("interaction")}
                  />
                </motion.div>
              </Flex>
            )}
          </Flex>
        </Flex>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={getEntryTransition(3)}
        >
          <MobileBottomBar
            firstButton={{
              onClick: onContinue ?? onClose,
              label: t("daily-streak.continue"),
            }}
          />
        </motion.div>
      </Flex>
    </Flex>
  );
};
