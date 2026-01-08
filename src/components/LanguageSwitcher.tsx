import {
  Box,
  Button,
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
          as={Button}
          p={"5px !important"}
          width={"40px"}
          height={"40px"}
        >
          <CircleFlagLanguage
            style={{ paddingTop: "10px" }}
            width={"25px"}
            languageCode={currentLanguage.substring(0, 2)}
          />
        </MenuButton>
        <MenuList>
          <MenuItem
            height={"40px"}
            fontSize={isMobile ? 15 : 17}
            onClick={() => changeLanguage("en")}
            gap={2}
          >
            <CircleFlagLanguage
              width={isMobile ? "25px" : "30px"}
              languageCode="en-us"
            />
            <Text ml={8}>English</Text>
          </MenuItem>
          <MenuItem
            height={"40px"}
            fontSize={isMobile ? 15 : 17}
            onClick={() => changeLanguage("es")}
            gap={2}
          >
            <CircleFlagLanguage
              width={isMobile ? "25px" : "30px"}
              languageCode="es"
            />
            <Text ml={8}>Español</Text>
          </MenuItem>
          <MenuItem
            height={"40px"}
            fontSize={isMobile ? 15 : 17}
            onClick={() => changeLanguage("pt")}
            gap={2}
          >
            <CircleFlagLanguage
              width={isMobile ? "25px" : "30px"}
              languageCode="pt"
            />
            <Text ml={8}>Português</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
