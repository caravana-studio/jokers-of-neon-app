import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TERMS_SECTIONS = [
  {
    number: "",
    title: "TL;DR",
    body: `• Beta marketplace — use at your own risk
• Must be 18 or older to trade
• Non-custodial: we never hold your funds or NFTs
• Marketplace fee is shown before every transaction
• NFTs are collectibles, not investments
• On-chain transactions on Starknet are irreversible`,
  },
  {
    number: "1.",
    title: "Acceptance",
    body: `By connecting your wallet and using the Jokers of Neon Marketplace ("the Marketplace"), you agree to these Terms. If you disagree, do not connect your wallet or use the Marketplace.`,
  },
  {
    number: "2.",
    title: "Relationship to Game Terms",
    body: `These Terms apply in addition to the Jokers of Neon Game Terms and Conditions. For marketplace activities, these Terms prevail. Specifically, Section 8 of the Game Terms ("No Marketplace") does not apply to the Marketplace operated under these Terms.`,
  },
  {
    number: "3.",
    title: "About the Marketplace",
    body: `The Marketplace is a non-custodial, peer-to-peer secondary market for Jokers of Neon NFT cards, operated by Caravana Studio LLC on Starknet. It is in beta (early access) and subject to change.`,
  },
  {
    number: "4.",
    title: "Eligibility",
    body: `You must be at least 18 years old and have legal capacity to enter into binding agreements. You may not use the Marketplace if you are located in a jurisdiction subject to U.S. sanctions or where use would violate applicable law.`,
  },
  {
    number: "5.",
    title: "How the Marketplace Works",
    body: `Listing: Sellers approve the marketplace contract to transfer their NFT and sign a sell order off-chain. No funds are locked at listing.

Buying: Buyers approve ERC-20 spending, then execute the purchase on-chain. The smart contract atomically transfers payment, fee, and NFT in a single transaction.

Canceling: Sellers can cancel active listings at any time via an on-chain transaction.

Settlement: All trades settle atomically on Starknet. The Marketplace never holds funds or NFTs.`,
  },
  {
    number: "6.",
    title: "Fees",
    body: `A marketplace fee (displayed before confirming any transaction) is deducted from the seller's proceeds. Buyers and sellers also pay Starknet network gas fees. The current fee rate is always shown on the confirmation screen.`,
  },
  {
    number: "7.",
    title: "Risks",
    body: `By using the Marketplace, you acknowledge:
• Smart contract risk: contracts may contain bugs or vulnerabilities
• Price volatility: NFT prices can fluctuate significantly
• Irreversibility: on-chain transactions cannot be reversed
• Beta risk: the Marketplace may be modified, paused, or shut down
• Wallet risk: you are solely responsible for your wallet security`,
  },
  {
    number: "8.",
    title: "NFTs and Intellectual Property",
    body: `Ownership of a Jokers of Neon NFT grants a limited, non-exclusive, non-transferable license to display the card for personal, non-commercial use. It does not confer IP ownership.`,
  },
  {
    number: "9.",
    title: "No Investment Advice",
    body: `NFTs are digital collectibles, not investments or securities. Nothing on this platform is financial or investment advice. No expectation of profit or return is implied.`,
  },
  {
    number: "10.",
    title: "Prohibited Conduct",
    body: `You may not engage in wash trading, market manipulation, money laundering, or any illegal activities. We reserve the right to restrict access based on jurisdiction or compliance requirements.`,
  },
  {
    number: "11.",
    title: "Wallet and Third-Party Services",
    body: `The Marketplace uses Cartridge Controller, subject to its own terms. We are not responsible for third-party services or wallet failures.`,
  },
  {
    number: "12.",
    title: "No Custody",
    body: `Caravana Studio LLC does not hold, control, or access your funds or NFTs. All transactions execute through smart contracts.`,
  },
  {
    number: "13.",
    title: "Game Modifications",
    body: `Caravana Studio LLC may modify card mechanics, gameplay, or NFT utility at any time. Such changes do not entitle users to refunds or compensation.`,
  },
  {
    number: "14.",
    title: "Beta Disclaimer",
    body: `This Marketplace is in early access. Features may be incomplete, changed, or removed. We make no guarantees of availability or continuity of service.`,
  },
  {
    number: "15.",
    title: "Disclaimers",
    body: `THE MARKETPLACE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.`,
  },
  {
    number: "16.",
    title: "Limitation of Liability",
    body: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, CARAVANA STUDIO LLC SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR SPECIAL DAMAGES, INCLUDING LOSS OF FUNDS, DATA, OR NFT VALUE.`,
  },
  {
    number: "17.",
    title: "Indemnification",
    body: `You agree to indemnify and hold harmless Caravana Studio LLC, its affiliates, and team members from claims arising from your use of the Marketplace or violation of these Terms.`,
  },
  {
    number: "18.",
    title: "Updates",
    body: `We may modify these Terms at any time. Continued use constitutes acceptance. The Effective Date above reflects the current version.`,
  },
  {
    number: "19.",
    title: "Governing Law",
    body: `These Terms are governed by the laws of the State of Delaware, USA.`,
  },
  {
    number: "20.",
    title: "Contact",
    body: `gm@jokersofneon.com`,
  },
];

export function TermsPage() {
  const { t } = useTranslation("marketplace");
  const navigate = useNavigate();

  return (
    <Box maxW="860px" mx="auto">
      {/* Top bar */}
      <Flex align="center" mb={6} gap={4}>
        <Button
          size="sm"
          variant="ghost"
          color="whiteAlpha.700"
          _hover={{ color: "white", bg: "whiteAlpha.100" }}
          onClick={() => navigate(-1)}
          fontFamily="Orbitron"
          fontSize={11}
          letterSpacing="0.08em"
        >
          ← {t("terms.back")}
        </Button>
      </Flex>

      {/* Main card */}
      <Box
        bg="rgba(6, 15, 38, 0.75)"
        border="1px solid rgba(32, 198, 237, 0.2)"
        borderRadius="xl"
        boxShadow="0 0 40px rgba(32, 198, 237, 0.08)"
        p={{ base: 6, md: 10 }}
      >
        {/* Header */}
        <Flex direction="column" align="center" mb={8}>
          <Box
            as="img"
            src="/logos/jn.png"
            alt="Jokers of Neon"
            h="32px"
            mb={4}
          />
          <Heading
            fontFamily="Orbitron"
            textTransform="uppercase"
            fontSize={{ base: 18, md: 22 }}
            letterSpacing="0.12em"
            color="white"
            textAlign="center"
            mb={2}
          >
            {t("terms.pageTitle")}
          </Heading>
          <Text fontFamily="Oxanium" fontSize={12} color="#ff934b" mb={1}>
            {t("terms.betaNotice")}
          </Text>
          <Text fontFamily="Oxanium" fontSize={12} color="whiteAlpha.500">
            {t("terms.effectiveDate")}: March 13, 2026 · Caravana Studio LLC (Delaware, USA)
          </Text>
        </Flex>

        {/* Sections */}
        <Box>
          {TERMS_SECTIONS.map((section, i) => (
            <Box
              key={i}
              mb={6}
              pb={6}
              borderBottom={
                i < TERMS_SECTIONS.length - 1
                  ? "1px solid rgba(255,255,255,0.07)"
                  : "none"
              }
            >
              <Text
                fontFamily="Orbitron"
                fontSize={13}
                letterSpacing="0.06em"
                color="#20c6ed"
                mb={2}
              >
                {section.number} {section.title}
              </Text>
              <Text
                fontFamily="Oxanium"
                fontSize={13}
                color="whiteAlpha.800"
                whiteSpace="pre-wrap"
                lineHeight="1.75"
              >
                {section.body}
              </Text>
            </Box>
          ))}
        </Box>

        {/* Footer note */}
        <Text
          fontFamily="Oxanium"
          fontSize={11}
          color="whiteAlpha.400"
          textAlign="center"
          mt={4}
        >
          The authoritative version of these Terms is in English. © 2026 Caravana Studio LLC. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
}
