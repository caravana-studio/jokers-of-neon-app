import { Flex, Text } from "@chakra-ui/react";
import { IconComponent } from "../IconComponent";
import { Icons } from "../../constants/icons";
import { VIOLET_LIGHT } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DailyMission } from "../../types/DailyMissions";

interface MissionRowProps {
  mission: DailyMission;
  fontSize?: string;
  iconSize?: string;
}

export const MissionRow = ({ mission, fontSize, iconSize }: MissionRowProps) => {
  const { isSmallScreen } = useResponsiveValues();

  const defaultIconSize = isSmallScreen ? "18px" : "20px";
  const defaultFontSize = isSmallScreen ? "12px" : "14px";

  const size = iconSize || defaultIconSize;
  const textSize = fontSize || defaultFontSize;

  const color = mission.completed ? VIOLET_LIGHT : "white";

  return (
    <Flex alignItems="center" gap={2} my={0}>
      <IconComponent
        icon={mission.completed ? Icons.CHECK : Icons.UNCHECK}
        width={size}
        height={size}
        color={color}
      />
      <Text fontSize={textSize} color={color} lineHeight="1.4">
        {mission.description} -
        <span style={{ fontFamily: "Orbitron" }}> {mission.xp} XP</span>
      </Text>
    </Flex>
  );
};
