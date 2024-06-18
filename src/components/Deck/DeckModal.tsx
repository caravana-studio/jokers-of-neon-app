import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react'
import { DeckOverview } from './DeckOverview.tsx'
import { Deck } from '../../types/Deck.ts'

interface DeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: Deck;
}

export const DeckModal = ({isOpen, onClose, deck}: DeckModalProps) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside" isCentered>
      <ModalOverlay />
      <ModalContent width="90%" marginTop="3%" maxWidth="90%" maxHeight="90%">
        <ModalBody p={0}>
          <DeckOverview commonCards={deck.commonCards} effectCards={deck.effectCards} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
};