import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { DIAMONDS } from "../theme/colors";
import { DailyStreakFireAnimation } from "./DailyStreakFireAnimation";
import { DailyStreakWeekProgress } from "./DailyStreakWeekProgress";

export interface DailyStreakSheetProps {
  isOpen: boolean;
  streak: number;
  onClose: () => void;
  onContinue?: () => void;
  referenceDate?: Date;
}

export const DailyStreakSheet = ({
  isOpen,
  streak,
  onClose,
  onContinue,
  referenceDate,
}: DailyStreakSheetProps) => {
  const normalizedStreak = Number.isFinite(streak)
    ? Math.max(0, Math.floor(streak))
    : 0;

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay
        bg="rgba(0, 0, 0, 0.7)"
        sx={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      />

      <DrawerContent
        w="100vw"
        maxW="100vw"
        mb={0}
        bg="#000000"
        color="white"
        borderTopRadius="32px"
        borderTop={`1px solid rgba(255, 147, 75, 0.45)`}
        boxShadow="0 -12px 40px rgba(255, 147, 75, 0.16)"
        overflow="hidden"
      >
        <DrawerBody
          px={{ base: 5, sm: 6 }}
          pt={3}
          pb="calc(28px + env(safe-area-inset-bottom))"
          bg="#000000"
        >
          <Flex
            flexDirection="column"
            alignItems="center"
            gap={6}
            w="100%"
            maxW="460px"
            mx="auto"
          >
            <Box
              w="56px"
              h="5px"
              borderRadius="full"
              bg="rgba(255, 255, 255, 0.2)"
            />

            <Flex
              w="100%"
              flexDirection="column"
              alignItems="center"
              gap={5}
              borderRadius="28px"
              px={{ base: 5, sm: 6 }}
              py={{ base: 5, sm: 6 }}
              bg="#050505"
              border={`1px solid rgba(255, 147, 75, 0.22)`}
              boxShadow="inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 40px rgba(0, 0, 0, 0.45)"
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
                  color="rgba(255, 255, 255, 0.68)"
                >
                  Neon Streak
                </Text>
                <Text
                  fontFamily="Orbitron"
                  fontSize={{ base: "40px", sm: "48px" }}
                  lineHeight={1}
                  fontWeight={800}
                  color={DIAMONDS}
                  textShadow="0 0 24px rgba(255, 147, 75, 0.2)"
                >
                  {normalizedStreak}
                </Text>
                <Heading
                  as="h2"
                  fontSize={{ base: "31px", sm: "36px" }}
                  lineHeight={1}
                  fontWeight={800}
                  letterSpacing="-0.03em"
                  textTransform="none"
                  color="white"
                >
                  Daily Streak
                </Heading>
                <Text
                  textAlign="center"
                  color="rgba(255, 255, 255, 0.72)"
                  fontSize={{ base: "14px", sm: "15px" }}
                  maxW="320px"
                >
                  Play a hand each day to keep your neon run charged.
                </Text>
              </Flex>
            </Flex>

            <Box
              w="100%"
              bg="#050505"
              border={`1px solid rgba(255, 147, 75, 0.18)`}
              borderRadius="24px"
              px={{ base: 4, sm: 5 }}
              py={4}
              boxShadow="inset 0 1px 0 rgba(255,255,255,0.04)"
            >
              <DailyStreakWeekProgress
                streak={normalizedStreak}
                referenceDate={referenceDate}
              />
            </Box>

            <Button
              w="100%"
              h="56px"
              size="md"
              bg={DIAMONDS}
              boxShadow={`0 0 20px rgba(255, 147, 75, 0.24)`}
              _hover={{
                bg: "#FF9F5B",
              }}
              _active={{
                bg: "#F18839",
              }}
              onClick={onContinue ?? onClose}
            >
              Continue
            </Button>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
