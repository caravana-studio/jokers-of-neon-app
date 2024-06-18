import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react'
import { DeckOverview } from './DeckOverview.tsx'
import { Card } from '../../types/Card.ts'

interface DeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  commonCards: Card[];
  effectCards: Card[];
}

export const DeckModal = ({isOpen, onClose, commonCards, effectCards}: DeckModalProps) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside" isCentered>
      <ModalOverlay />
      <ModalContent width="90%" marginTop="3%" maxWidth="90%" maxHeight="90%">
        <ModalBody p={0}>
          <DeckOverview commonCards={commonCards} effectCards={effectCards} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
};