import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

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
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent bg="backgroundBlue" border="1px solid" borderColor="blue">
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={3} align="stretch">
            <Text color="whiteAlpha.800" fontSize="sm">
              {description}
            </Text>
            <Button
              variant="secondarySolid"
              onClick={onFiatSelect}
              isDisabled={fiatDisabled}
            >
              {fiatLabel}
            </Button>
            <Button
              variant="outlineSecondaryGlow"
              onClick={onCryptoSelect}
              isDisabled={cryptoDisabled}
            >
              {cryptoLabel}
            </Button>
            {cryptoDisabled && cryptoDisabledReason ? (
              <Text color="orange.300" fontSize="xs">
                {cryptoDisabledReason}
              </Text>
            ) : null}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
