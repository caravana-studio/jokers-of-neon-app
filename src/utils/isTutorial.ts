import { useLocation } from "react-router-dom";

export const isTutorial = (): boolean => {
  const location = useLocation();
  return location.pathname === "/tutorial";
};
