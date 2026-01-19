import { Box, Button, Flex, Heading, Text, useToast, VStack, HStack, Code, Divider } from "@chakra-ui/react";
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
  getDeviceId
} from "../utils/appsflyer";
import {
  getPendingReferralData,
  getPendingConversionData,
  clearPendingReferralData,
  clearPendingConversionData
} from "../utils/appsflyerReferral";
import { useAppsFlyerReferral } from "../hooks/useAppsFlyerReferral";
import { Capacitor } from "@capacitor/core";

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
  const { account: { account } } = useDojo();
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

  // Load initial data
  useEffect(() => {
    loadData();
  }, [userAddress]);

  const loadData = async () => {
    // Load pending data
    setPendingReferral(getPendingReferralData());
    setPendingConversion(getPendingConversionData());

    // Load AppsFlyer IDs
    const uid = await getAppsFlyerUID();
    const devId = await getDeviceId();
    setAppsFlyerUID(uid);
    setDeviceId(devId);

    // Load stats if user is logged in
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
      toast({ title: "Username not found", description: "Please set a username first", status: "error" });
      return;
    }

    setLoading(true);
    try {
      const code = await createReferralCode(userAddress, username);
      setReferralCode(code);
      toast({ title: "Referral code created!", description: code, status: "success" });
      await loadData(); // Refresh stats
    } catch (error) {
      toast({ title: "Failed to create code", description: String(error), status: "error" });
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
        toast({ title: "Link generated!", status: "success" });
        await logReferralInvite(referralCode, "test_share");
      } else {
        const fallbackUrl = generateReferralLink(referralCode);
        setGeneratedLink(fallbackUrl);
        toast({ title: "Fallback link generated", status: "info" });
      }
    } catch (error) {
      toast({ title: "Failed to generate link", description: String(error), status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toast({ title: "Link copied!", status: "success", duration: 2000 });
    }
  };

  const handleClearPendingData = () => {
    clearPendingReferralData();
    clearPendingConversionData();
    setPendingReferral(null);
    setPendingConversion(null);
    toast({ title: "Pending data cleared", status: "info" });
  };

  const handleRefresh = () => {
    loadData();
    toast({ title: "Data refreshed", status: "info" });
  };

  return (
    <DelayedLoading ms={0}>
      <MobileDecoration />
      <Flex
        m={4}
        flexDirection="column"
        gap={4}
        w="100%"
        color="white"
        maxW="600px"
        mx="auto"
        pb={10}
      >
        <Button size="sm" onClick={() => navigate(-1)} alignSelf="flex-start">
          Back
        </Button>

        <Heading size="lg">Referral System Test</Heading>

        {/* Platform Info */}
        <Box bg="gray.800" p={4} borderRadius="md">
          <Heading size="sm" mb={2}>Platform Info</Heading>
          <VStack align="start" spacing={1} fontSize="sm">
            <Text>Platform: <Code>{isNative ? "Native (iOS/Android)" : "Web"}</Code></Text>
            <Text>Username: <Code colorScheme={username ? "green" : "red"}>{username || "Not set"}</Code></Text>
            <Text>User Address: <Code fontSize="xs">{userAddress || "Not logged in"}</Code></Text>
            <Text>AppsFlyer UID: <Code fontSize="xs">{appsFlyerUID || "N/A"}</Code></Text>
            <Text>Device ID: <Code fontSize="xs">{deviceId || "N/A"}</Code></Text>
          </VStack>
        </Box>

        <Divider />

        {/* Referral Code Section */}
        <Box bg="gray.800" p={4} borderRadius="md">
          <Heading size="sm" mb={2}>Your Referral Code</Heading>
          {referralCode ? (
            <VStack align="start" spacing={2}>
              <HStack>
                <Text>Code:</Text>
                <Code colorScheme="green" fontSize="lg">{referralCode}</Code>
              </HStack>
              <Button
                colorScheme="blue"
                onClick={handleGenerateLink}
                isLoading={loading}
                size="sm"
              >
                Generate Invite Link (SDK)
              </Button>
            </VStack>
          ) : (
            <Button
              colorScheme="green"
              onClick={handleCreateCode}
              isLoading={loading}
              isDisabled={!userAddress}
            >
              Create Referral Code
            </Button>
          )}
        </Box>

        {/* Generated Link */}
        {generatedLink && (
          <Box bg="gray.800" p={4} borderRadius="md">
            <Heading size="sm" mb={2}>Generated Link</Heading>
            <Code
              display="block"
              whiteSpace="pre-wrap"
              wordBreak="break-all"
              p={2}
              fontSize="xs"
              mb={2}
            >
              {generatedLink}
            </Code>
            <Button colorScheme="teal" size="sm" onClick={handleCopyLink}>
              Copy Link
            </Button>
          </Box>
        )}

        <Divider />

        {/* Stats Section */}
        <Box bg="gray.800" p={4} borderRadius="md">
          <HStack justify="space-between" mb={2}>
            <Heading size="sm">Your Referral Stats</Heading>
            <Button size="xs" onClick={handleRefresh}>Refresh</Button>
          </HStack>
          {stats ? (
            <VStack align="start" spacing={1} fontSize="sm">
              <Text>Total Claims: <Code>{stats.total_claims}</Code></Text>
              <Text>Valid Claims: <Code colorScheme="green">{stats.valid_claims}</Code></Text>
              <Text>Fraudulent: <Code colorScheme="red">{stats.fraudulent_claims}</Code></Text>
              <Text>Rewards Given: <Code colorScheme="blue">{stats.rewards_given}</Code></Text>
              {stats.milestones && stats.milestones.length > 0 && (
                <Box mt={2}>
                  <Text fontWeight="bold">Milestones:</Text>
                  {stats.milestones.map((m, i) => (
                    <Text key={i} fontSize="xs" ml={2}>
                      - {m.milestone_type}: {m.reward_type} x{m.reward_amount}
                      {m.reward_given ? " (given)" : " (pending)"}
                    </Text>
                  ))}
                </Box>
              )}
            </VStack>
          ) : (
            <Text fontSize="sm" color="gray.400">No stats available</Text>
          )}
        </Box>

        <Divider />

        {/* Hook State */}
        <Box bg="gray.800" p={4} borderRadius="md">
          <Heading size="sm" mb={2}>Hook State (useAppsFlyerReferral)</Heading>
          <VStack align="start" spacing={1} fontSize="sm">
            <Text>Processing State: <Code>{state}</Code></Text>
            <Text>Referral Data: <Code>{referralData ? "Present" : "None"}</Code></Text>
            <Text>Conversion Data: <Code>{conversionData ? "Present" : "None"}</Code></Text>
            {referralData && (
              <Code display="block" fontSize="xs" whiteSpace="pre-wrap" mt={2}>
                {JSON.stringify(referralData, null, 2)}
              </Code>
            )}
          </VStack>
        </Box>

        {/* Pending Data */}
        <Box bg="gray.800" p={4} borderRadius="md">
          <HStack justify="space-between" mb={2}>
            <Heading size="sm">Pending Data (localStorage)</Heading>
            <Button size="xs" colorScheme="red" onClick={handleClearPendingData}>
              Clear
            </Button>
          </HStack>
          <VStack align="start" spacing={2} fontSize="sm">
            <Box w="100%">
              <Text fontWeight="bold">Pending Referral:</Text>
              <Code display="block" fontSize="xs" whiteSpace="pre-wrap" maxH="100px" overflow="auto">
                {pendingReferral ? JSON.stringify(pendingReferral, null, 2) : "None"}
              </Code>
            </Box>
            <Box w="100%">
              <Text fontWeight="bold">Pending Conversion:</Text>
              <Code display="block" fontSize="xs" whiteSpace="pre-wrap" maxH="100px" overflow="auto">
                {pendingConversion ? JSON.stringify(pendingConversion, null, 2) : "None"}
              </Code>
            </Box>
          </VStack>
        </Box>

        {/* Instructions */}
        <Box bg="blue.900" p={4} borderRadius="md">
          <Heading size="sm" mb={2}>Testing Instructions</Heading>
          <VStack align="start" spacing={1} fontSize="sm">
            <Text>1. Create a referral code (uses your username)</Text>
            <Text>2. Generate an invite link using the SDK</Text>
            <Text>3. Copy and share the link</Text>
            <Text>4. On another device, click the link and install the app</Text>
            <Text>5. Check the "Pending Data" section for deep link data</Text>
            <Text>6. After login, check "Hook State" for processing status</Text>
            <Text>7. Refresh stats to see new claims</Text>
          </VStack>
        </Box>

        {/* Console Logs Info */}
        <Box bg="orange.900" p={4} borderRadius="md">
          <Heading size="sm" mb={2}>Check Console Logs</Heading>
          <Text fontSize="sm">
            Open Xcode console or Safari Web Inspector to see detailed logs with prefix:
          </Text>
          <VStack align="start" spacing={0} mt={2} fontSize="xs">
            <Code>[AppsFlyer]</Code>
            <Code>[AppsFlyerBridge]</Code>
            <Code>[AppsFlyer Referral]</Code>
            <Code>[useAppsFlyerReferral]</Code>
          </VStack>
        </Box>
      </Flex>
    </DelayedLoading>
  );
};
