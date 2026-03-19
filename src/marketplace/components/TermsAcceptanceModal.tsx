import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Text,
  Box,
  VStack,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount, useDisconnect } from "@starknet-react/core";
import { getMarketplaceTermsDocument } from "../terms";

const STORAGE_KEY = "marketplace_terms_v2_accepted";

export function TermsAcceptanceModal() {
  const { t } = useTranslation("marketplace");
  const { status } = useAccount();
  const { disconnect } = useDisconnect();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [checked, setChecked] = useState(false);
  const termsContent = getMarketplaceTermsDocument(t);

  useEffect(() => {
    if (
      status === "connected" &&
      localStorage.getItem(STORAGE_KEY) !== "true"
    ) {
      onOpen();
    }
  }, [status]);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    onClose();
  };

  const handleDecline = () => {
    disconnect();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      size="lg"
      isCentered
    >
      <ModalOverlay bg="rgba(0,0,0,0.75)" backdropFilter="blur(6px)" />
      <ModalContent
        bg="gray.900"
        border="1px solid"
        borderColor="rgba(32, 198, 237, 0.3)"
        borderRadius="xl"
        boxShadow="0 0 40px rgba(32, 198, 237, 0.15)"
        mx={4}
      >
        <ModalHeader
          fontFamily="Orbitron"
          textTransform="uppercase"
          fontSize={15}
          letterSpacing="0.08em"
          color="white"
          borderBottom="1px solid"
          borderColor="whiteAlpha.100"
          pb={3}
        >
          {t("terms.modalTitle")}
        </ModalHeader>

        <ModalBody py={4}>
          <VStack spacing={3} align="stretch">
            {/* Scrollable terms content */}
            <Box
              h="340px"
              overflowY="auto"
              bg="rgba(0,0,0,0.3)"
              border="1px solid"
              borderColor="whiteAlpha.100"
              borderRadius="md"
              p={4}
              sx={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(32,198,237,0.3) transparent",
                "&::-webkit-scrollbar": { width: "4px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(32,198,237,0.3)",
                  borderRadius: "4px",
                },
              }}
            >
              <Text
                fontFamily="Oxanium"
                fontSize={12}
                color="whiteAlpha.800"
                whiteSpace="pre-wrap"
                lineHeight="1.7"
              >
                {termsContent}
              </Text>
            </Box>

            {/* Warning about declining */}
            <Text
              fontFamily="Oxanium"
              fontSize={11}
              color="whiteAlpha.500"
              textAlign="center"
            >
              {t("terms.declineWarning")}
            </Text>

            {/* Checkbox */}
            <Checkbox
              isChecked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              colorScheme="cyan"
              size="md"
            >
              <Text fontFamily="Oxanium" fontSize={13} color="whiteAlpha.900">
                {t("terms.checkboxLabel")}
              </Text>
            </Checkbox>
          </VStack>
        </ModalBody>

        <ModalFooter
          borderTop="1px solid"
          borderColor="whiteAlpha.100"
          pt={3}
          gap={3}
        >
          <HStack spacing={3} w="100%" justify="flex-end">
            <Button
              variant="ghost"
              size="sm"
              color="whiteAlpha.600"
              _hover={{ color: "red.300", bg: "rgba(255,100,100,0.1)" }}
              onClick={handleDecline}
              fontFamily="Orbitron"
              fontSize={11}
              letterSpacing="0.08em"
            >
              {t("terms.decline")}
            </Button>
            <Button
              size="sm"
              isDisabled={!checked}
              onClick={handleAccept}
              fontFamily="Orbitron"
              fontSize={11}
              letterSpacing="0.08em"
              bg="rgba(32, 198, 237, 0.15)"
              color="#20c6ed"
              border="1px solid rgba(32, 198, 237, 0.4)"
              _hover={{ bg: "rgba(32, 198, 237, 0.25)" }}
              _disabled={{
                opacity: 0.4,
                cursor: "not-allowed",
                _hover: { bg: "rgba(32, 198, 237, 0.15)" },
              }}
            >
              {t("terms.accept")}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
