import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProgressStore } from "../../state/roguelike/useProgressStore";
import { useRoguelikeUiStore } from "../../state/roguelike/useRoguelikeUiStore";

interface PostRunLocationState {
  nextPath?: string;
}

export const PostRunUnlockView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const consumeNextUnlock = useProgressStore((state) => state.consumeNextUnlock);
  const peekNextUnlock = useProgressStore((state) => state.peekNextUnlock);

  const unlockModalOpen = useRoguelikeUiStore((state) => state.unlockModalOpen);
  const unlockToShow = useRoguelikeUiStore((state) => state.unlockToShow);
  const openUnlockModal = useRoguelikeUiStore((state) => state.openUnlockModal);
  const clearUnlock = useRoguelikeUiStore((state) => state.clearUnlock);

  const [loading, setLoading] = useState(false);
  const nextPath =
    (location.state as PostRunLocationState | null)?.nextPath ?? "/roguelike";

  useEffect(() => {
    if (unlockToShow) {
      return;
    }

    const hydrateUnlock = async () => {
      const nextUnlock = await peekNextUnlock();
      if (nextUnlock) {
        openUnlockModal(nextUnlock);
      }
    };

    void hydrateUnlock();
  }, [unlockToShow, peekNextUnlock, openUnlockModal]);

  const handleClose = async () => {
    setLoading(true);

    if (unlockToShow) {
      await consumeNextUnlock();
    }

    clearUnlock();
    setLoading(false);
    navigate(nextPath, { replace: true });
  };

  if (!unlockToShow) {
    return (
      <Flex h="100%" w="100%" justifyContent="center" alignItems="center" p={5}>
        <VStack
          spacing={4}
          p={6}
          maxW="560px"
          bg="rgba(0,0,0,0.55)"
          border="1px solid rgba(255,255,255,0.2)"
          borderRadius="16px"
          color="white"
        >
          <Heading size="md">No hay unlock pendiente</Heading>
          <Button onClick={() => navigate("/roguelike")}>Back to Entry</Button>
        </VStack>
      </Flex>
    );
  }

  return (
    <Modal isOpen={unlockModalOpen} onClose={() => void handleClose()} isCentered>
      <ModalOverlay />
      <ModalContent bg="gray.900" color="white" border="1px solid rgba(255,255,255,0.2)">
        <ModalHeader>Nuevo Unlock</ModalHeader>
        <ModalBody>
          <VStack alignItems="flex-start" spacing={2}>
            <Heading size="md">{unlockToShow.title}</Heading>
            <Text opacity={0.9}>{unlockToShow.description}</Text>
            <Text fontSize="sm" opacity={0.75}>
              Run {unlockToShow.unlockedAtRun} · Round {unlockToShow.unlockedAtRound}
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => void handleClose()} isLoading={loading}>
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
