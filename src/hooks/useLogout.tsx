import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useDojo } from "../dojo/useDojo";
import { useGameStore } from "../state/useGameStore";
import { useShopStore } from "../state/useShopStore";

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useDojo();
  const isLoggingOutRef = useRef(false);

  const { removeGameId } = useGameStore();
  const { reset: resetShop } = useShopStore();

  const handleLogout = async () => {
    if (isLoggingOutRef.current) {
      return;
    }

    isLoggingOutRef.current = true;
    try {
      await logout();
      removeGameId();
      resetShop();
      navigate("/");
    } finally {
      isLoggingOutRef.current = false;
    }
  };

  return { handleLogout };
};
