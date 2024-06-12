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
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GAME_ID, LOGGED_USER, SOUND_OFF } from "../constants/localStorage";
import { useUsername } from "../dojo/utils/useUsername";
import { useGameContext } from "../providers/GameProvider";
import { GameInfoModal } from "./GameInfoModal";

export const GameMenu = () => {
  const username = useUsername();
  const { executeCreateGame } = useGameContext();
  const navigate = useNavigate();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(!localStorage.getItem(SOUND_OFF));
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (!localStorage.getItem(SOUND_OFF)) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error: any) => {
            console.error("Auto-play failed:", error);
          });
      }
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        localStorage.setItem(SOUND_OFF, "true");
      } else {
        audioRef.current.play();
        localStorage.removeItem(SOUND_OFF);
      }
      setIsPlaying(!isPlaying);
    }
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
      <audio ref={audioRef} src="/music/track1.mp3" loop />

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
