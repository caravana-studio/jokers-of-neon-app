import { useNavigate as useRouterNavigate } from "react-router-dom";
import { stateToPageMap } from "../constants/redirectConfig";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useGameStore } from "../state/useGameStore";

export const useCustomNavigate = () => {
  const navigate = useRouterNavigate();
  const { setState, resetRage } = useGameStore();

  const customNavigate = (state: GameStateEnum) => {
    setState(state);
    if (state !== GameStateEnum.Rage) {
      resetRage();
    }
    navigate(stateToPageMap[state]);
  };

  return customNavigate;
};
