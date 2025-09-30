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
import { useGameStore } from "../state/useGameStore";
import { NEON_PINK } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import CachedImage from "./CachedImage";
import { SettingsContent } from "./SettingsContent";
import { ModalProps } from "../types/Modals";

export const SettingsModal = ({ close }: ModalProps) => {
  const { isSmallScreen } = useResponsiveValues();
  const { id } = useGameStore();

  const { t } = useTranslation(["game"], { keyPrefix: "settings-modal" });
  const { t: tGeneral } = useTranslation(["game"]);

  const title = t("title");

  return (
    <Modal isOpen={true} onClose={close || (() => {})} size={"xl"} isCentered>
      <ModalOverlay
        bg="blackAlpha.400"
        backdropFilter="auto"
        backdropBlur="5px"
      />
      <ModalContent width={isSmallScreen ? "100%" : "70%"}>
        <ModalHeader>
          <Heading size="m" variant="neonWhite">
            {title}
          </Heading>
        </ModalHeader>
        <ModalCloseButton onClick={close} />
        <ModalBody>
          <SettingsContent />
        </ModalBody>
        <ModalFooter justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
            <CachedImage src="/logos/jn.png" height="15px" />
            <Text fontFamily="Orbitron" fontSize="15px" fontWeight="500">
              {" "}
              · {id}
            </Text>
          </Flex>
          <Button
            variant="secondarySolid"
            boxShadow={`0px 0px 10px 6px ${NEON_PINK}`}
            size="sm"
            ml={3}
            onClick={close}
          >
            {tGeneral("confirmation-modal.confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
