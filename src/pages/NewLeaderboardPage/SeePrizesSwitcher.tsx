import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useResponsiveValues } from "../../theme/responsiveSettings";

interface SeePrizesSwitcherProps {
    onChange: (value: boolean) => void;
}

export const SeePrizesSwitcher = ({ onChange }: SeePrizesSwitcherProps) => {
  const { t } = useTranslation("home", { keyPrefix: "leaderboard" });
  const { isSmallScreen } = useResponsiveValues();
  return (
    <FormControl display="flex" alignItems="center">
      <FormLabel color="white" fontSize={isSmallScreen ? "xs" : "md"} htmlFor="see-prizes" mb="0">
        {t("see-prizes")}
      </FormLabel>
      <Switch onChange={(e) => {
        onChange(e.target.checked);
      }} size={isSmallScreen ? "sm" : "md"} id="see-prizes" />
    </FormControl>
  );
};
