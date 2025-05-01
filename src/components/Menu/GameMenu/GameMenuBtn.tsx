import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { GameMenuContent } from "./GameMenuContent.tsx";
import { useResponsiveValues } from "../../../theme/responsiveSettings.tsx";

export interface GameMenuProps {
  showTutorial?: () => void;
}

export const GameMenuBtn = ({ showTutorial }: GameMenuProps) => {
  const { isSmallScreen } = useResponsiveValues();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {isMenuOpen && (
        <GameMenuContent
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
      )}
      <Menu placement="right" variant={"menuGameOutline"}>
        <MenuButton
          height={["30px", "45px"]}
          width={["30px", "45px"]}
          borderRadius={["8px", "14px"]}
          className="game-tutorial-step-9"
          onClick={() => setIsMenuOpen(true)}
        >
          <FontAwesomeIcon
            icon={faBars}
            style={{
              verticalAlign: "middle",
              fontSize: isSmallScreen ? 14 : 20,
            }}
          />
        </MenuButton>
      </Menu>
    </>
  );
};
