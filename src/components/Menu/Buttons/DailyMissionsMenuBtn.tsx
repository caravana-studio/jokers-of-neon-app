import { Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Icons } from "../../../constants/icons";
import { useInformationPopUp } from "../../../providers/InformationPopUpProvider";
import { DailyMissionsPopup } from "../../DailyMissions/DailyMissionsPopup";
import { MenuBtn } from "./MenuBtn";

interface DailyMissionsMenuBtnProps {
  width?: string;
}

export const DailyMissionsMenuBtn = ({ width = "20px" }: DailyMissionsMenuBtnProps) => {
  const { t } = useTranslation(["game"], {
    keyPrefix: "game.game-menu",
  });
  const { setInformation } = useInformationPopUp();

  const handleClick = () => {
    setInformation(<DailyMissionsPopup />);
  };

  return (
    <Box
      onClick={handleClick}
      cursor="pointer"
      _hover={{
        transform: "scale(1.1)",
        transition: "transform 0.2s",
      }}
    >
      <MenuBtn
        icon={Icons.CHECK}
        description={t("daily-missions-btn")}
        width={width}
      />
    </Box>
  );
};
