import {
  Box,
  Heading,
  Modal,
  ModalBody,
  ModalContent, ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr
} from '@chakra-ui/react'
import { useGetPlaysLevelDetail } from '../../queries/useGetPlaysLevelDetail'
import { PlaysTable } from './PlaysTable';
import {PlaysLayout} from './PlaysLayout.tsx'

interface PlaysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlaysModal = ({isOpen, onClose}: PlaysModalProps) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='lg' >
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={0}>
          <PlaysLayout />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
};