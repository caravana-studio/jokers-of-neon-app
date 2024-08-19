import {
  Box,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { SpecialCards } from "./SpecialCards";

interface CurrentSpecialCardsModalProps {
  close: () => void;
}

export const CurrentSpecialCardsModal = ({
  close,
}: CurrentSpecialCardsModalProps) => {
  return (
    <Modal size='2xl' isOpen={true} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="s" variant="neonWhite">
            My special cards
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={2}>
            <SpecialCards inStore />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
