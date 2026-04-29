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
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { NEON_PINK } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";

interface ConfirmationModalProps {
  close: () => void;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isOpen?: boolean;
  confirmText?: string;
  cancelText?: string;
  showCloseButton?: boolean;
  children?: ReactNode;
  closeOnOverlayClick?: boolean;
  isConfirmDisabled?: boolean;
  isConfirmLoading?: boolean;
  showCancelButton?: boolean;
  contentMaxW?: string | string[];
  titleFontSize?: string | string[];
  titleLineHeight?: string | string[];
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
  children,
  closeOnOverlayClick = true,
  isConfirmDisabled = false,
  isConfirmLoading = false,
  showCancelButton = true,
  contentMaxW,
  titleFontSize,
  titleLineHeight,
}: ConfirmationModalProps) => {
  const { t } = useTranslation(["game"]);

  const { isSmallScreen } = useResponsiveValues();
  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      closeOnOverlayClick={closeOnOverlayClick}
    >
      <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
      <ModalContent p={3} maxW={contentMaxW}>
        {showCloseButton && <ModalCloseButton />}
        <ModalHeader>
          <Heading
            size="m"
            textAlign={"center"}
            variant="neonWhite"
            fontSize={titleFontSize}
            lineHeight={titleLineHeight}
          >
            {title}
          </Heading>
        </ModalHeader>
        <ModalBody>
          {children ?? (
            <Flex gap={4} flexDirection="column">
              <Text size="md" textAlign={"center"}>
                {description}
              </Text>
            </Flex>
          )}
        </ModalBody>
        <ModalFooter justifyContent="center" mt={2} gap={3}>
          {showCancelButton && (
            <Button
              variant="defaultOutline"
              size="sm"
              fontSize={[10, 12]}
              w={isSmallScreen ? "50%" : "auto"}
              whiteSpace="normal"
              wordBreak="normal"
              overflowWrap="normal"
              textAlign="center"
              h="auto"
              py={2}
              onClick={onCancel ?? close}
            >
              {cancelText ?? t("confirmation-modal.close")}
            </Button>
          )}
          <Button
            variant="secondarySolid"
            boxShadow={`0px 0px 10px 6px ${NEON_PINK}`}
            size="sm"
            onClick={onConfirm}
            isDisabled={isConfirmDisabled}
            isLoading={isConfirmLoading}
            fontSize={[10, 12]}
            w={isSmallScreen ? "50%" : "auto"}
            whiteSpace="normal"
            wordBreak="normal"
            overflowWrap="normal"
            textAlign="center"
            h="auto"
            py={2}
          >
            {confirmText ?? t("confirmation-modal.confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
