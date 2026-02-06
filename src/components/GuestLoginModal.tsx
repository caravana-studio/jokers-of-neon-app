import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Preferences } from "@capacitor/preferences";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { GUEST_LOGIN_MODAL_SHOWN } from "../constants/localStorage";
import { PromoModal } from "./PromoModal";

interface GuestLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const GuestLoginModal = ({
  isOpen,
  onClose,
  onLogin,
}: GuestLoginModalProps) => {
  const { t } = useTranslation("home", {
    keyPrefix: "home.guestLoginModal",
  });

  const handleDontShowAgain = async () => {
    onClose();
    try {
      await Preferences.set({
        key: GUEST_LOGIN_MODAL_SHOWN,
        value: "hidden",
      });
    } catch (error) {
      console.warn("Preferences.set failed for guest modal", error);
      try {
        window.localStorage.setItem(GUEST_LOGIN_MODAL_SHOWN, "hidden");
      } catch (storageError) {
        console.warn("localStorage failed for guest modal", storageError);
      }
    }
  };

  return (
    <PromoModal
      isOpen={isOpen}
      onClose={onClose}
      closeButtonColor="white"
    >
      <Flex
        flexDir="column"
        px={4}
        alignItems="center"
        background="url(/packs/bg/5.jpg)"
        backgroundSize="cover"
        backgroundPosition="center"
        height={isMobile ? "360px" : "460px"}
        width="100%"
        justifyContent="center"
        overflow="hidden"
        position="relative"
        textAlign="center"
        gap={3}
      >
        <Flex flexDir="column" gap={2} mb={isMobile ? 2 : 3} zIndex={3}>
          <Heading
            color="gold"
            variant="italic"
            fontSize={isMobile ? 15 : 26}
            lineHeight={1.3}
            textShadow="0 0 5px rgba(255,255,255,0.8)"
          >
            {t("title")}
          </Heading>
        </Flex>
        <Text
          fontSize={isMobile ? 13 : 20}
          lineHeight={1.25}
          textShadow="0 0 10px rgba(0,0,0,0.6)"
          zIndex={3}
          mb={6}
          maxW="80%"
        >
          {t("body")}
        </Text>
        <Flex justifyContent="center" alignItems="center" gap={2}>
          <Button
            colorScheme="blue"
            variant="solid"
            size={isMobile ? "sm" : "md"}
            onClick={onLogin}
            zIndex={3}
            w={{ base: "80px", sm: "200px" }}
            mt={isMobile ? 0 : 2}
            fontSize={{ base: "10px", sm: "14px" }}
          >
            {t("button")}
          </Button>
          <Heading
            fontSize={isMobile ? 10 : 16}
            lineHeight={1.2}
            w={{ base: "110px", sm: "200px" }}
            textShadow="0 0 5px rgba(255,255,255,0.5)"
            zIndex={3}
          >
            {t("welcomePack")}
          </Heading>
        </Flex>
      </Flex>
      <Flex justifyContent="center" mt={4}>
        <Button
          variant="ghost"
          size={isMobile ? "xs" : "sm"}
          fontSize={{base: "9px", sm: "13px"}}
          onClick={handleDontShowAgain}
        >
          {t("dontShowAgain")}
        </Button>
      </Flex>
    </PromoModal>
  );
};
