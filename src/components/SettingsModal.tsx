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
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { NEON_PINK } from "../theme/colors";

export const SettingsModal = () => {
  const { t } = useTranslation(["game"]);
  const title = "Settings";
  const languageLbl = "Language";
  const sfxLbl = "Sfx";
  const musicLbl = "Music";
  const animSpeedLbl = "Animation speed";

  const saveSettings = () => {};

  return (
    <Modal isOpen={true} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="m" variant="neonWhite">
            {title}
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={4} flexDirection="column">
            <Flex>
              <Text size="md">{languageLbl}</Text>
            </Flex>
            <Flex>
              <Text size="md">{sfxLbl}</Text>
            </Flex>
            <Flex>
              <Text size="md">{musicLbl}</Text>
            </Flex>
            <Flex>
              <Text size="md">{animSpeedLbl}</Text>
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="secondarySolid"
            boxShadow={`0px 0px 10px 6px ${NEON_PINK}`}
            size="sm"
            onClick={saveSettings}
            ml={3}
          >
            {t("confirmation-modal.confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
