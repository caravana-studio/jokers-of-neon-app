import {
    Button,
    Flex,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useUsername } from "../../dojo/utils/useUsername";
import { useLogout } from "../../hooks/useLogout";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const ControllerButton = () => {
  const { isSmallScreen } = useResponsiveValues();
  const username = useUsername();
  const { handleLogout } = useLogout();
  const { t } = useTranslation("game");

  return (
    <Flex
      position="absolute"
      top={isSmallScreen ? "22px" : "50px"}
      right={isSmallScreen ? 5 : "60px"}
      zIndex={100}
    >
      <Menu placement="bottom-end">
        <MenuButton
          as={Button}
          textTransform="lowercase"
          h={isSmallScreen ? "24px" : "unset"}
        >
          {username}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={handleLogout}>
            {t("game.game-menu.logout-btn")}
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
