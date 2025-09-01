import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { NEON_PINK } from "../theme/colors";

interface ConfirmationModalProps {
  close: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isOpen?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationModal = ({
  close,
  title,
  description,
  onConfirm,
  isOpen = true,
  confirmText,
  cancelText,
}: ConfirmationModalProps) => {
  const { t } = useTranslation(["game"]);
  return (
    <Modal isOpen={isOpen} onClose={close}>
      <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
      <ModalContent>
        <ModalHeader>
          <Heading size="m" variant="neonWhite">
            {title}
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={4} flexDirection="column">
            <Text size="md">{description}</Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button variant="defaultOutline" size="sm" onClick={close}>
            {cancelText ?? t("confirmation-modal.close")}
          </Button>
          <Button
            variant="secondarySolid"
            boxShadow={`0px 0px 10px 6px ${NEON_PINK}`}
            size="sm"
            onClick={onConfirm}
            ml={3}
          >
            {confirmText ?? t("confirmation-modal.confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
