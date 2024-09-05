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
import { NEON_PINK } from "../theme/colors";

interface ConfirmationModalProps {
  close: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
}

export const ConfirmationModal = ({
  close,
  title,
  description,
  onConfirm,
}: ConfirmationModalProps) => {
  return (
    <Modal isOpen={true} onClose={close}>
      <ModalOverlay />
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
            Close
          </Button>
          <Button
            variant="secondarySolid"
            boxShadow={`0px 0px 10px 6px ${NEON_PINK}`}
            size="sm"
            onClick={onConfirm}
            ml={3}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
