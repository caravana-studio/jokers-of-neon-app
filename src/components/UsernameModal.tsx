import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { UsernameApiError, validateUsername } from "../api/usernames";

type UsernameModalProps = {
  isOpen: boolean;
  initialUsername?: string | null;
  title?: string;
  isRequired?: boolean;
  isSaving?: boolean;
  onSave: (username: string) => Promise<void>;
  onClose?: () => void;
};

export const UsernameModal = ({
  isOpen,
  initialUsername,
  title = "Choose username",
  isRequired = false,
  isSaving = false,
  onSave,
  onClose,
}: UsernameModalProps) => {
  const [value, setValue] = useState(initialUsername ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(initialUsername ?? "");
      setError(null);
    }
  }, [initialUsername, isOpen]);

  const handleSubmit = async () => {
    try {
      const username = validateUsername(value);
      setError(null);
      await onSave(username);
    } catch (error) {
      if (error instanceof UsernameApiError || error instanceof Error) {
        setError(error.message);
        return;
      }
      setError("Unable to save username");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isRequired ? () => {} : onClose ?? (() => {})}
      closeOnOverlayClick={!isRequired}
      isCentered
    >
      <ModalOverlay bg="rgba(0, 0, 0, 0.75)" />
      <ModalContent bg="black" color="white" border="1px solid #20C6ED" mx={4}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <Flex flexDir="column" gap={3}>
            <FormControl isInvalid={Boolean(error)}>
              <Input
                value={value}
                maxLength={15}
                autoFocus
                placeholder="Username"
                onChange={(event) => setValue(event.target.value.trim())}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    void handleSubmit();
                  }
                }}
              />
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
          </Flex>
        </ModalBody>
        <ModalFooter gap={3}>
          {!isRequired && (
            <Button variant="ghost" onClick={onClose} isDisabled={isSaving}>
              Cancel
            </Button>
          )}
          <Button
            variant="secondarySolid"
            onClick={handleSubmit}
            isLoading={isSaving}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
