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
  Text
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { NEON_PINK } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";

interface ConfirmationModalProps {
  close: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isOpen?: boolean;
  confirmText?: string;
  cancelText?: string;
  showCloseButton?: boolean;
}

export const ConfirmationModal = ({
  close,
  title,
  description,
  onConfirm,
  onCancel,
  isOpen = true,
  confirmText,
  cancelText,
  showCloseButton = false,
}: ConfirmationModalProps) => {
  const { t } = useTranslation(["game"]);

  const { isSmallScreen } = useResponsiveValues();
  return (
    <Modal isOpen={isOpen} onClose={close}>
      <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
      <ModalContent p={3}>
        {showCloseButton && <ModalCloseButton />}
        <ModalHeader>
          <Heading size="m" textAlign={"center"} variant="neonWhite">
            {title}
          </Heading>
        </ModalHeader>
        <ModalBody>
          <Flex gap={4} flexDirection="column">
            <Text size="md" textAlign={"center"}>
              {description}
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter justifyContent="center" mt={2}>
          <Button
            variant="defaultOutline"
            size="sm"
            fontSize={[10, 12]}
            w={isSmallScreen ? "50%" : "auto"}
            onClick={onCancel ?? close}
          >
            {cancelText ?? t("confirmation-modal.close")}
          </Button>
          <Button
            variant="secondarySolid"
            boxShadow={`0px 0px 10px 6px ${NEON_PINK}`}
            size="sm"
            onClick={onConfirm}
            ml={5}
            fontSize={[10, 12]}
            w={isSmallScreen ? "50%" : "auto"}
          >
            {confirmText ?? t("confirmation-modal.confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
