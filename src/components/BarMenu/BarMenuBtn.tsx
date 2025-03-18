import { Flex, Tooltip } from "@chakra-ui/react";
import { IconComponent } from "../IconComponent";
import { FC, ReactSVGElement, SVGProps } from "react";

interface BarMenuBtnProps {
  icon: string | FC<SVGProps<ReactSVGElement>>;
  description: string;
  onClick?: Function;
  width: string;
}

export const BarMenuBtn: React.FC<BarMenuBtnProps> = ({
  icon,
  description,
  onClick,
  width,
}) => {
  return (
    <Tooltip label={description} placement="right">
      <Flex
        cursor={onClick ? "pointer" : "default"}
        justifyContent="center"
        onClick={() => onClick?.()}
      >
        <IconComponent icon={icon} width={width} height="auto" />
      </Flex>
    </Tooltip>
  );
};
