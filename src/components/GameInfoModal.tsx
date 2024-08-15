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
} from "@chakra-ui/react";
import { useDojo } from "../dojo/useDojo";
import { useUsername } from "../dojo/utils/useUsername";
import { useGameContext } from "../providers/GameProvider";

interface GameInfoModalProps {
  close: () => void;
}

export const GameInfoModal = ({ close }: GameInfoModalProps) => {
  const { gameId } = useGameContext();
  const { account } = useDojo();
  const username = useUsername();
  return (
    <Modal isOpen={true} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="m" variant="neonWhite">
            Game information
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={4} flexDirection="column">
            <Heading size="s" variant="neonGreen">
              Game id: {gameId}
            </Heading>
            <Heading size="s" variant="neonGreen">
              Username: {username}
            </Heading>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={close}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
