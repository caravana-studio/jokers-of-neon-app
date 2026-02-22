import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useUsername } from "../../dojo/utils/useUsername";
import { useLogout } from "../../hooks/useLogout";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { isNative } from "../../utils/capacitorUtils";

export const ControllerButton = () => {
  const { isSmallScreen } = useResponsiveValues();
  const username = useUsername();
  const { handleLogout } = useLogout();
  const { t } = useTranslation("game");

  return (
    <Flex
      position="absolute"
      top={isSmallScreen ? (isNative ? "50px" : "15px") : "40px"}
      left={isMobile ? "70px" : "105px"}
      zIndex={100}
    >
      <Menu placement="bottom-start">
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
