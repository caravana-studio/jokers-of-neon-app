import {
  Flex,
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";

interface CollectorPacksShopModalProps {
  backgroundImage?: string;
}

export const CollectorPacksShopModal = ({
  backgroundImage = "/packs/bg/5.jpg",
}: CollectorPacksShopModalProps) => {
  const [open, setOpen] = useState(true);
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop.collector-packs-modal",
  });

  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      size="4xl"
      trapFocus={false}
      autoFocus={false}
    >
      <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
      <ModalContent p={3} overflow="visible" position="relative">
        <ModalCloseButton m={4} color="white" />
        <Flex
          flexDir="column"
          px={4}
          alignItems="center"
          background={`url(${backgroundImage})`}
          backgroundSize="cover"
          backgroundPosition="center"
          height={isMobile ? "360px" : "460px"}
          width="100%"
          justifyContent="center"
          overflow="hidden"
          position="relative"
          textAlign="center"
          gap={2}
        >
          <Flex flexDir="column" gap={2} mb={isMobile ? 3 : 5}>
            <Heading
              color="gold"
              variant="italic"
              fontSize={isMobile ? 17 : 30}
              lineHeight={1}
              textShadow="0 0 10px rgba(0,0,0,0.6)"
            >
              {t("title")}
            </Heading>
            <Text
              textTransform="uppercase"
              fontSize={isMobile ? 12 : 20}
              lineHeight={1.1}
              textShadow="0 0 10px rgba(0,0,0,0.6)"
            >
              {t("subtitle")}
            </Text>
          </Flex>
          <Text
            fontSize={isMobile ? 14 : 22}
            lineHeight={1.2}
            maxW={isMobile ? "90%" : "70%"}
            textShadow="0 0 10px rgba(0,0,0,0.6)"
          >
            {t("description")}
          </Text>
        </Flex>
      </ModalContent>
    </Modal>
  );
};
