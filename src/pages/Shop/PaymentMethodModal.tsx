import {
  Button,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { NEON_PINK } from "../../theme/colors";

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
      blockScrollOnMount={false}
      preserveScrollBarGap={false}
      returnFocusOnClose={false}
    >
      <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
      <ModalContent p={3} mx={4} maxW="560px">
        <ModalCloseButton color="whiteAlpha.900" />
        <ModalHeader pb={2}>
          <Heading size="m" textAlign="center" variant="neonWhite">
            {title}
          </Heading>
        </ModalHeader>
        <ModalBody pt={0} pb={6}>
          <Flex gap={4} flexDirection="column">
            <Text size="md" textAlign="center">
              {description}
            </Text>
            <Button
              variant="secondarySolid"
              onClick={() => handleSelect(onFiatSelect)}
              isDisabled={fiatDisabled}
              w="100%"
              h="auto"
              py={3}
              textTransform="none"
              px={5}
              boxShadow={`0px 0px 10px 6px ${NEON_PINK}`}
            >
              <HStack w="full" justify="space-between" spacing={2}>
                <Text fontFamily="Oxanium" fontSize={18} fontWeight={700}>
                  {fiatParts.left}
                </Text>
                {fiatParts.right ? (
                  <Text
                    fontFamily="Oxanium"
                    fontSize={18}
                    fontWeight={700}
                    whiteSpace="nowrap"
                  >
                    {fiatParts.right}
                  </Text>
                ) : null}
              </HStack>
            </Button>
            <Tooltip
              label={cryptoDisabledReason ?? ""}
              hasArrow
              shouldWrapChildren
              isDisabled={!(cryptoDisabled && cryptoDisabledReason)}
            >
              <Flex w="100%">
                <Button
                  variant="defaultOutline"
                  onClick={() => handleSelect(onCryptoSelect)}
                  isDisabled={cryptoDisabled}
                  w="100%"
                  h="auto"
                  py={3}
                  textTransform="none"
                  px={5}
                >
                  <HStack w="full" justify="space-between" spacing={2}>
                    <Text fontFamily="Oxanium" fontSize={18} fontWeight={700}>
                      {cryptoParts.left}
                    </Text>
                    {cryptoParts.right ? (
                      <Text
                        fontFamily="Oxanium"
                        fontSize={18}
                        fontWeight={700}
                        whiteSpace="nowrap"
                      >
                        {cryptoParts.right}
                      </Text>
                    ) : null}
                  </HStack>
                </Button>
              </Flex>
            </Tooltip>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
