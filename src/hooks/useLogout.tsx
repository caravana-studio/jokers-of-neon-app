import { useNavigate } from "react-router-dom";
import { useGameContext } from "../providers/GameProvider";
import { GAME_ID, LOGGED_USER } from "../constants/localStorage";
import { useDojo } from "../dojo/useDojo";

export const useLogout = () => {
  const navigate = useNavigate();

  const { restartGame } = useGameContext();
  const { logout } = useDojo();

  const handleLogout = () => {
    localStorage.removeItem(GAME_ID);
    localStorage.removeItem(LOGGED_USER);
    logout();
    restartGame();
    navigate("/");
  };

  return { handleLogout };
};
