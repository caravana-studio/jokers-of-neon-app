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
    <Modal size="xxl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent padding={{ base:4, sm:12 }}>
        <ModalHeader>
          <Heading size={{ base: "m", sm: "lg" }}variant="italic">
          App install
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDirection="column" alignItems="center" gap={4}>
            <Text fontSize={{ base: "s", sm: "lg" }} textAlign="center">
            Don't miss out on the ultimate Jokers of Neon experience. Install our app now!
            </Text>
            <Flex gap={{ base: 4, sm: 6 }}
              flexWrap={{ base: "wrap", sm: "nowrap" }}
              justifyContent="center" paddingTop={4}>
              <Button colorScheme="blue" onClick={onInstall}>
                Install app
              </Button>
              <Button variant="secondarySolid" onClick={onPlayInBrowser}>
                Keep Playing on browser
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InstallPromptModal;
