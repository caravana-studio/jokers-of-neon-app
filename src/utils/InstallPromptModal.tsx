import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Heading,
  Flex,
  Text,
  Button,
} from '@chakra-ui/react';

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  onPlayInBrowser: () => void;
}

const InstallPromptModal: React.FC<InstallPromptModalProps> = ({ isOpen, onClose, onInstall, onPlayInBrowser }) => {
  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg" variant="italic">
            Jokers of Neon
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDirection="column" alignItems="center" gap={4}>
            <Text fontSize="lg" textAlign="center">
              Best way to play Jokers of Neon is by installing our App. Do you want to install the app now?
            </Text>
            <Flex gap={4}>
              <Button colorScheme="blue" onClick={onInstall}>
                Install app
              </Button>
              <Button variant="outline" onClick={onPlayInBrowser}>
                Play on the browser
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InstallPromptModal;
