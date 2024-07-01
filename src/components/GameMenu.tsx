import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList
} from "@chakra-ui/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GAME_ID, LOGGED_USER } from "../constants/localStorage";
import { useUsername } from "../dojo/utils/useUsername";
import { useAudioPlayer } from '../providers/AudioPlayerProvider.tsx';
import { useGameContext } from "../providers/GameProvider";
import { GameInfoModal } from "./GameInfoModal";

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
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          sx={{
            color: "white",
            border: "3px solid white",
            boxShadow: `0px 0px 10px 0px white `,
            "&:active": {
              backgroundColor: "black",
            },
          }}
          px={{ base: 1, md: 3 }}
          py={{ base: 1, md: 5 }}
          fontSize={{ base: 20, md: 25 }}
          aria-label="Options"
          icon={<FontAwesomeIcon icon={faBars} />}
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
          <MenuItem
            backgroundColor="black"
            sx={{ borderRadius: 0 }}
            onClick={() => setShowInfoModal(true)}
          >
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
    </>
  );
};
