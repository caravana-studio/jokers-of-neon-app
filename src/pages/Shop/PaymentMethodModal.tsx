import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFiatSelect: () => void;
  onCryptoSelect: () => void;
  fiatLabel: string;
  cryptoLabel: string;
  title: string;
  description: string;
  fiatDisabled?: boolean;
  cryptoDisabled?: boolean;
  cryptoDisabledReason?: string;
}

const splitPaymentLabel = (
  label: string,
  fallbackLeft: string,
): { left: string; right: string } => {
  const parts = label
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return {
      left: parts[0],
      right: parts.slice(1).join(" · "),
    };
  }

  if (parts.length === 1) {
    return {
      left: parts[0],
      right: "",
    };
  }

  return {
    left: fallbackLeft,
    right: "",
  };
};

export const PaymentMethodModal = ({
  isOpen,
  onClose,
  onFiatSelect,
  onCryptoSelect,
  fiatLabel,
  cryptoLabel,
  title,
  description,
  fiatDisabled = false,
  cryptoDisabled = false,
  cryptoDisabledReason,
}: PaymentMethodModalProps) => {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;
    scrollYRef.current = window.scrollY;
  }, [isOpen]);

  const restoreScrollPosition = () => {
    if (typeof window === "undefined") return;
    const scrollY = scrollYRef.current;
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: scrollY, left: 0, behavior: "auto" });
    });
  };

  const handleClose = () => {
    if (typeof window !== "undefined") {
      scrollYRef.current = window.scrollY;
    }
    onClose();
    restoreScrollPosition();
  };

  const handleSelect = (onSelect: () => void) => {
    handleClose();
    onSelect();
  };

  const fiatParts = splitPaymentLabel(fiatLabel, "Pay with card");
  const cryptoParts = splitPaymentLabel(cryptoLabel, "Pay with crypto");

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isCentered
      size="sm"
      motionPreset="scale"
      blockScrollOnMount={false}
      preserveScrollBarGap={false}
      returnFocusOnClose={false}
    >
      <ModalOverlay backdropFilter="blur(8px)" bg="rgba(0,0,0,0.75)" />
      <ModalContent
        bg="rgba(6,38,64,0.86)"
        border="1px solid rgba(32,198,237,0.4)"
        borderRadius="24px"
        boxShadow="0 0 36px rgba(32,198,237,0.2)"
        mx={4}
      >
        <ModalCloseButton color="whiteAlpha.900" />
        <ModalBody pt={7} pb={6}>
          <VStack spacing={5} align="stretch">
            <Text
              fontFamily="Orbitron"
              fontSize={20}
              color="neonGreen"
              textTransform="uppercase"
              letterSpacing="0.08em"
              textAlign="center"
              textShadow="0 0 10px rgba(32,198,237,0.45)"
            >
              {title}
            </Text>
            <Text
              color="whiteAlpha.800"
              fontSize="sm"
              textAlign="center"
              fontFamily="Oxanium"
            >
              {description}
            </Text>
            <Button
              variant="solid"
              onClick={() => handleSelect(onFiatSelect)}
              isDisabled={fiatDisabled}
              minH="56px"
              textTransform="none"
              px={4}
              boxShadow="0 0 18px rgba(10,154,241,0.35)"
            >
              <HStack w="full" justify="space-between" spacing={2}>
                <Text
                  fontFamily="Oxanium"
                  fontSize={16}
                  fontWeight={700}
                >
                  {fiatParts.left}
                </Text>
                {fiatParts.right ? (
                  <Text
                    fontFamily="Oxanium"
                    fontSize={16}
                    fontWeight={700}
                    whiteSpace="nowrap"
                  >
                    {fiatParts.right}
                  </Text>
                ) : null}
              </HStack>
            </Button>
            <Button
              variant="outlineSecondaryGlow"
              onClick={() => handleSelect(onCryptoSelect)}
              isDisabled={cryptoDisabled}
              minH="56px"
              textTransform="none"
              px={4}
            >
              <HStack w="full" justify="space-between" spacing={2}>
                <Text
                  fontFamily="Oxanium"
                  fontSize={16}
                  fontWeight={700}
                >
                  {cryptoParts.left}
                </Text>
                {cryptoParts.right ? (
                  <Text
                    fontFamily="Oxanium"
                    fontSize={16}
                    fontWeight={700}
                    whiteSpace="nowrap"
                  >
                    {cryptoParts.right}
                  </Text>
                ) : null}
              </HStack>
            </Button>
            {cryptoDisabled && cryptoDisabledReason ? (
              <Box
                bg="rgba(255,179,0,0.12)"
                border="1px solid rgba(255,179,0,0.35)"
                borderRadius="10px"
                px={3}
                py={2}
              >
                <Text color="orange.200" fontSize="xs" fontFamily="Oxanium">
                  {cryptoDisabledReason}
                </Text>
              </Box>
            ) : null}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
