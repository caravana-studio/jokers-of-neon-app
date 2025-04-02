import { useLocation } from "react-router-dom";
import { useResponsiveValues } from "../../theme/responsiveSettings";

const hiddenRoutes = ["/", "/login", "/mods", "/my-games"];

export const hiddenBarMenu = (): boolean => {
  const { isSmallScreen } = useResponsiveValues();
  const location = useLocation();

  if (isSmallScreen) return true;
  if (hiddenRoutes.includes(location.pathname)) return true;

  return false;
};
