import { Flex, Tooltip } from "@chakra-ui/react";
import { IconComponent } from "../../IconComponent";
import { FC, ReactSVGElement, SVGProps } from "react";

export interface MenuBtnProps {
  icon: string | FC<SVGProps<ReactSVGElement>>;
  description: string;
  label?: string;
  onClick?: Function;
  width: string;
  disabled?: boolean;
}

export const MenuBtn: React.FC<MenuBtnProps> = ({
  icon,
  description,
  label,
  onClick,
  width,
  disabled,
}) => {
  const opacity = disabled ? 0.5 : 1;
  const btn = (
    <Tooltip label={description} placement="right">
      <Flex
        cursor={onClick ? "pointer" : "default"}
        justifyContent="center"
        onClick={() => onClick?.()}
        opacity={opacity}
      >
        <IconComponent icon={icon} width={width} height="auto" />
      </Flex>
    </Tooltip>
  );

  if (label)
    return (
      <Flex
        gap={4}
        alignItems={"center"}
        onClick={() => onClick?.()}
        opacity={opacity}
      >
        {btn}
        {label}
      </Flex>
    );
  else return btn;
};
