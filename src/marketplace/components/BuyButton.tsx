import {
  Box,
  Button,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useEffect } from "react";
import { useAccount, useBalance } from "@starknet-react/core";
import { useBuyNow } from "../hooks/useBuyNow";
import { CardImage } from "./CardImage";
import { formatTokenAmount } from "../utils/formatPrice";
import { usePrices, toUsd, formatUsd } from "../hooks/usePrices";
import { PAYMENT_TOKENS } from "../config/contracts";
import { TokenIcon } from "./TokenIcon";
import type { Listing } from "../types/marketplace";

interface BuyButtonProps {
  listing: Listing;
  onSuccess?: () => void;
}

function getTokenSymbol(address: string): string {
  const token = PAYMENT_TOKENS.find(
    (t) => t.address.toLowerCase() === address.toLowerCase()
  );
  return token?.symbol ?? "TOKEN";
}

const popIn = keyframes`
  0%   { opacity: 0; transform: scale(0.7); }
  70%  { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

const shimmer = keyframes`
  0%   { box-shadow: 0 0 8px rgba(32,198,237,0.15); }
  50%  { box-shadow: 0 0 14px rgba(32,198,237,0.3); }
  100% { box-shadow: 0 0 8px rgba(32,198,237,0.15); }
`;

export function BuyButton({ listing, onSuccess }: BuyButtonProps) {
  const { address, status: walletStatus } = useAccount();
  const { buy, status, error } = useBuyNow();
  const { isOpen: isConfirmOpen, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const { isOpen: isSuccessOpen, onOpen: openSuccess, onClose: closeSuccess } = useDisclosure();
  const prices = usePrices();

  const symbol = getTokenSymbol(listing.payment_token);
  const tokenAmount = formatTokenAmount(listing.price);
  const usdLabel = formatUsd(toUsd(tokenAmount, symbol, prices));

  const { data: balanceData } = useBalance({
    address,
    token: listing.payment_token as `0x${string}`,
    watch: false,
    enabled: walletStatus === "connected",
  });

  const isSeller =
    address?.toLowerCase() === listing.seller_address.toLowerCase();
  const isProcessing = ["approving", "buying", "confirming"].includes(status);
  const hasInsufficientBalance =
    balanceData !== undefined && balanceData.value < BigInt(listing.price);

  // Show success modal when purchase completes, then redirect after 4s
  useEffect(() => {
    if (status === "done") openSuccess();
  }, [status]);

  const handleConfirm = async () => {
    closeConfirm();
    await buy(listing);
  };

  if (walletStatus !== "connected") {
    return (
      <Button size="md" variant="solid" isDisabled>
        Connect Wallet to Buy
      </Button>
    );
  }

  if (isSeller) {
    return (
      <Button size="md" variant="defaultOutline" isDisabled>
        Your Listing
      </Button>
    );
  }

  return (
    <>
      <VStack spacing={2}>
        <Tooltip
          label="Insufficient balance"
          isDisabled={!hasInsufficientBalance}
          hasArrow
        >
          <Button
            size="md"
            variant="solid"
            onClick={openConfirm}
            isLoading={isProcessing}
            loadingText={
              status === "approving" ? "APPROVING..." :
              status === "buying" ? "BUYING..." :
              "CONFIRMING..."
            }
            isDisabled={hasInsufficientBalance || status === "done"}
            w="100%"
          >
            BUY NOW
          </Button>
        </Tooltip>
        {error && (
          <Text color="red.400" fontSize={11} fontFamily="Oxanium">
            {error}
          </Text>
        )}
      </VStack>

      {/* ── Confirmation modal ── */}
      <Modal isOpen={isConfirmOpen} onClose={closeConfirm} isCentered size="sm">
        <ModalOverlay backdropFilter="blur(6px)" bg="rgba(0,0,0,0.7)" />
        <ModalContent
          bg="rgba(6,22,48,0.97)"
          border="1px solid rgba(32,198,237,0.3)"
          borderRadius="20px"
          boxShadow="0 0 40px rgba(32,198,237,0.15)"
          mx={4}
        >
          <ModalBody pt={6} pb={2}>
            <VStack spacing={5} align="stretch">
              <Text
                fontFamily="Orbitron"
                fontSize={13}
                color="whiteAlpha.500"
                textTransform="uppercase"
                letterSpacing="0.12em"
                textAlign="center"
              >
                Confirm Purchase
              </Text>

              <Text
                fontFamily="Orbitron"
                fontSize={18}
                color="white"
                textTransform="uppercase"
                textAlign="center"
                textShadow="0 0 12px rgba(255,255,255,0.5)"
                noOfLines={2}
              >
                {listing.card_name}
              </Text>

              <Flex
                direction="column"
                align="center"
                bg="rgba(0,0,0,0.4)"
                borderRadius="14px"
                border="1px solid rgba(255,255,255,0.08)"
                py={4}
                gap={1}
              >
                <Text fontFamily="Oxanium" fontSize={12} color="whiteAlpha.500" textTransform="uppercase" letterSpacing="0.1em">
                  You will pay
                </Text>
                <HStack spacing={2} align="center">
                  <Text
                    fontFamily="Orbitron"
                    fontSize={32}
                    color="neonGreen"
                    fontWeight="bold"
                    lineHeight={1}
                  >
                    {tokenAmount}
                  </Text>
                  <TokenIcon symbol={symbol} size="26px" />
                </HStack>
                {usdLabel && (
                  <Text fontFamily="Oxanium" fontSize={14} color="whiteAlpha.600" fontStyle="italic">
                    {usdLabel}
                  </Text>
                )}
              </Flex>

              <Text fontFamily="Oxanium" fontSize={11} color="whiteAlpha.400" textAlign="center">
                This will trigger two transactions: approve + fill order
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter pt={3} pb={5} gap={3} justifyContent="center">
            <Button variant="solid" size="md" px={8} onClick={handleConfirm}>
              Confirm
            </Button>
            <Button variant="outlineSecondaryGlow" size="md" px={6} onClick={closeConfirm}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ── Success modal ── */}
      <Modal isOpen={isSuccessOpen} onClose={closeSuccess} isCentered size="sm">
        <ModalOverlay backdropFilter="blur(3px)" bg="rgba(0,0,0,0.75)" />
        <ModalContent
          bg="rgba(6,38,64,0.8)"
          border="1px solid rgba(32,198,237,0.4)"
          borderRadius="24px"
          mx={4}
          animation={`${shimmer} 2.5s ease-in-out infinite`}
        >
          <ModalBody pt={7} pb={2}>
            <VStack spacing={5} align="center">
              <Text
                fontFamily="Orbitron"
                fontSize={20}
                color="neonGreen"
                textTransform="uppercase"
                letterSpacing="0.1em"
                textAlign="center"
                textShadow="0 0 10px rgba(32,198,237,0.45)"
              >
                Purchase Complete
              </Text>

              {/* Card image with pop-in animation */}
              <Box
                animation={`${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`}
                display="flex"
                justifyContent="center"
              >
                <CardImage
                  imageUrl={listing.image_url}
                  rarity={listing.rarity}
                  skinId={listing.skin_id}
                  size="160px"
                />
              </Box>

              <Text
                fontFamily="Orbitron"
                fontSize={16}
                color="white"
                textTransform="uppercase"
                textAlign="center"
                textShadow="0 0 14px rgba(255,255,255,0.6)"
              >
                {listing.card_name}
              </Text>

              {/* Price */}
              <VStack spacing={0} align="center">
                <HStack spacing={2} align="center">
                  <Text
                    fontFamily="Orbitron"
                    fontSize={28}
                    color="neonGreen"
                    fontWeight="bold"
                    lineHeight={1}
                  >
                    {tokenAmount}
                  </Text>
                  <TokenIcon symbol={symbol} size="24px" />
                </HStack>
                {usdLabel && (
                  <Text fontFamily="Oxanium" fontSize={13} color="whiteAlpha.500" fontStyle="italic">
                    {usdLabel}
                  </Text>
                )}
              </VStack>

            </VStack>
          </ModalBody>

          <ModalFooter pb={8} justifyContent="center">
            <Button
              variant="solid"
              size="md"
              px={8}
              onClick={closeSuccess}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
