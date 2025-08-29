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
import { useResponsiveValues } from "../theme/responsiveSettings";

interface ConfirmationModalProps {
  close: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isOpen?: boolean;
}

export const ConfirmationModal = ({
  close,
  title,
  description,
  onConfirm,
  isOpen = true,
}: ConfirmationModalProps) => {
  const { t } = useTranslation(["game"]);

  const { isSmallScreen } = useResponsiveValues();
  return (
    <Modal isOpen={isOpen} onClose={close}>
      <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
      <ModalContent p={3}>
        <ModalHeader>
          <Heading size="m" variant="neonWhite">
            {title}
          </Heading>
        </ModalHeader>
        <ModalCloseButton sx={{ m: 5 }} />
        <ModalBody>
          <Flex gap={4} flexDirection="column">
            <Text size="md">{description}</Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button variant="defaultOutline" size="sm" w={isSmallScreen ? "50%" : "auto"} onClick={close}>
            {t("confirmation-modal.close")}
          </Button>
          <Button
            variant="secondarySolid"
            boxShadow={`0px 0px 10px 6px ${NEON_PINK}`}
            size="sm"
            onClick={onConfirm}
            ml={5}
            w={isSmallScreen ? "50%" : "auto"}
          >
            {t("confirmation-modal.confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
