import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useToast,
  VStack,
  HStack,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";
import { useTranslation } from "react-i18next";
import { FiShare2, FiCopy, FiArrowLeft, FiGift, FiUsers } from "react-icons/fi";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";
import { useDojo } from "../dojo/DojoContext";
import { useUsername } from "../dojo/utils/useUsername";
import {
  createReferralCode,
  getReferralStats,
  generateReferralLink,
} from "../api/referral";
import {
  generateNativeInviteUrl,
  logReferralInvite,
} from "../utils/appsflyer";
import { useResponsiveValues } from "../theme/responsiveSettings";

interface ReferralMilestone {
  milestone_type: string;
  referee_address: string;
  referee_username: string | null;
  reward_given: boolean;
  reward_type: string;
  reward_amount: number;
  created_at: string;
}

interface ReferralStats {
  referral_code: string | null;
  total_claims: number;
  valid_claims: number;
  fraudulent_claims: number;
  rewards_given: number;
  claims: Array<{
    referee_username: string | null;
    created_at: string;
  }>;
  milestones: ReferralMilestone[];
}

// Activity feed item component
const ActivityItem = ({
  milestone,
  t,
}: {
  milestone: ReferralMilestone;
  t: (key: string, options?: Record<string, unknown>) => string;
}) => {
  const username = milestone.referee_username || "???";
  const eventKey = `referral.activity.events.${milestone.milestone_type}`;
  const message = t(eventKey, { username });

  const timeAgo = getTimeAgo(new Date(milestone.created_at));

  return (
    <HStack
      w="100%"
      p={3}
      bg="whiteAlpha.100"
      borderRadius="lg"
      spacing={3}
      borderLeft="3px solid"
      borderLeftColor={milestone.reward_given ? "green.400" : "yellow.400"}
    >
      <Box
        p={2}
        borderRadius="full"
        bg={milestone.reward_given ? "green.500" : "yellow.500"}
      >
        <FiGift size={16} />
      </Box>
      <VStack align="start" spacing={0} flex={1}>
        <Text fontSize="sm" fontWeight="medium">
          {message}
        </Text>
        <Text fontSize="xs" color="whiteAlpha.600">
          {timeAgo}
        </Text>
      </VStack>
      {milestone.reward_type && (
        <Box
          px={2}
          py={1}
          bg={milestone.reward_given ? "green.900" : "yellow.900"}
          borderRadius="md"
        >
          <Text fontSize="xs" fontWeight="bold">
            +{milestone.reward_amount} {milestone.reward_type}
          </Text>
        </Box>
      )}
    </HStack>
  );
};

// Helper to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Stat box component
const StatBox = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) => (
  <VStack
    flex={1}
    p={4}
    bg="whiteAlpha.100"
    borderRadius="xl"
    spacing={1}
  >
    <Box color="purple.300">{icon}</Box>
    <Text fontSize="2xl" fontWeight="bold">
      {value}
    </Text>
    <Text fontSize="xs" color="whiteAlpha.700" textAlign="center">
      {label}
    </Text>
  </VStack>
);

