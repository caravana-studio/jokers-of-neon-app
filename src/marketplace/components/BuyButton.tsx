import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAccount, useBalance } from "@starknet-react/core";
import { useBuyNow } from "../hooks/useBuyNow";
import { CardImage } from "./CardImage";
import { formatTokenAmount } from "../utils/formatPrice";
import { usePrices, toUsd, formatUsd } from "../hooks/usePrices";
import { getPaymentToken } from "../config/contracts";
import { TokenIcon } from "./TokenIcon";
import type { Listing } from "../types/marketplace";

interface BuyButtonProps {
  listing: Listing;
  onSuccess?: () => void;
}

const popIn = keyframes`
  0%   { opacity: 0; transform: scale(0.7); }
  70%  { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

export function BuyButton({ listing, onSuccess }: BuyButtonProps) {
  const { t } = useTranslation("marketplace");
  const { address, status: walletStatus } = useAccount();
  const { buy, status, error } = useBuyNow();
  const { isOpen: isConfirmOpen, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const { isOpen: isSuccessOpen, onOpen: openSuccess, onClose: closeSuccess } = useDisclosure();
  const prices = usePrices();

  const token = getPaymentToken(listing.payment_token);
  const symbol = token?.symbol ?? "TOKEN";
  const tokenAmount = formatTokenAmount(listing.price, token?.decimals ?? 18);
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
        {t("auth.connectToBuy")}
      </Button>
    );
  }

  if (isSeller) {
    return (
      <Button size="md" variant="defaultOutline" isDisabled>
        {t("buy.yourListing")}
      </Button>
    );
  }

  return (
    <>
      <VStack spacing={2}>
        <Tooltip
          label={t("buy.insufficientBalance")}
          isDisabled={!hasInsufficientBalance}
          hasArrow
        >
          <Button
            size="md"
            variant="solid"
            onClick={openConfirm}
            isLoading={isProcessing}
            loadingText={
              status === "approving" ? t("buy.approving") :
              status === "buying" ? t("buy.buying") :
              t("buy.confirming")
            }
            isDisabled={hasInsufficientBalance || status === "done"}
            w="100%"
          >
            {t("buy.buyNow")}
          </Button>
        </Tooltip>
        {error && (
          <Text color="red.400" fontSize={11} fontFamily="Oxanium">
            {error}
          </Text>
        )}
      </VStack>

      {/* ── Confirmation modal ── */}
      <Modal isOpen={isConfirmOpen} onClose={closeConfirm}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
        <ModalContent p={3} mx={4}>
          <ModalHeader pb={2}>
            <Heading size="m" textAlign="center" variant="neonWhite">
              {t("buy.confirmTitle")}
            </Heading>
          </ModalHeader>
          <ModalBody>
            <VStack spacing={5} align="stretch">
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
                <Text fontFamily="Oxanium" fontSize={14} color="whiteAlpha.900" textTransform="uppercase" letterSpacing="0.1em">
                  {t("buy.willPay")}
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
                  <Text fontFamily="Oxanium" fontSize={14} color="whiteAlpha.800" fontStyle="italic">
                    {usdLabel}
                  </Text>
                )}
              </Flex>

              <Text fontFamily="Oxanium" fontSize={14} color="whiteAlpha.900" textAlign="center">
                {t("buy.confirmNotice")}
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter justifyContent="center" mt={2} gap={3}>
            <Button variant="defaultOutline" size="sm" onClick={closeConfirm}>
              {t("buy.confirmCancel")}
            </Button>
            <Button variant="secondarySolid" size="sm" onClick={handleConfirm}>
              {t("buy.confirmSubmit")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ── Success modal ── */}
      <Modal isOpen={isSuccessOpen} onClose={closeSuccess}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
        <ModalContent p={3} mx={4}>
          <ModalHeader pb={2}>
            <Heading size="m" textAlign="center" variant="neonWhite">
              {t("buy.successTitle")}
            </Heading>
          </ModalHeader>
          <ModalBody>
            <VStack spacing={5} align="center">
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

          <ModalFooter justifyContent="center" mt={2} gap={3}>
            <Button
              variant="secondarySolid"
              size="sm"
              onClick={closeSuccess}
            >
              {t("buy.close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
