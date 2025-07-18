import { useDisconnect } from "@starknet-react/core";
import { useNavigate } from "react-router-dom";
import { GAME_ID, LOGGED_USER } from "../constants/localStorage";
import { useGameStore } from "../state/useGameStore";

export const useLogout = () => {
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();
  const { removeGameId } = useGameStore();

  const handleLogout = () => {
    localStorage.removeItem(GAME_ID);
    localStorage.removeItem(LOGGED_USER);
    disconnect();
    removeGameId();
    navigate("/");
  };

  return { handleLogout };
};
