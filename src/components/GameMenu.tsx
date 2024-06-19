import {
    Box,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GAME_ID, LOGGED_USER } from "../constants/localStorage";
import { useUsername } from "../dojo/utils/useUsername";
import { useGameContext } from "../providers/GameProvider";
import { GameInfoModal } from "./GameInfoModal";
import { useAudioPlayer } from '../providers/AudioPlayerProvider.tsx'

export const GameMenu = () => {
  const username = useUsername();
  const { executeCreateGame } = useGameContext();
  const navigate = useNavigate();
  const { isPlaying, toggleSound } = useAudioPlayer();

  const [showInfoModal, setShowInfoModal] = useState(false);

  const togglePlayPause = () => {
    toggleSound();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        zIndex: 1000,
      }}
    >
      <Menu>
        <MenuButton
          as={IconButton}
          sx={{
            color: "white",
            border: "3px solid white",
            px: 3,
            py: 5,
            boxShadow: `0px 0px 10px 0px white `,
            "&:active": {
              backgroundColor: "black",
            },
          }}
          aria-label="Options"
          icon={<FontAwesomeIcon fontSize={25} icon={faBars} />}
          variant="outline"
        />
        <MenuList backgroundColor="black" sx={{ borderRadius: 0 }}>
          <MenuItem
            backgroundColor="black"
            sx={{ borderRadius: 0 }}
            onClick={() => executeCreateGame()}
          >
            Start new game
          </MenuItem>
          <MenuItem
            backgroundColor="black"
            sx={{ borderRadius: 0 }}
            onClick={togglePlayPause}
          >
            Turn sound {isPlaying ? "OFF" : "ON"}
          </MenuItem>
          <MenuItem backgroundColor="black" sx={{ borderRadius: 0 }} onClick={() => setShowInfoModal(true)}>
            Game info
          </MenuItem>
          <MenuItem
            backgroundColor="black"
            sx={{ borderRadius: 0 }}
            onClick={() => {
              localStorage.removeItem(GAME_ID);
              localStorage.removeItem(LOGGED_USER);
              navigate("/");
            }}
          >
            Logout {username}{" "}
          </MenuItem>
        </MenuList>
      </Menu>
      {showInfoModal && <GameInfoModal close={() => setShowInfoModal(false)} />}
    </Box>
  );
};
