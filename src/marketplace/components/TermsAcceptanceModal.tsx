import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Text,
  Box,
  VStack,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount, useDisconnect } from "@starknet-react/core";

const STORAGE_KEY = "marketplace_terms_v1_accepted";

const TERMS_CONTENT = `JOKERS OF NEON — MARKETPLACE TERMS OF USE
Beta Version | Effective: March 13, 2026
Entity: Caravana Studio LLC (Delaware, USA)
Contact: gm@jokersofneon.com

TL;DR
• Beta marketplace — use at your own risk
• Must be 18 or older to trade
• Non-custodial: we never hold your funds or NFTs
• Marketplace fee is shown before every transaction
• NFTs are collectibles, not investments
• On-chain transactions on Starknet are irreversible

1. Acceptance
By connecting your wallet and using the Jokers of Neon Marketplace ("the Marketplace"), you agree to these Terms. If you disagree, do not connect your wallet or use the Marketplace.

2. Relationship to Game Terms
These Terms apply in addition to the Jokers of Neon Game Terms and Conditions. For marketplace activities, these Terms prevail. Specifically, Section 8 of the Game Terms ("No Marketplace") does not apply to the Marketplace operated under these Terms.

3. About the Marketplace
The Marketplace is a non-custodial, peer-to-peer secondary market for Jokers of Neon NFT cards, operated by Caravana Studio LLC on Starknet. It is in beta (early access) and subject to change.

4. Eligibility
You must be at least 18 years old and have legal capacity to enter into binding agreements. You may not use the Marketplace if you are located in a jurisdiction subject to U.S. sanctions or where use would violate applicable law.

5. How the Marketplace Works
Listing: Sellers approve the marketplace contract to transfer their NFT and sign a sell order off-chain. No funds are locked at listing.

Buying: Buyers approve ERC-20 spending, then execute the purchase on-chain. The smart contract atomically transfers payment, fee, and NFT in a single transaction.

Canceling: Sellers can cancel active listings at any time via an on-chain transaction.

Settlement: All trades settle atomically on Starknet. The Marketplace never holds funds or NFTs.

6. Fees
A marketplace fee (displayed before confirming any transaction) is deducted from the seller's proceeds. Buyers and sellers also pay Starknet network gas fees. The current fee rate is always shown on the confirmation screen.

7. Risks
By using the Marketplace, you acknowledge:
• Smart contract risk: contracts may contain bugs or vulnerabilities
• Price volatility: NFT prices can fluctuate significantly
• Irreversibility: on-chain transactions cannot be reversed
• Beta risk: the Marketplace may be modified, paused, or shut down
• Wallet risk: you are solely responsible for your wallet security

8. NFTs and Intellectual Property
Ownership of a Jokers of Neon NFT grants a limited, non-exclusive, non-transferable license to display the card for personal, non-commercial use. It does not confer IP ownership.

9. No Investment Advice
NFTs are digital collectibles, not investments or securities. Nothing on this platform is financial or investment advice. No expectation of profit or return is implied.

10. Prohibited Conduct
You may not engage in wash trading, market manipulation, money laundering, or any illegal activities. We reserve the right to restrict access based on jurisdiction or compliance requirements.

11. Wallet and Third-Party Services
The Marketplace uses Cartridge Controller, subject to its own terms. We are not responsible for third-party services or wallet failures.

12. No Custody
Caravana Studio LLC does not hold, control, or access your funds or NFTs. All transactions execute through smart contracts.

13. Game Modifications
Caravana Studio LLC may modify card mechanics, gameplay, or NFT utility at any time. Such changes do not entitle users to refunds or compensation.

14. Beta Disclaimer
This Marketplace is in early access. Features may be incomplete, changed, or removed. We make no guarantees of availability or continuity of service.

15. Disclaimers
THE MARKETPLACE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.

16. Limitation of Liability
TO THE MAXIMUM EXTENT PERMITTED BY LAW, CARAVANA STUDIO LLC SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR SPECIAL DAMAGES, INCLUDING LOSS OF FUNDS, DATA, OR NFT VALUE.

17. Indemnification
You agree to indemnify and hold harmless Caravana Studio LLC, its affiliates, and team members from claims arising from your use of the Marketplace or violation of these Terms.

18. Updates
We may modify these Terms at any time. Continued use constitutes acceptance. The Effective Date above reflects the current version.

19. Governing Law
These Terms are governed by the laws of the State of Delaware, USA.

20. Contact
gm@jokersofneon.com

The authoritative version of these Terms is in English.
© 2026 Caravana Studio LLC. All rights reserved.`;

