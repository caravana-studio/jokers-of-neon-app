import { useNavigate as useRouterNavigate } from "react-router-dom";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useGameStore } from "../state/useGameStore";
import { stateToPageMap } from "../constants/redirectConfig";

export const useCustomNavigate = () => {
  const navigate = useRouterNavigate();
  const { setState } = useGameStore();

  const customNavigate = (state: GameStateEnum) => {
    setState(state);
    navigate(stateToPageMap[state]);
  };

  return customNavigate;
};
