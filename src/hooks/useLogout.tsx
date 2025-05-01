import { useNavigate } from "react-router-dom";
import { useDisconnect } from "@starknet-react/core";
import { useGameContext } from "../providers/GameProvider";
import { GAME_ID, LOGGED_USER } from "../constants/localStorage";

export const useLogout = () => {
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();
  const { restartGame } = useGameContext();

  const handleLogout = () => {
    localStorage.removeItem(GAME_ID);
    localStorage.removeItem(LOGGED_USER);
    disconnect();
    restartGame();
    navigate("/");
  };

  return { handleLogout };
};