export const ReferralPage = () => {
  const navigate = useNavigate();
  const toast = useToast({ position: "top", duration: 2000 });
  const { t } = useTranslation("referral");
  const { isSmallScreen } = useResponsiveValues();
  const {
    account: { account },
  } = useDojo();
  const username = useUsername();

  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const userAddress = account?.address;
  const isNative = Capacitor.isNativePlatform();

  // Load data
  const loadData = useCallback(async () => {
    if (!userAddress) {
      setInitialLoading(false);
      return;
    }

    try {
      console.log("[ReferralPage] Loading stats for:", userAddress);
      const statsData = await getReferralStats(userAddress);
      console.log("[ReferralPage] Stats received:", statsData);
      console.log("[ReferralPage] Claims:", statsData?.claims);
      console.log("[ReferralPage] Milestones:", statsData?.milestones);
      setStats(statsData);
      if (statsData.referral_code) {
        setReferralCode(statsData.referral_code);
      }
    } catch (error) {
      console.error("Failed to load referral stats:", error);
    } finally {
      setInitialLoading(false);
    }
  }, [userAddress]);

  // Load initial data and set up polling
  useEffect(() => {
    loadData();

    // Poll every 30 seconds when page is visible
    const pollInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadData();
      }
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadData();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadData]);

  const handleCreateCode = async () => {
    if (!userAddress) return;

    if (!username) {
      toast({ title: t("referral.need-username"), status: "warning" });
      return;
    }

    setLoading(true);
    try {
      const code = await createReferralCode(userAddress, username);
      setReferralCode(code);
      await loadData();
    } catch (error) {
      console.error("Failed to create code:", error);
      toast({ title: "Error creating code", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!referralCode) return;

    setLoading(true);
    try {
      // Try to generate OneLink URL first (for native)
      let linkToShare = generateReferralLink(referralCode);

      if (isNative) {
        const oneLinkUrl = await generateNativeInviteUrl(referralCode);
        if (oneLinkUrl) {
          linkToShare = oneLinkUrl;
        }
      }

      if (isNative) {
        await Share.share({
          title: "Join Jokers of Neon!",
          text: "Play Jokers of Neon with me and get rewards!",
          url: linkToShare,
          dialogTitle: "Share your referral link",
        });
        await logReferralInvite(referralCode, "native_share");
      } else if (navigator.share) {
        await navigator.share({
          title: "Join Jokers of Neon!",
          text: "Play Jokers of Neon with me!",
          url: linkToShare,
        });
      } else {
        await navigator.clipboard.writeText(linkToShare);
        toast({ title: t("referral.link-copied"), status: "success" });
      }
    } catch (error) {
      // User cancelled share
      console.log("Share cancelled:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!referralCode) return;

    const link = generateReferralLink(referralCode);
    await navigator.clipboard.writeText(link);
    toast({ title: t("referral.copied"), status: "success" });
  };

  // Combine claims and milestones into activity feed, sorted by date
  const activityFeed = stats?.milestones
    ?.slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    || [];

  const pendingRewards = stats?.milestones?.filter((m) => !m.reward_given).length || 0;
  const claimedRewards = stats?.rewards_given || 0;

  if (initialLoading) {
    return (
      <DelayedLoading ms={0}>
        <MobileDecoration />
        <Flex
          w="100%"
          h="100vh"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="xl" color="purple.400" />
        </Flex>
      </DelayedLoading>
    );
  }

  return (
    <DelayedLoading ms={0}>
      <MobileDecoration />
      <Flex
        flexDirection="column"
        w="100%"
        minH="100vh"
        color="white"
        maxW={{ base: "100%", md: "600px" }}
        mx="auto"
        p={{ base: 4, md: 8 }}
        pb={24}
        justifyContent={{ base: "flex-start", md: "center" }}
      >
        {/* Header */}
        <HStack justify="space-between" mb={4}>
          <IconButton
            aria-label="Back"
            icon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => navigate(-1)}
          />
          <Heading size="md">{t("referral.title")}</Heading>
          <Box w="40px" /> {/* Spacer for alignment */}
        </HStack>

        {/* Subtitle */}
        <Text
          textAlign="center"
          color="whiteAlpha.700"
          fontSize="sm"
          mb={6}
        >
          {t("referral.subtitle")}
        </Text>

        {/* Referral Code Section */}
        <Box
          bgGradient="linear(to-br, purple.900, blue.900)"
          p={6}
          borderRadius="2xl"
          mb={6}
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          {referralCode ? (
            <VStack spacing={4}>
              <Text fontSize="sm" color="whiteAlpha.700">
                {t("referral.your-code")}
              </Text>
              <Box
                bg="whiteAlpha.200"
                px={6}
                py={3}
                borderRadius="xl"
                border="2px dashed"
                borderColor="purple.400"
              >
                <Text
                  fontSize={isSmallScreen ? "2xl" : "3xl"}
                  fontWeight="bold"
                  letterSpacing="wider"
                  color="white"
                >
                  {referralCode}
                </Text>
              </Box>
              <HStack spacing={3} w="100%">
                <Button
                  flex={1}
                  leftIcon={<FiShare2 size={18} />}
                  colorScheme="purple"
                  size="md"
                  onClick={handleShare}
                  isLoading={loading}
                >
                  {t("referral.share-btn")}
                </Button>
                <Button
                  leftIcon={<FiCopy size={18} />}
                  size="md"
                  variant="outline"
                  borderColor="whiteAlpha.400"
                  _hover={{ bg: "whiteAlpha.200" }}
                  onClick={handleCopy}
                >
                  {t("referral.copy-btn")}
                </Button>
              </HStack>
            </VStack>
          ) : (
            <VStack spacing={4}>
              <Text fontSize="sm" color="whiteAlpha.700" textAlign="center">
                {t("referral.create-code")}
              </Text>
              <Button
                w="100%"
                colorScheme="purple"
                size="md"
                onClick={handleCreateCode}
                isLoading={loading}
                isDisabled={!userAddress || !username}
              >
                {t("referral.create-code-btn")}
              </Button>
              {!username && (
                <Text fontSize="xs" color="orange.300">
                  {t("referral.need-username")}
                </Text>
              )}
            </VStack>
          )}
        </Box>

        {/* Stats */}
        {stats && (
          <HStack spacing={3} mb={6}>
            <StatBox
              icon={<FiUsers size={24} />}
              value={stats.valid_claims}
              label={t("referral.stats.friends-invited")}
            />
            <StatBox
              icon={<FiGift size={24} />}
              value={claimedRewards + pendingRewards}
              label={t("referral.stats.rewards-earned")}
            />
          </HStack>
        )}

        {/* Activity Feed */}
        <VStack align="stretch" spacing={3} flex={1}>
          <Heading size="sm" color="whiteAlpha.900">
            {t("referral.activity.title")}
          </Heading>

          {activityFeed.length > 0 ? (
            <VStack spacing={2} align="stretch">
              {activityFeed.map((milestone, index) => (
                <ActivityItem
                  key={`${milestone.milestone_type}-${milestone.referee_address}-${index}`}
                  milestone={milestone}
                  t={t}
                />
              ))}
            </VStack>
          ) : (
            <Box
              p={6}
              bg="whiteAlpha.50"
              borderRadius="xl"
              textAlign="center"
            >
              <Text color="whiteAlpha.600" fontSize="sm">
                {t("referral.activity.empty")}
              </Text>
            </Box>
          )}
        </VStack>
      </Flex>
    </DelayedLoading>
  );
};

// Keep old export for backwards compatibility
export { ReferralPage as ReferralTestPage };
