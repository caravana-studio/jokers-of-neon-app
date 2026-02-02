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
  Progress,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";
import { useDojo } from "../dojo/DojoContext";
import { useUsername } from "../dojo/utils/useUsername";
import { createReferralCode, getReferralStats, generateReferralLink } from "../api/referral";
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
import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import { FaChevronDown, FaChevronUp, FaCopy, FaShare, FaSync, FaTrash, FaArrowLeft, FaLink, FaUsers, FaGift } from "react-icons/fa";

interface ReferralStats {
  referral_code: string | null;
  total_claims: number;
  valid_claims: number;
  fraudulent_claims: number;
  rewards_given: number;
  milestones: Array<{
    milestone_type: string;
    reward_given: boolean;
    reward_type: string;
    reward_amount: number;
  }>;
}

export const ReferralTestPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
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

  // Collapsible sections
  const debugSection = useDisclosure();
  const instructionsSection = useDisclosure();

  // Hook data
  const { referralData, conversionData, state } = useAppsFlyerReferral();

  // Pending data from localStorage
  const [pendingReferral, setPendingReferral] = useState<unknown>(null);
  const [pendingConversion, setPendingConversion] = useState<unknown>(null);

  const userAddress = account?.address;
  const isNative = Capacitor.isNativePlatform();
  const shortAddress = userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : null;

  // Load initial data
  useEffect(() => {
    loadData();
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
      toast({
        title: "Username required",
        description: "Set a username first",
        status: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const code = await createReferralCode(userAddress, username);
      setReferralCode(code);
      toast({ title: "Code created!", description: code, status: "success" });
      await loadData();
    } catch (error) {
      toast({ title: "Failed", description: String(error), status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    if (!referralCode) {
      toast({ title: "No referral code", status: "error" });
      return;
    }

    setLoading(true);
    try {
      const url = await generateNativeInviteUrl(referralCode);

      if (url) {
        setGeneratedLink(url);
        toast({ title: "Link ready!", status: "success" });
        await logReferralInvite(referralCode, "test_share");
      } else {
        const fallbackUrl = generateReferralLink(referralCode);
        setGeneratedLink(fallbackUrl);
        toast({ title: "Fallback link", status: "info" });
      }
    } catch (error) {
      toast({ title: "Failed", description: String(error), status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toast({ title: "Copied!", status: "success", duration: 1500 });
    }
  };

  const handleShareLink = async () => {
    if (!generatedLink || !referralCode) return;

    try {
      await Share.share({
        title: "Join Jokers of Neon!",
        text: `Use my referral code: ${referralCode}`,
        url: generatedLink,
        dialogTitle: "Share your referral link",
      });
      await logReferralInvite(referralCode, "native_share");
    } catch (error) {
      // User cancelled or share failed, fall back to copy
      handleCopyLink();
    }
  };

  const handleClearPendingData = () => {
    clearPendingReferralData();
    clearPendingConversionData();
    setPendingReferral(null);
    setPendingConversion(null);
    toast({ title: "Data cleared", status: "info" });
  };

  const handleRefresh = () => {
    loadData();
    toast({ title: "Refreshed", status: "info", duration: 1000 });
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
        px={4}
        py={3}
        pb={20}
      >
        {/* Header */}
        <HStack justify="space-between" align="center">
          <IconButton
            aria-label="Back"
            icon={<FaArrowLeft />}
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
          />
          <Heading size="md">Referral System</Heading>
          <IconButton
            aria-label="Refresh"
            icon={<FaSync />}
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
          />
        </HStack>

        {/* Status Bar */}
        <HStack
          bg="whiteAlpha.100"
          p={2}
          borderRadius="lg"
          justify="space-around"
          fontSize="xs"
        >
          <VStack spacing={0}>
            <Text color="gray.400">Platform</Text>
            <Badge colorScheme={isNative ? "green" : "blue"} fontSize="xs">
              {isNative ? "Native" : "Web"}
            </Badge>
          </VStack>
          <VStack spacing={0}>
            <Text color="gray.400">User</Text>
            <Text fontWeight="bold">{username || shortAddress || "—"}</Text>
          </VStack>
          <VStack spacing={0}>
            <Text color="gray.400">Status</Text>
            <Badge
              colorScheme={state === "idle" ? "green" : state === "processing" ? "yellow" : "blue"}
              fontSize="xs"
            >
              {state}
            </Badge>
          </VStack>
        </HStack>

        {/* Main Referral Card */}
        <Box
          bg="linear-gradient(135deg, #1a365d 0%, #2d3748 100%)"
          p={4}
          borderRadius="xl"
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <HStack>
                <FaLink color="#63B3ED" />
                <Text fontWeight="bold">Your Referral Code</Text>
              </HStack>
            </HStack>

            {referralCode ? (
              <>
                <Box
                  bg="whiteAlpha.200"
                  p={3}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <Text fontSize="2xl" fontWeight="bold" letterSpacing="wider">
                    {referralCode}
                  </Text>
                </Box>

                {!generatedLink ? (
                  <Button
                    colorScheme="blue"
                    onClick={handleGenerateLink}
                    isLoading={loading}
                    leftIcon={<FaLink />}
                    size="lg"
                  >
                    Generate Invite Link
                  </Button>
                ) : (
                  <VStack spacing={2}>
                    <Code
                      display="block"
                      p={2}
                      borderRadius="md"
                      fontSize="xs"
                      wordBreak="break-all"
                      bg="blackAlpha.400"
                      w="100%"
                    >
                      {generatedLink}
                    </Code>
                    <HStack w="100%" spacing={2}>
                      <Button
                        flex={1}
                        colorScheme="teal"
                        onClick={handleCopyLink}
                        leftIcon={<FaCopy />}
                        size="md"
                      >
                        Copy
                      </Button>
                      <Button
                        flex={1}
                        colorScheme="blue"
                        onClick={handleShareLink}
                        leftIcon={<FaShare />}
                        size="md"
                      >
                        Share
                      </Button>
                    </HStack>
                  </VStack>
                )}
              </>
            ) : (
              <Button
                colorScheme="green"
                onClick={handleCreateCode}
                isLoading={loading}
                isDisabled={!userAddress}
                size="lg"
                w="100%"
              >
                {!userAddress ? "Login Required" : "Create Referral Code"}
              </Button>
            )}
          </VStack>
        </Box>

        {/* Stats Card */}
        <Box bg="whiteAlpha.100" p={4} borderRadius="xl">
          <HStack mb={3}>
            <FaUsers color="#68D391" />
            <Text fontWeight="bold">Your Stats</Text>
          </HStack>

          {stats ? (
            <VStack spacing={3} align="stretch">
              <HStack justify="space-around">
                <VStack spacing={0}>
                  <Text fontSize="2xl" fontWeight="bold" color="green.300">
                    {stats.valid_claims}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Referrals
                  </Text>
                </VStack>
                <VStack spacing={0}>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.300">
                    {stats.rewards_given}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Rewards
                  </Text>
                </VStack>
                <VStack spacing={0}>
                  <Text fontSize="2xl" fontWeight="bold" color="red.300">
                    {stats.fraudulent_claims}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Blocked
                  </Text>
                </VStack>
              </HStack>

              {stats.milestones && stats.milestones.length > 0 && (
                <Box mt={2}>
                  <HStack mb={2}>
                    <FaGift color="#F6AD55" size={12} />
                    <Text fontSize="sm" fontWeight="bold">
                      Milestones
                    </Text>
                  </HStack>
                  <VStack spacing={1} align="stretch">
                    {stats.milestones.map((m, i) => (
                      <HStack
                        key={i}
                        justify="space-between"
                        bg="whiteAlpha.100"
                        p={2}
                        borderRadius="md"
                        fontSize="xs"
                      >
                        <Text>{m.milestone_type.replace(/_/g, " ")}</Text>
                        <HStack>
                          <Badge colorScheme="purple">
                            {m.reward_type} x{m.reward_amount}
                          </Badge>
                          <Badge colorScheme={m.reward_given ? "green" : "yellow"}>
                            {m.reward_given ? "Given" : "Pending"}
                          </Badge>
                        </HStack>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>
          ) : (
            <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
              {userAddress ? "Loading stats..." : "Login to see your stats"}
            </Text>
          )}
        </Box>

        {/* Debug Section (Collapsible) */}
        <Box bg="whiteAlpha.50" borderRadius="xl" overflow="hidden">
          <Button
            w="100%"
            variant="ghost"
            justifyContent="space-between"
            rightIcon={debugSection.isOpen ? <FaChevronUp /> : <FaChevronDown />}
            onClick={debugSection.onToggle}
            size="sm"
            py={3}
          >
            Debug Info
          </Button>
          <Collapse in={debugSection.isOpen}>
            <VStack spacing={3} p={3} align="stretch" fontSize="xs">
              {/* Device Info */}
              <Box>
                <Text fontWeight="bold" mb={1}>
                  Device
                </Text>
                <Code display="block" p={2} fontSize="xs" wordBreak="break-all">
                  AF UID: {appsFlyerUID || "N/A"}
                </Code>
                <Code display="block" p={2} fontSize="xs" wordBreak="break-all" mt={1}>
                  Device: {deviceId || "N/A"}
                </Code>
              </Box>

              {/* Hook State */}
              <Box>
                <Text fontWeight="bold" mb={1}>
                  Hook State
                </Text>
                <HStack spacing={2}>
                  <Badge>State: {state}</Badge>
                  <Badge colorScheme={referralData ? "green" : "gray"}>
                    Referral: {referralData ? "Yes" : "No"}
                  </Badge>
                  <Badge colorScheme={conversionData ? "green" : "gray"}>
                    Conversion: {conversionData ? "Yes" : "No"}
                  </Badge>
                </HStack>
                {referralData && (
                  <Code
                    display="block"
                    fontSize="xs"
                    whiteSpace="pre-wrap"
                    mt={2}
                    p={2}
                    maxH="80px"
                    overflow="auto"
                  >
                    {JSON.stringify(referralData, null, 2)}
                  </Code>
                )}
              </Box>

              {/* Pending Data */}
              <Box>
                <HStack justify="space-between" mb={1}>
                  <Text fontWeight="bold">Pending Data</Text>
                  <IconButton
                    aria-label="Clear"
                    icon={<FaTrash />}
                    size="xs"
                    colorScheme="red"
                    variant="ghost"
                    onClick={handleClearPendingData}
                  />
                </HStack>
                <Code
                  display="block"
                  fontSize="xs"
                  whiteSpace="pre-wrap"
                  p={2}
                  maxH="60px"
                  overflow="auto"
                >
                  Referral: {pendingReferral ? JSON.stringify(pendingReferral) : "None"}
                </Code>
                <Code
                  display="block"
                  fontSize="xs"
                  whiteSpace="pre-wrap"
                  p={2}
                  mt={1}
                  maxH="60px"
                  overflow="auto"
                >
                  Conversion: {pendingConversion ? JSON.stringify(pendingConversion) : "None"}
                </Code>
              </Box>
            </VStack>
          </Collapse>
        </Box>

        {/* Instructions (Collapsible) */}
        <Box bg="blue.900" borderRadius="xl" overflow="hidden">
          <Button
            w="100%"
            variant="ghost"
            justifyContent="space-between"
            rightIcon={instructionsSection.isOpen ? <FaChevronUp /> : <FaChevronDown />}
            onClick={instructionsSection.onToggle}
            size="sm"
            py={3}
          >
            How to Test
          </Button>
          <Collapse in={instructionsSection.isOpen}>
            <VStack align="start" spacing={2} p={3} fontSize="xs">
              <Text>1. Create a referral code (uses your username)</Text>
              <Text>2. Generate and share your invite link</Text>
              <Text>3. On another device, open the link</Text>
              <Text>4. Install/open the app from the link</Text>
              <Text>5. Login and check if referral was captured</Text>
              <Text>6. Refresh stats to see new claims</Text>
              <Box mt={2} p={2} bg="whiteAlpha.100" borderRadius="md" w="100%">
                <Text fontWeight="bold" mb={1}>
                  Console Logs:
                </Text>
                <Text color="gray.400">[AppsFlyer], [AppsFlyerBridge]</Text>
                <Text color="gray.400">[AppsFlyer Referral], [useAppsFlyerReferral]</Text>
              </Box>
            </VStack>
          </Collapse>
        </Box>
      </Flex>
    </DelayedLoading>
  );
};
