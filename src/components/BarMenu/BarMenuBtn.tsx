import { Flex, Tooltip } from "@chakra-ui/react";
import { IconComponent } from "../IconComponent";
import { FC, ReactSVGElement, SVGProps } from "react";

export interface BarMenuBtnProps {
  icon: string | FC<SVGProps<ReactSVGElement>>;
  description: string;
  onClick?: Function;
  width: string;
  disabled?: boolean;
}

export const BarMenuBtn: React.FC<BarMenuBtnProps> = ({
  icon,
  description,
  onClick,
  width,
  disabled,
}) => {
  return (
    <Tooltip label={description} placement="right">
      <Flex
        cursor={onClick ? "pointer" : "default"}
        justifyContent="center"
        onClick={() => onClick?.()}
        opacity={disabled ? 0.5 : 1}
      >
        <IconComponent icon={icon} width={width} height="auto" />
      </Flex>
    </Tooltip>
  );
};
