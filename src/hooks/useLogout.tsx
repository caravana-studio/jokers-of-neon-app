import { useNavigate } from "react-router-dom";
import { useDojo } from "../dojo/useDojo";
import { useGameStore } from "../state/useGameStore";

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useDojo();

  const { removeGameId } = useGameStore();

  const handleLogout = async () => {
    await logout();
    removeGameId();
    navigate("/");
  };

  return { handleLogout };
};