export function TermsAcceptanceModal() {
  const { t } = useTranslation("marketplace");
  const { status } = useAccount();
  const { disconnect } = useDisconnect();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (
      status === "connected" &&
      localStorage.getItem(STORAGE_KEY) !== "true"
    ) {
      onOpen();
    }
  }, [status]);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    onClose();
  };

  const handleDecline = () => {
    disconnect();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      size="lg"
      isCentered
    >
      <ModalOverlay bg="rgba(0,0,0,0.75)" backdropFilter="blur(6px)" />
      <ModalContent
        bg="gray.900"
        border="1px solid"
        borderColor="rgba(32, 198, 237, 0.3)"
        borderRadius="xl"
        boxShadow="0 0 40px rgba(32, 198, 237, 0.15)"
        mx={4}
      >
        <ModalHeader
          fontFamily="Orbitron"
          textTransform="uppercase"
          fontSize={15}
          letterSpacing="0.08em"
          color="white"
          borderBottom="1px solid"
          borderColor="whiteAlpha.100"
          pb={3}
        >
          {t("terms.modalTitle")}
        </ModalHeader>

        <ModalBody py={4}>
          <VStack spacing={3} align="stretch">
            {/* Scrollable terms content */}
            <Box
              h="340px"
              overflowY="auto"
              bg="rgba(0,0,0,0.3)"
              border="1px solid"
              borderColor="whiteAlpha.100"
              borderRadius="md"
              p={4}
              sx={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(32,198,237,0.3) transparent",
                "&::-webkit-scrollbar": { width: "4px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(32,198,237,0.3)",
                  borderRadius: "4px",
                },
              }}
            >
              <Text
                fontFamily="Oxanium"
                fontSize={12}
                color="whiteAlpha.800"
                whiteSpace="pre-wrap"
                lineHeight="1.7"
              >
                {TERMS_CONTENT}
              </Text>
            </Box>

            {/* Warning about declining */}
            <Text
              fontFamily="Oxanium"
              fontSize={11}
              color="whiteAlpha.500"
              textAlign="center"
            >
              {t("terms.declineWarning")}
            </Text>

            {/* Checkbox */}
            <Checkbox
              isChecked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              colorScheme="cyan"
              size="md"
            >
              <Text fontFamily="Oxanium" fontSize={13} color="whiteAlpha.900">
                {t("terms.checkboxLabel")}
              </Text>
            </Checkbox>
          </VStack>
        </ModalBody>

        <ModalFooter
          borderTop="1px solid"
          borderColor="whiteAlpha.100"
          pt={3}
          gap={3}
        >
          <HStack spacing={3} w="100%" justify="flex-end">
            <Button
              variant="ghost"
              size="sm"
              color="whiteAlpha.600"
              _hover={{ color: "red.300", bg: "rgba(255,100,100,0.1)" }}
              onClick={handleDecline}
              fontFamily="Orbitron"
              fontSize={11}
              letterSpacing="0.08em"
            >
              {t("terms.decline")}
            </Button>
            <Button
              size="sm"
              isDisabled={!checked}
              onClick={handleAccept}
              fontFamily="Orbitron"
              fontSize={11}
              letterSpacing="0.08em"
              bg="rgba(32, 198, 237, 0.15)"
              color="#20c6ed"
              border="1px solid rgba(32, 198, 237, 0.4)"
              _hover={{ bg: "rgba(32, 198, 237, 0.25)" }}
              _disabled={{
                opacity: 0.4,
                cursor: "not-allowed",
                _hover: { bg: "rgba(32, 198, 237, 0.15)" },
              }}
            >
              {t("terms.accept")}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
