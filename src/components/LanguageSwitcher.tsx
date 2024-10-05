import { useTranslation } from 'react-i18next';
import { CircleFlagLanguage } from 'react-circle-flags'
import {
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Box,
    Center,
    Flex,
  } from '@chakra-ui/react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation(["home"]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Menu>
      <MenuButton as={Button} p={"0 !important"} width={"auto"} >
        <Flex width={"25px"} m={"0 auto"}>
            <CircleFlagLanguage languageCode={i18n.language} />
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => changeLanguage('en')} gap={2}>
            <Box width={"30px"}>
                <CircleFlagLanguage languageCode="en-us" />
            </Box>
          English
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('es')} gap={2}>
            <Box width={"30px"}>
                <CircleFlagLanguage languageCode="es" />
            </Box>
            Español
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher;


