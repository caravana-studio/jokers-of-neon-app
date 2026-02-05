import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useToast,
  VStack,
  HStack,
  Code,
  Badge,
  IconButton,
  Collapse,
  useDisclosure,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";
import {
  FiChevronDown,
  FiChevronUp,
  FiCopy,
  FiShare2,
  FiRefreshCw,
  FiTrash2,
  FiArrowLeft,
} from "react-icons/fi";
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
  getAppsFlyerUID,
  getDeviceId,
} from "../utils/appsflyer";
import {
  getPendingReferralData,
  getPendingConversionData,
  clearPendingReferralData,
  clearPendingConversionData,
} from "../utils/appsflyerReferral";
import { useAppsFlyerReferral } from "../hooks/useAppsFlyerReferral";

interface ReferralClaim {
  id: number;
  referee_address: string;
  referee_username: string | null;
  flagged_as_fraud: boolean;
  fraud_reason: string | null;
  reward_given: boolean;
  created_at: string;
}

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
  claims: ReferralClaim[];
  milestones: ReferralMilestone[];
}

// Collapsible section component
const Section = ({
  title,
  defaultOpen = false,
  children,
  badge,
  headerRight,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: string;
  headerRight?: React.ReactNode;
}) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: defaultOpen });

  return (
    <Box bg="gray.800" borderRadius="lg" overflow="hidden">
      <HStack
        p={3}
        justify="space-between"
        cursor="pointer"
        onClick={onToggle}
        _hover={{ bg: "gray.700" }}
        transition="background 0.2s"
      >
        <HStack spacing={2}>
          <Text fontWeight="bold" fontSize="sm">
            {title}
          </Text>
          {badge && (
            <Badge colorScheme="green" fontSize="xs">
              {badge}
            </Badge>
          )}
        </HStack>
        <HStack spacing={2}>
          {headerRight}
          <IconButton
            aria-label="toggle"
            icon={isOpen ? <FiChevronUp /> : <FiChevronDown />}
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          />
        </HStack>
      </HStack>
      <Collapse in={isOpen}>
        <Box p={3} pt={0} borderTop="1px" borderColor="gray.700">
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

// Stat card component
const StatCard = ({
  label,
  value,
  colorScheme = "gray",
}: {
  label: string;
  value: string | number;
  colorScheme?: string;
}) => (
  <Box bg="gray.700" p={2} borderRadius="md" textAlign="center">
    <Text fontSize="xs" color="gray.400">
      {label}
    </Text>
    <Text fontWeight="bold" fontSize="md" color={`${colorScheme}.300`}>
      {value}
    </Text>
  </Box>
);

export const ReferralTestPage = () => {
  const navigate = useNavigate();
  const toast = useToast({ position: "top", duration: 2000 });
  const {
    account: { account },
  } = useDojo();
  const username = useUsername();

  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [appsFlyerUID, setAppsFlyerUID] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  // Hook data
  const { referralData, conversionData, state } = useAppsFlyerReferral();

  // Pending data from localStorage
  const [pendingReferral, setPendingReferral] = useState<unknown>(null);
  const [pendingConversion, setPendingConversion] = useState<unknown>(null);

  const userAddress = account?.address;
  const isNative = Capacitor.isNativePlatform();
  const shortAddress = userAddress
    ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
    : "N/A";

  // Load initial data and set up polling
  useEffect(() => {
    loadData();

    // Set up 30-second polling interval when page is visible
    const pollInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadData();
      }
    }, 30000);

    // Handle visibility change to refresh immediately when page becomes visible
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
  }, [userAddress]);

  const loadData = async () => {
    setPendingReferral(getPendingReferralData());
    setPendingConversion(getPendingConversionData());

    const uid = await getAppsFlyerUID();
    const devId = await getDeviceId();
    setAppsFlyerUID(uid);
    setDeviceId(devId);

    if (userAddress) {
      try {
        const statsData = await getReferralStats(userAddress);
        setStats(statsData);
        if (statsData.referral_code) {
          setReferralCode(statsData.referral_code);
        }
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    }
  };

  const handleCreateCode = async () => {
    if (!userAddress) {
      toast({ title: "Not logged in", status: "error" });
      return;
    }

    if (!username) {
      toast({ title: "Set username first", status: "error" });
      return;
    }

    setLoading(true);
    try {
      const code = await createReferralCode(userAddress, username);
      setReferralCode(code);
      toast({ title: `Code: ${code}`, status: "success" });
      await loadData();
    } catch (error) {
      toast({ title: "Failed", description: String(error), status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    if (!referralCode) {
      toast({ title: "No code", status: "error" });
      return;
    }

    setLoading(true);
    try {
      const url = await generateNativeInviteUrl(referralCode);

      if (url) {
        setGeneratedLink(url);
        await logReferralInvite(referralCode, "test_share");
      } else {
        const fallbackUrl = generateReferralLink(referralCode);
        setGeneratedLink(fallbackUrl);
      }
      toast({ title: "Link ready!", status: "success" });
    } catch (error) {
      toast({ title: "Failed", description: String(error), status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const linkToShare =
      generatedLink || (referralCode ? generateReferralLink(referralCode) : null);

    if (!linkToShare) {
      toast({ title: "Generate link first", status: "warning" });
      return;
    }

    try {
      // Use native share on mobile
      if (isNative) {
        await Share.share({
          title: "Join Jokers of Neon!",
          text: "Play Jokers of Neon with me and get rewards!",
          url: linkToShare,
          dialogTitle: "Share your referral link",
        });
        await logReferralInvite(referralCode!, "native_share");
      } else {
        // Web fallback - try Web Share API first
        if (navigator.share) {
          await navigator.share({
            title: "Join Jokers of Neon!",
            text: "Play Jokers of Neon with me!",
            url: linkToShare,
          });
        } else {
          // Copy to clipboard as fallback
          await navigator.clipboard.writeText(linkToShare);
          toast({ title: "Link copied!", status: "success" });
        }
      }
    } catch (error) {
      // User cancelled share or error
      console.log("Share cancelled or failed:", error);
    }
  };

  const handleCopy = async () => {
    const linkToCopy =
      generatedLink || (referralCode ? generateReferralLink(referralCode) : null);

    if (linkToCopy) {
      await navigator.clipboard.writeText(linkToCopy);
      toast({ title: "Copied!", status: "success" });
    }
  };

  const handleClearPendingData = () => {
    clearPendingReferralData();
    clearPendingConversionData();
    setPendingReferral(null);
    setPendingConversion(null);
    toast({ title: "Cleared", status: "info" });
  };

  return (
    <DelayedLoading ms={0}>
      <MobileDecoration />
      <Flex
        flexDirection="column"
        gap={3}
        w="100%"
        color="white"
        maxW="500px"
        mx="auto"
        p={3}
        pb={20}
      >
        {/* Header */}
        <HStack justify="space-between" mb={1}>
          <IconButton
            aria-label="Back"
            icon={<FiArrowLeft />}
            size="sm"
            variant="ghost"
            onClick={() => navigate(-1)}
          />
          <Heading size="md">Referral</Heading>
          <IconButton
            aria-label="Refresh"
            icon={<FiRefreshCw />}
            size="sm"
            variant="ghost"
            onClick={loadData}
          />
        </HStack>

        {/* Status Bar */}
        <HStack
          bg="gray.800"
          p={2}
          borderRadius="lg"
          justify="space-between"
          fontSize="xs"
        >
          <HStack spacing={2}>
            <Badge colorScheme={isNative ? "purple" : "blue"} fontSize="xs">
              {isNative ? "Native" : "Web"}
            </Badge>
            <Badge colorScheme={userAddress ? "green" : "red"} fontSize="xs">
              {userAddress ? shortAddress : "No wallet"}
            </Badge>
          </HStack>
          <Badge colorScheme={username ? "teal" : "orange"} fontSize="xs">
            {username || "No username"}
          </Badge>
        </HStack>

        {/* Main Action - Your Referral Code */}
        <Box
          bgGradient="linear(to-r, purple.800, blue.800)"
          p={4}
          borderRadius="lg"
        >
          {referralCode ? (
            <VStack spacing={3}>
              <Text fontSize="sm" color="gray.300">
                Your Referral Code
              </Text>
              <Code
                fontSize="2xl"
                fontWeight="bold"
                colorScheme="green"
                p={2}
                borderRadius="md"
              >
                {referralCode}
              </Code>
              <HStack spacing={2} w="100%">
                <Button
                  flex={1}
                  leftIcon={<FiShare2 />}
                  colorScheme="green"
                  size="sm"
                  onClick={handleShare}
                  isLoading={loading}
                >
                  Share
                </Button>
                <IconButton
                  aria-label="Copy"
                  icon={<FiCopy />}
                  colorScheme="blue"
                  size="sm"
                  onClick={handleCopy}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateLink}
                  isLoading={loading}
                >
                  OneLink
                </Button>
              </HStack>
              {generatedLink && (
                <Code
                  fontSize="xs"
                  p={2}
                  w="100%"
                  wordBreak="break-all"
                  maxH="60px"
                  overflow="auto"
                >
                  {generatedLink}
                </Code>
              )}
            </VStack>
          ) : (
            <VStack spacing={3}>
              <Text fontSize="sm" color="gray.300">
                Create your referral code
              </Text>
              <Button
                w="100%"
                colorScheme="green"
                onClick={handleCreateCode}
                isLoading={loading}
                isDisabled={!userAddress || !username}
              >
                Create Code
              </Button>
              {!username && (
                <Text fontSize="xs" color="orange.300">
                  Set a username first
                </Text>
              )}
            </VStack>
          )}
        </Box>

        {/* Stats Grid */}
        {stats && (
          <SimpleGrid columns={4} gap={2}>
            <StatCard label="Claims" value={stats.total_claims} />
            <StatCard
              label="Valid"
              value={stats.valid_claims}
              colorScheme="green"
            />
            <StatCard
              label="Fraud"
              value={stats.fraudulent_claims}
              colorScheme="red"
            />
            <StatCard
              label="Rewards"
              value={stats.rewards_given}
              colorScheme="blue"
            />
          </SimpleGrid>
        )}

        {/* Claims Section */}
        {stats?.claims && stats.claims.length > 0 && (
          <Section title="Referred Users" badge={`${stats.valid_claims}/${stats.total_claims}`}>
            <VStack align="start" spacing={2}>
              {stats.claims.map((c, i) => (
                <Box key={i} w="100%" p={2} bg="gray.700" borderRadius="md">
                  <HStack justify="space-between" fontSize="xs">
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">{c.referee_username || "Unknown"}</Text>
                      <Text fontSize="2xs" color="gray.400">
                        {c.referee_address.slice(0, 8)}...{c.referee_address.slice(-6)}
                      </Text>
                    </VStack>
                    <VStack align="end" spacing={0}>
                      <Badge
                        colorScheme={c.flagged_as_fraud ? "red" : "green"}
                        fontSize="2xs"
                      >
                        {c.flagged_as_fraud ? c.fraud_reason || "Fraud" : "Valid"}
                      </Badge>
                      <Text fontSize="2xs" color="gray.500">
                        {new Date(c.created_at).toLocaleDateString()}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Section>
        )}

        {/* Milestones Section */}
        {stats?.milestones && stats.milestones.length > 0 && (
          <Section title="Milestones" badge={`${stats.milestones.length}`}>
            <VStack align="start" spacing={1}>
              {stats.milestones.map((m, i) => (
                <HStack key={i} justify="space-between" w="100%" fontSize="xs">
                  <VStack align="start" spacing={0}>
                    <Text>{m.milestone_type}</Text>
                    <Text fontSize="2xs" color="gray.400">
                      {m.referee_username || m.referee_address.slice(0, 10)}...
                    </Text>
                  </VStack>
                  <HStack>
                    <Code>
                      {m.reward_type} x{m.reward_amount}
                    </Code>
                    <Badge
                      colorScheme={m.reward_given ? "green" : "yellow"}
                      fontSize="2xs"
                    >
                      {m.reward_given ? "✓" : "..."}
                    </Badge>
                  </HStack>
                </HStack>
              ))}
            </VStack>
          </Section>
        )}

        {/* Hook State */}
        <Section
          title="Hook State"
          badge={state}
          headerRight={
            <Badge
              colorScheme={referralData ? "green" : "gray"}
              fontSize="2xs"
            >
              {referralData ? "Has Data" : "Empty"}
            </Badge>
          }
        >
          <VStack align="start" spacing={2} fontSize="xs">
            <HStack>
              <Text color="gray.400">State:</Text>
              <Code>{state}</Code>
            </HStack>
            {referralData && (
              <Box w="100%">
                <Text color="gray.400" mb={1}>
                  Referral Data:
                </Text>
                <Code
                  display="block"
                  fontSize="2xs"
                  whiteSpace="pre-wrap"
                  maxH="80px"
                  overflow="auto"
                  p={2}
                >
                  {JSON.stringify(referralData, null, 2)}
                </Code>
              </Box>
            )}
            {conversionData && (
              <Box w="100%">
                <Text color="gray.400" mb={1}>
                  Conversion Data:
                </Text>
                <Code
                  display="block"
                  fontSize="2xs"
                  whiteSpace="pre-wrap"
                  maxH="80px"
                  overflow="auto"
                  p={2}
                >
                  {JSON.stringify(conversionData, null, 2)}
                </Code>
              </Box>
            )}
          </VStack>
        </Section>

        {/* Pending Data */}
        <Section
          title="Pending Data"
          headerRight={
            <IconButton
              aria-label="Clear"
              icon={<FiTrash2 />}
              size="xs"
              colorScheme="red"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleClearPendingData();
              }}
            />
          }
        >
          <VStack align="start" spacing={2} fontSize="xs">
            <Box w="100%">
              <Text color="gray.400">Referral:</Text>
              <Code
                display="block"
                fontSize="2xs"
                whiteSpace="pre-wrap"
                maxH="60px"
                overflow="auto"
                p={1}
              >
                {pendingReferral
                  ? JSON.stringify(pendingReferral, null, 2)
                  : "None"}
              </Code>
            </Box>
            <Box w="100%">
              <Text color="gray.400">Conversion:</Text>
              <Code
                display="block"
                fontSize="2xs"
                whiteSpace="pre-wrap"
                maxH="60px"
                overflow="auto"
                p={1}
              >
                {pendingConversion
                  ? JSON.stringify(pendingConversion, null, 2)
                  : "None"}
              </Code>
            </Box>
          </VStack>
        </Section>

        {/* Device Info */}
        <Section title="Device Info">
          <VStack align="start" spacing={1} fontSize="xs">
            <HStack justify="space-between" w="100%">
              <Text color="gray.400">AppsFlyer UID:</Text>
              <Code fontSize="2xs">{appsFlyerUID || "N/A"}</Code>
            </HStack>
            <HStack justify="space-between" w="100%">
              <Text color="gray.400">Device ID:</Text>
              <Code fontSize="2xs">{deviceId || "N/A"}</Code>
            </HStack>
            <HStack justify="space-between" w="100%">
              <Text color="gray.400">Address:</Text>
              <Code fontSize="2xs">{shortAddress}</Code>
            </HStack>
          </VStack>
        </Section>

        {/* Help */}
        <Section title="How to Test">
          <VStack align="start" spacing={1} fontSize="xs" color="gray.300">
            <Text>1. Create code (needs username)</Text>
            <Text>2. Share link or copy OneLink</Text>
            <Text>3. Open on another device</Text>
            <Text>4. Login and check Hook State</Text>
            <Text>5. Refresh to see new claims</Text>
          </VStack>
          <Box mt={2} p={2} bg="gray.700" borderRadius="md">
            <Text fontSize="2xs" color="gray.400">
              Check console for logs: [AppsFlyer], [AppsFlyer Referral]
            </Text>
          </Box>
        </Section>
      </Flex>
    </DelayedLoading>
  );
};
