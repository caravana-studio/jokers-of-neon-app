import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react'
import {PlaysLayout} from './PlaysLayout.tsx'

interface PlaysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlaysModal = ({isOpen, onClose}: PlaysModalProps) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose} >
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={0}>
          <PlaysLayout />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
};