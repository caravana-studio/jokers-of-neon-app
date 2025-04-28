import { useNavigate } from "react-router-dom";
import { useGame } from "../dojo/queries/useGame";
import { useEffect } from "react";

export const useRedirectByGameState = (delay = 3000) => {
    const game = useGame();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (game?.state !== "AT_SHOP") return;
  
      const timeoutId = setTimeout(() => {
        if (game?.state === "AT_SHOP") {
          navigate("/redirect/store", { state: { lastTabIndex: 1 } });
        }
      }, delay);
  
      return () => clearTimeout(timeoutId);
    }, [game?.state, navigate, delay]);
  };