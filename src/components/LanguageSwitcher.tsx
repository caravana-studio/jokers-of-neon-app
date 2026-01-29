import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { CircleFlagLanguage } from "react-circle-flags";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useOptionalSettings } from "../providers/SettingsProvider";
import { isNative } from "../utils/capacitorUtils";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation(["home"]);
  const settings = useOptionalSettings();
  const currentLanguage = settings?.language ?? i18n.language.substring(0, 2);

  const changeLanguage = (lng: string) => {
    if (settings?.setLanguage) {
      settings.setLanguage(lng);
      return;
    }
    i18n.changeLanguage(lng);
  };

  const buttonSize = isMobile ? 36 : 44;
  const flagSize = isMobile ? 28 : 36;

  return (
    <Box
      transform={isMobile ? "scale(0.7)" : ""}
      zIndex={999}
      position="absolute"
      left={isMobile ? "15px" : "45px"}
      top={isMobile ? (isNative ? "50px" : "15px") : "40px"}
    >
      <Menu>
        <MenuButton
          width={`${buttonSize}px`}
          height={`${buttonSize}px`}
          borderRadius="full"
          bg="transparent"
          border="2px solid"
          borderColor="whiteAlpha.400"
          p={0}
          overflow="hidden"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          transition="all 0.2s ease"
          _hover={{
            borderColor: "whiteAlpha.700",
          }}
          _active={{
            transform: "scale(0.95)",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
            height="100%"
          >
            <CircleFlagLanguage
              width={`${flagSize}px`}
              languageCode={currentLanguage.substring(0, 2)}
            />
          </Box>
        </MenuButton>
        <MenuList
          bg="gray.900"
          borderColor="whiteAlpha.300"
          borderRadius="xl"
          py={2}
          boxShadow="0 4px 20px rgba(0, 0, 0, 0.5)"
          minW="160px"
        >
          <MenuItem
            height={"44px"}
            fontSize={isMobile ? 14 : 16}
            onClick={() => changeLanguage("en")}
            gap={3}
            bg="transparent"
            _hover={{ bg: "whiteAlpha.100" }}
            px={4}
          >
            <CircleFlagLanguage
              width={isMobile ? "26px" : "30px"}
              languageCode="en-us"
            />
            <Text fontWeight="medium">English</Text>
          </MenuItem>
          <MenuItem
            height={"44px"}
            fontSize={isMobile ? 14 : 16}
            onClick={() => changeLanguage("es")}
            gap={3}
            bg="transparent"
            _hover={{ bg: "whiteAlpha.100" }}
            px={4}
          >
            <CircleFlagLanguage
              width={isMobile ? "26px" : "30px"}
              languageCode="es"
            />
            <Text fontWeight="medium">Español</Text>
          </MenuItem>
          <MenuItem
            height={"44px"}
            fontSize={isMobile ? 14 : 16}
            onClick={() => changeLanguage("pt")}
            gap={3}
            bg="transparent"
            _hover={{ bg: "whiteAlpha.100" }}
            px={4}
          >
            <CircleFlagLanguage
              width={isMobile ? "26px" : "30px"}
              languageCode="pt"
            />
            <Text fontWeight="medium">Português</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
